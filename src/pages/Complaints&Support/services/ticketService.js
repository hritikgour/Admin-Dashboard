// src/services/ticketService.js
let tickets = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  ticketId: `TCKT-${1000 + i}`,
  user: `User ${i + 1}`,
  subject: `Issue ${i + 1} subject`,
  priority: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
  status: ["Open", "In Progress", "Closed"][Math.floor(Math.random() * 3)],
  lastUpdate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
  messages: [
    { sender: "User", text: `Hello, I have an issue ${i + 1}`, time: new Date().toLocaleString() }
  ],
  assigned: ""
}));

export async function getTickets() {
  return new Promise(resolve => {
    setTimeout(() => resolve([...tickets]), 300); // simulate delay
  });
}

export async function getTicketDetails(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId || t.ticketId === ticketId);
  return new Promise(resolve => setTimeout(() => resolve({ ...ticket }), 200));
}

export async function updateTicket(ticketId, action, payload = {}) {
  const idx = tickets.findIndex(t => t.id === ticketId || t.ticketId === ticketId);
  if (idx === -1) return;

  switch (action) {
    case "reply":
      tickets[idx].messages.push({ sender: "Agent", text: payload.text, time: new Date().toLocaleString() });
      break;
    case "assign":
      tickets[idx].assigned = payload.agent;
      break;
    case "close":
      tickets[idx].status = "Closed";
      break;
    case "escalate":
      tickets[idx].priority = "High";
      break;
    default:
      break;
  }

  return new Promise(resolve => setTimeout(() => resolve({ ...tickets[idx] }), 200));
}
