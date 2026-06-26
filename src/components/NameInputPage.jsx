import React, { useState } from "react";
import hiCatImg from "../assets/images/hi.jpg";
import boniBearImg from "../assets/images/boni_bear.png";
import kikoCatImg from "../assets/images/kiko_cat.png";
import liliFlowerImg from "../assets/images/lili_flower.png";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

export default function NameInputPage({ onNext }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onNext(trimmed);
    }
  };

  return (
    <div className="page-wrapper fade-in-up">
      <div className="cute-card">
        {/* Top Garland / Flags - Full and cute */}
        <div className="garland-container">
          <div className="flag"></div>
          <div className="flag"></div>
          <div className="flag"></div>
          <div className="flag"></div>
          <div className="flag"></div>
          <div className="flag"></div>
        </div>

        {/* Floating stickers configured securely in card boundaries */}
        <div 
          className="sticker-decor float-slow" 
          style={{ 
            width: "42px", 
            height: "42px", 
            top: "40px", 
            left: "15px",
            border: "2px solid var(--soft-pink)",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "var(--shadow-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img 
            src={boniBearImg} 
            alt="Boni Bear" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>

        <div className="grid-bg" style={{ marginTop: "24px" }}>
          {/* Main mascot cat hi.jpg in the center */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
            <div className="polaroid-frame" style={{ transform: "rotate(-2deg)", width: "130px", padding: "8px 8px 16px 8px" }}>
              <img 
                src={hiCatImg} 
                alt="Hi Cat" 
                className="polaroid-image" 
                style={{ width: "114px", height: "114px" }}
              />
            </div>
          </div>

          <h1 style={{ fontSize: "2.2rem", marginBottom: "8px" }}>Haiii!</h1>
          <p style={{ fontSize: "0.95rem", color: "var(--brown-text)", marginBottom: "20px" }}>
            Sebelum masuk boleh dong kenalan dulu, tulis namanya dibawah ya ✨
          </p>

          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="text"
              placeholder="Masukkan nama kamu"
              className="cute-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={20}
              required
            />
            <button
              type="submit"
              className="btn-pill"
              disabled={!inputValue.trim()}
              style={{ width: "100%" }}
            >
              Yuk, mulai! ✨
            </button>
          </form>
        </div>

        {/* Bottom decorations: Flower cluster on bottom-left, smiley on bottom-right */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 10px", marginTop: "-8px", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div 
              className="float-medium" 
              style={{ 
                width: "36px", 
                height: "36px",
                border: "2px solid var(--soft-pink)",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "var(--shadow-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img 
                src={liliFlowerImg} 
                alt="Lili Flower" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
          </div>
          <div 
            className="float-fast" 
            style={{ 
              width: "38px", 
              height: "38px",
              border: "2px solid var(--soft-pink)",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "var(--shadow-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img 
              src={kikoCatImg} 
              alt="Kiko Cat" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
