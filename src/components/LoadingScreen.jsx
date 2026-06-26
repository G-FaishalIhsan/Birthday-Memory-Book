import React, { useEffect, useState } from "react";
import waitCatImg from "../assets/images/wait.jpg";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

export default function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1800; // 1.8 seconds total
    const intervalTime = 30; // update every 30ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onFinished) onFinished();
          }, 200); // short delay after hitting 100%
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinished]);

  return (
    <div className="loading-screen fade-in-up">
      <img 
        src={waitCatImg} 
        alt="Loading..." 
        className="loading-img float-slow" 
      />
      <div>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--dark-brown-heading)", fontSize: "1.6rem", marginBottom: "4px" }}>
          loading dulu yaa...
        </h2>
        <p style={{ color: "var(--brown-text)", fontSize: "0.95rem" }}>
          Siap siap deh ✨
        </p>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%`, transition: "width 0.05s ease-out" }}
        />
      </div>
    </div>
  );
}
