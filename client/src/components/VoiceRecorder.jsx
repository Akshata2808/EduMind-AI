import { useEffect, useRef, useState } from 'react';

const VoiceRecorder = ({ onResult = () => {} }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const r = new SpeechRecognition();
    r.lang = 'en-IN';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      onResult(txt);
    };
    recognitionRef.current = r;
  }, []);

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      r.stop();
      setListening(false);
    } else {
      try {
        r.start();
        setListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!supported) return <div className="rounded-md bg-rose-50 p-3 text-rose-700">Speech recognition not supported in this browser.</div>;

  return (
    <div className="flex items-center gap-4">
      <button onClick={toggle} className={`rounded-full px-4 py-2 font-medium ${listening ? 'bg-rose-500 text-white' : 'bg-palegreen text-slate-900'}`}>
        {listening ? 'Stop' : 'Record'}
      </button>
      <span className="text-sm text-slate-600">Use voice input for quick questions.</span>
    </div>
  );
};

export default VoiceRecorder;
