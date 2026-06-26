import React, { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import NameInputPage from "./components/NameInputPage";
import WelcomePage from "./components/WelcomePage";
import BirthdayCakePage from "./components/BirthdayCakePage";
import WhatsAppGimmickPage from "./components/WhatsAppGimmickPage";
import PhotoUploadPage from "./components/PhotoUploadPage";
import ScrapbookBook from "./components/ScrapbookBook";
import ClosingPage from "./components/ClosingPage";
import FloatingDecor from "./components/FloatingDecor";
import CatGimmick from "./components/CatGimmick";

export default function App() {
  const [step, setStep] = useState("loading");
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleLoadingFinished = () => {
    setStep("name");
  };

  const handleNameSubmitted = (submittedName) => {
    setName(submittedName);
    setStep("welcome");
  };

  const handleWelcomeFinished = () => {
    setStep("cake");
  };

  const handleCakeBlown = () => {
    setStep("whatsapp");
  };

  const handleWhatsAppFinished = () => {
    setStep("upload");
  };

  const handleUploadFinished = () => {
    setStep("scrapbook");
  };

  const handleScrapbookFinished = () => {
    setStep("closing");
  };

  const handleReplay = () => {
    // Revoke all created Object URLs to prevent memory leaks
    photos.forEach((photo) => {
      URL.revokeObjectURL(photo.url);
    });
    setPhotos([]);
    setName("");
    setStep("name");
  };

  return (
    <div className="app-container">
      {/* Background Floating Decor (Stars, Hearts, Sparkles) active on all pages except loading */}
      {step !== "loading" && <FloatingDecor />}

      {/* Main active page/step rendering */}
      {step === "loading" && (
        <LoadingScreen onFinished={handleLoadingFinished} />
      )}

      {step === "name" && (
        <NameInputPage onNext={handleNameSubmitted} />
      )}

      {step === "welcome" && (
        <WelcomePage name={name} onNext={handleWelcomeFinished} />
      )}

      {step === "cake" && (
        <BirthdayCakePage name={name} onNext={handleCakeBlown} />
      )}

      {step === "whatsapp" && (
        <WhatsAppGimmickPage name={name} onNext={handleWhatsAppFinished} />
      )}

      {step === "upload" && (
        <PhotoUploadPage 
          photos={photos} 
          setPhotos={setPhotos} 
          onNext={handleUploadFinished} 
        />
      )}

      {step === "scrapbook" && (
        <div className="page-wrapper wide">
          <ScrapbookBook 
            name={name} 
            photos={photos} 
            onNext={handleScrapbookFinished} 
          />
        </div>
      )}

      {step === "closing" && (
        <ClosingPage 
          name={name} 
          photos={photos} 
          onReplay={handleReplay} 
          onBackToScrapbook={() => setStep("scrapbook")}
        />
      )}

      {/* Floating Cat Gimmick button on bottom-right, visible from scrapbook step onwards */}
      {(step === "scrapbook" || step === "closing") && <CatGimmick />}
    </div>
  );
}
