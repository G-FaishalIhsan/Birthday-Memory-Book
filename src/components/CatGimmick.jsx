import React, { useState, useEffect } from "react";
import kikoCatImg from "../assets/images/kiko_cat.png";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

const messages = [
  "meow~ 🐾",
  "pelan-pelan bukanya yaa ✨",
  "jangan lupa senyum hari ini! 😊",
  "scrapbook-nya lucu kan? 📖",
  "happy birthday! 🎂",
  "kamu berharga banget tahu! 💖",
  "semoga harimu menyenangkan! 🌸"
];

export default function CatGimmick() {
  const [bubbleText, setBubbleText] = useState("");
  const [bounce, setBounce] = useState(false);

  const handleClick = () => {
    if (bounce) return;
    setBounce(true);
    
    // Choose a random message
    const rand = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(rand);
    
    setTimeout(() => {
      setBounce(false);
    }, 400);
  };

  // Automatically fade out speech bubble after 3.5 seconds
  useEffect(() => {
    if (bubbleText) {
      const timer = setTimeout(() => {
        setBubbleText("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [bubbleText]);

  return (
    <div className="cat-gimmick-container">
      {/* Speech bubble */}
      {bubbleText && (
        <div className="cat-bubble fade-in-up" style={{ animationDuration: "0.25s" }}>
          {bubbleText}
        </div>
      )}

      {/* Floating button */}
      <button 
        onClick={handleClick}
        className={`cat-gimmick-btn float-slow ${bounce ? "cake-bounce-active" : ""}`}
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF8ED",
          border: "2.5px solid var(--soft-pink)",
          overflow: "hidden",
          borderRadius: "50%"
        }}
      >
        <img 
          src={kikoCatImg} 
          alt="Cat Gimmick" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </button>
    </div>
  );
}
