import { randomUUID } from "crypto";
import express, { type Response } from "express";
import { HydratedDocument } from "mongoose";
import { DatabaseInit, Ticket, TicketBuyed } from "./database";
import {
  TicketBuyed as ITicketBuyed,
  TicketBuyedStatus,
  TicketStatus,
} from "./types";

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
  await ticketBuyed.save();
  res.json(ticketBuyed.toJSON());
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
