import React, { useMemo } from "react";
import TicketQueue from "./TicketQueue";

export default function Escalations({ tickets, search, onView, onUpdate }) {
  // Only high-priority tickets
  const highPriorityTickets = useMemo(() => 
    tickets.filter(t => t.priority === "High"), 
    [tickets]
  );

  return (
    <TicketQueue 
      tickets={highPriorityTickets} 
      search={search} 
      onView={onView} 
      onUpdate={onUpdate} 
    />
  );
}
