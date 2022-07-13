import { DatabaseInit, Ticket, TicketBuyed } from "../database";
(async () => {
  try {
    console.log("cleaning up.....");
    await DatabaseInit();
    await Ticket.deleteMany({});
    await TicketBuyed.deleteMany({});
    console.log("cleanup done");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
