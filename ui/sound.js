const MARKER_SOUND_MS = 560;

function createAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

export function createSoundUI() {
  let audioContext = null;

  function getContext() {
    if (!audioContext) {
      audioContext = createAudioContext();
    }

    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function playMarkerDraw() {
    const context = getContext();
    if (!context) return;

    const duration = MARKER_SOUND_MS / 1000;
    const now = context.currentTime;
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < channel.length; i += 1) {
      const progress = i / channel.length;
      const grit = Math.random() * 2 - 1;
      const tooth = Math.sin(progress * Math.PI * 86);
      const pressure = Math.sin(progress * Math.PI);
      channel[i] = (grit * 0.7 + tooth * 0.3) * pressure * 0.36;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1150, now);
    filter.frequency.exponentialRampToValueAtTime(360, now + duration);
    filter.Q.setValueAtTime(2.1, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.08);
    gain.gain.setValueAtTime(0.09, now + duration * 0.76);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(now);
    source.stop(now + duration);
  }

  return {
    playMarkerDraw
  };
}
