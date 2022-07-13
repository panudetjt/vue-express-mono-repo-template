import { randomUUID } from "crypto";
import { DatabaseInit, Ticket } from "../database";
import { TicketStatus, TicketType } from "../types";
(async () => {
  try {
    console.log("migrating.....");
    await DatabaseInit();
    await Ticket.insertMany([
      {
        id: randomUUID(),
        type: TicketType.A,
        price: 5000,
        status: TicketStatus.AVAILABLE,
        remaining: 10,
        availablePerDay: 10,
        minimumPerOrder: 1,
      },
      {
        id: randomUUID(),
        type: TicketType.B,
        price: 2500,
        status: TicketStatus.AVAILABLE,
        remaining: 20,
        availablePerDay: 20,
        minimumPerOrder: 2,
      },
      {
        id: randomUUID(),
        type: TicketType.C,
        price: 1000,
        status: TicketStatus.AVAILABLE,
        remaining: 30,
        availablePerDay: 30,
        minimumPerOrder: 2,
      },
      {
        id: randomUUID(),
        type: TicketType.D,
        price: 500,
        status: TicketStatus.AVAILABLE,
        remaining: 40,
        availablePerDay: 40,
        minimumPerOrder: 3,
      },
    ]);
    console.log("migrated");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
