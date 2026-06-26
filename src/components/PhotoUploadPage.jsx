import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import cameraSticker from "../assets/stickers/camera.svg";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/animations.css";

export default function PhotoUploadPage({ photos, setPhotos, onNext }) {
  const fileInputRef = useRef(null);
  const [warningMsg, setWarningMsg] = useState("");
  const [showVolumeModal, setShowVolumeModal] = useState(false);

  // Revoke Object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Optional cleanup if needed. But since photos are preserved for scrapbook and closing,
      // we only clean them up when resetting/replaying in App.jsx.
    };
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Filter image files only
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    // Calculate space remaining
    const remaining = 7 - photos.length;
    if (remaining <= 0) {
      setWarningMsg("Maksimal upload 7 foto saja yaa! 😊");
      return;
    }

    const filesToAdd = imageFiles.slice(0, remaining);
    
    const newPhotos = filesToAdd.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      file
    }));

    setPhotos(prev => [...prev, ...newPhotos]);

    if (imageFiles.length > remaining) {
      setWarningMsg("Beberapa foto dilewati karena sudah mencapai batas maksimal 7 foto.");
    }

    // Reset file input value so same file can be uploaded again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (id, url) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    URL.revokeObjectURL(url);
  };

  const handleBoxClick = () => {
    if (photos.length >= 7) {
      setWarningMsg("Batas maksimal 7 foto sudah tercapai! Hapus beberapa foto jika ingin mengganti.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isNextDisabled = photos.length < 5;

  return (
    <div className="page-wrapper fade-in-up">
      <div className="cute-card">
        <div>
          <h1 style={{ fontSize: "1.9rem", marginBottom: "8px", color: "var(--dark-brown-heading)" }}>
            Yeay! 🎉
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--brown-text)" }}>
            Sekarang saatnya upload foto-foto manis kamu ya 💗
          </p>
        </div>

        <div className="grid-bg">
          <div className="upload-container">
            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              style={{ display: "none" }}
            />

            {/* Custom Upload Box */}
            <div className="upload-box" onClick={handleBoxClick}>
              <img 
                src={cameraSticker} 
                alt="Camera Icon" 
                style={{ width: "40px", height: "40px" }}
              />
              <span>Pilih Foto</span>
              <p>Minimal 5, maksimal 7 foto</p>
            </div>

            {/* Uploaded photo count status */}
            <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: photos.length >= 5 ? "var(--primary-pink)" : "var(--brown-text)" }}>
              {photos.length} dari 7 foto terpilih {photos.length >= 5 ? "✨" : "(kurang " + (5 - photos.length) + " lagi)"}
            </div>

            {/* Grid of uploaded photo previews */}
            {photos.length > 0 && (
              <div className="photo-grid">
                {photos.map((photo) => (
                  <div key={photo.id} className="photo-preview-item fade-in-up">
                    <img src={photo.url} alt="Uploaded Memory" />
                    <div 
                      className="photo-remove-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id, photo.url);
                      }}
                    >
                      ×
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowVolumeModal(true)}
            className="btn-pill"
            disabled={isNextDisabled}
            style={{ width: "100%", marginTop: "24px" }}
          >
            Selesai, Lanjut Next Chapter →
          </button>
        </div>
      </div>

      {/* Beautiful premium custom warning modal overlay - mounted via Portal */}
      {warningMsg && createPortal(
        <div className="custom-popup-overlay">
          <div className="custom-popup-card bubble-slide-in">
            <div className="custom-popup-icon" style={{ animation: "float 2s ease-in-out infinite" }}>🌸</div>
            <h3 className="custom-popup-title">Ups! Perhatian 🌷</h3>
            <p className="custom-popup-text">{warningMsg}</p>
            <button className="btn-pill" onClick={() => setWarningMsg("")} style={{ width: "80%" }}>
              Mengerti ✨
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Volume suggestion warning modal overlay - mounted via Portal */}
      {showVolumeModal && createPortal(
        <div className="custom-popup-overlay">
          <div className="custom-popup-card bubble-slide-in">
            <div className="custom-popup-icon" style={{ animation: "float 2s ease-in-out infinite" }}>🎧</div>
            <h3 className="custom-popup-title">Sesuaikan Volume 🎵</h3>
            <p className="custom-popup-text">
              “Sebelum lanjut. Pastikan volume suara perangkatmu sudah pas dan nyaman ya! 😊🌸”
            </p>
            <button className="btn-pill" onClick={onNext} style={{ width: "80%" }}>
              Lanjut →
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
