// src/Components/SplashScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import "./SplashScreen.css";
import logo from "../assets/logo.png";

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(1);
  const logoRef = useRef(null);

  useEffect(() => {
    // Stage 1 → Loading bar (2s)
    const timer1 = setTimeout(() => setStage(2), 2000);

    // Stage 2 → Fly logo to navbar (after 2s of welcome)
    const timer2 = setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.classList.add("fly-up");
      }
    }, 4000); // 2s loading + 2s welcome

    // Stage 3 → Exit splash completely (after logo lands)
    const timer3 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 6000); // total 6s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen stage${stage}`}>
      <img ref={logoRef} src={logo} alt="NeoBank Logo" className="splash-logo" />

      {/* Stage 1: Loading bar */}
      {stage === 1 && (
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      )}

      {/* Stage 2: Welcome */}
      {stage === 2 && (
        <>
          <h1>Welcome to our NeoBank!</h1>
          <h2>NeoBank में आपका स्वागत है !</h2>
          {/* Floating bubbles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="bubble"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${5 + Math.random() * 4}s`
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
