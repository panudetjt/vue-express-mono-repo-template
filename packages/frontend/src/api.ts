import type { Report, Ticket, TicketBuyed, TicketReport } from "backend/types";
export const baseUrl = "http://localhost:3000";

export const getTickets = () => {
  return new Promise<Ticket[]>((resolve, reject) => {
    fetch(`${baseUrl}/tickets`)
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then((json) => resolve(json))
      .catch((error) => reject(error));
  });
};

export const buyTicket = (id: string, amount: string) => {
  return new Promise<TicketBuyed[]>((resolve, reject) => {
    fetch(`${baseUrl}/buy/${id}/${amount}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then((json) => resolve(json))
      .catch((error) => reject(error));
  });
};

export const useTicket = (id: string) => {
  return new Promise<TicketBuyed>((resolve, reject) => {
    fetch(`${baseUrl}/use/${id}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then((json) => resolve(json))
      .catch((error) => reject(error));
  });
};

export const getReport = () => {
  return new Promise<Report<TicketReport>>((resolve, reject) => {
    fetch(`${baseUrl}/report`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then((json) => resolve(json))
      .catch((error) => reject(error));
  });
};
