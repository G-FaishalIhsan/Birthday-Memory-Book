import React from "react";
import hiCatImg from "../assets/images/hi.jpg";
import tapeSticker from "../assets/stickers/tape.svg";
import bowSticker from "../assets/stickers/bow.svg";
import { specialNames } from "../data/specialNames";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

export default function WelcomePage({ name, onNext }) {
  const nameLower = name.toLowerCase().trim();
  const hasSpecial = specialNames[nameLower];

  const badgeText = hasSpecial ? hasSpecial.badge : "little birthday surprise ✨";
  const welcomeText = hasSpecial 
    ? hasSpecial.welcome 
    : "Hari ini ada cerita kecil yang disiapin buat kamu.\nDibuka pelan-pelan ya,\njangan buru-buru.";

  return (
    <div className="page-wrapper fade-in-up">
      <div className="cute-card">
        {/* Ribbon Bow on top - low z-index/behind badge to not cover text */}
        <div className="ribbon-wrapper">
          <img 
            src={bowSticker} 
            alt="ribbon bow" 
            className="float-slow" 
            style={{ width: "36px", height: "36px", opacity: 0.9 }} 
          />
        </div>

        {/* Surprise Badge */}
        <div className="cute-badge" style={{ marginTop: "12px" }}>
          {badgeText}
        </div>

        <div className="grid-bg">
          <h1 style={{ fontSize: "1.9rem", marginBottom: "12px", color: "var(--dark-brown-heading)" }}>
            Hai, {name}! 💗
          </h1>
          
          <p style={{ 
            fontSize: "1rem", 
            color: "var(--brown-text)", 
            lineHeight: "1.6", 
            marginBottom: "24px",
            whiteSpace: "pre-line" 
          }}>
            {welcomeText}
          </p>

          {/* Polaroid Frame */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div className="polaroid-frame" style={{ transform: "rotate(3deg)", width: "160px", padding: "10px 10px 20px 10px" }}>
              {/* Masking tape on top of polaroid */}
              <img 
                src={tapeSticker} 
                alt="tape" 
                className="polaroid-tape"
              />
              <img 
                src={hiCatImg} 
                alt="Welcome Polaroid" 
                className="polaroid-image"
                style={{ width: "140px", height: "140px" }}
              />
            </div>
          </div>

          <button
            onClick={onNext}
            className="btn-pill"
            style={{ width: "100%" }}
          >
            Lanjut yuk! →
          </button>
        </div>
      </div>
    </div>
  );
}
