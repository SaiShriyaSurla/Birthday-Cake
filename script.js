const cake = document.querySelector('.candles');
let candleCount = 0;  // Initialize candle count

function addCandle() {
  const candle = document.createElement('div');
  candle.className = 'candle';
  // Ensure the candles are spaced somewhat randomly along the width of the cake
  candle.style.left = `${Math.random() * 90 + 5}%`;

  const flame = document.createElement('div');
  flame.className = 'flame';
  candle.appendChild(flame);  // Add the flame to the candle
  
  cake.appendChild(candle);  // Add the candle to the cake container

  // Update the candle count
  candleCount += 1;
  document.getElementById('candleCount').innerText = candleCount;  // Update the displayed count
}

function blowCandles() {
  const flames = document.querySelectorAll('.flame');
  flames.forEach(flame => {
    flame.style.display = 'none';  // Hide the flame to simulate being blown out
  });
}

// Audio detection for blowing candles
function listenToBlow() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }) // Request permission to access audio
    .then(stream => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function checkBlow() {
        analyser.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((a, b) => a + b, 0);
        if (sum > 9000) {  // Threshold value, adjust based on testing
          blowCandles();
        }
        requestAnimationFrame(checkBlow);  // Continuously check the audio input
      }

      checkBlow();
    })
    .catch(err => {
      console.error('Could not access the microphone.', err);
    });
}

listenToBlow();  // Start listening for blowing immediately when the page loads
