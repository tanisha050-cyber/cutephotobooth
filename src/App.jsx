import { useRef, useState } from 'react';
import './App.css';
import Webcam from 'react-webcam';

export default function App() {
  const [screen, setScreen] = useState('camera');
  const [countdown, setCountdown] = useState(3);
  const [flash, setFlash] = useState(false);
  const [photos, setPhotos] = useState([]);

  const webcamRef = useRef(null);
  const [blackWhite, setBlackWhite] = useState(false);

  // Small helper to wait
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Main photobooth flow
  const startCountdown = async () => {
    setPhotos([]);

    for (let i = 0; i < 3; i++) {
      setScreen('countdown');

      // 3 → 2 → 1
      for (let number = 3; number >= 1; number--) {
        setCountdown(number);
        await wait(1000);
      }

      // Flash
      setFlash(true);
      await wait(180);
      setFlash(false);

      // Capture image
      const image = webcamRef.current.getScreenshot();
      if (image) {
        setPhotos((prev) => [...prev, image]);
      }

      // Back to camera briefly
      setScreen('camera');
      await wait(1200);
    }

    // Processing screen
    setScreen('processing');
    await wait(2200);

    // Final result
    setScreen('result');
  };

  return (
    <>
      {/* White flash overlay */}
      {flash && <div className='flash-screen' />}

      {/* Processing screen */}
      {screen === 'processing' && (
        <div className='processing-screen'>
          <h2>Getting your photo strip ready…</h2>

          <div className='loading-bar'>
            <div className='loading-fill'></div>
          </div>

          <p>Developing film ✦ Please wait</p>
        </div>
      )}

      {/* Camera screen */}
      {screen !== 'processing' && screen !== 'result' && (
        <div className='app'>
          <h1>Vintage Photobooth</h1>

          <div className='camera-frame'>
            <Webcam
              ref={webcamRef}
              mirrored={true}
              screenshotFormat='image/jpeg'
              className='webcam'
            />
          </div>

          <button onClick={startCountdown}>Start</button>

          {/* Mini previews */}
          {photos.length > 0 && (
            <div className='preview-row'>
              {photos.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`preview-${index}`}
                  className='preview-thumb'
                />
              ))}
            </div>
          )}

          {/* Countdown overlay */}
          {screen === 'countdown' && (
            <div className='countdown-screen'>
              <div className='countdown-number'>{countdown}</div>
            </div>
          )}
        </div>
      )}

      {/* Final result screen */}
      {screen === 'result' && (
        <div className='result-screen'>
          <button
  className='bw-btn'
  onClick={() => setBlackWhite(!blackWhite)}
>
  {blackWhite ? 'Color Mode 🎨' : 'B&W Mode 🖤'}
</button>
          <div className='strip reveal'>
            {photos.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`final-${index}`}
               className={`strip-photo ${blackWhite ? 'bw' : ''}`}/>
            ))}
          </div>

          <button className='download-btn'>Download Strip</button>
        </div>
      )}
    </>
  );
}