import React, { useState, useEffect, useRef, useMemo } from "react";
import kikoCatImg from "../assets/images/kiko_cat.png";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

const getScript = (name) => [
  { sender: "them", text: "Meow~ Yeayy Lilinnya berhasil ditiup! 🎂🎉", delay: 1200 },
  { sender: "them", text: `Eh, tunggu sebentar, ${name}... 🐾`, delay: 1800 },
  { sender: "them", text: "Sebelum kita lanjut nih, aku mau minta tolong sesuatu...", delay: 2000 },
  { sender: "them", text: "Boleh dong upload 5 sampai 7 foto manis kamu dulu nggak? Hehe 📷 (aman kok ga disimpen)", delay: 2200 },
  { sender: "them", text: "Ada kejutan soalnya di next slide 😁🌸", delay: 1800 }
];

export default function WhatsAppGimmickPage({ name, onNext }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const chatEndRef = useRef(null);

  const script = useMemo(() => getScript(name), [name]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notifikasi/soundeffect.mp3");
      audio.volume = 0.6;
      audio.play().catch((err) => {
        console.warn("Notification sound blocked or failed:", err);
      });
    } catch (e) {
      console.warn("Audio element error:", e);
    }
  };

  // Robust Declarative State Machine to show messages step-by-step
  useEffect(() => {
    if (messageIndex >= script.length) {
      setIsTyping(false);
      setShowButton(true);
      return;
    }

    let messageTimer = null;

    // Phase 1: Delay before starting to type
    const typingTimer = setTimeout(() => {
      setIsTyping(true);
      
      // Phase 2: Typing duration
      const duration = Math.max(800, script[messageIndex].delay - 500);
      messageTimer = setTimeout(() => {
        setMessages((prev) => [...prev, script[messageIndex]]);
        playNotificationSound();
        setIsTyping(false);
        setMessageIndex((prev) => prev + 1);
      }, duration);
    }, 600);

    // Clean up both timers on dependency change or unmount
    return () => {
      clearTimeout(typingTimer);
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
  }, [messageIndex, script]);

  // Safe scroll to bottom on new messages
  useEffect(() => {
    try {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      console.warn("scrollIntoView failed gracefully:", e);
    }
  }, [messages, isTyping]);

  return (
    <div className="page-wrapper fade-in-up">
      <div className="cute-card" style={{ padding: "16px 12px", gap: "12px", maxWidth: "400px" }}>
        
        {/* WhatsApp Mobile Mockup Header */}
        <div style={{
          width: "100%",
          backgroundColor: "#FFF0F6",
          border: "2px solid var(--soft-pink)",
          borderRadius: "16px 16px 0 0",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textAlign: "left",
          borderBottom: "3px dashed var(--soft-pink)"
        }}>
          {/* Back Arrow Mockup */}
          <span style={{ fontSize: "1.1rem", color: "var(--dark-brown-heading)", fontWeight: "bold" }}>←</span>
          
          {/* Profile Picture */}
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1.5px solid var(--soft-pink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}>
            <img src={kikoCatImg} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Profile Name & Status */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: "bold", color: "var(--dark-brown-heading)", fontFamily: "var(--font-heading)" }}>
              Someone Special ✨
            </span>
            <span style={{ fontSize: "0.75rem", color: isTyping ? "#E56D94" : "#8d6e63", fontWeight: isTyping ? "bold" : "normal" }}>
              {isTyping ? "sedang mengetik..." : "online"}
            </span>
          </div>
        </div>

        {/* WhatsApp Chat Body Container */}
        <div style={{
          width: "100%",
          height: "280px",
          backgroundColor: "#FFF8ED",
          border: "2px solid var(--soft-pink)",
          borderTop: "none",
          borderRadius: "0 0 16px 16px",
          padding: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundImage: "radial-gradient(rgba(242,127,166,0.04) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}>
          {/* Chat bubbles */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="bubble-slide-in"
              style={{
                alignSelf: "flex-start",
                backgroundColor: "var(--white)",
                border: "2px solid var(--soft-pink)",
                borderRadius: "0px 16px 16px 16px",
                padding: "8px 12px",
                maxWidth: "85%",
                fontSize: "0.9rem",
                color: "var(--brown-text)",
                textAlign: "left",
                boxShadow: "0 2px 4px rgba(107, 78, 61, 0.05)",
                lineHeight: "1.4"
              }}
            >
              {msg.text}
            </div>
          ))}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#FFF0F6",
                border: "1.5px dashed var(--soft-pink)",
                borderRadius: "0px 12px 12px 12px",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: "3px"
              }}
            >
              <div className="typing-dot" style={{ width: "5px", height: "5px", backgroundColor: "var(--primary-pink)" }}></div>
              <div className="typing-dot" style={{ width: "5px", height: "5px", backgroundColor: "var(--primary-pink)", animationDelay: "0.2s" }}></div>
              <div className="typing-dot" style={{ width: "5px", height: "5px", backgroundColor: "var(--primary-pink)", animationDelay: "0.4s" }}></div>
            </div>
          )}

          {/* Ref to scroll to bottom */}
          <div ref={chatEndRef} />
        </div>

        {/* CTA Button appearing when all chats finished */}
        <div style={{ width: "100%", minHeight: "48px", marginTop: "4px" }}>
          {showButton && (
            <button
              onClick={onNext}
              className="btn-pill"
              style={{ width: "100%" }}
            >
              Next Chapter 📖
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
