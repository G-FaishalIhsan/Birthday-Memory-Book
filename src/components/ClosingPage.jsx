import React, { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";

// Import Stickers
import bearSticker from "../assets/stickers/bear.svg";
import flowerSticker from "../assets/stickers/flower.svg";
import heartSticker from "../assets/stickers/heart.svg";
import smileySticker from "../assets/stickers/smiley.svg";
import starSticker from "../assets/stickers/star.svg";
import balloonSticker from "../assets/stickers/balloon.svg";
import confettiSticker from "../assets/stickers/confetti.svg";
import hiCatImg from "../assets/images/hi.jpg";
import boniBearImg from "../assets/images/boni_bear.png";
import kikoCatImg from "../assets/images/kiko_cat.png";
import liliFlowerImg from "../assets/images/lili_flower.png";

import { specialNames } from "../data/specialNames";

// Import Samples (Fallbacks)
import sample1 from "../assets/samples/sample-1.svg";
import sample2 from "../assets/samples/sample-2.svg";
import sample3 from "../assets/samples/sample-3.svg";
import sample4 from "../assets/samples/sample-4.svg";

import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

export default function ClosingPage({ name, photos, onReplay, onBackToScrapbook }) {
  const [staggerIndex, setStaggerIndex] = useState(-1);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  
  // Photobooth States
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Safe checks for target name
  const safeName = useMemo(() => name || "Teman ✨", [name]);
  const nameLower = useMemo(() => safeName.toLowerCase().trim(), [safeName]);
  const hasSpecial = useMemo(() => specialNames[nameLower] || null, [nameLower]);
  
  const closingWish = useMemo(() => {
    return hasSpecial ? hasSpecial.closing : "Semoga kamu selalu bahagia hari ini dan seterusnya.";
  }, [hasSpecial]);

  // Safe checks for photos
  const safePhotos = useMemo(() => photos || [], [photos]);

  // Stagger entry animations
  useEffect(() => {
    // Immediate confetti celebration
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.65 }
    });

    const timers = [];
    for (let i = 0; i < 4; i++) {
      timers.push(
        setTimeout(() => {
          setStaggerIndex(i);
        }, (i + 1) * 350)
      );
    }

    // Startup Photobooth
    startCamera();

    return () => {
      timers.forEach(clearTimeout);
      stopCamera();
    };
  }, []);

  // Play background music (lagu3.mp3) on mount with fade-in, clean up on unmount
  useEffect(() => {
    const audio = new Audio("/lagu/lagu3.mp3");
    const targetVolume = 0.5;
    audio.volume = 0; // Start at 0 volume
    audio.loop = true;

    let fadeInterval = null;

    audio.play().then(() => {
      let vol = 0;
      fadeInterval = setInterval(() => {
        if (vol < targetVolume) {
          vol = Math.min(targetVolume, vol + 0.05);
          audio.volume = vol;
        } else {
          clearInterval(fadeInterval);
        }
      }, 150); // Takes about 1.5 seconds to reach 0.5
    }).catch((err) => {
      console.warn("Autoplay for lagu3 blocked or error:", err);
    });

    return () => {
      if (fadeInterval) clearInterval(fadeInterval);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Web Camera start
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(false);
    setCapturedImg(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 320, facingMode: "user" },
          audio: false
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraLoading(false);
      } else {
        throw new Error("Kamera tidak didukung perangkat.");
      }
    } catch (err) {
      console.warn("Could not start webcam:", err);
      setCameraError(true);
      setCameraLoading(false);
    }
  };

  // Web Camera stop
  const stopCamera = () => {
    if (cameraStream) {
      try {
        cameraStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn("Error stopping camera tracks:", e);
      }
      setCameraStream(null);
    }
  };

  // Capture Polaroid Picture
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Draw video frame to square canvas
      ctx.drawImage(video, 0, 0, 300, 300);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImg(dataUrl);

      // Stop camera stream after capturing
      stopCamera();

      // Fun camera capture sound effect & confetti pop
      playChimeNote(600);
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.8 }
      });
    }
  };

  // Reset Photobooth
  const retakePhoto = () => {
    startCamera();
  };

  // Simple Synthesizer note player
  const playChimeNote = (freq) => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
  };

  // Double chime melody for the big eye surprise
  const playChimeMelody = () => {
    playChimeNote(523.25);
    setTimeout(() => playChimeNote(659.25), 100);
    setTimeout(() => playChimeNote(783.99), 200);
    setTimeout(() => playChimeNote(1046.50), 300);
  };

  // Trigger final CTA overlay modal
  const handleCTA = () => {
    setShowSurpriseModal(true);
    playChimeMelody();
    
    // continuous confetti shower
    const end = Date.now() + 2000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 200);
  };

  // Mix uploaded photos and sample templates for background visual montage
  const montagePhotos = useMemo(() => {
    const defaultTemplates = [sample1, sample2, sample3, sample4];
    const userPhotos = safePhotos.map(p => p?.url).filter(Boolean);
    const combined = [...userPhotos];
    
    // Fill up to 12 items with defaults if user uploaded less
    while (combined.length < 12) {
      combined.push(defaultTemplates[combined.length % defaultTemplates.length]);
    }
    return combined.slice(0, 12);
  }, [safePhotos]);

  return (
    <div className="page-wrapper wide-closing-wrapper fade-in-up">
      
      {/* ========================================================
          BACKGROUND FLOATING GOLDEN PARTICLES / CONFETTI
          ======================================================== */}
      <div className="golden-particles-layer" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
        {/* Left side golden particles */}
        <img src={starSticker} className="float-slow blink-soft" style={{ position: "absolute", top: "15%", left: "4%", width: "24px", opacity: 0.7 }} />
        <img src={confettiSticker} className="float-medium" style={{ position: "absolute", top: "45%", left: "6%", width: "36px", opacity: 0.6 }} />
        <img src={starSticker} className="float-fast blink-soft" style={{ position: "absolute", top: "75%", left: "3%", width: "18px", opacity: 0.7 }} />
        
        {/* Right side golden particles */}
        <img src={starSticker} className="float-medium blink-soft" style={{ position: "absolute", top: "20%", right: "5%", width: "22px", opacity: 0.7 }} />
        <img src={confettiSticker} className="float-slow" style={{ position: "absolute", top: "50%", right: "7%", width: "40px", opacity: 0.6 }} />
        <img src={starSticker} className="float-fast blink-soft" style={{ position: "absolute", top: "80%", right: "4%", width: "20px", opacity: 0.7 }} />
      </div>

      <div className="cute-card" style={{ overflow: "hidden", position: "relative" }}>
        
        {/* ========================================================
            1. MONTASE VISUAL (THE MEMORY GRID) BACKGROUND
            ======================================================== */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden"
        }}>
          <div className="slow-pan-bg" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            padding: "8px",
            width: "110%",
            height: "110%"
          }}>
            {montagePhotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Montage Thumbnail"
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ zIndex: 10, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.9rem", color: "var(--dark-brown-heading)", marginBottom: "6px" }}>
            Yeay akhirnya kita menamatkan cerita singkat ini ✨
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--brown-text)" }}>
            Makasih ya udah meluangkan waktu berhargamu buat lengkapin halaman random ini.
          </p>
        </div>

        <div className="grid-bg" style={{ gap: "20px", display: "flex", flexDirection: "column", zIndex: 10 }}>
          
          {/* Responsive columns: Row on desktop, Column on mobile */}
          <div className="closing-content-columns" style={{ position: "relative" }}>
            
            {/* FLOATING CAKE STICKER on the left edge (Matches reference image collage feel) */}
            <div style={{ position: "absolute", left: "-52px", top: "50px", zIndex: 12, transform: "rotate(-12deg)", pointerEvents: "none" }} className="float-slow">
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "var(--white)",
                border: "2.5px solid var(--soft-pink)",
                borderRadius: "50%",
                boxShadow: "var(--shadow-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <svg viewBox="0 0 100 100" width="40" height="40">
                  {/* Plate */}
                  <ellipse cx="50" cy="80" rx="35" ry="6" fill="#EAD8FF" />
                  {/* Cake Bottom Layer */}
                  <rect x="25" y="50" width="50" height="25" rx="3" fill="#FFD6E3" stroke="#F27FA6" strokeWidth="1.5" />
                  {/* Cake Top Layer */}
                  <rect x="32" y="32" width="36" height="20" rx="2" fill="#FFF8ED" stroke="#FFD1A8" strokeWidth="1.5" />
                  {/* Candle */}
                  <rect x="48" y="16" width="4" height="16" fill="#DCC7FF" />
                  <path d="M 50 10 Q 48 13 50 16 Q 52 13 50 10 Z" fill="#FFA726" />
                </svg>
              </div>
            </div>

            {/* Column Left: Statistics + Wishes */}
            <div style={{ flex: "1.25", display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
              
              {/* ========================================================
                  2. 3 KARAKTER LUCU DENGAN PESAN POSITIF & LUCU
                  ======================================================== */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
                opacity: staggerIndex >= 0 ? 1 : 0,
                transform: staggerIndex >= 0 ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease"
              }}>
                {/* Karakter 1: Boni */}
                <div className="character-card-premium">
                  <div className="character-avatar-badge">
                    <img src={boniBearImg} alt="Boni Bear Avatar" />
                  </div>
                  <div className="character-bubble-content">
                    <div className="character-name-label">Boni si Beruang 🐻</div>
                    <div className="character-speech-text">
                      “Kamu itu hebat dan tulus banget. Terima kasih sudah jadi dirimu sendiri ya! ✨”
                    </div>
                  </div>
                </div>

                {/* Karakter 2: Kiko */}
                <div className="character-card-premium">
                  <div className="character-avatar-badge">
                    <img src={kikoCatImg} alt="Kiko Cat Avatar" />
                  </div>
                  <div className="character-bubble-content">
                    <div className="character-name-label">Cuking si Kucing 🐱</div>
                    <div className="character-speech-text">
                      “Jangan lupa senyum ya hari ini! Biar orang-orang di sekitarmu juga seneng liat kamu 😊”
                    </div>
                  </div>
                </div>

                {/* Karakter 3: Lili */}
                <div className="character-card-premium">
                  <div className="character-avatar-badge">
                    <img src={liliFlowerImg} alt="Lili Flower Avatar" />
                  </div>
                  <div className="character-bubble-content">
                    <div className="character-name-label">Lily si Bunga 🌸</div>
                    <div className="character-speech-text">
                      “Semoga mimpi-mimpi manis kamu mekar satu per satu dengan indah tahun ini! 🌷”
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  3. PESAN UTAMA (THE CORE MESSAGE BOX WITH FLOWERS)
                  ======================================================== */}
              <div style={{
                textAlign: "left",
                backgroundColor: "var(--white)",
                border: "2px dashed var(--soft-pink)",
                borderRadius: "16px",
                padding: "20px 16px",
                fontSize: "0.9rem",
                color: "var(--brown-text)",
                boxShadow: "var(--shadow-soft)",
                lineHeight: "1.6",
                position: "relative",
                opacity: staggerIndex >= 1 ? 1 : 0,
                transform: staggerIndex >= 1 ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease"
              }}>
                {/* Floating Flower bouquet clusters in bottom corners */}
                <img src={flowerSticker} alt="flower" className="sticker-decor float-slow" style={{ position: "absolute", bottom: "-12px", left: "-14px", width: "38px", height: "38px", zIndex: 6 }} />
                <img src={flowerSticker} alt="flower" className="sticker-decor float-medium" style={{ position: "absolute", bottom: "-12px", right: "-14px", width: "38px", height: "38px", zIndex: 6, transform: "scaleX(-1)" }} />

                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
                  <img src={starSticker} alt="star" style={{ width: "16px", height: "16px" }} />
                  <strong style={{ color: "var(--dark-brown-heading)" }}>Apresiasi:</strong>
                </div>
                <p style={{ marginBottom: "12px", fontSize: "0.85rem" }}>
                  "Jangan lupa bersyukurya, kamu hebat bisa lewatin semua ini, hope you have a great day”
                </p>

                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
                  <img src={flowerSticker} alt="flower" style={{ width: "16px", height: "16px" }} />
                  <strong style={{ color: "var(--dark-brown-heading)" }}>Harapan:</strong>
                </div>
                <p style={{ marginBottom: "12px", fontSize: "0.85rem" }}>
                  “Semoga di usia yang baru ini kamu selalu sehat, bahagia, dan semua mimpi kamu terwujud”
                </p>

                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
                  <img src={heartSticker} alt="heart" style={{ width: "16px", height: "16px" }} />
                  <strong style={{ color: "var(--dark-brown-heading)" }}>Pesan:</strong>
                </div>
                <p style={{ marginBottom: "0", fontSize: "0.85rem" }}>
                  “Jangan lupakan orang orang terdekat sama orang yang sudah mendukung kamu sampai detik ini ya”
                </p>
              </div>
            </div>

            {/* Column Right: Photobooth */}
            <div style={{ flex: "0.75", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minWidth: "220px", position: "relative" }}>
              
              {/* ========================================================
                  4. INTERAKSI SENTUHAN AKHIR (DIGITAL PHOTOBOOTH WITH BALLOONS)
                  ======================================================== */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                opacity: staggerIndex >= 2 ? 1 : 0,
                transform: staggerIndex >= 2 ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease"
              }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--dark-brown-heading)", marginBottom: "10px", display: "inline-block" }}>
                  📸 Small Photobooth 📸
                </span>
                
                <div className="polaroid-frame" style={{ transform: "rotate(-1.5deg)", width: "200px", padding: "10px 10px 24px 10px", backgroundColor: "#FFF", position: "relative" }}>
                  
                  {/* Floating Helium Balloon Stickers behind/on top of Polaroid Corners */}
                  <img src={balloonSticker} alt="balloon" className="sticker-decor float-medium" style={{ position: "absolute", top: "-32px", left: "-28px", width: "42px", height: "50px", zIndex: 1, transform: "rotate(-12deg)" }} />
                  <img src={balloonSticker} alt="balloon" className="sticker-decor float-slow" style={{ position: "absolute", top: "-32px", right: "-28px", width: "42px", height: "50px", zIndex: 1, transform: "rotate(15deg) scaleX(-1)" }} />

                  <div style={{
                    width: "178px",
                    height: "178px",
                    backgroundColor: "#F0F0F0",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "2px",
                    border: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    {capturedImg ? (
                      /* Captured Image Mode */
                      <img src={capturedImg} alt="Captured Polaroid" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : cameraError ? (
                      /* Error Graceful Fallback Mode */
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px", textAlign: "center" }}>
                        <img src={hiCatImg} alt="Cat Placeholder" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", marginBottom: "8px", border: "2.5px solid var(--soft-pink)" }} />
                        <span style={{ fontSize: "0.75rem", color: "var(--brown-text)", fontWeight: "bold" }}>Keep smiling! ✨</span>
                      </div>
                    ) : (
                      /* Live Camera Video Mode */
                      <>
                        {cameraLoading && <span style={{ fontSize: "0.8rem", color: "var(--brown-text)" }}>Memuat kamera...</span>}
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: cameraLoading ? "none" : "block"
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Polaroid Footer Text */}
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", color: "var(--dark-brown-heading)", marginTop: "12px" }}>
                    Met, Ulang Tahun 😉
                  </div>
                </div>

                {/* Hidden Canvas for Capturing */}
                <canvas ref={canvasRef} width={300} height={300} style={{ display: "none" }} />

                {/* Camera Actions */}
                {!cameraError && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    {!capturedImg ? (
                      <button
                        onClick={capturePhoto}
                        disabled={cameraLoading}
                        className="btn-pill"
                        style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                      >
                        Ambil Foto 📸
                      </button>
                    ) : (
                      <button
                        onClick={retakePhoto}
                        className="btn-pill btn-secondary"
                        style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                      >
                        Foto Ulang 🔄
                      </button>
                    )}
                  </div>
                )}
              </div>
              
            </div>

          </div>

          {/* ========================================================
              5. CALL-TO-ACTION (CTA) - SHINY SURPRISE GRADIENT BUTTON
              ======================================================= */}
          <button
            onClick={handleCTA}
            className="btn-gradient-surprise fade-in-up"
            style={{
              width: "100%",
              marginTop: "8px",
              opacity: staggerIndex >= 3 ? 1 : 0,
              transform: staggerIndex >= 3 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.4s ease",
              animationDuration: "0.5s"
            }}
          >
            Yeay sudah selesai, lanjut close 💖
          </button>
        </div>

        {/* Micro Stickers in Corners */}
        <img src={bearSticker} alt="bear" className="sticker-decor float-slow" style={{ width: "24px", height: "24px", bottom: "16px", left: "16px" }} />
        <img src={flowerSticker} alt="flower" className="sticker-decor float-medium" style={{ width: "26px", height: "26px", top: "12px", right: "12px" }} />
      </div>

      {/* ========================================================
          POP-UP OVERLAY MODAL (MODAL KEJUTAN CTA) - PORTAL MOUNTED
          ======================================================== */}
      {showSurpriseModal && createPortal(
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(107, 78, 61, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div 
            className="cute-card bubble-slide-in" 
            style={{
              maxWidth: "380px",
              padding: "28px 24px",
              backgroundColor: "var(--cream-paper)",
              border: "4px solid var(--primary-pink)",
              position: "relative",
              gap: "16px"
            }}
          >
            {/* Surprise Icon */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={smileySticker} alt="Sticker Mascot" style={{ width: "70px", height: "70px" }} />
            </div>

            <h2 style={{ fontSize: "1.7rem", color: "var(--primary-pink)" }}>
              Terimakasih ya sudah berpartisipasi dan membuka ini 💗
            </h2>

            <p style={{ fontSize: "0.95rem", color: "var(--brown-text)", lineHeight: "1.6" }}>
              “Selamat ulang tahun sekali lagi, {safeName}! 🎂🌷<br/>
              Semoga semua hal baik selalu melingkari hidupmu. Makasih banyak ya udah mau buka lembaran cerita sederhana ini sampai selesai.”
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <button
                  onClick={onReplay}
                  className="btn-pill"
                  style={{ flex: 1, fontSize: "0.9rem", padding: "10px 14px" }}
                >
                  Lanjut ke awal lagi 🔄
                </button>
                
                <button
                  onClick={() => setShowSurpriseModal(false)}
                  className="btn-pill btn-secondary"
                  style={{ flex: 1, fontSize: "0.9rem", padding: "10px 14px" }}
                >
                  Tutup 🌸
                </button>
              </div>

              {onBackToScrapbook && (
                <button
                  onClick={onBackToScrapbook}
                  className="btn-pill"
                  style={{ 
                    width: "100%", 
                    fontSize: "0.9rem", 
                    padding: "10px 14px", 
                    backgroundColor: "#f3e8ff", 
                    borderColor: "#d8b4fe", 
                    color: "#6b21a8" 
                  }}
                >
                  Kembali ke Scrapbook 📖
                </button>
              )}
            </div>

            {/* Tiny stars in modal */}
            <img src={starSticker} alt="star" className="sticker-decor float-slow" style={{ width: "20px", height: "20px", top: "15px", left: "15px" }} />
            <img src={starSticker} alt="star" className="sticker-decor float-medium" style={{ width: "20px", height: "20px", bottom: "15px", right: "15px" }} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
