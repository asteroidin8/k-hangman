const MARKER_SOUND_MS = 180;

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
      const scratch = Math.random() * 2 - 1;
      channel[i] = scratch * (1 - progress) * 0.38;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(260, now + duration);
    filter.Q.setValueAtTime(1.4, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.018);
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
