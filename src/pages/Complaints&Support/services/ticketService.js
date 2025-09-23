export const getTickets = async () => [
  { id: "TCK1001", user: "Amit Sharma", subject: "Failed Transaction", status: "Open", sla: "4h left", priority: "High" },
  { id: "TCK1002", user: "Neha Verma", subject: "KYC not approved", status: "In Progress", sla: "1d left", priority: "Medium" },
  { id: "TCK1003", user: "Rahul Singh", subject: "Card not delivered", status: "Closed", sla: "Resolved", priority: "Low" },
];

export const getTicketDetails = async (id) => ({
  id,
  user: "Amit Sharma",
  subject: "Failed Transaction",
  status: "Open",
  priority: "High",
  messages: [
    { sender: "User", text: "My transaction failed, money not refunded!" },
    { sender: "Agent", text: "We are checking with our banking partner." },
  ],
});

export const updateTicket = async (id, action, payload) => {
  console.log("Ticket Update API mock:", { id, action, payload });
  return { success: true };
};
