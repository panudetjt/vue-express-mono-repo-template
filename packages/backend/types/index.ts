export enum TicketType {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export enum TicketBuyedStatus {
  AVAILABLE = "AVAILABLE",
  USED = "USED",
}

export enum TicketStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
}

export type ID = string;
export interface Ticket {
  id: ID;
  type: TicketType;
  price: number;
  status: TicketStatus;
  remaining: number;
  availablePerDay: number;
  minimumPerOrder: number;
}
export interface TicketBuyed {
  id: ID;
  status: TicketBuyedStatus;
  detail: Ticket;
}
