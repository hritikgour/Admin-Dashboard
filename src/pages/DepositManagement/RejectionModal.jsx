import React, { useState } from "react";

const RejectionModal = ({ row, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    const payload = { reason };
    if (onConfirm) {
      onConfirm(payload);
    } else {
      console.log("Rejection Reason:", reason);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Reject Request</h3>
        <p>{row?.name ? `Customer: ${row.name}` : ""}</p>

        <textarea
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="reject" onClick={handleReject}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
