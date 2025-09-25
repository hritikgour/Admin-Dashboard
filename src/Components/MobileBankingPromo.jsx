import React from "react";
import "./MobileBankingPromo.css";
import qrCode from "../assets/qrcode.png"; // ✅ Save QR as qrcode.png in /assets

export default function MobileBankingPromo() {
  return (
    <section className="mobile-promo">
      <div className="promo-text">
        <h2>Seamless Mobile Banking</h2>
        <p>Scan the QR code to download the NeoBank mobile app.</p>
      </div>
      <div className="promo-qr">
        <img src={qrCode} alt="NeoBank Mobile App QR" />
      </div>
    </section>
  );
}
