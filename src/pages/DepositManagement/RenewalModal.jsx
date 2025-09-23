import React, { useState } from "react";

const RenewalModal = ({ row, onClose, onConfirm }) => {
  const [tenure, setTenure] = useState("");
  const [interest, setInterest] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

  const handleRenew = () => {
    const payload = { tenure, interest: interest ? `${interest}%` : undefined, overrideReason };
    if (onConfirm) {
      onConfirm(payload);
    } else {
      console.log("Renewal Details:", payload);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Renew Deposit</h3>
        <p>{row?.name ? `Customer: ${row.name}` : ""}</p>

        <input
          type="text"
          placeholder="New Tenure"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Interest Rate (%)"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />
        <textarea
          placeholder="Override Reason (if any)"
          value={overrideReason}
          onChange={(e) => setOverrideReason(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="renew" onClick={handleRenew}>Confirm Renewal</button>
        </div>
      </div>
    </div>
  );
};

export default RenewalModal;
