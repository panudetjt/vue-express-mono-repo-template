import { DatabaseInit, Ticket } from "../database";
(async () => {
  try {
    console.log("Filling ticket.....");
    await DatabaseInit();
    await Ticket.updateMany({}, [{ $set: { remaining: "$availablePerDay" } }]);
    console.log("Filling ticket done");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
