/**
 * ==========================================================================
 * HAPPY 16TH BIRTHDAY PRISHA — CINEMATIC INTERACTIVE JAVASCRIPT ENGINE
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER & SOUND EFFECTS (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingMusic = false;
      this.melodyTimer = null;
      this.noteIndex = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playPopperSound() {
      this.init();
      if (!this.ctx) return;

      // Pop sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);

      // Chime sparkle
      setTimeout(() => this.playSparkleChime([523.25, 659.25, 783.99, 1046.5]), 80);
    }

    playSparkleChime(freqs = [587.33, 739.99, 880.0, 1174.66]) {
      this.init();
      if (!this.ctx) return;

      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.85);
        }, idx * 70);
      });
    }

    playBlowSound() {
      this.init();
      if (!this.ctx) return;

      // Wind / soft whoosh
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      setTimeout(() => this.playSparkleChime([659.25, 880, 1108.73, 1318.51]), 250);
    }

    playLetterOpenSound() {
      this.init();
      this.playSparkleChime([440, 554.37, 659.25, 880]);
    }

    playGiftOpenSound() {
      this.init();
      this.playSparkleChime([523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]);
    }

    toggleBackgroundMusic(onStateChange) {
      this.init();
      const bgAudio = document.getElementById('bgAudio');

      if (this.isPlayingMusic) {
        this.stopMusic(bgAudio);
        if (onStateChange) onStateChange(false);
      } else {
        this.startMusic(bgAudio);
        if (onStateChange) onStateChange(true);
      }
    }

    startMusic(bgAudio) {
      this.isPlayingMusic = true;
      if (bgAudio && bgAudio.src && !bgAudio.src.endsWith('/')) {
        bgAudio.play().catch(() => {
          this.startSynthesizedMusic();
        });
      } else {
        this.startSynthesizedMusic();
      }
    }

    stopMusic(bgAudio) {
      this.isPlayingMusic = false;
      if (bgAudio) {
        bgAudio.pause();
      }
      if (this.melodyTimer) {
        clearInterval(this.melodyTimer);
        this.melodyTimer = null;
      }
    }

    startSynthesizedMusic() {
      if (this.melodyTimer) clearInterval(this.melodyTimer);

      // Sweet music-box "Happy Birthday" progression in C Major
      const notes = [
        { f: 261.63, d: 350 }, { f: 261.63, d: 200 }, { f: 293.66, d: 500 }, { f: 261.63, d: 500 }, { f: 349.23, d: 500 }, { f: 329.63, d: 900 },
        { f: 261.63, d: 350 }, { f: 261.63, d: 200 }, { f: 293.66, d: 500 }, { f: 261.63, d: 500 }, { f: 392.00, d: 500 }, { f: 349.23, d: 900 },
        { f: 261.63, d: 350 }, { f: 261.63, d: 200 }, { f: 523.25, d: 500 }, { f: 440.00, d: 500 }, { f: 349.23, d: 500 }, { f: 329.63, d: 500 }, { f: 293.66, d: 900 },
        { f: 466.16, d: 350 }, { f: 466.16, d: 200 }, { f: 440.00, d: 500 }, { f: 349.23, d: 500 }, { f: 392.00, d: 500 }, { f: 349.23, d: 1100 }
      ];

      this.noteIndex = 0;
      const playNextNote = () => {
        if (!this.isPlayingMusic || !this.ctx) return;
        const current = notes[this.noteIndex];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(current.f, this.ctx.currentTime);

        // Music box envelope
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (current.d / 1000) * 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + (current.d / 1000) * 1.5);

        this.noteIndex = (this.noteIndex + 1) % notes.length;
        this.melodyTimer = setTimeout(playNextNote, current.d);
      };

      playNextNote();
    }
  }

  const sound = new SoundEngine();

  // --- CELEBRATION & PARTICLES ENGINE ---
  class CelebrationEngine {
    constructor() {
      this.canvas = document.getElementById('celebrationCanvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.ribbons = [];
      this.balloons = [];
      this.isRunning = false;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    triggerSurpriseCelebration() {
      this.resize();
      this.particles = [];
      this.ribbons = [];
      this.balloons = [];
      this.isRunning = true;

      const colors = ['#D9899A', '#B85C73', '#F8DDE3', '#D1AE70', '#DED6EF', '#FFF8F6', '#FFD166'];

      // Left party popper burst
      for (let i = 0; i < 110; i++) {
        const angle = -Math.PI / 4 + (Math.random() * 0.8 - 0.4);
        const speed = Math.random() * 18 + 12;
        this.particles.push({
          x: 0,
          y: window.innerHeight * 0.85,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 9 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          gravity: 0.35,
          type: Math.random() > 0.4 ? 'rect' : 'heart'
        });
      }

      // Right party popper burst
      for (let i = 0; i < 110; i++) {
        const angle = - (3 * Math.PI) / 4 + (Math.random() * 0.8 - 0.4);
        const speed = Math.random() * 18 + 12;
        this.particles.push({
          x: window.innerWidth,
          y: window.innerHeight * 0.85,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 9 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          gravity: 0.35,
          type: Math.random() > 0.4 ? 'rect' : 'heart'
        });
      }

      // Ribbons flying
      for (let i = 0; i < 24; i++) {
        const fromLeft = i % 2 === 0;
        this.ribbons.push({
          x: fromLeft ? 0 : window.innerWidth,
          y: window.innerHeight * 0.85,
          vx: (fromLeft ? 1 : -1) * (Math.random() * 14 + 10),
          vy: -(Math.random() * 16 + 10),
          length: Math.random() * 60 + 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
          points: [],
          gravity: 0.28
        });
      }

      // Floating celebratory balloons
      for (let i = 0; i < 15; i++) {
        this.balloons.push({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + Math.random() * 200,
          speed: Math.random() * 2 + 1.5,
          size: Math.random() * 20 + 25,
          color: colors[Math.floor(Math.random() * colors.length)],
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.04 + 0.02
        });
      }

      this.animate();
    }

    animate() {
      if (!this.isRunning || !this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw & update confetti particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;

        if (p.type === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          // Draw heart
          this.ctx.font = `${p.size * 1.3}px sans-serif`;
          this.ctx.fillText('♡', -p.size / 2, p.size / 2);
        }
        this.ctx.restore();
      }

      // Draw & update ribbons
      for (let i = this.ribbons.length - 1; i >= 0; i--) {
        const r = this.ribbons[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += r.gravity;
        r.vx *= 0.98;
        r.opacity -= 0.004;

        r.points.push({ x: r.x, y: r.y });
        if (r.points.length > 15) r.points.shift();

        if (r.opacity <= 0 || r.y > this.canvas.height + 100) {
          this.ribbons.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalAlpha = Math.max(0, r.opacity);
        this.ctx.strokeStyle = r.color;
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';

        for (let j = 0; j < r.points.length; j++) {
          const pt = r.points[j];
          if (j === 0) this.ctx.moveTo(pt.x, pt.y);
          else this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.stroke();
        this.ctx.restore();
      }

      // Draw & update balloons
      for (let i = this.balloons.length - 1; i >= 0; i--) {
        const b = this.balloons[i];
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobble) * 20;

        if (b.y < -100) {
          this.balloons.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.fillStyle = b.color;
        this.ctx.globalAlpha = 0.85;

        // Balloon body
        this.ctx.beginPath();
        this.ctx.ellipse(currentX, b.y, b.size * 0.75, b.size, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Balloon knot & string
        this.ctx.beginPath();
        this.ctx.moveTo(currentX, b.y + b.size);
        this.ctx.lineTo(currentX, b.y + b.size + 40);
        this.ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        this.ctx.restore();
      }

      if (this.particles.length > 0 || this.ribbons.length > 0 || this.balloons.length > 0) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.isRunning = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  const celebration = new CelebrationEngine();

  // --- AMBIENT FLOATING BACKGROUND CANVAS ---
  class AmbientCanvas {
    constructor() {
      this.canvas = document.getElementById('ambientCanvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.items = [];
      this.resize();
      this.initItems();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    initItems() {
      const count = window.innerWidth < 768 ? 16 : 32;
      const symbols = ['✨', '🌸', '✦', '♡', '⋆'];
      for (let i = 0; i < count; i++) {
        this.items.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedY: Math.random() * 0.6 + 0.2,
          speedX: (Math.random() - 0.5) * 0.4,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 14 + 10,
          opacity: Math.random() * 0.4 + 0.15,
          wobble: Math.random() * Math.PI * 2
        });
      }
    }

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.items.forEach(item => {
        item.y -= item.speedY;
        item.wobble += 0.02;
        item.x += Math.sin(item.wobble) * 0.5 + item.speedX;

        if (item.y < -30) {
          item.y = this.canvas.height + 30;
          item.x = Math.random() * this.canvas.width;
        }

        this.ctx.save();
        this.ctx.font = `${item.size}px sans-serif`;
        this.ctx.globalAlpha = item.opacity;
        this.ctx.fillStyle = '#D9899A';
        this.ctx.fillText(item.symbol, item.x, item.y);
        this.ctx.restore();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  new AmbientCanvas();


  // --- 1. OPENING SURPRISE REVEAL HANDLER ---
  const btnReveal = document.getElementById('btnRevealSurprise');
  const openingScreen = document.getElementById('openingScreen');
  const floatingNav = document.getElementById('floatingNav');

  if (btnReveal) {
    btnReveal.addEventListener('click', () => {
      sound.playPopperSound();
      celebration.triggerSurpriseCelebration();

      openingScreen.classList.add('is-hidden');
      document.body.classList.remove('is-loading');

      // Show floating navigation
      if (floatingNav) {
        floatingNav.classList.add('visible');
      }

      // Auto start music gently
      sound.startMusic(document.getElementById('bgAudio'));
      const musicBtn = document.getElementById('musicToggleBtn');
      const musicLabel = document.getElementById('musicLabel');
      if (musicBtn && musicLabel) {
        musicBtn.classList.add('is-playing');
        musicLabel.textContent = 'MUSIC ON';
      }

      // Stagger reveal animations on Hero
      document.querySelectorAll('.hero-section .reveal-fade').forEach(el => {
        el.classList.add('is-revealed');
      });
    });
  }

  // --- 2. MUSIC BUTTON CONTROLS ---
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      sound.toggleBackgroundMusic((isPlaying) => {
        if (isPlaying) {
          musicToggleBtn.classList.add('is-playing');
          if (musicLabel) musicLabel.textContent = 'MUSIC ON';
        } else {
          musicToggleBtn.classList.remove('is-playing');
          if (musicLabel) musicLabel.textContent = 'PLAY MUSIC';
        }
      });
    });
  }

  // --- 3. 3D HERO POLAROID TILT ---
  const polaroid = document.getElementById('heroPolaroid');
  if (polaroid && window.innerWidth > 992) {
    window.addEventListener('mousemove', (e) => {
      const rect = polaroid.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      const rotateY = deltaX * 12;
      const rotateX = -deltaY * 12;
      polaroid.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(2.5deg)`;
    });
  }

  // --- 4. HER FAVOURITES INTERACTION (EXPAND CARDS) ---
  const favCards = document.querySelectorAll('.fav-card');
  favCards.forEach(card => {
    const handleCardClick = () => {
      sound.playSparkleChime([523.25, 659.25]);
      card.classList.toggle('is-expanded');
    };

    card.addEventListener('click', handleCardClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick();
      }
    });
  });

  // --- 5. BIRTHDAY CAKE & MAKE A WISH INTERACTION ---
  const btnMakeWish = document.getElementById('btnMakeWish');
  const candles = document.querySelectorAll('.candle');
  const wishRevealBox = document.getElementById('wishRevealBox');
  const cakeSection = document.getElementById('cake-section');

  if (btnMakeWish) {
    btnMakeWish.addEventListener('click', () => {
      sound.playBlowSound();

      // Flicker and extinguish all candles
      candles.forEach((candle, idx) => {
        setTimeout(() => {
          candle.classList.add('extinguished');
        }, idx * 35);
      });

      if (cakeSection) {
        cakeSection.classList.add('blown-out');
      }

      // Trigger sparkle celebration
      celebration.triggerSurpriseCelebration();

      // Reveal wish grant message
      setTimeout(() => {
        if (wishRevealBox) {
          wishRevealBox.classList.add('is-revealed');
        }
        btnMakeWish.style.display = 'none';
      }, 700);
    });
  }

  // --- 6. SISTER'S LETTER ENVELOPE OPENING ---
  const envelopeBox = document.getElementById('envelopeBox');
  const btnOpenLetter = document.getElementById('btnOpenLetter');
  const waxSeal = document.getElementById('waxSeal');

  const openLetter = () => {
    if (!envelopeBox.classList.contains('is-opened')) {
      sound.playLetterOpenSound();
      envelopeBox.classList.add('is-opened');
      if (btnOpenLetter) {
        btnOpenLetter.innerHTML = '<span>LETTER OPENED ♡</span> <span>✨</span>';
        btnOpenLetter.style.pointerEvents = 'none';
        btnOpenLetter.style.opacity = '0.7';
      }
    }
  };

  if (btnOpenLetter) btnOpenLetter.addEventListener('click', openLetter);
  if (waxSeal) waxSeal.addEventListener('click', openLetter);

  // --- 7. FINAL SURPRISE GIFT BOX ---
  const giftBox = document.getElementById('giftBox');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const grandRevealCard = document.getElementById('grandRevealCard');

  if (btnOpenGift && giftBox) {
    btnOpenGift.addEventListener('click', () => {
      sound.playGiftOpenSound();
      giftBox.classList.add('is-opened');
      btnOpenGift.style.display = 'none';

      // Massive confetti & sparkles explosion
      celebration.triggerSurpriseCelebration();

      setTimeout(() => {
        if (grandRevealCard) {
          grandRevealCard.classList.add('is-active');
          grandRevealCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    });
  }

  // --- 8. SCROLL OBSERVER (REVEAL ANIMATIONS & ACTIVE NAV) ---
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    threshold: 0.25
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Trigger reveal fade elements inside the section
        entry.target.querySelectorAll('.reveal-fade').forEach(el => {
          el.classList.add('is-revealed');
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

})();
