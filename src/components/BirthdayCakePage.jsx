import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import SidePoppers from "./SidePoppers";
import ConfettiRain from "./ConfettiRain";
import { useBlowDetector } from "../hooks/useBlowDetector";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

export default function BirthdayCakePage({ name, onNext }) {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [cakeBounce, setCakeBounce] = useState(false);
  const [effectsActive, setEffectsActive] = useState(false);
  const [micMsg, setMicMsg] = useState("");
  const [screenShake, setScreenShake] = useState(false);

  // Synth Pop Sound to celebrate the blowing of the candles
  const playCelebrateSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      
      // Ascent chime melody: C5 (523Hz), E5 (659Hz), G5 (783Hz), C6 (1046Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.12 + 0.5);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.5);
      });
    } catch (e) {
      console.warn("Chime synth could not be initialized:", e);
    }
  };

  const blowAllCandles = () => {
    if (isBlown) return;
    
    // Set all candles to unlit
    setCandlesLit([false, false, false, false, false]);
    setIsBlown(true);
    setCakeBounce(true);
    setScreenShake(true);
    setEffectsActive(true);
    setMicEnabled(false); // Stop mic detection
    stopMic();

    // Play synthesized chimes
    playCelebrateSound();

    // Multiple Waves of Confetti!
    const triggerConfettiWave = (xOffset, yOffset, angleVal) => {
      confetti({
        particleCount: 50,
        angle: angleVal,
        spread: 65,
        origin: { x: xOffset, y: yOffset }
      });
    };

    // Wave 1: Immediate left and right poppers
    triggerConfettiWave(0, 0.65, 60);
    triggerConfettiWave(1, 0.65, 120);

    // Wave 2: Left popper after 500ms
    setTimeout(() => triggerConfettiWave(0.1, 0.55, 50), 500);
    
    // Wave 3: Right popper after 1000ms
    setTimeout(() => triggerConfettiWave(0.9, 0.55, 130), 1000);

    // Wave 4: Central burst after 1500ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 }
      });
    }, 1500);

    // Reset bounce and shake animations
    setTimeout(() => {
      setCakeBounce(false);
      setScreenShake(false);
    }, 500);

    // Keep active particle effects for 5 seconds
    setTimeout(() => {
      setEffectsActive(false);
    }, 5500);

    // Show Next button after 1.8 seconds
    setTimeout(() => {
      setShowNextBtn(true);
    }, 1800);
  };

  // Mic hook integration
  const { isPermissionGranted, isUnsupported, error, startMic, stopMic, rms } = useBlowDetector({
    threshold: 0.12,
    onBlow: blowAllCandles
  });

  useEffect(() => {
    if (micEnabled) {
      if (isUnsupported) {
        setMicMsg("Mic tidak didukung browser ini 😭");
        setMicEnabled(false);
      } else if (error) {
        setMicMsg("Mic ditolak, pakai tombol manual ya 🥺");
        setMicEnabled(false);
      } else if (isPermissionGranted) {
        setMicMsg("Mode tiup aktif! Coba tiup mic kamu pelan-pelan 💨");
      }
    }
  }, [micEnabled, isPermissionGranted, isUnsupported, error]);

  const handleMicToggle = async () => {
    if (isBlown) return;
    if (micEnabled) {
      stopMic();
      setMicEnabled(false);
      setMicMsg("");
    } else {
      setMicEnabled(true);
      setMicMsg("Meminta izin akses mic...");
      await startMic();
    }
  };

  return (
    <div className={`page-wrapper fade-in-up ${screenShake ? "screen-shake-active" : ""}`}>
      <div className={`cake-card ${isBlown ? "blown" : ""}`}>
        {/* Confetti & popper effects */}
        <SidePoppers active={effectsActive} />
        <ConfettiRain active={effectsActive} />

        <div style={{ textAlign: "center", zIndex: 10 }}>
          <h1 style={{ fontSize: "1.9rem", marginBottom: "8px", color: "var(--dark-brown-heading)" }}>
            Happy Birthday, {name}! 🎉
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--brown-text)" }}>
            Semoga hari ini penuh kebahagiaan dan hal-hal baik datang padamu ✨
          </p>
        </div>

        {/* 2-layer HTML/CSS/SVG Cake Drawing */}
        <div className={`cake-container ${cakeBounce ? "cake-bounce-active" : ""}`}>
          <svg className="svg-cake" viewBox="0 0 200 200">
            {/* Plate */}
            <ellipse cx="100" cy="160" rx="75" ry="12" fill="#EAD8FF" stroke="#DCC7FF" strokeWidth="3" />
            
            {/* Cake Layer 1 (Bottom) */}
            <rect x="40" y="105" width="120" height="45" rx="8" fill="#FFD6E3" stroke="#F27FA6" strokeWidth="2.5" />
            {/* Bottom frosting drips */}
            <path d="M 40 115 Q 50 125 60 115 Q 70 125 80 115 Q 90 125 100 115 Q 110 125 120 115 Q 130 125 140 115 Q 150 125 160 115" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

            {/* Cake Layer 2 (Top) */}
            <rect x="55" y="70" width="90" height="38" rx="6" fill="#FFF8ED" stroke="#FFD1A8" strokeWidth="2.5" />
            {/* Top frosting drops */}
            <path d="M 55 78 Q 62 86 70 78 Q 78 86 86 78 Q 94 86 102 78 Q 110 86 118 78 Q 126 86 134 78 Q 141 86 145 78" fill="none" stroke="#F27FA6" strokeWidth="3.5" strokeLinecap="round" />

            {/* Cake decorations (berries) */}
            <circle cx="70" cy="67" r="4" fill="#F27FA6" />
            <circle cx="90" cy="67" r="4" fill="#F27FA6" />
            <circle cx="110" cy="67" r="4" fill="#F27FA6" />
            <circle cx="130" cy="67" r="4" fill="#F27FA6" />

            {/* 5 Candles & Flames */}
            {/* Candle 1 */}
            <rect x="62" y="45" width="4" height="22" fill="#DCC7FF" />
            {candlesLit[0] && (
              <path d="M 64 35 Q 61 40 64 45 Q 67 40 64 35 Z" fill="#FFA726" className="flame-flicker" style={{ animationDelay: "0.1s" }} />
            )}

            {/* Candle 2 */}
            <rect x="80" y="42" width="4" height="25" fill="#FFE385" />
            {candlesLit[1] && (
              <path d="M 82 32 Q 79 37 82 42 Q 85 37 82 32 Z" fill="#FFA726" className="flame-flicker" style={{ animationDelay: "0.3s" }} />
            )}

            {/* Candle 3 (Center) */}
            <rect x="98" y="40" width="4" height="27" fill="#FFB7C5" />
            {candlesLit[2] && (
              <path d="M 100 30 Q 97 35 100 40 Q 103 35 100 30 Z" fill="#FFA726" className="flame-flicker" style={{ animationDelay: "0s" }} />
            )}

            {/* Candle 4 */}
            <rect x="116" y="42" width="4" height="25" fill="#FFE385" />
            {candlesLit[3] && (
              <path d="M 118 32 Q 115 37 118 42 Q 121 37 118 32 Z" fill="#FFA726" className="flame-flicker" style={{ animationDelay: "0.5s" }} />
            )}

            {/* Candle 5 */}
            <rect x="134" y="45" width="4" height="22" fill="#DCC7FF" />
            {candlesLit[4] && (
              <path d="M 136 35 Q 133 40 136 45 Q 139 40 136 35 Z" fill="#FFA726" className="flame-flicker" style={{ animationDelay: "0.2s" }} />
            )}
          </svg>
        </div>

        {/* Candles state text feedback */}
        <div style={{ minHeight: "32px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
          {isBlown ? (
            <div style={{ color: "var(--primary-pink)", fontWeight: "bold", fontSize: "1.1rem" }} className="fade-in-up">
              Yeay! Lilinnya sudah ditiup 🎉
            </div>
          ) : micEnabled ? (
            <div className="mic-status-badge active float-medium">
              <span>{micMsg}</span>
              {rms > 0.01 && (
                <div style={{ display: "flex", gap: "2px", marginLeft: "4px" }}>
                  <div className="typing-dot" style={{ animationDuration: "0.6s" }}></div>
                  <div className="typing-dot" style={{ animationDuration: "0.8s" }}></div>
                </div>
              )}
            </div>
          ) : micMsg ? (
            <div className="mic-status-badge" style={{ color: "#a65c4e", borderColor: "#ffcdd2", backgroundColor: "#ffebee" }}>
              {micMsg}
            </div>
          ) : null}
        </div>

        {/* Control Panel Buttons */}
        <div className="candles-control-panel" style={{ zIndex: 10 }}>
          {!isBlown ? (
            <>
              <button
                onClick={blowAllCandles}
                className="btn-pill"
                style={{ width: "100%" }}
              >
                Tiup manual 🎂
              </button>
              
              <button
                onClick={handleMicToggle}
                className={`btn-pill btn-secondary`}
                style={{ width: "100%", borderColor: micEnabled ? "var(--primary-pink)" : "var(--soft-pink)" }}
              >
                {micEnabled ? "Matikan Mode Mic 🎙️" : "Aktifkan Mode Tiup Mic 🎙️"}
              </button>
            </>
          ) : (
            showNextBtn && (
              <button
                onClick={onNext}
                className="btn-pill fade-in-up"
                style={{ width: "100%", animationDuration: "0.4s" }}
              >
                Lanjut Kejutan →
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
