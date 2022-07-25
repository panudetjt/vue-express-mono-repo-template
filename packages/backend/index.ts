import { randomUUID } from "crypto";
import express, { type Response } from "express";
import { HydratedDocument } from "mongoose";
import { DatabaseInit, Ticket, TicketBuyed } from "./database";
import {
  Report,
  TicketBuyed as ITicketBuyed,
  TicketBuyedStatus,
  TicketReport,
  TicketStatus,
} from "./types";
import { add, formatISO, sub } from "date-fns";
import { formatDate } from "./utils/format-date";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/tickets", async (req, res) => {
  res.json(await Ticket.find({}).select("-_id -__v"));
});

const buyTicket = async (id: string, amountString: string, res: Response) => {
  const sendError = (code: number, error: string) => {
    console.error(error);
    res.status(code).json({ error });
  };
  const amount = parseInt(amountString, 10);
  if (isNaN(amount)) {
    sendError(400, "amount is not a number");
    return;
  }
  const ticket = await Ticket.findOne({ id });
  if (!ticket) {
    sendError(404, `Ticket ${id} not found`);
    return;
  }
  if (ticket.status !== "AVAILABLE") {
    sendError(400, `Ticket ${id} is not available`);
    return;
  }
  if (ticket.remaining <= 0) {
    sendError(400, `Ticket ${id} is sold out`);
    return;
  }
  if (ticket.remaining - amount < 0) {
    sendError(400, `Ticket ${id} has only ${ticket.remaining} left`);
    return;
  }

  const tickets: HydratedDocument<ITicketBuyed>[] = [];
  for (let i = 0; i < amount; i++) {
    const ticketBuyed = new TicketBuyed({
      id: randomUUID(),
      type: ticket.type,
      createdAt: new Date(),
      status: TicketBuyedStatus.AVAILABLE,
      detail: ticket,
    });
    tickets.push(ticketBuyed);
    ticket.remaining--;
  }
  try {
    await TicketBuyed.insertMany(tickets);
    if (ticket.remaining === 0) {
      ticket.status = TicketStatus.UNAVAILABLE;
    }
    await ticket.save();
    res.json(tickets.map((x) => x.toJSON()));
  } catch (e) {
    console.error(e);
    sendError(500, "Internal server error");
    return;
  }
};

app.post("/buy/:ticketId/:amount", async (req, res) => {
  const { ticketId, amount } = req.params;
  buyTicket(ticketId, amount, res);
});

app.post("/use/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const ticketBuyed = await TicketBuyed.findOne({ id: ticketId }).populate(
    "detail"
  );
  if (!ticketBuyed) {
    res.status(404).json({ error: `Ticket ${ticketId} not found` });
    return;
  }
  if (ticketBuyed.status !== TicketBuyedStatus.AVAILABLE) {
    res.status(400).json({ error: `Ticket ${ticketId} is not available` });
    return;
  }
  ticketBuyed.status = TicketBuyedStatus.USED;
  ticketBuyed.issuedAt = new Date();
  await ticketBuyed.save();
  res.json(ticketBuyed.toJSON());
});

app.get("/report", async (req, res) => {
  // const { type, date } = req.query;
  // const ticketA = await TicketBuyed.find({ type: "A" }).limit(10);
  type CountDataByIssuedAt = { issuedAt: string; count: number };
  const start = sub(new Date(), { days: 7 });
  const end = new Date();
  const tickets: {
    _id: string;
    data: CountDataByIssuedAt[];
  }[] = await TicketBuyed.aggregate([
    {
      $match: {
        issuedAt: {
          $gte: start,
        },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          issuedAt: {
            $dateFromParts: {
              year: { $year: "$issuedAt" },
              month: { $month: "$issuedAt" },
              day: { $dayOfMonth: "$issuedAt" },
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.issuedAt": 1 } },
    {
      $group: {
        _id: "$_id.type",
        data: {
          $push: {
            issuedAt: "$_id.issuedAt",
            count: "$count",
          },
        },
      },
    },
  ]);

  const report: Report<TicketReport> = {
    labels: [],
    datasets: [],
  };

  const dateOnly = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let dateCursor = dateOnly(start);
  const endCursor = dateOnly(end);
  while (dateCursor < endCursor) {
    report.labels.push(dateCursor.toISOString());
    dateCursor = add(dateCursor, { days: 1 });
  }

  const findIssuedAt = (label: string, data: CountDataByIssuedAt): boolean => {
    return (
      formatISO(new Date(label), { representation: "date" }) ===
      formatISO(new Date(data.issuedAt), { representation: "date" })
    );
  };
  for (const ticket of tickets) {
    report.datasets.push({
      label: ticket._id,
      data: report.labels.map((x) => {
        const found = ticket.data.find((y) => findIssuedAt(x, y));
        return found ? found.count : 0;
      }),
    });
  }
  res.json(report);
});

app.get("/ticket/:ticketId", async (req, res) => {
  throw new Error("Unimplemented");
});

app.post("/ticket", async (req, res) => {
  const { type, price, remaining, availablePerDay, minimumPerOrder } = req.body;
  const ticket = new Ticket({
    type,
    price,
    remaining,
    availablePerDay,
    minimumPerOrder,
  });
  try {
    await ticket.save();
    res.json(ticket.toJSON());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, async () => {
  await DatabaseInit();
  console.log(`Example app listening on port ${port}`);
});
