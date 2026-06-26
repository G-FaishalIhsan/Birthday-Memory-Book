import { useEffect, useRef, useState } from "react";

export function useBlowDetector({ threshold = 0.12, onBlow }) {
  const [error, setError] = useState(null);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [rms, setRms] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const consecutiveBlowFramesRef = useRef(0);
  const isActiveRef = useRef(false);

  const stopMic = () => {
    isActiveRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch((err) => console.error("Error closing AudioContext:", err));
      audioContextRef.current = null;
    }
    setRms(0);
    setIsPermissionGranted(false);
  };

  const startMic = async () => {
    if (isActiveRef.current) return;
    
    // Check support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) {
      setIsUnsupported(true);
      setError("Microphone or Web Audio API not supported in this browser.");
      return;
    }

    isActiveRef.current = true;
    consecutiveBlowFramesRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (!isActiveRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      setIsPermissionGranted(true);
      setError(null);

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      // Handle Autoplay restrictions
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);

      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);

      const checkVolume = () => {
        if (!isActiveRef.current || !analyserRef.current) return;

        analyserRef.current.getFloatTimeDomainData(dataArray);

        // Calculate RMS volume
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          sumSquares += dataArray[i] * dataArray[i];
        }
        const rmsValue = Math.sqrt(sumSquares / bufferLength);
        
        setRms(rmsValue);

        // Blow detection: if RMS is higher than threshold
        if (rmsValue > threshold) {
          consecutiveBlowFramesRef.current += 1;
          if (consecutiveBlowFramesRef.current >= 4) {
            if (onBlow) {
              onBlow();
            }
            stopMic();
            return;
          }
        } else {
          consecutiveBlowFramesRef.current = Math.max(0, consecutiveBlowFramesRef.current - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      animationFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(err.message || "Could not access microphone.");
      setIsPermissionGranted(false);
      isActiveRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return { isPermissionGranted, isUnsupported, error, startMic, stopMic, rms };
}
