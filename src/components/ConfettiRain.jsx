import React, { useMemo } from "react";
import "../styles/animations.css";

export default function ConfettiRain({ active }) {
  const particles = useMemo(() => {
    if (!active) return [];
    const colors = ["#FFD6E3", "#FFF8ED", "#FFD1A8", "#DCC7FF", "#F27FA6", "#FFE385", "#B3E5FC"];
    const items = [];
    
    for (let i = 0; i < 40; i++) {
      items.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        style: {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${2.5 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 1.5}s`,
          width: `${6 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 10}px`,
          opacity: 0.8 + Math.random() * 0.2
        }
      });
    }
    return items;
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 99, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="css-confetti-particle"
          style={{
            ...p.style,
            backgroundColor: p.color
          }}
        />
      ))}
    </div>
  );
}
