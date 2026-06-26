import React, { useMemo } from "react";
import "../styles/animations.css";

export default function SidePoppers({ active }) {
  const particles = useMemo(() => {
    if (!active) return [];
    const colors = ["#FFD6E3", "#FFF8ED", "#FFD1A8", "#DCC7FF", "#F27FA6", "#FFE385", "#B3E5FC"];
    const items = [];
    
    // Left popper particles
    for (let i = 0; i < 20; i++) {
      items.push({
        side: "left",
        color: colors[Math.floor(Math.random() * colors.length)],
        style: {
          transform: `scale(${0.3 + Math.random() * 0.7}) rotate(${Math.random() * 360}deg)`,
          animationDelay: `${Math.random() * 0.3}s`,
          left: `${15 + Math.random() * 25}px`,
          bottom: `${15 + Math.random() * 25}px`,
          width: `${6 + Math.random() * 10}px`,
          height: `${6 + Math.random() * 10}px`,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px"
        }
      });
    }

    // Right popper particles
    for (let i = 0; i < 20; i++) {
      items.push({
        side: "right",
        color: colors[Math.floor(Math.random() * colors.length)],
        style: {
          transform: `scale(${0.3 + Math.random() * 0.7}) rotate(${Math.random() * 360}deg)`,
          animationDelay: `${Math.random() * 0.3}s`,
          right: `${15 + Math.random() * 25}px`,
          bottom: `${15 + Math.random() * 25}px`,
          width: `${6 + Math.random() * 10}px`,
          height: `${6 + Math.random() * 10}px`,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px"
        }
      });
    }

    return items;
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 12 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className={p.side === "left" ? "popper-left-particle" : "popper-right-particle"}
          style={{
            ...p.style,
            backgroundColor: p.color
          }}
        />
      ))}
    </div>
  );
}
