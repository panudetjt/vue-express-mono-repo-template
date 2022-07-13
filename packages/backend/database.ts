/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Ticket as ITicket, TicketBuyed as ITicketBuyed } from "./types";
import { connect, Schema, model } from "mongoose";

const { DATABASE_URL } = process.env;

const TicketSchema = new Schema<ITicket>({
  id: { type: String, required: true },
  type: { type: String, reqiured: true },
  price: { type: Number, reqiured: true },
  status: { type: String, reqiured: true },
  remaining: { type: Number, reqiured: true },
  availablePerDay: { type: Number, reqiured: true },
  minimumPerOrder: { type: Number, reqiured: true },
}).set("toJSON", {
  transform: (_, ret) => {
    const { _id, __v, ...rest } = ret;
    return <ITicket>{ ...rest };
  },
});

export const Ticket = model("Ticket", TicketSchema);

const TicketBuyedSchema = new Schema<ITicketBuyed>({
  id: { type: String, required: true },
  status: { type: String, reqiured: true },
  detail: { type: Schema.Types.ObjectId, ref: "Ticket" },
}).set("toJSON", {
  transform: (_, ret) => {
    const { _id, __v, ...rest } = ret;
    return <ITicketBuyed>{ ...rest };
  },
});

export const TicketBuyed = model<ITicketBuyed>(
  "TicketBuyed",
  TicketBuyedSchema
);

export const DatabaseInit = async () => {
  try {
    // db.tickets.aggregate([{ $match: { id: "id"}}, { $lookup: { from: "ticketonsales", localField: "info", foreignField: "_id", as: "info"}}, { $unwind: "$info"}, {$limit: 1} ])
    await connect(DATABASE_URL || "");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
