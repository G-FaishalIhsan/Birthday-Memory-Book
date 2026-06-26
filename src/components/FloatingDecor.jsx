import React, { useMemo } from "react";
import "../styles/global.css";
import "../styles/animations.css";

export default function FloatingDecor() {
  // Generate random positions once
  const decors = useMemo(() => {
    const items = [
      { type: "heart", color: "#FF9EBB", size: 18, delay: "0s", speed: "float-slow", top: "15%", left: "10%" },
      { type: "star", color: "#FFE385", size: 22, delay: "1.5s", speed: "float-medium", top: "25%", left: "85%" },
      { type: "flower", color: "#FFD6E3", size: 24, delay: "0.8s", speed: "float-slow", top: "70%", left: "8%" },
      { type: "sparkle", color: "#DCC7FF", size: 16, delay: "2s", speed: "float-fast", top: "65%", left: "88%" },
      { type: "heart", color: "#FFD6E3", size: 14, delay: "3s", speed: "float-slow", top: "80%", left: "45%" },
      { type: "star", color: "#FFE385", size: 16, delay: "0.5s", speed: "float-medium", top: "5%", left: "55%" },
      { type: "sparkle", color: "#FFF8ED", size: 20, delay: "2.5s", speed: "float-fast", top: "45%", left: "12%" },
    ];
    return items;
  }, []);

  return (
    <div className="floating-decor-layer">
      {decors.map((d, index) => {
        const style = {
          top: d.top,
          left: d.left,
          width: `${d.size}px`,
          height: `${d.size}px`,
          animationDelay: d.delay,
        };

        return (
          <div
            key={index}
            className={`floating-sticker ${d.speed}`}
            style={style}
          >
            {d.type === "heart" && (
              <svg viewBox="0 0 100 100" fill={d.color} width="100%" height="100%">
                <path d="M 50 82 C 38 72, 16 54, 16 35 C 16 21, 27 10, 41 10 C 49 10, 56 15, 60 21 C 64 15, 71 10, 79 10 C 93 10, 104 21, 104 35 C 104 54, 82 72, 70 82 Z" />
              </svg>
            )}
            {d.type === "star" && (
              <svg viewBox="0 0 100 100" fill={d.color} width="100%" height="100%" className="blink-soft">
                <path d="M 50 10 Q 50 40 80 50 Q 50 60 50 90 Q 50 60 20 50 Q 50 40 50 10 Z" />
              </svg>
            )}
            {d.type === "flower" && (
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <g fill={d.color}>
                  <circle cx="50" cy="25" r="18" />
                  <circle cx="74" cy="42" r="18" />
                  <circle cx="65" cy="70" r="18" />
                  <circle cx="35" cy="70" r="18" />
                  <circle cx="26" cy="42" r="18" />
                </g>
                <circle cx="50" cy="50" r="14" fill="#FFE066" />
              </svg>
            )}
            {d.type === "sparkle" && (
              <svg viewBox="0 0 100 100" fill={d.color} width="100%" height="100%" className="blink-soft">
                <path d="M 50 20 L 58 42 L 80 50 L 58 58 L 50 80 L 42 58 L 20 50 L 42 42 Z" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
