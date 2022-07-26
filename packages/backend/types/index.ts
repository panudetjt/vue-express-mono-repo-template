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
  type: TicketType;
  status: TicketBuyedStatus;
  createdAt: Date;
  issuedAt: Date;
  detail: Ticket;
}

export interface TicketReport {
  label: string;
  data: number[];
}

export interface Report<T> {
  labels: string[];
  datasets: T[];
}
