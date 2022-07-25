import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";
import { DatabaseInit, Ticket, TicketBuyed } from "../database";
import { TicketBuyed as ITicketBuyed, TicketBuyedStatus } from "../types";
import { sub, add, differenceInDays } from "date-fns";
import { randomIndex } from "../utils/random";
const TicketBuyedStatusList = Object.values(TicketBuyedStatus);
(async () => {
  try {
    console.log("Faking ticket.....");
    await DatabaseInit();
    const tickets = await Ticket.find({});
    // const amount = Math.round(Math.random() * 100);
    const amount = 1000;
    const ticketBuyeds: HydratedDocument<ITicketBuyed>[] = [];
    for (let i = 0; i < amount; i++) {
      const detail = tickets[randomIndex(tickets.length)];
      const createdAt = sub(new Date(), { days: randomIndex(30) });
      const diffDays = differenceInDays(new Date(), createdAt);
      const issuedAt = add(createdAt, { days: randomIndex(diffDays) });
      const ticket = new TicketBuyed({
        id: randomUUID(),
        type: detail.type,
        status:
          TicketBuyedStatusList[randomIndex(TicketBuyedStatusList.length)],
        issuedAt,
        createdAt,
        detail,
      });
      ticketBuyeds.push(ticket);
    }
    await TicketBuyed.insertMany(ticketBuyeds);
    console.log("Faking ticket done");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
