import React, { useRef, useState, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import ScrapbookPage from "./ScrapbookPage";
import { scrapbookLetters } from "../data/scrapbookTexts";

// Import Stickers
import bearSticker from "../assets/stickers/bear.svg";
import flowerSticker from "../assets/stickers/flower.svg";
import heartSticker from "../assets/stickers/heart.svg";
import starSticker from "../assets/stickers/star.svg";
import bowSticker from "../assets/stickers/bow.svg";
import tapeSticker from "../assets/stickers/tape.svg";
import smileySticker from "../assets/stickers/smiley.svg";
import balloonSticker from "../assets/stickers/balloon.svg";

// Import Custom Images
import birthdayBunnyImg from "../assets/images/birthday_bunny.jpg";

// Import Samples (Fallbacks)
import sample1 from "../assets/samples/sample-1.svg";
import sample2 from "../assets/samples/sample-2.svg";
import sample3 from "../assets/samples/sample-3.svg";
import sample4 from "../assets/samples/sample-4.svg";
import sample5 from "../assets/samples/sample-5.svg";
import sample6 from "../assets/samples/sample-6.svg";
import sample7 from "../assets/samples/sample-7.svg";

import "../styles/global.css";
import "../styles/scrapbook.css";
import "../styles/layout.css";

export default function ScrapbookBook({ name, photos, onNext }) {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 440, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  // Responsive sizing adjustments
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setIsMobile(true);
        setDimensions({ width: 330, height: 500 });
      } else if (w < 768) {
        setIsMobile(true);
        setDimensions({ width: 380, height: 540 });
      } else {
        setIsMobile(false);
        setDimensions({ width: 440, height: 620 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Background music sequence loop (lagu1.mp3 -> lagu2.mp3 -> repeat) with gentle fade-in
  useEffect(() => {
    const playlist = ["/lagu/lagu1.mp3", "/lagu/lagu2.mp3"];
    let currentTrackIndex = 0;
    const audio = new Audio(playlist[currentTrackIndex]);
    const targetVolume = 0.5;
    audio.volume = 0; // Start at 0 volume

    let fadeInterval = null;

    const playCurrentTrack = () => {
      audio.volume = 0; // Reset volume to 0 before play
      audio.play().then(() => {
        if (fadeInterval) clearInterval(fadeInterval);
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
        console.warn("Autoplay audio blocked or error:", err);
      });
    };

    const handleTrackEnded = () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      audio.src = playlist[currentTrackIndex];
      audio.load();
      playCurrentTrack();
    };

    audio.addEventListener("ended", handleTrackEnded);

    // Initial play
    playCurrentTrack();

    // Clean up
    return () => {
      audio.removeEventListener("ended", handleTrackEnded);
      if (fadeInterval) clearInterval(fadeInterval);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const handlePageChange = (e) => {
    setCurrentPage(e.data);
  };

  const handlePrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const handleNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  // Compile letter messages with personalized name
  const letterOneCompiled = useMemo(() => {
    return scrapbookLetters.letterOne.text.replace(/{name}/g, name);
  }, [name]);

  const letterTwoCompiled = useMemo(() => {
    return scrapbookLetters.letterTwo.text.replace(/{name}/g, name);
  }, [name]);

  const letterThreeCompiled = useMemo(() => {
    return scrapbookLetters.letterThree.text.replace(/{name}/g, name);
  }, [name]);

  // Safely extract photos or fallback SVGs
  const getPhoto = (index, fallback) => {
    if (photos && photos[index]) {
      return photos[index].url;
    }
    return fallback;
  };

  return (
    <div className="scrapbook-container fade-in-up">
      <div className="book-wrapper" style={{ width: isMobile ? `${dimensions.width}px` : `${dimensions.width * 2}px`, height: `${dimensions.height}px` }}>
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={300}
          maxWidth={500}
          minHeight={450}
          maxHeight={700}
          drawShadow={true}
          flippingTime={800}
          useMouseEvents={true}
          showCover={false}
          ref={bookRef}
          onFlip={handlePageChange}
          className="cute-scrapbook-flipbook"
          style={{ backgroundColor: "var(--cream-paper)" }}
        >
          {/* ========================================================
              HALAMAN 1: COVER
              ======================================================== */}
          <ScrapbookPage pageNum={1} isLeft={true}>
            <div className="page-header">
              <div className="cute-badge" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>Scrapbook Birthday 📖</div>
            </div>
            
            <div className="page-content" style={{ gap: "14px" }}>
              <div className="scrapbook-polaroid rotated-left" style={{ width: "160px", padding: "8px 8px 16px 8px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" style={{ width: "60px" }} />
                <div className="scrapbook-img-frame" style={{ width: "140px", height: "140px" }}>
                  <img src={getPhoto(0, sample1)} alt="Cover Photo" className="scrapbook-img" />
                </div>
              </div>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "8px", color: "var(--dark-brown-heading)", fontFamily: "var(--font-heading)", lineHeight: "1.4" }}>
                Buku Kenangan<br/>Untukmu, {name} 💗
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--brown-text)", maxWidth: "85%", textAlign: "center" }}>
                Kumpulan momen manis yang disatukan khusus buat kamu ✨
              </p>
            </div>

            <img src={bearSticker} alt="bear sticker" className="sticker-decor float-slow" style={{ width: "32px", height: "32px", bottom: "35px", left: "20px" }} />
            <img src={heartSticker} alt="heart sticker" className="sticker-decor float-fast" style={{ width: "24px", height: "24px", top: "35px", right: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 2: DEDICATED PHOTO 1 (LARGE)
              ======================================================== */}
          <ScrapbookPage pageNum={2} isLeft={false}>
            <div className="page-header">
              <h2>Awal Senyuman ✨</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-right" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(0, sample2)} alt="Large Memory 1" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note" style={{ marginTop: "12px" }}>
                “All the best wishes for your special day!”
              </div>
            </div>

            <img src={flowerSticker} alt="flower" className="sticker-decor float-medium" style={{ width: "30px", height: "30px", bottom: "40px", right: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 3: DEDICATED PHOTO 2 (LARGE)
              ======================================================== */}
          <ScrapbookPage pageNum={3} isLeft={true}>
            <div className="page-header">
              <h2>Momen Hangat 🌸</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-left" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(1, sample3)} alt="Large Memory 2" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note lavender-note" style={{ marginTop: "12px" }}>
                “Kadang momen kecil cukup untuk bikin hari jadi hangat.”
              </div>
            </div>

            <img src={smileySticker} alt="smiley" className="sticker-decor float-slow" style={{ width: "28px", height: "28px", top: "35px", left: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 4: DEDICATED PHOTO 3 (LARGE)
              ======================================================== */}
          <ScrapbookPage pageNum={4} isLeft={false}>
            <div className="page-header">
              <h2>Cerita Indah 💫</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-right" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(2, sample4)} alt="Large Memory 3" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note" style={{ marginTop: "12px" }}>
                “Semoga apa yang kamu impikan terwujud dengan indah dan bahagia!”
              </div>
            </div>

            <img src={starSticker} alt="star" className="sticker-decor float-medium" style={{ width: "24px", height: "24px", bottom: "35px", left: "25px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 5: LETTER PAGE 1
              ======================================================== */}
          <ScrapbookPage pageNum={5} isLeft={true}>
            <div className="page-content" style={{ justifyContent: "flex-start", padding: "10px 0" }}>
              <div className="letter-text">
                <h3>{scrapbookLetters.letterOne.title.replace(/{name}/g, name)}</h3>
                <p>{letterOneCompiled}</p>
              </div>
            </div>

            <img src={bowSticker} alt="bow" className="sticker-decor float-slow" style={{ width: "34px", height: "34px", bottom: "30px", right: "25px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 6: LETTER PAGE 2
              ======================================================== */}
          <ScrapbookPage pageNum={6} isLeft={false}>
            <div className="page-content" style={{ justifyContent: "flex-start", padding: "10px 0" }}>
              <div className="letter-text">
                <h3>{scrapbookLetters.letterTwo.title.replace(/{name}/g, name)}</h3>
                <p>{letterTwoCompiled}</p>
              </div>
            </div>

            <img src={starSticker} alt="star" className="sticker-decor float-medium" style={{ width: "24px", height: "24px", top: "30px", left: "25px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 7: LETTER PAGE 3 (NEW)
              ======================================================== */}
          <ScrapbookPage pageNum={7} isLeft={true}>
            <div className="page-content" style={{ justifyContent: "flex-start", padding: "10px 0" }}>
              <div className="letter-text">
                <h3>{scrapbookLetters.letterThree.title.replace(/{name}/g, name)}</h3>
                <p>{letterThreeCompiled}</p>
              </div>
            </div>

            <img src={smileySticker} alt="smiley" className="sticker-decor float-slow" style={{ width: "32px", height: "32px", bottom: "30px", right: "25px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 8: DEDICATED PHOTO 4 (LARGE)
              ======================================================== */}
          <ScrapbookPage pageNum={8} isLeft={false}>
            <div className="page-header">
              <h2>Momen Berharga ☕</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-left" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(3, sample5)} alt="Large Memory 4" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note lavender-note" style={{ marginTop: "12px" }}>
                “Senyum dari hati”
              </div>
            </div>

            <img src={flowerSticker} alt="flower" className="sticker-decor float-medium" style={{ width: "28px", height: "28px", top: "35px", right: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 9: DEDICATED PHOTO 5 (LARGE)
              ======================================================== */}
          <ScrapbookPage pageNum={9} isLeft={true}>
            <div className="page-header">
              <h2>Senyuman Favorit 💖</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-right" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(4, sample6)} alt="Large Memory 5" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note" style={{ marginTop: "12px" }}>
                “Semoga halaman ini jadi pengingat kecil yang manis.”
              </div>
            </div>

            <img src={heartSticker} alt="heart" className="sticker-decor float-slow" style={{ width: "26px", height: "26px", bottom: "35px", right: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 10: DEDICATED PHOTO 6 (LARGE)
              ======================================================== */}
          <ScrapbookPage pageNum={10} isLeft={false}>
            <div className="page-header">
              <h2> Cerita seru ✨</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-left" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(5, sample7)} alt="Large Memory 6" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note lavender-note" style={{ marginTop: "12px" }}>
                “Jangan lupakan momen-momen indah ini ya!”
              </div>
            </div>

            <img src={starSticker} alt="star" className="sticker-decor float-fast" style={{ width: "28px", height: "28px", top: "35px", left: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 11: DEDICATED PHOTO 7 (LARGE) (NEW)
              ======================================================== */}
          <ScrapbookPage pageNum={11} isLeft={true}>
            <div className="page-header">
              <h2> Future wish 💫</h2>
            </div>
            
            <div className="page-content">
              <div className="scrapbook-polaroid rotated-right" style={{ width: "240px", padding: "10px 10px 22px 10px" }}>
                <img src={tapeSticker} alt="tape" className="scrapbook-tape top" />
                <div className="scrapbook-img-frame" style={{ width: "216px", height: "216px" }}>
                  <img src={getPhoto(6, sample1)} alt="Large Memory 7" className="scrapbook-img" />
                </div>
              </div>

              <div className="sticky-note" style={{ marginTop: "12px" }}>
                “Semoga harimu penuh dengan kebahagiaan dan kejutan-kejutan indah!”
              </div>
            </div>

            <img src={bearSticker} alt="bear" className="sticker-decor float-slow" style={{ width: "26px", height: "26px", bottom: "35px", right: "20px" }} />
          </ScrapbookPage>

          {/* ========================================================
              HALAMAN 12: PENUTUP BUKU (CLOSING BOOK)
              ======================================================== */}
          <ScrapbookPage pageNum={12} isLeft={false}>
            <div className="page-content" style={{ gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img 
                  src={birthdayBunnyImg} 
                  alt="Happy Birthday Bunny" 
                  style={{ width: "160px", height: "160px", objectFit: "contain", borderRadius: "12px", border: "3px solid var(--soft-pink)", boxShadow: "var(--shadow-soft)" }} 
                />
              </div>
              
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "1.35rem", color: "var(--dark-brown-heading)", marginBottom: "8px", fontFamily: "var(--font-heading)", lineHeight: "1.4" }}>
                  Terima kasih sudah membuka semua halaman ini 💗
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--brown-text)", lineHeight: "1.5" }}>
                  Semoga lembaran-lembaran memori tadi bisa bikin kamu senyum hehe.<br/>
                  Mari kita lanjut ke kejutan penutup ya!
                </p>
              </div>

              <button
                onClick={() => {
                  setTimeout(() => {
                    onNext();
                  }, 120);
                }}
                className="btn-pill"
                style={{ width: "85%", marginTop: "4px" }}
              >
                Lanjut ke Penutup →
              </button>
            </div>

            <img src={flowerSticker} alt="flower" className="sticker-decor float-slow" style={{ width: "28px", height: "28px", top: "35px", right: "20px" }} />
          </ScrapbookPage>
        </HTMLFlipBook>
      </div>

      {/* Book Nav Controls */}
      <div className="scrapbook-controls">
        <button 
          onClick={handlePrev} 
          className="control-btn"
          disabled={currentPage === 0}
          title="Halaman Sebelumnya"
        >
          ←
        </button>

        <div className="page-indicator">
          Halaman {currentPage + 1} dari 12
        </div>

        <button 
          onClick={handleNext} 
          className="control-btn"
          disabled={currentPage >= 11}
          title="Halaman Selanjutnya"
        >
          →
        </button>
      </div>
    </div>
  );
}
