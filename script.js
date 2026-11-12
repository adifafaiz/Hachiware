/**
 * ==============================================================================
 * HAPPY BIRTHDAY SPECIAL - TOSCA & CHIIKAWA INTERACTIVE SCRIPT
 * Glassmorphic PIN Login (1728) & Ultimate Celebration Dashboard
 * ==============================================================================
 */

// ==========================================
// CONFIGURATION & STATE
// ==========================================
// Set PIN to 1728 as requested.
// Clear old default '1234' if stored previously.
let savedPin = localStorage.getItem("bday_pin");
if (!savedPin || savedPin === "1234") {
  savedPin = "1728";
  localStorage.setItem("bday_pin", "1728");
}

const CONFIG = {
  defaultPin: savedPin,
  pinLength: 4
};

let currentPin = "";
let isLocked = true;
let isAudioPlaying = false;
let audioContext = null;
let musicBoxInterval = null;

// ==========================================
// DOM ELEMENTS
// ==========================================
const loginScreen = document.getElementById("loginScreen");
const surpriseScreen = document.getElementById("surpriseScreen");
const pinDots = document.querySelectorAll(".pin-dot");
const pinDotsContainer = document.getElementById("pinDots");
const pinStatusMsg = document.getElementById("pinStatusMsg");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const lockBackBtn = document.getElementById("lockBackBtn");

// Modal Elements
const hintModal = document.getElementById("hintModal");
const hintTriggerBtn = document.getElementById("hintTriggerBtn");
const closeHintModalBtn = document.getElementById("closeHintModalBtn");
const currentPinCodeEl = document.getElementById("currentPinCode");
const customPinInput = document.getElementById("customPinInput");
const setCustomPinBtn = document.getElementById("setCustomPinBtn");

// Photo Lightbox
const photoModal = document.getElementById("photoModal");
const lightboxImg = document.getElementById("lightboxImg");
const closePhotoModalBtn = document.getElementById("closePhotoModalBtn");
const stroboTrack = document.getElementById("stroboTrack");

// Interactive Cake
const cakeBox = document.getElementById("cakeBox");
const blowCandleBtn = document.getElementById("blowCandleBtn");
const wishResult = document.getElementById("wishResult");
const flames = document.querySelectorAll(".flame");
const confettiBtn = document.getElementById("confettiBtn");

// Music Pill
const musicBtn = document.getElementById("musicBtn");
const musicStatus = document.getElementById("musicStatus");
const sparklesCanvas = document.getElementById("sparklesCanvas");

// Mascot Speech Elements
const peekingChiikawa = document.querySelector(".peeking-chiikawa");
const peekingHachiware = document.querySelector(".peeking-hachiware");
const mascotUsagi = document.querySelector(".mascot-usagi");

// Dashboard Elements
const dashTabs = document.querySelectorAll(".dash-tab-btn");
const dashContents = document.querySelectorAll(".dash-tab-content");
const waxSealBtn = document.getElementById("waxSealBtn");
const envelopeCard = document.getElementById("envelopeCard");
const loveLetterBody = document.getElementById("loveLetterBody");
const rollAffirmationBtn = document.getElementById("rollAffirmationBtn");
const affirmationText = document.getElementById("affirmationText");
const sendWishBtn = document.getElementById("sendWishBtn");
const wishTextarea = document.getElementById("wishTextarea");
const wishesList = document.getElementById("wishesList");

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  currentPinCodeEl.textContent = CONFIG.defaultPin;
  initKeypad();
  initKeyboardListeners();
  initStroboInteractions();
  initModals();
  initCakeInteractions();
  initMusicController();
  initSparklesCanvas();
  initMascotSounds();
  initDashboardTabs();
  initEnvelopeInteraction();
  initAffirmationGenerator();
  initCoupons();
  initWishesBoard();
  initHeartReactions();
  initArcadeGames();
  initThemePicker();
  initMusicPicker();
  initGalleryUpload();
  initTimelineChecklist();
  initRatingSystem();
  initWheelsMenuDropdown();
  initOthersTabFeatures();
  initCuteClock();

  // URL query parameter ?view=dashboard to easily preview dashboard anytime
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("view") === "dashboard") {
    unlockWebsite();
  }
});

// ==========================================
// AUDIO SYNTHESIZER (CUTE CHIMES & MUSIC BOX)
// ==========================================
function getAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playKeySound(freq = 520) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch (e) {}
}

function playSuccessFanfare() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }, idx * 100);
    });
  } catch (e) {}
}

// Gentle Music Box "Happy Birthday" Notes
const BDAY_NOTES = [
  { f: 261.63, d: 350 }, { f: 261.63, d: 350 }, { f: 293.66, d: 650 }, { f: 261.63, d: 650 },
  { f: 349.23, d: 650 }, { f: 329.63, d: 1100 }, { f: 0, d: 250 },
  { f: 261.63, d: 350 }, { f: 261.63, d: 350 }, { f: 293.66, d: 650 }, { f: 261.63, d: 650 },
  { f: 392.00, d: 650 }, { f: 349.23, d: 1100 }, { f: 0, d: 250 },
  { f: 261.63, d: 350 }, { f: 261.63, d: 350 }, { f: 523.25, d: 650 }, { f: 440.00, d: 650 },
  { f: 349.23, d: 650 }, { f: 329.63, d: 650 }, { f: 293.66, d: 900 }, { f: 0, d: 250 },
  { f: 466.16, d: 350 }, { f: 466.16, d: 350 }, { f: 440.00, d: 650 }, { f: 349.23, d: 650 },
  { f: 392.00, d: 650 }, { f: 349.23, d: 1300 }
];

function playMusicBoxNote(freq, durationMs) {
  if (!freq || !isAudioPlaying) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (durationMs / 1000));
  } catch (e) {}
}

function startMusicBoxMelody() {
  stopMusicBoxMelody();
  let step = 0;

  function next() {
    if (!isAudioPlaying) return;
    const current = BDAY_NOTES[step];
    playMusicBoxNote(current.f, current.d);

    step = (step + 1) % BDAY_NOTES.length;
    musicBoxInterval = setTimeout(next, current.d + 60);
  }

  next();
}

function stopMusicBoxMelody() {
  if (musicBoxInterval) {
    clearTimeout(musicBoxInterval);
    musicBoxInterval = null;
  }
}

// ==========================================
// KEYPAD & PIN LOGIC (PIN 1728)
// ==========================================
function initKeypad() {
  const keys = document.querySelectorAll(".key-btn");
  keys.forEach(key => {
    key.addEventListener("click", () => {
      const keyValue = key.getAttribute("data-key");
      handleKeyInput(keyValue);
    });
  });

  loginSubmitBtn.addEventListener("click", () => {
    validatePin();
  });
}

function initKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    if (!isLocked || document.activeElement === customPinInput || document.activeElement === wishTextarea) return;

    if (e.key >= "0" && e.key <= "9") {
      handleKeyInput(e.key);
    } else if (e.key === "Backspace") {
      handleKeyInput("backspace");
    } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
      handleKeyInput("clear");
    } else if (e.key === "Enter") {
      validatePin();
    }
  });
}

function handleKeyInput(keyValue) {
  pinStatusMsg.textContent = "";
  pinStatusMsg.className = "pin-status-msg";

  if (keyValue === "clear") {
    currentPin = "";
    playKeySound(380);
    updateDots();
  } else if (keyValue === "backspace") {
    if (currentPin.length > 0) {
      currentPin = currentPin.slice(0, -1);
      playKeySound(420);
      updateDots();
    }
  } else if (!isNaN(keyValue)) {
    if (currentPin.length < CONFIG.pinLength) {
      currentPin += keyValue;
      const tones = [523.25, 587.33, 659.25, 698.46, 783.99];
      playKeySound(tones[currentPin.length] || 560);
      updateDots();

      if (currentPin.length === CONFIG.pinLength) {
        setTimeout(validatePin, 180);
      }
    }
  }
}

function updateDots() {
  pinDots.forEach((dot, index) => {
    if (index < currentPin.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

function validatePin() {
  if (currentPin.length === 0) {
    pinStatusMsg.textContent = "Ketik PIN rahasiamu dulu yaa! 🌸";
    pinStatusMsg.classList.add("error-msg");
    playErrorSound();
    return;
  }

  if (currentPin === CONFIG.defaultPin) {
    // PIN 1728 BENAR!
    playSuccessFanfare();
    pinStatusMsg.textContent = "Yeeaaay PIN 1728 benar! Membuka istana ulang tahun... 🎉✨";
    pinStatusMsg.classList.add("success-msg");

    triggerConfettiStorm();

    setTimeout(() => {
      unlockWebsite();
    }, 900);

  } else {
    // PIN SALAH
    playErrorSound();
    pinDotsContainer.classList.add("error");
    pinStatusMsg.textContent = "Oops, PIN salah sayang! Coba ingat angka spesial kita (1728)~ 🥺🐾";
    pinStatusMsg.classList.add("error-msg");

    setTimeout(() => {
      pinDotsContainer.classList.remove("error");
      currentPin = "";
      updateDots();
    }, 700);
  }
}

function unlockWebsite() {
  isLocked = false;
  loginScreen.classList.remove("active");
  surpriseScreen.classList.remove("active");
  
  // ALWAYS SHOW THEME PICKER AFTER PIN LOGIN
  const themePicker = document.getElementById("themePickerScreen");
  if (themePicker) {
    themePicker.classList.remove("fade-out");
    themePicker.classList.add("active");
  } else {
    surpriseScreen.classList.add("active");
  }
  
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (!isAudioPlaying) {
    toggleMusic(true);
  }
}

function relockWebsite() {
  isLocked = true;
  currentPin = "";
  updateDots();
  pinStatusMsg.textContent = "";
  surpriseScreen.classList.remove("active");
  // Also hide theme picker & music picker if visible
  const themePicker = document.getElementById("themePickerScreen");
  if (themePicker) themePicker.classList.remove("active");
  const musicPicker = document.getElementById("musicPickerScreen");
  if (musicPicker) musicPicker.classList.remove("active");
  // Clear saved theme so user picks again on next login
  localStorage.removeItem("bday_theme");
  loginScreen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// DASHBOARD TABS SYSTEM
// ==========================================
function initDashboardTabs() {
  const tabs = document.querySelectorAll(".dash-tab-btn");
  const contents = document.querySelectorAll(".dash-tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      playKeySound(640);
    });
  });
}

// ==========================================
// INTERACTIVE ENVELOPE (LOVE LETTER)
// ==========================================
function initEnvelopeInteraction() {
  function openEnvelope() {
    if (!envelopeCard.classList.contains("opened")) {
      envelopeCard.classList.add("opened");
      loveLetterBody.classList.add("visible");
      playSuccessFanfare();
      triggerConfettiStorm();
    }
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }
  if (envelopeCard) {
    envelopeCard.addEventListener("click", openEnvelope);
  }
}

// ==========================================
// CHIIKAWA DAILY AFFIRMATION ROLLER
// ==========================================
const AFFIRMATIONS = [
  "Pesan Hari Ini: Pacar kamu ini beruntung banget punya kamu di dunia ini! Tetaplah jadi gadis paling manis yaa~ 💖",
  "Chiikawa bilang: Kamu itu 1000x lebih imut dari biasanya hari ini! Senyum terus yaa~ 🌸",
  "Hachiware bersorak: 'Kimi wa saikou da!' (Kamu adalah yang terhebat dan tercantik!) ✨",
  "Usagi teriak: 'YAAAAHAAA! URA-URA!!' Artinya Usagi mendoakan kamu bahagia dan kaya raya selalu! 🐰🎉",
  "Pengingat penting: Kalau kamu capek atau badmood, ada pacar yang siap meluk dan manjain kamu 24 jam! 🥰",
  "Fakta ilmiah: Senyumanmu adalah sumber energi terbesar buat pacar kamu! 🌷",
  "Semoga di usia baru ini rezeki melimpah, kuliah/karir lancar, dan pipi gemasmu tetap awet gemesin! 🍼"
];

function initAffirmationGenerator() {
  if (!rollAffirmationBtn || !affirmationText) return;
  rollAffirmationBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    affirmationText.style.opacity = 0;
    playKeySound(720);

    setTimeout(() => {
      affirmationText.textContent = AFFIRMATIONS[randomIndex];
      affirmationText.style.opacity = 1;
    }, 150);
  });
}

// ==========================================
// VIRTUAL GIFT COUPONS
// ==========================================
function initCoupons() {
  const claimBtns = document.querySelectorAll(".claim-coupon-btn");
  claimBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const couponCard = btn.closest(".coupon-item");
      if (couponCard && !couponCard.classList.contains("claimed")) {
        couponCard.classList.add("claimed");
        btn.textContent = "Sudah Diklaim! 🎟️💖";
        playSuccessFanfare();
        triggerConfettiStorm();
      }
    });
  });
}

// ==========================================
// WISHING STAR BOARD
// ==========================================
function initWishesBoard() {
  if (!sendWishBtn || !wishTextarea || !wishesList) return;

  sendWishBtn.addEventListener("click", () => {
    const text = wishTextarea.value.trim();
    if (text.length === 0) {
      alert("Tuliskan doa atau harapanmu dulu ya sayang! 🌸");
      return;
    }

    const item = document.createElement("div");
    item.className = "wish-card-item";
    item.innerHTML = `
      <span class="wish-item-star">🌟</span>
      <div class="wish-item-text">"${escapeHtml(text)}"</div>
      <span class="wish-item-author">— Tuan Putri 💖</span>
    `;

    wishesList.prepend(item);
    wishTextarea.value = "";
    playSuccessFanfare();
    triggerConfettiStorm();

    alert("Bintang doamu sudah berhasil diterbangkan ke langit tosca! Semoga terkabul sayang~ ✨");
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// ==========================================
// GALLERY HEART REACTION COUNTERS
// ==========================================
function initHeartReactions() {
  const heartBtns = document.querySelectorAll(".heart-react-btn");
  heartBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const countEl = btn.querySelector(".heart-count");
      if (countEl) {
        let current = parseInt(countEl.textContent.replace(/\D/g, "")) || 99;
        countEl.textContent = `${current + 1}+`;
      }
      playKeySound(880);
      btn.style.transform = "scale(1.2)";
      setTimeout(() => { btn.style.transform = "scale(1)"; }, 150);
    });
  });
}

// ==========================================
// STROBO PHOTO RUNNER & LIGHTBOX
// ==========================================
function initStroboInteractions() {
  if (stroboTrack) {
    stroboTrack.addEventListener("click", (e) => {
      const item = e.target.closest(".strobo-item");
      if (item) {
        const img = item.querySelector("img");
        if (img) {
          openLightbox(img.src);
        }
      }
    });
  }

  const polaroidWraps = document.querySelectorAll(".polaroid-img-wrap");
  polaroidWraps.forEach(wrap => {
    wrap.addEventListener("click", (e) => {
      const img = wrap.querySelector("img");
      const card = wrap.closest(".polaroid-card");
      const caption = card ? card.querySelector(".polaroid-caption") : null;
      if (img) {
        openLightbox(img.src, caption ? caption.textContent : "Kenangan Terindah 💕");
      }
    });
  });
}

function openLightbox(src, customCaption = null) {
  lightboxImg.src = src;
  const captionEl = document.getElementById("lightboxCaption");
  if (captionEl) {
    captionEl.textContent = customCaption || "Cantik & menggemaskan selalu! 💖✨";
  }
  photoModal.classList.add("open");
  playKeySound(720);
}

// ==========================================
// MODALS (HINT & CONFIG)
// ==========================================
function initModals() {
  hintTriggerBtn.addEventListener("click", () => {
    currentPinCodeEl.textContent = CONFIG.defaultPin;
    hintModal.classList.add("open");
    playKeySound(600);
  });

  closeHintModalBtn.addEventListener("click", () => {
    hintModal.classList.remove("open");
  });

  closePhotoModalBtn.addEventListener("click", () => {
    photoModal.classList.remove("open");
  });

  [hintModal, photoModal].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  });

  setCustomPinBtn.addEventListener("click", () => {
    const val = customPinInput.value.trim();
    if (val.length >= 4 && !isNaN(val)) {
      CONFIG.defaultPin = val;
      localStorage.setItem("bday_pin", val);
      currentPinCodeEl.textContent = val;
      customPinInput.value = "";
      alert(`PIN baru berhasil disimpan: ${val} 💕`);
      hintModal.classList.remove("open");
      playSuccessFanfare();
    } else {
      alert("Masukkan minimal 4 digit angka ya!");
    }
  });

  lockBackBtn.addEventListener("click", () => {
    relockWebsite();
  });
}

// ==========================================
// INTERACTIVE BIRTHDAY CAKE & WISH
// ==========================================
function initCakeInteractions() {
  let isBlown = false;

  function handleBlowCandle() {
    if (isBlown) {
      flames.forEach(f => f.classList.remove("blown"));
      wishResult.textContent = "Lilin dinyalakan lagi! Yuk tiup lagi~ 🕯️";
      isBlown = false;
      playKeySound(500);
      return;
    }

    isBlown = true;
    flames.forEach(f => f.classList.add("blown"));
    playKeySound(300);

    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch(e) {}

    wishResult.innerHTML = "Huuufff~ Lilin padam! 🕯️💨<br><b>Semoga semua impian & harapanmu terkabul ya sayang! 💖✨</b><br><span style='font-size: 0.85rem; color: var(--tosca-700); font-weight: 600; display: inline-block; margin-top: 6px;'>✨ Yuk terbangkan doamu di Bintang Doa tepat di bawah ini! 👇</span>";
    triggerConfettiStorm();
  }

  blowCandleBtn.addEventListener("click", handleBlowCandle);
  cakeBox.addEventListener("click", handleBlowCandle);

  confettiBtn.addEventListener("click", () => {
    triggerConfettiStorm();
    playSuccessFanfare();
  });
}

// ==========================================
// WHEELS SPECIAL MENU ACCORDION (SURAT TITAH RAJA JADUL)
// ==========================================
function playRoyalFanfare() {
  try {
    const ctx = getAudioContext();
    // Majestic sweet royal fanfare notes
    const notes = [349.23, 440.00, 523.25, 698.46, 880.00, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.65);
        } catch(e) {}
      }, idx * 75);
    });
  } catch(e) {}
}

function initWheelsMenuDropdown() {
  const menuSection = document.getElementById("wheelsMenuSection");
  const toggleBtn = document.getElementById("wheelsMenuToggleBtn");
  const scrollContainer = document.getElementById("wheelsRoyalScroll");
  const togglePill = document.getElementById("menuTogglePill");
  const foldBtn = document.getElementById("scrollFoldBtn");

  if (!menuSection || !toggleBtn) return;

  function toggleMenu(forceState = null) {
    const isOpen = menuSection.classList.contains("open");
    const nextState = forceState !== null ? forceState : !isOpen;

    if (nextState) {
      menuSection.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (togglePill) {
        togglePill.innerHTML = '<span class="toggle-text">Tutup Titah</span><span class="toggle-arrow">▲</span>';
      }
      playRoyalFanfare();
      try {
        triggerConfettiStorm();
      } catch(e) {}
    } else {
      menuSection.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (togglePill) {
        togglePill.innerHTML = '<span class="toggle-text">Buka Titah</span><span class="toggle-arrow">▼</span>';
      }
      try {
        playKeySound(440);
      } catch(e) {}
    }
  }

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  if (foldBtn) {
    foldBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(false);
      menuSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
}

// ==========================================
// MUSIC TRACKS DATA & CONTROLLER
// ==========================================
const MUSIC_TRACKS = {
  "bday-evita": {
    id: "bday-evita",
    title: "Birtday Evitaaa",
    type: "synth",
    desc: "Musik Box Klasik Ulang Tahun Spesial Evita (Default)"
  },
  "chiikawa": {
    id: "chiikawa",
    title: "Chikawaa",
    type: "audio",
    file: "Music yang bisa dipilih/「1hr extend」Chiikawa Pajama Parties Uwawa no uta「一時間耐久」 ちいかわ パジャマパーティーズのうた 「1小時」吉伊卡哇 睡衣派對之歌」.mp3",
    desc: "Pajama Parties Uwawa no Uta"
  },
  "5sos": {
    id: "5sos",
    title: "5SOS",
    type: "audio",
    file: "Music yang bisa dipilih/5 Seconds of Summer Greatest Hits Full Album ▶️ Full Album ▶️ Top 10 Hits of All Time.mp3",
    desc: "5 Seconds of Summer Greatest Hits"
  },
  "1d": {
    id: "1d",
    title: "One Directions",
    type: "audio",
    file: "Music yang bisa dipilih/Soft One Direction Playlist to Relax and Focus.mp3",
    desc: "Soft One Direction Playlist"
  },
  "1d-lofi": {
    id: "1d-lofi",
    title: "One Directions Lofi",
    type: "audio",
    file: "Music yang bisa dipilih/One Direction Lofi Mix ✨ Chill Hits for Study, Relax & Sleep.mp3",
    desc: "One Direction Lofi Mix"
  }
};

let currentMusicTrackId = localStorage.getItem("bday_selected_music") || "bday-evita";
let bgAudioPlayer = null;

function getBgAudioPlayer() {
  if (!bgAudioPlayer) {
    bgAudioPlayer = new Audio();
    bgAudioPlayer.loop = true;
    bgAudioPlayer.volume = 0.65;
  }
  return bgAudioPlayer;
}

function playSelectedMusicTrack(trackId) {
  const track = MUSIC_TRACKS[trackId] || MUSIC_TRACKS["bday-evita"];
  currentMusicTrackId = track.id;

  // Update floating button title
  if (musicBtn) {
    musicBtn.title = `Sedang Memutar: ${track.title} 🎶 (Klik untuk jeda)`;
  }

  if (track.type === "synth") {
    // Stop MP3 if playing
    if (bgAudioPlayer) {
      bgAudioPlayer.pause();
    }
    startMusicBoxMelody();
  } else {
    // Stop synth music box
    stopMusicBoxMelody();
    const player = getBgAudioPlayer();
    const targetSrc = encodeURI(track.file);
    if (!player.src.endsWith(targetSrc)) {
      player.src = targetSrc;
    }
    player.play().catch(e => {
      console.warn("Autoplay audio blocked or pending user interaction:", e);
    });
  }
}

function stopAllMusic() {
  stopMusicBoxMelody();
  if (bgAudioPlayer) {
    bgAudioPlayer.pause();
  }
  if (musicBtn) {
    const track = MUSIC_TRACKS[currentMusicTrackId] || MUSIC_TRACKS["bday-evita"];
    musicBtn.title = `Putar Lagu: ${track.title} 🎶`;
  }
}

function initMusicController() {
  musicBtn.addEventListener("click", () => {
    toggleMusic();
  });
}

function toggleMusic(forceState = null) {
  isAudioPlaying = forceState !== null ? forceState : !isAudioPlaying;

  if (isAudioPlaying) {
    musicBtn.classList.add("playing");
    musicStatus.textContent = "ON";
    playSelectedMusicTrack(currentMusicTrackId);
  } else {
    musicBtn.classList.remove("playing");
    musicStatus.textContent = "OFF";
    stopAllMusic();
  }
}

// ==========================================
// MASCOTS INTERACTIVE BOUNCE & AUDIO
// ==========================================
function initMascotSounds() {
  if (peekingChiikawa) {
    peekingChiikawa.addEventListener("click", () => {
      playKeySound(880);
      const bubble = peekingChiikawa.querySelector(".bubble-speech");
      if (bubble) {
        bubble.textContent = "Chiikawa sayang kamu! 🐾";
        setTimeout(() => { bubble.textContent = "Semangat! 💕"; }, 2000);
      }
    });
  }

  if (peekingHachiware) {
    peekingHachiware.addEventListener("click", () => {
      playKeySound(780);
      alert("Hachiware: 'Kimi ga daisuki!' (Aku suka banget sama kamu!) 🌸");
    });
  }

  if (mascotUsagi) {
    mascotUsagi.addEventListener("click", () => {
      playSuccessFanfare();
      alert("Usagi: 'YAAAAHAAAAA!! URA-URA!!' 🐰🎉💨");
    });
  }
}

// ==========================================
// BACKGROUND AMBIENT SPARKLES CANVAS
// ==========================================
function initSparklesCanvas() {
  if (!sparklesCanvas) return;
  const ctx = sparklesCanvas.getContext("2d");
  let width = (sparklesCanvas.width = window.innerWidth);
  let height = (sparklesCanvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = sparklesCanvas.width = window.innerWidth;
    height = sparklesCanvas.height = window.innerHeight;
  });

  const sparkles = [];
  const sparkleColors = ["#ffffff", "#5eead4", "#99f6e4", "#fef08a", "#fbcfe8"];

  for (let i = 0; i < 45; i++) {
    sparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.3 - 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * 0.03 + 0.01,
      color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
    });
  }

  function renderSparkles() {
    ctx.clearRect(0, 0, width, height);

    sparkles.forEach(s => {
      s.x += s.speedX;
      s.y += s.speedY;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      s.opacity += s.pulse;
      if (s.opacity > 0.95 || s.opacity < 0.25) {
        s.pulse = -s.pulse;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, s.opacity);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = s.color;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(renderSparkles);
  }

  renderSparkles();
}

// ==========================================
// PURE JAVASCRIPT CONFETTI CANNON
// ==========================================
function triggerConfettiStorm() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);

  const colors = [
    "#14b8a6", "#2dd4bf", "#0d9488",
    "#f43f5e", "#fbcfe8", "#fef08a",
    "#fbbf24", "#ffffff"
  ];

  const particles = [];
  const particleCount = 140;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: w / 2 + (Math.random() - 0.5) * 150,
      y: h / 2 + (Math.random() - 0.5) * 150,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1.2) * 16,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      alpha: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle"
    });
  }

  let frame = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, w, h);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.vx *= 0.98;

      if (frame > 45) {
        p.alpha -= 0.016;
      }

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    });

    frame++;
    if (alive && frame < 180) {
      requestAnimationFrame(updateConfetti);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(updateConfetti);
}


// ==========================================
// ARCADE GAMES SYSTEM (FLAPPY BIRTHDAY, CATCH, MEMORY)
// ==========================================
let activeGame = null;
let flappyAnimationId = null;
let catchAnimationId = null;

function initArcadeGames() {
  const gameSelectorGrid = document.getElementById('gameSelectorGrid');
  const gameArenaWrapper = document.getElementById('gameArenaWrapper');
  const backToGamesBtn = document.getElementById('backToGamesBtn');
  const gameArenaTitle = document.getElementById('gameArenaTitle');
  const currentScoreDisplay = document.getElementById('currentScoreDisplay');
  const highScoreDisplay = document.getElementById('highScoreDisplay');
  const flappyCanvas = document.getElementById('flappyCanvas');
  const catchCanvas = document.getElementById('catchCanvas');
  const memoryGameContainer = document.getElementById('memoryGameContainer');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const gameStartOverlay = document.getElementById('gameStartOverlay');
  const startActiveGameBtn = document.getElementById('startActiveGameBtn');
  const restartGameBtn = document.getElementById('restartGameBtn');
  const catchMobileControls = document.getElementById('catchMobileControls');

  // Select game card click
  const gameCards = document.querySelectorAll('.game-select-card');
  gameCards.forEach(card => {
    card.addEventListener('click', () => {
      const gameType = card.getAttribute('data-game');
      launchGame(gameType);
    });
  });

  // Back button
  if (backToGamesBtn) {
    backToGamesBtn.addEventListener('click', () => {
      stopAllGames();
      gameArenaWrapper.style.display = 'none';
      gameSelectorGrid.style.display = 'grid';
      playKeySound(500);
    });
  }

  // Start button in overlay
  if (startActiveGameBtn) {
    startActiveGameBtn.addEventListener('click', () => {
      gameStartOverlay.style.display = 'none';
      if (activeGame === 'flappy') {
        startFlappyLoop();
      } else if (activeGame === 'catch') {
        startCatchLoop();
      } else if (activeGame === 'snake') {
        startSnakeLoop();
      } else if (activeGame === 'whack') {
        startWhackLoop();
      } else if (activeGame === 'pop') {
        startPopLoop();
      }
    });
  }

  // Restart button
  if (restartGameBtn) {
    restartGameBtn.addEventListener('click', () => {
      gameOverOverlay.style.display = 'none';
      if (activeGame === 'flappy') {
        resetFlappyGame();
        startFlappyLoop();
      } else if (activeGame === 'catch') {
        resetCatchGame();
        startCatchLoop();
      } else if (activeGame === 'memory') {
        startMemoryGame();
      } else if (activeGame === 'snake') {
        resetSnakeGame();
        startSnakeLoop();
      } else if (activeGame === 'whack') {
        resetWhackGame();
        startWhackLoop();
      } else if (activeGame === 'pop') {
        resetPopGame();
        startPopLoop();
      }
    });
  }

  function launchGame(gameType) {
    activeGame = gameType;
    gameSelectorGrid.style.display = 'none';
    gameArenaWrapper.style.display = 'flex';
    gameOverOverlay.style.display = 'none';

    // Hide all canvas/containers
    flappyCanvas.style.display = 'none';
    catchCanvas.style.display = 'none';
    memoryGameContainer.style.display = 'none';
    catchMobileControls.style.display = 'none';

    playKeySound(700);

    const snakeCanvas = document.getElementById('snakeCanvas');
    const popCanvas = document.getElementById('popCanvas');
    const whackGameContainer = document.getElementById('whackGameContainer');
    const snakeMobileControls = document.getElementById('snakeMobileControls');

    if (snakeCanvas) snakeCanvas.style.display = 'none';
    if (popCanvas) popCanvas.style.display = 'none';
    if (whackGameContainer) whackGameContainer.style.display = 'none';
    if (snakeMobileControls) snakeMobileControls.style.display = 'none';
    const xoxContainer = document.getElementById('xoxGameContainer');
    if (xoxContainer) xoxContainer.style.display = 'none';

    if (gameType === 'flappy') {
      gameArenaTitle.textContent = 'Flappy Birthday 🐣🎂';
      flappyCanvas.style.display = 'block';
      const best = localStorage.getItem('flappy_best') || 0;
      highScoreDisplay.textContent = best;
      currentScoreDisplay.textContent = '0';
      
      document.getElementById('startOverlayTitle').textContent = 'Flappy Birthday';
      document.getElementById('startOverlayDesc').textContent = 'Klik layar / tekan Spasi untuk kepakkan sayap Chiikawa dan lewati lilin kue!';
      gameStartOverlay.style.display = 'flex';
      setupFlappyGame();

    } else if (gameType === 'catch') {
      gameArenaTitle.textContent = 'Tangkap Kado Ultah 🧺🍓';
      catchCanvas.style.display = 'block';
      catchMobileControls.style.display = 'flex';
      const best = localStorage.getItem('catch_best') || 0;
      highScoreDisplay.textContent = best;
      currentScoreDisplay.textContent = '0';

      document.getElementById('startOverlayTitle').textContent = 'Tangkap Kado Ultah';
      document.getElementById('startOverlayDesc').textContent = 'Geser Chiikawa untuk menangkap kado, kue, dan stroberi. Hindari awan hujan!';
      gameStartOverlay.style.display = 'flex';
      setupCatchGame();

    } else if (gameType === 'memory') {
      gameArenaTitle.textContent = 'Tebak Kartu Pasangan 🃏✨';
      memoryGameContainer.style.display = 'grid';
      gameStartOverlay.style.display = 'none';
      highScoreDisplay.textContent = '-';
      currentScoreDisplay.textContent = '0 Langkah';
      startMemoryGame();

    } else if (gameType === 'snake') {
      gameArenaTitle.textContent = 'Ular Manis Chiikawa 🐍🍰';
      if (snakeCanvas) snakeCanvas.style.display = 'block';
      if (snakeMobileControls) snakeMobileControls.style.display = 'flex';
      const best = localStorage.getItem('snake_best') || 0;
      highScoreDisplay.textContent = best;
      currentScoreDisplay.textContent = '0';

      document.getElementById('startOverlayTitle').textContent = 'Ular Manis Chiikawa';
      document.getElementById('startOverlayDesc').textContent = 'Gunakan tombol panah atau D-pad untuk makan kue dan stroberi tanpa menabrak dinding!';
      gameStartOverlay.style.display = 'flex';
      setupSnakeGame();

    } else if (gameType === 'whack') {
      gameArenaTitle.textContent = 'Pukul Usagi Ceria 🔨🐰';
      if (whackGameContainer) whackGameContainer.style.display = 'grid';
      const best = localStorage.getItem('whack_best') || 0;
      highScoreDisplay.textContent = best;
      currentScoreDisplay.textContent = '0';

      document.getElementById('startOverlayTitle').textContent = 'Pukul Usagi Ceria';
      document.getElementById('startOverlayDesc').textContent = 'Ketuk Usagi secepat mungkin saat muncul dari semak tosca dalam waktu 30 detik!';
      gameStartOverlay.style.display = 'flex';
      setupWhackGame();

    } else if (gameType === 'pop') {
      gameArenaTitle.textContent = 'Pecahkan Balon Cinta 🎈✨';
      if (popCanvas) popCanvas.style.display = 'block';
      const best = localStorage.getItem('pop_best') || 0;
      highScoreDisplay.textContent = best;
      currentScoreDisplay.textContent = '0';

      document.getElementById('startOverlayTitle').textContent = 'Pecahkan Balon Cinta';
      document.getElementById('startOverlayDesc').textContent = 'Letuskan balon-balon ulang tahun tosca & emas yang terbang sebelum waktu 35 detik habis!';
      gameStartOverlay.style.display = 'flex';
      setupPopGame();

    } else if (gameType === 'xox') {
      gameArenaTitle.textContent = 'Tic-Tac-Toe Cinta (XOX) ❌⭕';
      const xoxContainer = document.getElementById('xoxGameContainer');
      if (xoxContainer) xoxContainer.style.display = 'flex';
      highScoreDisplay.textContent = '-';
      currentScoreDisplay.textContent = 'Main XOX';
      gameStartOverlay.style.display = 'none';
      setupXoxGame();
    }
  }

  function stopAllGames() {
    if (flappyAnimationId) {
      cancelAnimationFrame(flappyAnimationId);
      flappyAnimationId = null;
    }
    if (catchAnimationId) {
      cancelAnimationFrame(catchAnimationId);
      catchAnimationId = null;
    }
    stopSnakeGame();
    stopWhackGame();
    stopPopGame();
    activeGame = null;
  }
}

// ----------------------------------------------------
// GAME 1: FLAPPY BIRTHDAY
// ----------------------------------------------------
let flappyState = {
  bird: { x: 75, y: 200, vy: 0, gravity: 0.36, jump: -6.4, radius: 18, angle: 0 },
  pipes: [],
  bonusItems: [],
  score: 0,
  isRunning: false,
  frame: 0
};

function setupFlappyGame() {
  const canvas = document.getElementById('flappyCanvas');
  const ctx = canvas.getContext('2d');
  resetFlappyGame();
  drawFlappyScene(ctx);

  function triggerJump(e) {
    if (activeGame !== 'flappy') return;
    if (e && e.type !== 'keydown') e.preventDefault();

    if (!flappyState.isRunning) {
      const startOverlay = document.getElementById('gameStartOverlay');
      if (startOverlay.style.display !== 'none') {
        startOverlay.style.display = 'none';
        startFlappyLoop();
      }
      return;
    }
    flappyState.bird.vy = flappyState.bird.jump;
    playKeySound(780);
  }

  canvas.onclick = triggerJump;
  canvas.ontouchstart = triggerJump;

  window.addEventListener('keydown', (e) => {
    if (activeGame === 'flappy' && (e.code === 'Space' || e.code === 'ArrowUp')) {
      triggerJump(e);
    }
  });
}

function resetFlappyGame() {
  flappyState.bird.y = 200;
  flappyState.bird.vy = 0;
  flappyState.bird.angle = 0;
  flappyState.pipes = [];
  flappyState.bonusItems = [];
  flappyState.score = 0;
  flappyState.isRunning = false;
  flappyState.frame = 0;
  document.getElementById('currentScoreDisplay').textContent = '0';
}

function startFlappyLoop() {
  flappyState.isRunning = true;
  const canvas = document.getElementById('flappyCanvas');
  const ctx = canvas.getContext('2d');

  function loop() {
    if (!flappyState.isRunning || activeGame !== 'flappy') return;

    updateFlappy();
    drawFlappyScene(ctx);

    flappyAnimationId = requestAnimationFrame(loop);
  }
  loop();
}

function updateFlappy() {
  const bird = flappyState.bird;
  flappyState.frame++;

  // Gravity
  bird.vy += bird.gravity;
  bird.y += bird.vy;
  bird.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, (bird.vy / 10)));

  // Ceiling and floor collision
  if (bird.y + bird.radius >= 420) {
    bird.y = 420 - bird.radius;
    endFlappyGame();
    return;
  }
  if (bird.y - bird.radius <= 0) {
    bird.y = bird.radius;
    bird.vy = 0;
  }

  // Spawn Candle Pipes
  if (flappyState.frame % 95 === 0) {
    const gap = 125;
    const topHeight = Math.floor(Math.random() * (220 - 70 + 1)) + 70;
    flappyState.pipes.push({
      x: 360,
      top: topHeight,
      bottom: topHeight + gap,
      passed: false
    });

    if (Math.random() < 0.45) {
      flappyState.bonusItems.push({
        x: 360 + 25,
        y: topHeight + gap / 2,
        collected: false
      });
    }
  }

  // Move and check pipes
  for (let i = flappyState.pipes.length - 1; i >= 0; i--) {
    const p = flappyState.pipes[i];
    p.x -= 2.2;

    if (!p.passed && p.x + 45 < bird.x) {
      p.passed = true;
      flappyState.score += 1;
      document.getElementById('currentScoreDisplay').textContent = flappyState.score;
      playKeySound(920);
    }

    const candleWidth = 46;
    if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + candleWidth) {
      if (bird.y - bird.radius < p.top || bird.y + bird.radius > p.bottom) {
        endFlappyGame();
        return;
      }
    }

    if (p.x < -60) {
      flappyState.pipes.splice(i, 1);
    }
  }

  // Move and check bonus strawberries
  for (let i = flappyState.bonusItems.length - 1; i >= 0; i--) {
    const b = flappyState.bonusItems[i];
    b.x -= 2.2;

    if (!b.collected) {
      const dx = bird.x - b.x;
      const dy = bird.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < bird.radius + 14) {
        b.collected = true;
        flappyState.score += 2;
        document.getElementById('currentScoreDisplay').textContent = flappyState.score;
        playSuccessFanfare();
      }
    }

    if (b.x < -30) {
      flappyState.bonusItems.splice(i, 1);
    }
  }
}

function drawFlappyScene(ctx) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
  skyGrad.addColorStop(0, '#cbf7ee');
  skyGrad.addColorStop(0.5, '#7ee7d8');
  skyGrad.addColorStop(1, '#14b8a6');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 360, 460);

  // Distant pastel clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.arc(80, 70, 30, 0, Math.PI * 2);
  ctx.arc(115, 65, 36, 0, Math.PI * 2);
  ctx.arc(150, 72, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(260, 110, 26, 0, Math.PI * 2);
  ctx.arc(290, 105, 32, 0, Math.PI * 2);
  ctx.fill();

  // Pipes
  flappyState.pipes.forEach(p => {
    const w = 46;
    drawCandle(ctx, p.x, 0, w, p.top, true);
    drawCandle(ctx, p.x, p.bottom, w, 420 - p.bottom, false);
  });

  // Strawberries
  flappyState.bonusItems.forEach(b => {
    if (!b.collected) {
      ctx.save();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🍓', b.x, b.y);
      ctx.restore();
    }
  });

  // Ground layer
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(0, 420, 360, 40);
  ctx.fillStyle = '#115e59';
  ctx.fillRect(0, 420, 360, 5);

  drawFlyingChiikawa(ctx, flappyState.bird);
}

function drawCandle(ctx, x, y, w, h, isTop) {
  ctx.save();
  ctx.fillStyle = '#ccfbf1';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = '#2dd4bf';
  for (let i = 0; i < h; i += 22) {
    ctx.fillRect(x + 2, y + i, w - 4, 10);
  }

  const flameY = isTop ? y + h : y;
  ctx.beginPath();
  ctx.arc(x + w / 2, flameY, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + w / 2, flameY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.fill();

  ctx.restore();
}

function drawFlyingChiikawa(ctx, bird) {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.angle);

  // Tiny Flapping Wings
  const wingFlap = Math.sin(flappyState.frame * 0.3) * 6;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-14, 2 + wingFlap, 10, 6, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Round White Body
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Round Bear Ears
  ctx.beginPath();
  ctx.arc(-11, -15, 6, 0, Math.PI * 2);
  ctx.arc(11, -15, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.arc(-11, -15, 3, 0, Math.PI * 2);
  ctx.arc(11, -15, 3, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.ellipse(-9, 5, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(9, 5, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-5, -1, 3, 0, Math.PI * 2);
  ctx.arc(5, -1, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-6, -2, 1.2, 0, Math.PI * 2);
  ctx.arc(4, -2, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(-2, 4, 2.5, 0, Math.PI);
  ctx.arc(2, 4, 2.5, 0, Math.PI);
  ctx.stroke();

  // Party Hat
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(-7, -14);
  ctx.lineTo(7, -14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, -29, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function endFlappyGame() {
  flappyState.isRunning = false;
  playErrorSound();

  const best = parseInt(localStorage.getItem('flappy_best') || 0);
  if (flappyState.score > best) {
    localStorage.setItem('flappy_best', flappyState.score);
    document.getElementById('highScoreDisplay').textContent = flappyState.score;
  }

  showGameOver('Flappy Birthday', flappyState.score, best);
}

// ----------------------------------------------------
// GAME 2: TANGKAP KADO ULTAH
// ----------------------------------------------------
let catchState = {
  player: { x: 180, y: 395, width: 56, speed: 6 },
  items: [],
  score: 0,
  lives: 3,
  isRunning: false,
  frame: 0
};

function setupCatchGame() {
  const canvas = document.getElementById('catchCanvas');
  const ctx = canvas.getContext('2d');
  resetCatchGame();
  drawCatchScene(ctx);

  function updatePlayerPos(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (clientX - rect.left) * scaleX;
    catchState.player.x = Math.max(30, Math.min(330, x));
  }

  canvas.onmousemove = (e) => {
    if (catchState.isRunning) updatePlayerPos(e.clientX);
  };
  canvas.ontouchmove = (e) => {
    if (catchState.isRunning && e.touches[0]) {
      e.preventDefault();
      updatePlayerPos(e.touches[0].clientX);
    }
  };

  window.addEventListener('keydown', (e) => {
    if (activeGame === 'catch' && catchState.isRunning) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        catchState.player.x = Math.max(30, catchState.player.x - 24);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        catchState.player.x = Math.min(330, catchState.player.x + 24);
      }
    }
  });

  const btnLeft = document.getElementById('btnMoveLeft');
  const btnRight = document.getElementById('btnMoveRight');
  if (btnLeft && btnRight) {
    const moveLeft = (e) => {
      if (e && e.type === 'touchstart') e.preventDefault();
      catchState.player.x = Math.max(30, catchState.player.x - 30);
    };
    const moveRight = (e) => {
      if (e && e.type === 'touchstart') e.preventDefault();
      catchState.player.x = Math.min(330, catchState.player.x + 30);
    };
    btnLeft.onclick = moveLeft;
    btnLeft.ontouchstart = moveLeft;
    btnRight.onclick = moveRight;
    btnRight.ontouchstart = moveRight;
  }
}

function resetCatchGame() {
  catchState.player.x = 180;
  catchState.items = [];
  catchState.score = 0;
  catchState.lives = 3;
  catchState.isRunning = false;
  catchState.frame = 0;
  document.getElementById('currentScoreDisplay').textContent = '0';
}

function startCatchLoop() {
  catchState.isRunning = true;
  const canvas = document.getElementById('catchCanvas');
  const ctx = canvas.getContext('2d');

  function loop() {
    if (!catchState.isRunning || activeGame !== 'catch') return;

    updateCatch();
    drawCatchScene(ctx);

    catchAnimationId = requestAnimationFrame(loop);
  }
  loop();
}

const CATCH_TYPES = [
  { icon: '🍓', score: 1, isBomb: false },
  { icon: '🍰', score: 2, isBomb: false },
  { icon: '🎁', score: 3, isBomb: false },
  { icon: '💖', score: 5, isBomb: false },
  { icon: '🌧️', score: 0, isBomb: true }
];

function updateCatch() {
  catchState.frame++;

  if (catchState.frame % 38 === 0) {
    const itemType = CATCH_TYPES[Math.floor(Math.random() * CATCH_TYPES.length)];
    catchState.items.push({
      x: Math.floor(Math.random() * (320 - 40 + 1)) + 40,
      y: -20,
      vy: Math.random() * 1.5 + 2.5,
      ...itemType
    });
  }

  for (let i = catchState.items.length - 1; i >= 0; i--) {
    const it = catchState.items[i];
    it.y += it.vy;

    const py = catchState.player.y;
    const px = catchState.player.x;

    if (it.y >= py - 15 && it.y <= py + 20) {
      if (Math.abs(it.x - px) < 32) {
        if (it.isBomb) {
          catchState.lives -= 1;
          playErrorSound();
        } else {
          catchState.score += it.score;
          playKeySound(600 + it.score * 80);
        }

        document.getElementById('currentScoreDisplay').textContent = catchState.score;
        catchState.items.splice(i, 1);

        if (catchState.lives <= 0) {
          endCatchGame();
          return;
        }
        continue;
      }
    }

    if (it.y > 470) {
      catchState.items.splice(i, 1);
    }
  }
}

function drawCatchScene(ctx) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 460);
  skyGrad.addColorStop(0, '#ccfbf1');
  skyGrad.addColorStop(1, '#14b8a6');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 360, 460);

  ctx.font = '18px sans-serif';
  ctx.fillText('❤️'.repeat(Math.max(0, catchState.lives)), 14, 30);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  catchState.items.forEach(it => {
    ctx.font = '24px sans-serif';
    ctx.fillText(it.icon, it.x, it.y);
  });

  const px = catchState.player.x;
  const py = catchState.player.y;

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(px, py - 4, 34, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(px, py + 18, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.arc(px - 9, py + 22, 3.5, 0, Math.PI * 2);
  ctx.arc(px + 9, py + 22, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px - 5, py + 16, 2.5, Math.PI, 0);
  ctx.arc(px + 5, py + 16, 2.5, Math.PI, 0);
  ctx.stroke();
}

function endCatchGame() {
  catchState.isRunning = false;
  playErrorSound();

  const best = parseInt(localStorage.getItem('catch_best') || 0);
  if (catchState.score > best) {
    localStorage.setItem('catch_best', catchState.score);
    document.getElementById('highScoreDisplay').textContent = catchState.score;
  }

  showGameOver('Tangkap Kado Ultah', catchState.score, best);
}

// ----------------------------------------------------
// GAME 3: TEBAK KARTU PASANGAN
// ----------------------------------------------------
let memoryCards = [];
let flippedCards = [];
let matchedCount = 0;
let memoryMoves = 0;

function startMemoryGame() {
  const container = document.getElementById('memoryGameContainer');
  container.innerHTML = '';
  flippedCards = [];
  matchedCount = 0;
  memoryMoves = 0;
  document.getElementById('currentScoreDisplay').textContent = '0 Langkah';

  const icons = ['🎂', '🎀', '🐱', '🐰', '🩵', '🍓'];
  const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

  deck.forEach((icon, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.setAttribute('data-icon', icon);
    card.setAttribute('data-index', idx);

    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="card-front">✨</div>
        <div class="card-back">${icon}</div>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    container.appendChild(card);
  });
}

function handleCardClick(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  card.classList.add('flipped');
  flippedCards.push(card);
  playKeySound(680);

  if (flippedCards.length === 2) {
    memoryMoves++;
    document.getElementById('currentScoreDisplay').textContent = `${memoryMoves} Langkah`;

    const icon1 = flippedCards[0].getAttribute('data-icon');
    const icon2 = flippedCards[1].getAttribute('data-icon');

    if (icon1 === icon2) {
      setTimeout(() => {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        flippedCards = [];
        matchedCount += 2;
        playSuccessFanfare();

        if (matchedCount === 12) {
          triggerConfettiStorm();
          showGameOver('Tebak Kartu Pasangan', `${memoryMoves} Langkah`, 'Sempurna');
        }
      }, 350);
    } else {
      setTimeout(() => {
        flippedCards[0].classList.remove('flipped');
        flippedCards[1].classList.remove('flipped');
        flippedCards = [];
      }, 750);
    }
  }
}

// ----------------------------------------------------
// GAME OVER OVERLAY HELPER
// ----------------------------------------------------
function showGameOver(gameName, score, best) {
  const overlay = document.getElementById('gameOverOverlay');
  const title = document.getElementById('gameOverTitle');
  const msg = document.getElementById('gameOverMsg');
  const finalVal = document.getElementById('finalScoreVal');
  const emoji = document.getElementById('gameOverEmoji');

  title.textContent = 'Permainan Selesai!';
  finalVal.textContent = score;

  if (gameName === 'Tebak Kartu Pasangan') {
    emoji.textContent = '🏆';
    msg.textContent = 'Hebat banget princess! Semua pasangan kartu berhasil ditebak dengan cerdas! 💕';
  } else if (typeof score === 'number' && score >= 10) {
    emoji.textContent = '👑';
    msg.textContent = 'KEREN BANGET SAYANG! Princess bener-bener pro player sejati! 🌸✨';
    triggerConfettiStorm();
  } else {
    emoji.textContent = '🥺';
    msg.textContent = 'Gapapa sayang, kamu udah berusaha hebat banget! Yuk coba lagi yuk~ 🐾';
  }

  overlay.style.display = 'flex';
}


// ----------------------------------------------------
// GAME 4: ULAR MANIS CHIIKAWA (SNAKE)
// ----------------------------------------------------
let snakeState = {
  gridSize: 20,
  cols: 18,
  rows: 23,
  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food: { x: 5, y: 5, icon: '🍰' },
  score: 0,
  isRunning: false,
  timer: null
};

function setupSnakeGame() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  resetSnakeGame();
  drawSnakeScene(ctx);

  // Arrow keys listener
  window.addEventListener('keydown', (e) => {
    if (activeGame === 'snake' && snakeState.isRunning) {
      handleSnakeInput(e.code);
    }
  });

  // Mobile D-pad
  const up = document.getElementById('dpadUp');
  const down = document.getElementById('dpadDown');
  const left = document.getElementById('dpadLeft');
  const right = document.getElementById('dpadRight');

  function bindDpad(btn, code) {
    if (!btn) return;
    const trigger = (e) => {
      if (e && e.type === 'touchstart') e.preventDefault();
      handleSnakeInput(code);
    };
    btn.onclick = trigger;
    btn.ontouchstart = trigger;
  }

  bindDpad(up, 'ArrowUp');
  bindDpad(down, 'ArrowDown');
  bindDpad(left, 'ArrowLeft');
  bindDpad(right, 'ArrowRight');
}

function handleSnakeInput(code) {
  const d = snakeState.dir;
  if ((code === 'ArrowUp' || code === 'KeyW') && d.y === 0) {
    snakeState.nextDir = { x: 0, y: -1 };
    playKeySound(580);
  } else if ((code === 'ArrowDown' || code === 'KeyS') && d.y === 0) {
    snakeState.nextDir = { x: 0, y: 1 };
    playKeySound(520);
  } else if ((code === 'ArrowLeft' || code === 'KeyA') && d.x === 0) {
    snakeState.nextDir = { x: -1, y: 0 };
    playKeySound(550);
  } else if ((code === 'ArrowRight' || code === 'KeyD') && d.x === 0) {
    snakeState.nextDir = { x: 1, y: 0 };
    playKeySound(610);
  }
}

function resetSnakeGame() {
  stopSnakeGame();
  snakeState.snake = [
    { x: 7, y: 11 },
    { x: 6, y: 11 },
    { x: 5, y: 11 }
  ];
  snakeState.dir = { x: 1, y: 0 };
  snakeState.nextDir = { x: 1, y: 0 };
  snakeState.score = 0;
  snakeState.isRunning = false;
  spawnSnakeFood();
  document.getElementById('currentScoreDisplay').textContent = '0';
}

function spawnSnakeFood() {
  const icons = ['🍰', '🍓', '🧁', '💖', '🎀'];
  let valid = false;
  while (!valid) {
    const fx = Math.floor(Math.random() * snakeState.cols);
    const fy = Math.floor(Math.random() * snakeState.rows);
    const onSnake = snakeState.snake.some(s => s.x === fx && s.y === fy);
    if (!onSnake) {
      snakeState.food = {
        x: fx,
        y: fy,
        icon: icons[Math.floor(Math.random() * icons.length)]
      };
      valid = true;
    }
  }
}

function startSnakeLoop() {
  snakeState.isRunning = true;
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');

  if (snakeState.timer) clearInterval(snakeState.timer);
  snakeState.timer = setInterval(() => {
    if (!snakeState.isRunning || activeGame !== 'snake') return;
    updateSnake();
    drawSnakeScene(ctx);
  }, 130);
}

function stopSnakeGame() {
  if (snakeState.timer) {
    clearInterval(snakeState.timer);
    snakeState.timer = null;
  }
  snakeState.isRunning = false;
}

function updateSnake() {
  snakeState.dir = snakeState.nextDir;
  const head = { ...snakeState.snake[0] };
  head.x += snakeState.dir.x;
  head.y += snakeState.dir.y;

  // Wall collision
  if (head.x < 0 || head.x >= snakeState.cols || head.y < 0 || head.y >= snakeState.rows) {
    endSnakeGame();
    return;
  }

  // Self collision
  if (snakeState.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    endSnakeGame();
    return;
  }

  snakeState.snake.unshift(head);

  // Check eat food
  if (head.x === snakeState.food.x && head.y === snakeState.food.y) {
    snakeState.score += 1;
    document.getElementById('currentScoreDisplay').textContent = snakeState.score;
    playKeySound(750);
    spawnSnakeFood();
  } else {
    snakeState.snake.pop();
  }
}

function drawSnakeScene(ctx) {
  // Pastel checkered background
  ctx.fillStyle = '#ccfbf1';
  ctx.fillRect(0, 0, 360, 460);

  // Draw food
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fx = snakeState.food.x * 20 + 10;
  const fy = snakeState.food.y * 20 + 10;
  ctx.fillText(snakeState.food.icon, fx, fy);

  // Draw snake body segments
  snakeState.snake.forEach((seg, i) => {
    const sx = seg.x * 20;
    const sy = seg.y * 20;

    if (i === 0) {
      // Chiikawa Head
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(sx + 10, sy + 10, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheeks
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(sx + 5, sy + 12, 2.5, 0, Math.PI * 2);
      ctx.arc(sx + 15, sy + 12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(sx + 7, sy + 8, 2, 0, Math.PI * 2);
      ctx.arc(sx + 13, sy + 8, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Body Segment (Mint Tosca gradient beads)
      ctx.fillStyle = i % 2 === 0 ? '#14b8a6' : '#2dd4bf';
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(sx + 10, sy + 10, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  });
}

function endSnakeGame() {
  stopSnakeGame();
  playErrorSound();

  const best = parseInt(localStorage.getItem('snake_best') || 0);
  if (snakeState.score > best) {
    localStorage.setItem('snake_best', snakeState.score);
    document.getElementById('highScoreDisplay').textContent = snakeState.score;
  }

  showGameOver('Ular Manis Chiikawa', snakeState.score, best);
}

// ----------------------------------------------------
// GAME 5: PUKUL USAGI CERIA (WHACK-A-MOLE)
// ----------------------------------------------------
let whackState = {
  score: 0,
  timeLeft: 30,
  timerInterval: null,
  moleInterval: null,
  activeHole: null
};

function setupWhackGame() {
  const container = document.getElementById('whackGameContainer');
  container.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.className = 'whack-hole';
    hole.setAttribute('data-hole', i);

    const mole = document.createElement('div');
    mole.className = 'whack-mole';
    mole.setAttribute('data-hole', i);
    mole.textContent = '🐰';

    const triggerWhack = (e) => {
      if (e && e.type === 'touchstart') e.preventDefault();
      whackMole(mole, i);
    };
    mole.onclick = triggerWhack;
    mole.ontouchstart = triggerWhack;

    hole.appendChild(mole);
    container.appendChild(hole);
  }
}

function resetWhackGame() {
  stopWhackGame();
  whackState.score = 0;
  whackState.timeLeft = 30;
  document.getElementById('currentScoreDisplay').textContent = `0 (30s)`;
  setupWhackGame();
}

function startWhackLoop() {
  resetWhackGame();

  // 1-second countdown timer
  whackState.timerInterval = setInterval(() => {
    if (activeGame !== 'whack') {
      stopWhackGame();
      return;
    }
    whackState.timeLeft--;
    document.getElementById('currentScoreDisplay').textContent = `${whackState.score} (${whackState.timeLeft}s)`;

    if (whackState.timeLeft <= 0) {
      endWhackGame();
    }
  }, 1000);

  // Mole pop interval
  popRandomMole();
}

function popRandomMole() {
  if (whackState.timeLeft <= 0 || activeGame !== 'whack') return;

  const moles = document.querySelectorAll('.whack-mole');
  moles.forEach(m => m.classList.remove('up', 'hit'));

  const randomHoleIdx = Math.floor(Math.random() * 9);
  const mole = moles[randomHoleIdx];

  // 70% Usagi, 15% Golden Usagi, 15% Chiikawa (don't hit)
  const rand = Math.random();
  if (rand < 0.65) {
    mole.textContent = '🐰';
    mole.setAttribute('data-type', 'usagi');
  } else if (rand < 0.82) {
    mole.textContent = '👑';
    mole.setAttribute('data-type', 'gold');
  } else {
    mole.textContent = '🥺';
    mole.setAttribute('data-type', 'chiikawa');
  }

  mole.classList.add('up');
  const stayTime = Math.random() * 450 + 600;

  whackState.moleTimeout = setTimeout(() => {
    mole.classList.remove('up');
    if (whackState.timeLeft > 0 && activeGame === 'whack') {
      whackState.moleTimeout2 = setTimeout(popRandomMole, Math.random() * 250 + 200);
    }
  }, stayTime);
}

function whackMole(mole, idx) {
  if (!mole.classList.contains('up') || mole.classList.contains('hit') || whackState.timeLeft <= 0) return;

  mole.classList.add('hit');
  const type = mole.getAttribute('data-type');

  if (type === 'usagi') {
    whackState.score += 1;
    playKeySound(720);
  } else if (type === 'gold') {
    whackState.score += 3;
    playSuccessFanfare();
  } else if (type === 'chiikawa') {
    whackState.score = Math.max(0, whackState.score - 1);
    playErrorSound();
  }

  document.getElementById('currentScoreDisplay').textContent = `${whackState.score} (${whackState.timeLeft}s)`;

  setTimeout(() => {
    mole.classList.remove('up', 'hit');
  }, 220);
}

function stopWhackGame() {
  if (whackState.timerInterval) {
    clearInterval(whackState.timerInterval);
    whackState.timerInterval = null;
  }
  if (whackState.moleTimeout) clearTimeout(whackState.moleTimeout);
  if (whackState.moleTimeout2) clearTimeout(whackState.moleTimeout2);

  const moles = document.querySelectorAll('.whack-mole');
  moles.forEach(m => m.classList.remove('up', 'hit'));
}

function endWhackGame() {
  stopWhackGame();
  playSuccessFanfare();

  const best = parseInt(localStorage.getItem('whack_best') || 0);
  if (whackState.score > best) {
    localStorage.setItem('whack_best', whackState.score);
    document.getElementById('highScoreDisplay').textContent = whackState.score;
  }

  showGameOver('Pukul Usagi Ceria', whackState.score, best);
}

// ----------------------------------------------------
// GAME 6: PECAHKAN BALON CINTA (BALLOON POP)
// ----------------------------------------------------
let popState = {
  balloons: [],
  particles: [],
  score: 0,
  timeLeft: 35,
  timerInterval: null,
  isRunning: false,
  frame: 0
};

function setupPopGame() {
  const canvas = document.getElementById('popCanvas');
  const ctx = canvas.getContext('2d');
  resetPopGame();
  drawPopScene(ctx);

  function handlePop(clientX, clientY) {
    if (!popState.isRunning || activeGame !== 'pop') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    popBalloonAt(clickX, clickY);
  }

  canvas.onclick = (e) => {
    handlePop(e.clientX, e.clientY);
  };

  canvas.ontouchstart = (e) => {
    if (e.touches && e.touches[0]) {
      e.preventDefault();
      handlePop(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
}

function resetPopGame() {
  stopPopGame();
  popState.balloons = [];
  popState.particles = [];
  popState.score = 0;
  popState.timeLeft = 35;
  popState.isRunning = false;
  popState.frame = 0;
  document.getElementById('currentScoreDisplay').textContent = `0 (35s)`;
}

function startPopLoop() {
  resetPopGame();
  popState.isRunning = true;
  const canvas = document.getElementById('popCanvas');
  const ctx = canvas.getContext('2d');

  popState.timerInterval = setInterval(() => {
    if (activeGame !== 'pop') {
      stopPopGame();
      return;
    }
    popState.timeLeft--;
    document.getElementById('currentScoreDisplay').textContent = `${popState.score} (${popState.timeLeft}s)`;

    if (popState.timeLeft <= 0) {
      endPopGame();
    }
  }, 1000);

  function loop() {
    if (!popState.isRunning || activeGame !== 'pop') return;
    updatePop();
    drawPopScene(ctx);
    flappyAnimationId = requestAnimationFrame(loop);
  }
  loop();
}

function stopPopGame() {
  if (popState.timerInterval) {
    clearInterval(popState.timerInterval);
    popState.timerInterval = null;
  }
  popState.isRunning = false;
}

const BALLOON_COLORS = ['#2dd4bf', '#14b8a6', '#f472b6', '#fbbf24', '#c084fc', '#60a5fa'];

function updatePop() {
  popState.frame++;

  // Spawn balloons
  if (popState.frame % 28 === 0) {
    const isGold = Math.random() < 0.18;
    popState.balloons.push({
      x: Math.random() * (310 - 50) + 50,
      y: 480,
      radius: isGold ? 28 : (Math.random() * 8 + 22),
      vy: Math.random() * 1.5 + 2.2,
      color: isGold ? '#fbbf24' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      isGold: isGold,
      seed: Math.random() * 10
    });
  }

  // Update balloons
  for (let i = popState.balloons.length - 1; i >= 0; i--) {
    const b = popState.balloons[i];
    b.y -= b.vy;
    b.x += Math.sin(popState.frame * 0.05 + b.seed) * 0.7;

    if (b.y < -50) {
      popState.balloons.splice(i, 1);
    }
  }

  // Update pop particles
  for (let i = popState.particles.length - 1; i >= 0; i--) {
    const p = popState.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.alpha -= 0.03;
    if (p.alpha <= 0) {
      popState.particles.splice(i, 1);
    }
  }
}

function popBalloonAt(cx, cy) {
  for (let i = popState.balloons.length - 1; i >= 0; i--) {
    const b = popState.balloons[i];
    const dx = cx - b.x;
    const dy = cy - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= b.radius + 6) {
      // Pop!
      const pts = b.isGold ? 5 : 1;
      popState.score += pts;
      document.getElementById('currentScoreDisplay').textContent = `${popState.score} (${popState.timeLeft}s)`;

      playKeySound(b.isGold ? 950 : 800);

      // Create burst particles
      for (let k = 0; k < 12; k++) {
        popState.particles.push({
          x: b.x,
          y: b.y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: b.color,
          alpha: 1,
          size: Math.random() * 5 + 3
        });
      }

      popState.balloons.splice(i, 1);
      break;
    }
  }
}

function drawPopScene(ctx) {
  // Romantic gradient sky
  const sky = ctx.createLinearGradient(0, 0, 0, 460);
  sky.addColorStop(0, '#cbf7ee');
  sky.addColorStop(0.6, '#99f6e4');
  sky.addColorStop(1, '#14b8a6');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 360, 460);

  // Draw balloons
  popState.balloons.forEach(b => {
    ctx.save();
    // Balloon body
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.radius, b.radius * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(b.x - b.radius * 0.35, b.y - b.radius * 0.45, b.radius * 0.28, b.radius * 0.45, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // String
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + b.radius * 1.2);
    ctx.quadraticCurveTo(b.x + 6, b.y + b.radius * 1.2 + 10, b.x, b.y + b.radius * 1.2 + 20);
    ctx.stroke();

    // Icon inside
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.isGold ? '👑' : '💖', b.x, b.y);
    ctx.restore();
  });

  // Draw burst particles
  popState.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function endPopGame() {
  stopPopGame();
  playSuccessFanfare();

  const best = parseInt(localStorage.getItem('pop_best') || 0);
  if (popState.score > best) {
    localStorage.setItem('pop_best', popState.score);
    document.getElementById('highScoreDisplay').textContent = popState.score;
  }

  showGameOver('Pecahkan Balon Cinta', popState.score, best);
}


// ----------------------------------------------------
// GAME 7: TIC-TAC-TOE (XOX) LOGIC
// ----------------------------------------------------
let xoxState = {
  board: Array(9).fill(null),
  currentPlayer: 'X', // 'X' = 💖 Princess, 'O' = 🌸 AI/Player 2
  mode: 'ai', // 'ai' or '2p'
  isGameOver: false,
  scoreX: 0,
  scoreO: 0,
  scoreDraw: 0,
  aiTimeout: null
};

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function setupXoxGame() {
  const modeAiBtn = document.getElementById('xoxModeAi');
  const mode2pBtn = document.getElementById('xoxMode2P');
  const resetBtn = document.getElementById('xoxResetBtn');
  const cells = document.querySelectorAll('.xox-cell');

  if (modeAiBtn && mode2pBtn) {
    modeAiBtn.onclick = () => {
      xoxState.mode = 'ai';
      modeAiBtn.classList.add('active');
      mode2pBtn.classList.remove('active');
      resetXoxRound();
      playKeySound(600);
    };
    mode2pBtn.onclick = () => {
      xoxState.mode = '2p';
      mode2pBtn.classList.add('active');
      modeAiBtn.classList.remove('active');
      resetXoxRound();
      playKeySound(600);
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      resetXoxRound();
      playKeySound(540);
    };
  }

  cells.forEach(cell => {
    cell.onclick = () => {
      const idx = parseInt(cell.getAttribute('data-cell'));
      handleCellClick(idx);
    };
  });

  resetXoxRound();
}

function resetXoxRound() {
  if (xoxState.aiTimeout) {
    clearTimeout(xoxState.aiTimeout);
    xoxState.aiTimeout = null;
  }

  xoxState.board = Array(9).fill(null);
  xoxState.currentPlayer = 'X';
  xoxState.isGameOver = false;

  const cells = document.querySelectorAll('.xox-cell');
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'xox-cell';
  });

  updateXoxTurnText();
}

function updateXoxTurnText() {
  const turnText = document.getElementById('xoxTurnText');
  if (!turnText) return;

  if (xoxState.isGameOver) return;

  if (xoxState.currentPlayer === 'X') {
    turnText.textContent = 'Giliran: 💖 Tuan Putri (X)';
  } else {
    turnText.textContent = xoxState.mode === 'ai' ? 'Giliran: 🌸 Chiikawa AI (O)...' : 'Giliran: 🌸 Pangeran (O)';
  }
}

function handleCellClick(idx) {
  if (xoxState.board[idx] || xoxState.isGameOver) return;
  if (xoxState.mode === 'ai' && xoxState.currentPlayer === 'O') return;

  makeMove(idx, xoxState.currentPlayer);

  if (!xoxState.isGameOver && xoxState.mode === 'ai' && xoxState.currentPlayer === 'O') {
    xoxState.aiTimeout = setTimeout(makeAiMove, 450);
  }
}

function makeMove(idx, player) {
  xoxState.board[idx] = player;
  const cell = document.querySelector(`.xox-cell[data-cell="${idx}"]`);
  if (cell) {
    cell.textContent = player === 'X' ? '💖' : '🌸';
    cell.classList.add('filled');
  }

  playKeySound(player === 'X' ? 760 : 640);

  // Check Win
  const winCombo = checkWin(xoxState.board, player);
  if (winCombo) {
    xoxState.isGameOver = true;
    winCombo.forEach(ci => {
      const c = document.querySelector(`.xox-cell[data-cell="${ci}"]`);
      if (c) c.classList.add('win');
    });

    const turnText = document.getElementById('xoxTurnText');
    if (player === 'X') {
      xoxState.scoreX++;
      document.getElementById('xoxScoreX').textContent = xoxState.scoreX;
      turnText.textContent = '🎉 Selamat Tuan Putri Menang! 💖👑';
      playSuccessFanfare();
      triggerConfettiStorm();
    } else {
      xoxState.scoreO++;
      document.getElementById('xoxScoreO').textContent = xoxState.scoreO;
      turnText.textContent = xoxState.mode === 'ai' ? '🥺 Chiikawa menang tipis! Coba lagi yaa~' : '🌸 Pangeran Menang!';
      playErrorSound();
    }
    return;
  }

  // Check Draw
  if (xoxState.board.every(cell => cell !== null)) {
    xoxState.isGameOver = true;
    xoxState.scoreDraw++;
    document.getElementById('xoxScoreDraw').textContent = xoxState.scoreDraw;
    const turnText = document.getElementById('xoxTurnText');
    if (turnText) turnText.textContent = '🤝 Seri! Hati kita seimbang~ 💕';
    playKeySound(500);
    return;
  }

  // Switch Player
  xoxState.currentPlayer = xoxState.currentPlayer === 'X' ? 'O' : 'X';
  updateXoxTurnText();
}

function checkWin(board, player) {
  for (let combo of WIN_COMBOS) {
    if (combo.every(idx => board[idx] === player)) {
      return combo;
    }
  }
  return null;
}

function makeAiMove() {
  if (xoxState.isGameOver || xoxState.currentPlayer !== 'O') return;

  const b = xoxState.board;

  // 1. Can AI win immediately?
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'O';
      if (checkWin(b, 'O')) {
        b[i] = null;
        makeMove(i, 'O');
        return;
      }
      b[i] = null;
    }
  }

  // 2. Block Princess from winning
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'X';
      if (checkWin(b, 'X')) {
        b[i] = null;
        makeMove(i, 'O');
        return;
      }
      b[i] = null;
    }
  }

  // 3. Take Center if available (50% chance)
  if (!b[4] && Math.random() < 0.6) {
    makeMove(4, 'O');
    return;
  }

  // 4. Random available spot
  const emptyIndices = b.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  if (emptyIndices.length > 0) {
    const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(choice, 'O');
  }
}


// ==========================================
// THEME PICKER SYSTEM
// ==========================================
function initThemePicker() {
  const themeCards = document.querySelectorAll(".theme-option-card");
  const confirmBtn = document.getElementById("themeConfirmBtn");
  const themePickerScreen = document.getElementById("themePickerScreen");
  const themeSwitchBtn = document.getElementById("themeSwitchBtn");
  let selectedTheme = localStorage.getItem("bday_theme") || "tosca";

  // Pre-select theme on load
  applyTheme(selectedTheme);
  themeCards.forEach(card => {
    if (card.dataset.theme === selectedTheme) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
    
    card.addEventListener("click", () => {
      themeCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedTheme = card.dataset.theme;
      
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.classList.add("ready");
      }
      
      try { playKeySound(620); } catch(e) {}
      applyTheme(selectedTheme);
    });
  });

  // Always enable confirm button once loaded
  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.classList.add("ready");
    
    confirmBtn.onclick = () => {
      if (!selectedTheme) selectedTheme = "tosca";
      localStorage.setItem("bday_theme", selectedTheme);
      applyTheme(selectedTheme);

      themePickerScreen.classList.add("fade-out");
      try { playKeySound(720); } catch(e) {}

      setTimeout(() => {
        themePickerScreen.classList.remove("active", "fade-out");
        const musicPicker = document.getElementById("musicPickerScreen");
        if (musicPicker) {
          musicPicker.classList.remove("fade-out");
          musicPicker.classList.add("active");
        } else {
          surpriseScreen.classList.add("active");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 450);
    };
  }

  // Dashboard Theme Switch Button (if user wants to change theme from dashboard)
  if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener("click", () => {
      surpriseScreen.classList.remove("active");
      themePickerScreen.classList.remove("fade-out");
      themePickerScreen.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// ==========================================
// MUSIC PICKER SYSTEM
// ==========================================
function initMusicPicker() {
  const musicCards = document.querySelectorAll(".music-option-card");
  const confirmBtn = document.getElementById("musicConfirmBtn");
  const musicPickerScreen = document.getElementById("musicPickerScreen");
  const musicSwitchBtn = document.getElementById("musicSwitchBtn");
  let selectedMusic = localStorage.getItem("bday_selected_music") || "bday-evita";

  // Pre-select current music
  musicCards.forEach(card => {
    if (card.dataset.music === selectedMusic) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }

    card.addEventListener("click", () => {
      musicCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedMusic = card.dataset.music;
      currentMusicTrackId = selectedMusic;

      try { playKeySound(620); } catch(e) {}

      // Play selected music preview immediately
      toggleMusic(true);
    });
  });

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (!selectedMusic) selectedMusic = "bday-evita";
      localStorage.setItem("bday_selected_music", selectedMusic);
      currentMusicTrackId = selectedMusic;

      // Ensure music is playing
      toggleMusic(true);

      musicPickerScreen.classList.add("fade-out");
      try { playSuccessFanfare(); } catch(e) {}

      setTimeout(() => {
        musicPickerScreen.classList.remove("active", "fade-out");
        surpriseScreen.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
        try { triggerConfettiStorm(); } catch(e) {}
      }, 450);
    };
  }

  // Dashboard Music Switch Button
  if (musicSwitchBtn) {
    musicSwitchBtn.addEventListener("click", () => {
      surpriseScreen.classList.remove("active");
      musicPickerScreen.classList.remove("fade-out");
      musicPickerScreen.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function applyTheme(themeName) {
  const root = document.documentElement;
  
  // Remove all theme classes first
  document.body.classList.remove("theme-tosca", "theme-pink", "theme-seventeen");
  
  switch(themeName) {
    case "pink":
      root.style.setProperty("--tosca-50", "#fdf2f8");
      root.style.setProperty("--tosca-100", "#fce7f3");
      root.style.setProperty("--tosca-200", "#fbcfe8");
      root.style.setProperty("--tosca-300", "#f9a8d4");
      root.style.setProperty("--tosca-400", "#f472b6");
      root.style.setProperty("--tosca-500", "#ec4899");
      root.style.setProperty("--tosca-600", "#db2777");
      root.style.setProperty("--tosca-700", "#be185d");
      root.style.setProperty("--tosca-800", "#9d174d");
      root.style.setProperty("--tosca-900", "#831843");
      root.style.setProperty("--tosca-950", "#500724");
      root.style.setProperty("--pink-soft", "#fce7f3");
      root.style.setProperty("--glass-shadow", "0 20px 45px -10px rgba(190, 24, 93, 0.3), 0 0 20px rgba(236, 72, 153, 0.15)");
      document.body.classList.add("theme-pink");
      break;

    case "seventeen":
      root.style.setProperty("--tosca-50", "#fdf2f8");
      root.style.setProperty("--tosca-100", "#f3e8ff");
      root.style.setProperty("--tosca-200", "#e9d5ff");
      root.style.setProperty("--tosca-300", "#c9a6e3");
      root.style.setProperty("--tosca-400", "#a78bfa");
      root.style.setProperty("--tosca-500", "#8b5cf6");
      root.style.setProperty("--tosca-600", "#7c3aed");
      root.style.setProperty("--tosca-700", "#6d28d9");
      root.style.setProperty("--tosca-800", "#5b21b6");
      root.style.setProperty("--tosca-900", "#4c1d95");
      root.style.setProperty("--tosca-950", "#2e1065");
      root.style.setProperty("--pink-soft", "#f4a6c0");
      root.style.setProperty("--glass-shadow", "0 20px 45px -10px rgba(109, 40, 217, 0.3), 0 0 20px rgba(139, 92, 246, 0.15)");
      document.body.classList.add("theme-seventeen");
      break;

    case "tosca":
    default:
      root.style.setProperty("--tosca-50", "#f0fdfa");
      root.style.setProperty("--tosca-100", "#ccfbf1");
      root.style.setProperty("--tosca-200", "#99f6e4");
      root.style.setProperty("--tosca-300", "#5eead4");
      root.style.setProperty("--tosca-400", "#2dd4bf");
      root.style.setProperty("--tosca-500", "#14b8a6");
      root.style.setProperty("--tosca-600", "#0d9488");
      root.style.setProperty("--tosca-700", "#0f766e");
      root.style.setProperty("--tosca-800", "#115e59");
      root.style.setProperty("--tosca-900", "#134e4a");
      root.style.setProperty("--tosca-950", "#042f2e");
      root.style.setProperty("--pink-soft", "#fbcfe8");
      root.style.setProperty("--glass-shadow", "0 20px 45px -10px rgba(15, 118, 110, 0.3), 0 0 20px rgba(20, 184, 166, 0.15)");
      document.body.classList.add("theme-tosca");
      break;
  }
  
  // Update background gradient based on theme
  updateBgForTheme(themeName);
  
  // Update cute clock theme
  if (typeof updateClockTheme === "function") {
    updateClockTheme(themeName);
  }
}

function updateBgForTheme(themeName) {
  const bgSky = document.querySelector(".bg-sky");
  const mountainFar = document.querySelector(".mountain-far");
  const mountainMid = document.querySelector(".mountain-mid");
  const mountainNear = document.querySelector(".mountain-near");
  const bgGlow = document.querySelector(".bg-glow");
  
  if (!bgSky) return;
  
  switch(themeName) {
    case "pink":
      bgSky.style.background = "linear-gradient(180deg, #fce4ec 0%, #f8bbd0 25%, #f48fb1 50%, #f06292 75%, #ec407a 100%)";
      if (mountainFar) mountainFar.style.background = "linear-gradient(180deg, #f48fb1, #e91e63)";
      if (mountainMid) mountainMid.style.background = "linear-gradient(180deg, #e91e63, #c2185b)";
      if (mountainNear) mountainNear.style.background = "linear-gradient(180deg, #c2185b, #880e4f)";
      if (bgGlow) bgGlow.style.background = "radial-gradient(ellipse at center, rgba(244,143,177,0.7) 0%, rgba(233,30,99,0.3) 40%, transparent 70%)";
      break;

    case "seventeen":
      bgSky.style.background = "linear-gradient(180deg, #e8d5f5 0%, #c9a6e3 20%, #89b4d6 50%, #f4a6c0 75%, #d4a0d0 100%)";
      if (mountainFar) mountainFar.style.background = "linear-gradient(180deg, #b39ddb, #7e57c2)";
      if (mountainMid) mountainMid.style.background = "linear-gradient(180deg, #7e57c2, #5e35b1)";
      if (mountainNear) mountainNear.style.background = "linear-gradient(180deg, #5e35b1, #4527a0)";
      if (bgGlow) bgGlow.style.background = "radial-gradient(ellipse at center, rgba(244,166,192,0.7) 0%, rgba(137,180,214,0.4) 40%, transparent 70%)";
      break;

    case "tosca":
    default:
      bgSky.style.background = "";
      if (mountainFar) mountainFar.style.background = "";
      if (mountainMid) mountainMid.style.background = "";
      if (mountainNear) mountainNear.style.background = "";
      if (bgGlow) bgGlow.style.background = "";
      break;
  }
}


// ==========================================
// GALLERY PHOTO UPLOAD SYSTEM
// ==========================================
let pendingPhotos = []; // temp storage for photos waiting for caption

function initGalleryUpload() {
  const addCard = document.getElementById("addMemoryCard");
  const fileInput = document.getElementById("memoryFileInput");
  const captionModal = document.getElementById("memoryCaptionModal");
  const captionInput = document.getElementById("memoryCaptionInput");
  const captionSaveBtn = document.getElementById("captionSaveBtn");
  const captionCancelBtn = document.getElementById("captionCancelBtn");

  if (!addCard || !fileInput) return;

  // Load saved photos on init
  loadSavedPhotos();

  // Click "Add Memory" card → open file picker
  addCard.addEventListener("click", () => {
    fileInput.click();
  });

  // File selected → process
  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    pendingPhotos = [];
    
    // Convert each file to base64
    let processed = 0;
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Resize image to save localStorage space (max 400px width)
        resizeImage(ev.target.result, 400, (resizedDataUrl) => {
          pendingPhotos.push({
            id: Date.now() + "_" + Math.random().toString(36).substr(2, 5),
            src: resizedDataUrl,
            caption: "",
            hearts: 0,
            addedAt: new Date().toISOString()
          });
          
          processed++;
          if (processed === files.length) {
            // Show caption modal for the first photo (or batch)
            showCaptionModal();
          }
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    fileInput.value = "";
  });

  // Caption modal save
  if (captionSaveBtn) {
    captionSaveBtn.addEventListener("click", () => {
      const caption = captionInput.value.trim() || "Kenangan indah 💕";
      
      // Apply caption to all pending photos
      pendingPhotos.forEach(photo => {
        photo.caption = caption;
      });

      // Save to localStorage
      savePhotosToStorage(pendingPhotos);
      
      // Render the new photos
      pendingPhotos.forEach(photo => {
        renderUploadedPhoto(photo);
      });

      // Re-init heart reactions for new buttons
      reInitHeartReactions();

      // Close modal
      hideCaptionModal();
      
      // Show toast
      showUploadToast(`📸 ${pendingPhotos.length} foto berhasil ditambahkan! ✨`);
      
      // Play success sound
      try { playKeySound(880); } catch(e) {}
      
      pendingPhotos = [];
    });
  }

  // Caption modal cancel
  if (captionCancelBtn) {
    captionCancelBtn.addEventListener("click", () => {
      hideCaptionModal();
      pendingPhotos = [];
    });
  }
}

function resizeImage(dataUrl, maxWidth, callback) {
  const img = new Image();
  img.onload = () => {
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    
    // Use JPEG for smaller file size
    callback(canvas.toDataURL("image/jpeg", 0.7));
  };
  img.src = dataUrl;
}

function showCaptionModal() {
  const modal = document.getElementById("memoryCaptionModal");
  const input = document.getElementById("memoryCaptionInput");
  if (modal) {
    modal.classList.add("show");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 300);
    }
  }
}

function hideCaptionModal() {
  const modal = document.getElementById("memoryCaptionModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function getStoredPhotos() {
  try {
    const data = localStorage.getItem("bday_gallery_photos");
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
}

function savePhotosToStorage(newPhotos) {
  const existing = getStoredPhotos();
  const updated = [...existing, ...newPhotos];
  try {
    localStorage.setItem("bday_gallery_photos", JSON.stringify(updated));
  } catch(e) {
    // localStorage might be full - show warning
    showUploadToast("⚠️ Penyimpanan penuh! Coba hapus beberapa foto lama.");
  }
}

function updateStoredPhotos(allPhotos) {
  try {
    localStorage.setItem("bday_gallery_photos", JSON.stringify(allPhotos));
  } catch(e) {}
}

function loadSavedPhotos() {
  const photos = getStoredPhotos();
  photos.forEach(photo => {
    renderUploadedPhoto(photo);
  });
  // Re-init heart reactions after loading
  if (photos.length > 0) {
    reInitHeartReactions();
  }
}

function renderUploadedPhoto(photo) {
  const container = document.getElementById("userPhotosContainer");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "polaroid-card user-uploaded";
  card.dataset.photoId = photo.id;
  card.innerHTML = `
    <span class="memory-new-tag">BARU ✨</span>
    <button class="memory-delete-btn" title="Hapus foto ini" data-photo-id="${photo.id}">✕</button>
    <div class="polaroid-img-wrap"><img src="${photo.src}" alt="Kenangan"></div>
    <span class="polaroid-caption">${photo.caption}</span>
    <button class="heart-react-btn" title="Kirim Hati!">❤️ <span class="heart-count">${photo.hearts || 0}</span></button>
  `;

  container.appendChild(card);

  // Add delete handler
  const deleteBtn = card.querySelector(".memory-delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteUploadedPhoto(photo.id, card);
    });
  }

  // Add lightbox handler for the image
  const imgWrap = card.querySelector(".polaroid-img-wrap");
  if (imgWrap) {
    imgWrap.addEventListener("click", () => {
      const img = imgWrap.querySelector("img");
      if (img) {
        try { openLightbox(img.src); } catch(e) {}
      }
    });
  }

  // Add heart handler with persistence
  const heartBtn = card.querySelector(".heart-react-btn");
  if (heartBtn) {
    heartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const countEl = heartBtn.querySelector(".heart-count");
      if (countEl) {
        let current = parseInt(countEl.textContent.replace(/\D/g, "")) || 0;
        current++;
        countEl.textContent = `${current}`;
        
        // Update in localStorage
        const photos = getStoredPhotos();
        const idx = photos.findIndex(p => p.id === photo.id);
        if (idx !== -1) {
          photos[idx].hearts = current;
          updateStoredPhotos(photos);
        }
      }
      try { playKeySound(880); } catch(e) {}
      heartBtn.style.transform = "scale(1.2)";
      setTimeout(() => { heartBtn.style.transform = "scale(1)"; }, 150);
    });
  }
}

function deleteUploadedPhoto(photoId, cardEl) {
  // Animate removal
  cardEl.style.transition = "all 0.4s ease";
  cardEl.style.transform = "scale(0.7) rotate(5deg)";
  cardEl.style.opacity = "0";
  
  setTimeout(() => {
    cardEl.remove();
    
    // Remove from localStorage
    const photos = getStoredPhotos();
    const updated = photos.filter(p => p.id !== photoId);
    updateStoredPhotos(updated);
    
    showUploadToast("🗑️ Foto berhasil dihapus!");
    try { playKeySound(440); } catch(e) {}
  }, 400);
}

function reInitHeartReactions() {
  // Re-bind heart buttons for newly added cards
  // The original initHeartReactions only runs once, so we need this for dynamic cards
  const newHeartBtns = document.querySelectorAll(".user-uploaded .heart-react-btn");
  // Already handled in renderUploadedPhoto, so this is a no-op safety net
}

function showUploadToast(message) {
  // Remove existing toast
  const existing = document.querySelector(".upload-progress-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "upload-progress-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto-remove after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}


// ==========================================
// TIMELINE CHECKLIST & RATING SYSTEM
// ==========================================
const RATING_RESPONSES = {
  5: {
    emoji: "🥰💖🎉",
    text: "MAKASIIIII BUAT HARI INI SAYANG!! Kamu udah bikin hari ini jadi hari paling indah sedunia! I love you so much!! 💕💕💕",
    bg: "#f0fdfa"
  },
  4: {
    emoji: "😊💕",
    text: "Seneng banget hari ini bisa bikin kamu happy! Makasih udah jadi yang terbaik, next time pasti lebih seru lagi ya sayang~ 🌸",
    bg: "#f0fdf4"
  },
  3: {
    emoji: "☺️🌷",
    text: "Hehe lumayan ya hari ini~ Makasih udah sabar dan tetep senyum. Aku janji bakal bikin momen yang lebih spesial lagi buat kamu! 💐",
    bg: "#fefce8"
  },
  2: {
    emoji: "🥺💔",
    text: "Maaf ya sayang kalo hari ini kurang seru... Aku bakal usaha lebih keras lagi supaya next time bisa bikin kamu senyum terus. Kamu tetep yang terbaik~ 🌙",
    bg: "#fff1f2"
  },
  1: {
    emoji: "😢💧",
    text: "Maaf banget ya sayang kalo hari ini mengecewakan... Aku bener-bener minta maaf. Tapi aku janji, aku bakal tebus semua ini dan bikin kamu bahagia. Kamu pantas dapet yang terbaik! 🥀💝",
    bg: "#fef2f2"
  }
};

function renderRatingResult(rating) {
  const response = RATING_RESPONSES[rating];
  const responseDiv = document.getElementById("ratingResponse");
  const resEmoji = document.getElementById("ratingResEmoji");
  const resText = document.getElementById("ratingResText");
  const stars = document.querySelectorAll(".rating-star");

  stars.forEach(s => {
    const r = parseInt(s.dataset.rating);
    s.classList.remove("active", "lit");
    if (r <= rating) {
      s.classList.add("active");
    }
  });

  if (response && responseDiv) {
    if (resEmoji) resEmoji.textContent = response.emoji;
    if (resText) resText.textContent = response.text;
    responseDiv.style.display = "block";
    responseDiv.style.background = response.bg;
  }
}

function showRatingModal() {
  const modal = document.getElementById("ratingModal");
  if (!modal) return;

  const savedRating = localStorage.getItem("bday_rating");
  if (savedRating) {
    renderRatingResult(parseInt(savedRating));
  }

  modal.classList.add("open");
  try { playSuccessFanfare(); } catch(e) {}
}

function initTimelineChecklist() {
  const openBtn = document.getElementById("timelineOpenBtn");
  const modal = document.getElementById("timelineModal");
  const closeBtn = document.getElementById("closeTimelineBtn");
  const checkboxes = document.querySelectorAll(".tl-checkbox");
  const progressFill = document.getElementById("tlProgressFill");
  const progressText = document.getElementById("tlProgressText");
  const progressBadge = document.getElementById("tlProgressBadge");
  const footerHint = document.getElementById("tlFooterHint");
  const ratingTriggerBtn = document.getElementById("tlRatingTriggerBtn");
  const totalItems = checkboxes.length;

  if (!openBtn || !modal) return;

  // Prevent card click from bubbling to overlay
  const modalCards = modal.querySelectorAll(".modal-card");
  modalCards.forEach(c => c.addEventListener("click", e => e.stopPropagation()));

  // Load saved state
  const savedChecks = getTimelineState();
  checkboxes.forEach((cb, idx) => {
    if (savedChecks[idx]) {
      cb.checked = true;
      const item = cb.closest(".tl-item");
      if (item) item.classList.add("checked");
    }
  });
  updateTimelineProgress();

  // Open modal button
  openBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    modal.classList.add("open");
    try { playKeySound(660); } catch(e) {}
  });

  // Close modal button
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.classList.remove("open");
    });
  }

  // Close when clicking directly on overlay backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });

  // Rating trigger button inside timeline footer
  if (ratingTriggerBtn) {
    ratingTriggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.classList.remove("open");
      showRatingModal();
    });
  }

  // Checkbox change interactions
  checkboxes.forEach((cb, idx) => {
    const item = cb.closest(".tl-item");
    
    cb.addEventListener("change", () => {
      if (cb.checked) {
        if (item) item.classList.add("checked");
        try { playKeySound(700 + idx * 60); } catch(e) {}
      } else {
        if (item) item.classList.remove("checked");
        try { playKeySound(400); } catch(e) {}
      }

      saveTimelineState();
      updateTimelineProgress();

      const checkedCount = document.querySelectorAll(".tl-checkbox:checked").length;
      if (checkedCount === totalItems) {
        // Trigger celebration and open rating after brief notice
        try { playSuccessFanfare(); } catch(e) {}
        setTimeout(() => {
          modal.classList.remove("open");
          showRatingModal();
        }, 800);
      }
    });
  });

  function updateTimelineProgress() {
    const checked = document.querySelectorAll(".tl-checkbox:checked").length;
    const pct = Math.round((checked / totalItems) * 100);
    
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.textContent = `${checked} dari ${totalItems} selesai`;
    if (progressBadge) {
      progressBadge.textContent = `${checked}/${totalItems}`;
      if (checked === totalItems) {
        progressBadge.classList.add("complete");
      } else {
        progressBadge.classList.remove("complete");
      }
    }

    if (footerHint) {
      if (checked === totalItems) {
        footerHint.textContent = "🎉 Semua checklist selesai! Kamu luar biasa! ✨";
      } else if (checked > totalItems / 2) {
        footerHint.textContent = "Sedikit lagi sayang! Semangat~ 💪✨";
      } else {
        footerHint.textContent = "Centang semua untuk unlock surprise! 🎉";
      }
    }

    // Show button to open rating if all checked
    if (ratingTriggerBtn) {
      ratingTriggerBtn.style.display = (checked === totalItems) ? "inline-block" : "none";
    }
  }
}

function getTimelineState() {
  try {
    const data = localStorage.getItem("bday_timeline");
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
}

function saveTimelineState() {
  const checkboxes = document.querySelectorAll(".tl-checkbox");
  const state = Array.from(checkboxes).map(cb => cb.checked);
  localStorage.setItem("bday_timeline", JSON.stringify(state));
}

function initRatingSystem() {
  const modal = document.getElementById("ratingModal");
  const stars = document.querySelectorAll(".rating-star");
  const closeBtn = document.getElementById("ratingCloseBtn");

  if (!modal) return;

  // Prevent card click from closing modal
  const modalCards = modal.querySelectorAll(".modal-card");
  modalCards.forEach(c => c.addEventListener("click", e => e.stopPropagation()));

  const savedRating = localStorage.getItem("bday_rating");
  if (savedRating) {
    renderRatingResult(parseInt(savedRating));
  }

  stars.forEach(star => {
    const rating = parseInt(star.dataset.rating);

    star.addEventListener("mouseenter", () => {
      stars.forEach(s => {
        const r = parseInt(s.dataset.rating);
        if (r <= rating) {
          s.classList.add("lit");
        } else {
          s.classList.remove("lit");
        }
      });
    });

    star.addEventListener("mouseleave", () => {
      stars.forEach(s => {
        if (!s.classList.contains("active")) {
          s.classList.remove("lit");
        }
      });
    });

    star.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem("bday_rating", rating.toString());
      renderRatingResult(rating);
      try { playKeySound(800); } catch(e) {}
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.classList.remove("open");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });
}

// ==========================================
// TAB 7: MENU LAINNYA (PERIOD TRACKER, JIRA TIMELINE, NOTES)
// ==========================================
function initOthersTabFeatures() {
  initOthersSubmenu();
  initPeriodTracker();
  initJiraTaskTimeline();
  initNotesCantik();
  initSavingsTracker();
}

function initOthersSubmenu() {
  const subtabBtns = document.querySelectorAll(".others-subtab-btn");
  const subtabPanels = document.querySelectorAll(".others-subcontent");

  if (!subtabBtns.length || !subtabPanels.length) return;

  function switchSubtab(targetId, playSound = true) {
    subtabBtns.forEach(btn => {
      if (btn.getAttribute("data-subtab") === targetId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    subtabPanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    localStorage.setItem("bday_others_active_subtab", targetId);
    if (playSound) {
      try { playKeySound(620); } catch(e) {}
    }
  }

  subtabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-subtab");
      switchSubtab(targetId, true);
    });
  });

  // Restore saved active subtab or default to period tracker
  const savedSubtab = localStorage.getItem("bday_others_active_subtab");
  if (savedSubtab && document.getElementById(savedSubtab)) {
    switchSubtab(savedSubtab, false);
  }
}

function formatIndoDate(dateStr) {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatIndoDateShort(dateStr) {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ------------------------------------------
// 1. PERIOD TRACKER LOGIC
// ------------------------------------------
function initPeriodTracker() {
  const lastDateInput = document.getElementById("periodLastDate");
  const cycleLenInput = document.getElementById("periodCycleLen");
  const durationInput = document.getElementById("periodDuration");
  const saveBtn = document.getElementById("savePeriodBtn");
  const preset3MonthsBtn = document.getElementById("preset3MonthsBtn");
  const presetCustomBtn = document.getElementById("presetCustomBtn");
  const cycleSuffixText = document.getElementById("cycleSuffixText");

  const statusBanner = document.getElementById("periodStatusBanner");
  const statusIcon = document.getElementById("periodStatusIcon");
  const cycleDayText = document.getElementById("periodCycleDayText");
  const nextDateText = document.getElementById("periodNextDateText");
  const countdownText = document.getElementById("periodCountdownText");

  const valNextPeriod = document.getElementById("valNextPeriod");
  const valOvulation = document.getElementById("valOvulation");
  const valCurrentPhase = document.getElementById("valCurrentPhase");
  const valPhaseDesc = document.getElementById("valPhaseDesc");
  const careMessage = document.getElementById("periodCareMessage");
  const symptomChips = document.querySelectorAll(".symptom-chip");
  const symptomStatusMsg = document.getElementById("symptomStatusMsg");
  const forecastCardsGrid = document.getElementById("forecastCardsGrid");

  if (!lastDateInput || !saveBtn) return;

  // Load saved data or set specialized 3-month (90 days) default
  const savedDataStr = localStorage.getItem("bday_period_tracker");
  let periodData = {
    lastDate: "",
    cycleLen: 90, // Default 3 bulan sekali (bawaan ibu tersayang)
    duration: 6,
    symptoms: []
  };

  if (savedDataStr) {
    try {
      const parsed = JSON.parse(savedDataStr);
      periodData = Object.assign(periodData, parsed);
      // If user still had the old generic 28-day cycle, upgrade to the special 90-day cycle
      if (periodData.cycleLen === 28) {
        periodData.cycleLen = 90;
      }
    } catch(e) {}
  } else {
    // Default lastDate: around 35 days ago to demonstrate a 3-month cycle in mid-phase
    const d = new Date();
    d.setDate(d.getDate() - 35);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    periodData.lastDate = `${y}-${m}-${day}`;
  }

  // Populate inputs
  if (periodData.lastDate) lastDateInput.value = periodData.lastDate;
  if (periodData.cycleLen) cycleLenInput.value = periodData.cycleLen;
  if (periodData.duration) durationInput.value = periodData.duration;

  // Sync preset chips UI
  function updatePresetChipsUI(len) {
    if (len === 90) {
      if (preset3MonthsBtn) preset3MonthsBtn.classList.add("active");
      if (presetCustomBtn) presetCustomBtn.classList.remove("active");
      if (cycleSuffixText) cycleSuffixText.textContent = "Hari (3 Bulan: 90 Hari)";
    } else {
      if (preset3MonthsBtn) preset3MonthsBtn.classList.remove("active");
      if (presetCustomBtn) presetCustomBtn.classList.add("active");
      if (cycleSuffixText) cycleSuffixText.textContent = `Hari (${len} Hari)`;
    }
  }
  updatePresetChipsUI(periodData.cycleLen);

  if (preset3MonthsBtn) {
    preset3MonthsBtn.addEventListener("click", () => {
      cycleLenInput.value = 90;
      updatePresetChipsUI(90);
      try { playKeySound(620); } catch(e) {}
      savePeriodData();
    });
  }

  if (presetCustomBtn) {
    presetCustomBtn.addEventListener("click", () => {
      updatePresetChipsUI(parseInt(cycleLenInput.value) || 90);
      cycleLenInput.focus();
      cycleLenInput.select();
      try { playKeySound(560); } catch(e) {}
    });
  }

  cycleLenInput.addEventListener("input", () => {
    const val = parseInt(cycleLenInput.value) || 90;
    updatePresetChipsUI(val);
  });

  // Render symptoms with Full Solution Advice & Auto-Sticky Note Creation
  const solutionBox = document.getElementById("symptomSolutionBox");
  const solutionBadgeIcon = document.getElementById("solutionBadgeIcon");
  const solutionTitleText = document.getElementById("solutionTitleText");
  const solutionTimestampText = document.getElementById("solutionTimestampText");
  const solutionAdviceList = document.getElementById("solutionAdviceList");
  const solutionSweetQuote = document.getElementById("solutionSweetQuote");
  const symptomHistoryWrap = document.getElementById("symptomHistoryWrap");
  const symptomHistoryList = document.getElementById("symptomHistoryList");


  // Comprehensive Medical & Sweet Boyfriend Advice Database
  const SYMPTOM_DATA = {
    cramp: {
      name: "Perut Kram",
      emoji: "🩹",
      color: "pink",
      solutions: [
        "Kompres hangat perut bagian bawah pakai botol/bantalan air hangat selama 15-20 menit untuk meredakan kontraksi otot rahim.",
        "Minum air jahe hangat atau teh chamomile tanpa kafein agar otot perut lebih relaks dan tenang.",
        "Coba posisi tidur miring meringkuk (fetal position) untuk mengurangi tekanan di dinding perut.",
        "Lakukan pijatan lembut memutar searah jarum jam di sekitar pusar dengan minyak aromaterapi lavender.",
        "Hindari makanan terlalu asin atau dingin sementara waktu, dan kabari ayang ya sayang... Ayang siap nemenin kamu! 💕"
      ],
      sweetNote: "Sakit banget ya sayang? Jangan ditahan sendirian yaa. Rebahan yang nyaman, ayang siap beliin makanan kesukaanmu atau bantuin kompres hangat. Peluk erat dari ayang! 🧸🍫💖"
    },
    sweet: {
      name: "Butuh Coklat / Makanan Manis",
      emoji: "🍫",
      color: "yellow",
      solutions: [
        "Pilih dark chocolate (kandungan kakao 70%+) karena kaya magnesium alami yang ampuh meredakan kram & menstimulasi hormon endorfin bahagia.",
        "Padukan dengan buah manis alami (pisang, kurma, stroberi) agar lonjakan gula darah tetap stabil dan berenergi.",
        "Minum segelas air putih hangat setelah ngemil manis agar tenggorokan tetap segar.",
        "Ayang siap pesankan dessert, cake, atau es krim kesukaan Tuan Putri sekarang juga! 🍨✨"
      ],
      sweetNote: "Bidadari manja lagi pengen yang manis-manis nih! Mau coklat apa sayang? Langsung sebutin yaa, ayang beliin sekarang biar senyum manismu balik merekah lagi~ 🍫🍰✨"
    },
    hug: {
      name: "Manja / Butuh Dipeluk",
      emoji: "🧸",
      color: "pink",
      solutions: [
        "Peluk guling empuk atau boneka Chiikawa hangat kesayangan di tempat tidur.",
        "Putar lagu favoritmu atau musik box ulang tahun yang menenangkan hati.",
        "Telepon atau kirim voice note ke ayang; tumpahkan semua unek-unekmu, ayang selalu siap mendengarkan tanpa henti.",
        "Tarik napas dalam-dalam secara perlahan dan ingat: kamu adalah orang paling berharga & paling aku sayang! 💕"
      ],
      sweetNote: "Sini manja ke pelukan ayang! Jangan ngerasa sendirian ya sayang, ayang selalu ada buat dengerin semua ceritamu dan bikin kamu ngerasa aman serta nyaman. Love you always & forever! 💖🫂"
    },
    tired: {
      name: "Cepat Ngantuk / Lelah",
      emoji: "😴",
      color: "purple",
      solutions: [
        "Ambil istirahat tidur siang singkat (power nap) 20-30 menit untuk meregenerasi sel tubuh & energi.",
        "Pastikan asupan air putih hangat cukup (minimal 1 gelas besar) untuk mencegah lemas akibat dehidrasi.",
        "Redupkan pencahayaan ruangan dan istirahatkan mata sejenak dari radiasi layar handphone.",
        "Konsumsi makanan kaya zat besi (telur, sayuran hijau, daging) untuk membantu stamina tubuh."
      ],
      sweetNote: "Rebahan yang nyaman ya bidadariku, jangan paksain mikir berat-berat hari ini. Pejamkan mata, ayang temenin dan doain mimpi indah buat kamu~ 🌙✨💤"
    },
    happy: {
      name: "Lagi Semangat & Happy",
      emoji: "🥰",
      color: "tosca",
      solutions: [
        "Salurkan mood ceria ini untuk hobi favorit, jalan-jalan santai, atau ngobrol seru bareng ayang.",
        "Tetap jaga pola makan teratur dan jangan lupa minum air putih yang cukup.",
        "Abadikan senyuman manismu hari ini dengan foto selfie buat ayang simpan di galeri memori!"
      ],
      sweetNote: "Seneng banget liat kesayanganku lagi sebahagia dan seceria ini! Senyum manismu itu kebahagiaan terbesar buat ayang. Tetap jadi gadis paling manis dan selalu bahagia ya sayangku! 🌸✨💖"
    },
    bloated: {
      name: "Perut Kembung",
      emoji: "🎈",
      color: "purple",
      solutions: [
        "Minum air putih hangat sedikit demi sedikit secara perlahan (jangan langsung banyak).",
        "Lakukan jalan santai ringan di dalam kamar selama 5-10 menit untuk melancarkan gas di pencernaan.",
        "Hindari minuman berkarbonasi/soda dan kurangi makanan yang terlalu berminyak atau asin.",
        "Seduh teh jahe atau teh peppermint hangat untuk meredakan rasa begah di lambung."
      ],
      sweetNote: "Perutnya lagi begah ya sayang? Duduk atau rebahan dengan posisi kepala agak tinggi yaa. Minum air hangat pelan-pelan, semoga lekas enteng dan nyaman kembali ya kesayangan ayang! 🍵🌸"
    }
  };

  function getIndoTimestamp() {
    const now = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    const yearNum = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    return {
      full: `${dayName}, ${dateNum} ${monthName} ${yearNum} • ${hours}:${mins} WIB`,
      short: `${dateNum} ${monthName.slice(0, 3)} ${hours}:${mins}`,
      dateOnly: `${dateNum} ${monthName} ${yearNum}`
    };
  }

  function displaySymptomSolution(symKey, timestampStr) {
    const data = SYMPTOM_DATA[symKey];
    if (!data || !solutionBox) return;

    if (solutionBadgeIcon) solutionBadgeIcon.textContent = data.emoji;
    if (solutionTitleText) solutionTitleText.textContent = `Kondisi: ${data.name}`;
    if (solutionTimestampText) solutionTimestampText.textContent = `🕒 ${timestampStr}`;

    if (solutionAdviceList) {
      solutionAdviceList.innerHTML = data.solutions.map(sol => `
        <li class="advice-item">
          <span class="advice-check">✨</span>
          <span class="advice-txt">${sol}</span>
        </li>
      `).join("");
    }

    if (solutionSweetQuote) {
      solutionSweetQuote.innerHTML = `
        <div class="quote-avatar">🧸</div>
        <div class="quote-content">
          <strong>Pesan Perhatian dari Ayang:</strong>
          <p>"${data.sweetNote}"</p>
        </div>
      `;
    }

    solutionBox.style.display = "block";
    solutionBox.classList.add("solution-card-appear");
    setTimeout(() => solutionBox.classList.remove("solution-card-appear"), 600);
  }

  function autoCreateStickyNote(symKey, timeObj) {
    const data = SYMPTOM_DATA[symKey];
    if (!data) return;

    let notes = [];
    try {
      const savedStr = localStorage.getItem("bday_user_notes");
      if (savedStr) notes = JSON.parse(savedStr);
    } catch(e) { notes = []; }

    const noteContent = `🕒 Waktu Dicatat: ${timeObj.full}\n\n💡 Solusi & Saran dari Ayang:\n` +
      data.solutions.map((s, idx) => `${idx + 1}. ${s}`).join("\n") +
      `\n\n🧸 Pesan Ayang:\n"${data.sweetNote}"`;

    const newNote = {
      id: "note_sym_" + Date.now(),
      isPeriod: true,
      title: `${data.emoji} Catatan Kondisi: ${data.name}`,
      content: noteContent,
      color: data.color || "pink",
      date: timeObj.short
    };

    notes.unshift(newNote);
    localStorage.setItem("bday_user_notes", JSON.stringify(notes));

    // Dispatch event so Sticky Notes UI in Subtab 3 re-renders in real-time
    window.dispatchEvent(new Event("notesUpdated"));
  }

  function syncPeriodCalculationToNotes(openNotesTab = false) {
    const lastDateVal = lastDateInput.value;
    const cycleLenVal = parseInt(cycleLenInput.value) || 90;
    const durationVal = parseInt(durationInput.value) || 6;

    if (!lastDateVal) return;

    const lastParts = lastDateVal.split("-");
    if (lastParts.length !== 3) return;
    const lastDateObj = new Date(parseInt(lastParts[0]), parseInt(lastParts[1]) - 1, parseInt(lastParts[2]));

    // Next Period Date
    const nextDateObj = new Date(lastDateObj);
    nextDateObj.setDate(nextDateObj.getDate() + cycleLenVal);
    const ny = nextDateObj.getFullYear();
    const nm = String(nextDateObj.getMonth() + 1).padStart(2, "0");
    const nd = String(nextDateObj.getDate()).padStart(2, "0");
    const nextDateFormatted = formatIndoDate(`${ny}-${nm}-${nd}`);

    // Ovulation Date (approx cycleLen - 14 days)
    const ovulDateObj = new Date(lastDateObj);
    ovulDateObj.setDate(ovulDateObj.getDate() + (cycleLenVal - 14));
    const oy = ovulDateObj.getFullYear();
    const om = String(ovulDateObj.getMonth() + 1).padStart(2, "0");
    const od = String(ovulDateObj.getDate()).padStart(2, "0");
    const ovulFormatted = formatIndoDate(`${oy}-${om}-${od}`);

    // Countdown & Days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = nextDateObj - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let countdownStr = "";
    if (daysLeft > 0) {
      const approxMonths = (daysLeft / 30).toFixed(1);
      countdownStr = `${daysLeft} Hari Lagi (~${approxMonths} Bulan Lagi)`;
    } else if (daysLeft === 0) {
      countdownStr = "Hari Ini (Perkiraan Hari Pertama Mens)! 🌸";
    } else {
      countdownStr = `Sudah lewat ${Math.abs(daysLeft)} hari dari perkiraan`;
    }

    // 3 Next Forecasts
    let forecasts = [];
    for (let i = 1; i <= 3; i++) {
      const fDate = new Date(lastDateObj);
      fDate.setDate(fDate.getDate() + (cycleLenVal * i));
      const fy = fDate.getFullYear();
      const fm = String(fDate.getMonth() + 1).padStart(2, "0");
      const fd = String(fDate.getDate()).padStart(2, "0");
      forecasts.push(`${i}. ${formatIndoDate(`${fy}-${fm}-${fd}`)}`);
    }

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]}`;
    const timeFormatted = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const noteContent = `🌸 SIKLUS KHUSUS 3 BULANAN (BAWAAN IBU TERCINTA 💕)

📅 Tanggal Mens Terakhir: ${formatIndoDate(lastDateVal)}
⏳ Panjang Siklus: ${cycleLenVal} Hari (3 Bulan Sekali)
⏳ Durasi Mens: ${durationVal} Hari

🔮 Prediksi Mens Berikutnya:
👉 ${nextDateFormatted}
⏳ Hitung Mundur: ${countdownStr}

✨ Perkiraan Masa Subur (Ovulasi):
👉 ${ovulFormatted}

📋 3 Jadwal Mens Mendatang Sepanjang Tahun:
${forecasts.join("\n")}

🧸 Pesan Perhatian dari Ayang:
"Kapanpun perut kamu kram atau lagi gak nyaman pas mens, langsung kabarin aku ya sayang! Istirahat yang cukup, jangan capek-capek, aku selalu ada buat kamu~ 💖"`;

    let notes = [];
    try {
      const saved = localStorage.getItem("bday_user_notes");
      if (saved) notes = JSON.parse(saved);
    } catch(e) { notes = []; }

    const existingIdx = notes.findIndex(n => n.id === "note_period_calc" || n.isPeriodSummary);

    const periodNoteObj = {
      id: "note_period_calc",
      isPeriod: true,
      isPeriodSummary: true,
      title: "🌸 Hasil Perhitungan Siklus Mens (3 Bulan)",
      content: noteContent,
      color: "pink",
      date: `${dateStr} • ${timeFormatted}`
    };

    if (existingIdx !== -1) {
      notes[existingIdx] = periodNoteObj;
    } else {
      notes.unshift(periodNoteObj);
    }

    localStorage.setItem("bday_user_notes", JSON.stringify(notes));
    window.dispatchEvent(new Event("notesUpdated"));

    if (openNotesTab) {
      const notesSubtabBtn = document.querySelector('.others-subtab-btn[data-subtab="subtab-notes"]');
      if (notesSubtabBtn) {
        notesSubtabBtn.click();
      }
    }
  }

  function loadRecentSymptomHistory() {
    if (!symptomHistoryWrap || !symptomHistoryList) return;
    let history = [];
    try {
      const hStr = localStorage.getItem("bday_symptom_history");
      if (hStr) history = JSON.parse(hStr);
    } catch(e) { history = []; }

    if (history.length === 0) {
      symptomHistoryWrap.style.display = "none";
      return;
    }

    symptomHistoryWrap.style.display = "block";
    symptomHistoryList.innerHTML = "";

    history.slice(0, 5).forEach(item => {
      const data = SYMPTOM_DATA[item.key];
      if (!data) return;

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "history-item-chip";
      chip.innerHTML = `<span>${data.emoji} ${data.name}</span> <small>${item.timeShort}</small>`;
      chip.addEventListener("click", () => {
        displaySymptomSolution(item.key, item.timeFull);
        try { playKeySound(600); } catch(e) {}
      });
      symptomHistoryList.appendChild(chip);
    });
  }

  function saveSymptomHistory(symKey, timeObj) {
    let history = [];
    try {
      const hStr = localStorage.getItem("bday_symptom_history");
      if (hStr) history = JSON.parse(hStr);
    } catch(e) { history = []; }

    history.unshift({
      key: symKey,
      timeFull: timeObj.full,
      timeShort: timeObj.short,
      timestamp: Date.now()
    });

    localStorage.setItem("bday_symptom_history", JSON.stringify(history.slice(0, 10)));
    loadRecentSymptomHistory();
  }

  // Pre-load history
  loadRecentSymptomHistory();

  // Highlight previously chosen symptom chips
  symptomChips.forEach(chip => {
    const s = chip.getAttribute("data-symptom");
    if (periodData.symptoms && periodData.symptoms.includes(s)) {
      chip.classList.add("selected");
    }

    chip.addEventListener("click", () => {
      const timeObj = getIndoTimestamp();
      chip.classList.add("selected");

      if (!periodData.symptoms) periodData.symptoms = [];
      if (!periodData.symptoms.includes(s)) periodData.symptoms.push(s);

      localStorage.setItem("bday_period_tracker", JSON.stringify(periodData));

      // 1. Display immediate solution advice
      displaySymptomSolution(s, timeObj.full);

      // 2. Automatically create sticky note in Notes Cantik
      autoCreateStickyNote(s, timeObj);

      // 3. Save to recent history
      saveSymptomHistory(s, timeObj);

      if (symptomStatusMsg) {
        symptomStatusMsg.innerHTML = `✨ <b>${SYMPTOM_DATA[s] ? SYMPTOM_DATA[s].name : s}</b> tercatat pada <b>${timeObj.short}</b> & dibuatkan Sticky Note otomatis! 💕`;
        setTimeout(() => { symptomStatusMsg.innerHTML = ""; }, 4000);
      }

      try { playKeySound(720); } catch(e) {}
    });
  });

  function renderPeriod() {
    const lastDateVal = lastDateInput.value;
    const cycleLenVal = parseInt(cycleLenInput.value) || 90;
    const durationVal = parseInt(durationInput.value) || 6;

    if (!lastDateVal) {
      nextDateText.textContent = "Pilih tanggal mens terakhir dulu ya sayang~ 🌸";
      countdownText.textContent = "Perkiraan tanggal berikutnya akan muncul di sini";
      if (forecastCardsGrid) forecastCardsGrid.innerHTML = "";
      return;
    }

    const parts = lastDateVal.split("-");
    const lastDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    lastDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;

    // Calculate next period date (advance by cycleLenVal until in future)
    let nextPeriod = new Date(lastDate);
    while (nextPeriod <= today) {
      nextPeriod.setDate(nextPeriod.getDate() + cycleLenVal);
    }

    const daysUntilNext = Math.round((nextPeriod - today) / msPerDay);

    // Calculate current cycle start & current cycle day
    let currentCycleStart = new Date(nextPeriod);
    currentCycleStart.setDate(currentCycleStart.getDate() - cycleLenVal);
    let cycleDay = Math.round((today - currentCycleStart) / msPerDay) + 1;
    if (cycleDay < 1) cycleDay = 1;
    if (cycleDay > cycleLenVal) cycleDay = cycleLenVal;

    // Ovulation: approximately 14 days before the NEXT period (luteal phase is constant)
    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Dynamic Phases for ~90-day (3-month) cycle
    let phaseName = "";
    let phaseDesc = "";
    let phaseIcon = "🌸";
    let careMsg = "";

    if (cycleDay <= durationVal) {
      phaseName = "Fase Menstruasi (Hari " + cycleDay + ")";
      phaseDesc = "Fase menstruasi aktif. Istirahat yang banyak, hindari aktivitas berat ya sayang!";
      phaseIcon = "🩸";
      careMsg = "Lagi hari-hari mens ya sayang? Jangan capek-capek yaa, banyak minum air hangat. Kalau perut kram kabarin aku, aku siap beliin makanan kesukaanmu & nemenin kamu seharian! 🧸🍫💖";
    } else if (today < fertileStart) {
      // Extended follicular & peaceful recovery phase
      phaseName = "Fase Pemulihan & Energi Rileks (Hari " + cycleDay + ")";
      phaseDesc = "Siklus panjang 3 bulananmu lagi di fase pemulihan tenang & stabil.";
      phaseIcon = "🌱";
      careMsg = "Tubuhmu lagi di fase tenang dan rileks nih sayang! Energi tubuh terjaga optimal, nikmati hari-harimu dengan ceria, aku selalu dukung dan bangga sama kamu~ ☀️✨";
    } else if (today <= fertileEnd) {
      phaseName = "Masa Subur / Ovulasi (Hari " + cycleDay + ")";
      phaseDesc = "Puncak hormon estrogen aktif, kulit glowing dan mood sangat ceria!";
      phaseIcon = "🌸";
      careMsg = "Tuan Putri lagi di puncak pesona & energi paling ceria nih! Senyum terus ya bidadari tercantikku, aura manismu terpancar banget~ 🌸💖";
    } else {
      // Luteal / PMS phase (approaching next 3-month period)
      phaseName = "Fase Luteal / Menjelang Mens (PMS)";
      phaseDesc = "Menjelang siklus 3 bulananmu berikutnya. Mood mungkin agak sensitif & butuh disayang.";
      phaseIcon = "🌙";
      careMsg = "Udah mulai mendekati jadwal mens 3 bulananmu nih sayang~ Kalau tiba-tiba ngerasa lelah, perut kembung, pegal, atau pengen ngemil manis-manis, langsung bilang aku yaa. Aku siap manjain & peluk kamu selalu! 🍫💕";
    }

    function toYmd(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    const nextYmd = toYmd(nextPeriod);
    const ovuYmd = toYmd(ovulationDate);
    const fertileStartYmd = toYmd(fertileStart);
    const fertileEndYmd = toYmd(fertileEnd);

    // Update UI elements
    statusIcon.textContent = phaseIcon;
    const cycleDescLabel = (cycleLenVal === 90) ? "3 Bulan (90 Hari)" : `${cycleLenVal} Hari`;
    cycleDayText.textContent = `Hari ke-${cycleDay} dari Siklus ${cycleDescLabel}`;
    nextDateText.textContent = formatIndoDate(nextYmd);

    // Format human-friendly countdown for long 3-month cycle
    if (daysUntilNext === 0) {
      countdownText.innerHTML = "🩸 <b>Perkiraan mulai HARI INI!</b> Siapkan pembalut & jangan capek-capek ya sayang~";
    } else if (daysUntilNext === 1) {
      countdownText.innerHTML = "🌸 <b>Perkiraan BESOK!</b> Jaga kondisi dan istirahat yang cukup ya bidadariku~";
    } else if (daysUntilNext <= 14) {
      countdownText.innerHTML = `⚠️ <b>Tinggal ${daysUntilNext} hari lagi!</b> (${phaseName}) — Waktunya siap-siap ya sayang 💕`;
    } else {
      const approxMonths = Math.floor(daysUntilNext / 30);
      const remainingDays = daysUntilNext % 30;
      let monthStr = "";
      if (approxMonths > 0) {
        monthStr = `${approxMonths} bulan ${remainingDays > 0 ? remainingDays + " hari" : ""}`;
      } else {
        monthStr = `${daysUntilNext} hari`;
      }
      countdownText.textContent = `Perkiraan dalam ${monthStr} lagi (${daysUntilNext} hari) • ${phaseName}`;
    }

    valNextPeriod.textContent = formatIndoDate(nextYmd);
    valOvulation.textContent = `${formatIndoDateShort(fertileStartYmd)} - ${formatIndoDateShort(fertileEndYmd)}`;
    valCurrentPhase.textContent = phaseName;
    valPhaseDesc.textContent = phaseDesc;
    if (careMessage) careMessage.textContent = `"${careMsg}"`;

    // Render 3 Upcoming Period Forecast Cards
    if (forecastCardsGrid) {
      forecastCardsGrid.innerHTML = "";
      for (let i = 1; i <= 3; i++) {
        const fDate = new Date(nextPeriod);
        fDate.setDate(fDate.getDate() + (cycleLenVal * (i - 1)));
        const fYmd = toYmd(fDate);
        const fDays = Math.round((fDate - today) / msPerDay);
        
        let fDistStr = "";
        if (fDays === 0) {
          fDistStr = "Hari ini";
        } else if (fDays < 30) {
          fDistStr = `${fDays} hari lagi`;
        } else {
          const fM = Math.round(fDays / 30);
          fDistStr = `~${fM} bulan lagi (${fDays} hari)`;
        }

        const card = document.createElement("div");
        card.className = "forecast-card" + (i === 1 ? " next-period-highlight" : "");
        card.innerHTML = `
          <div class="forecast-card-top">
            <span class="forecast-badge">${i === 1 ? "⭐ Periode Terdekat" : `Periode ke-${i}`}</span>
            <span class="forecast-dist">${fDistStr}</span>
          </div>
          <div class="forecast-date">${formatIndoDate(fYmd)}</div>
          <small class="forecast-note">Perkiraan siklus ke-${i} Tuan Putri</small>
        `;
        forecastCardsGrid.appendChild(card);
      }
    }
  }

  function savePeriodData() {
    periodData.lastDate = lastDateInput.value;
    periodData.cycleLen = parseInt(cycleLenInput.value) || 90;
    periodData.duration = parseInt(durationInput.value) || 6;

    localStorage.setItem("bday_period_tracker", JSON.stringify(periodData));
    renderPeriod();
    syncPeriodCalculationToNotes(false);
    try { playKeySound(700); } catch(e) {}

    saveBtn.innerHTML = "<span>✅ Siklus 3 Bulan Disimpan & Dicatat ke Notes! 💕</span>";
    setTimeout(() => {
      saveBtn.innerHTML = "<span>✨ Hitung & Simpan Siklus ✨</span>";
    }, 2500);
  }

  const syncPeriodToNotesBtn = document.getElementById("syncPeriodToNotesBtn");
  if (syncPeriodToNotesBtn) {
    syncPeriodToNotesBtn.addEventListener("click", () => {
      savePeriodData();
      syncPeriodCalculationToNotes(true);
      try { playKeySound(880); } catch(e) {}
    });
  }

  saveBtn.addEventListener("click", savePeriodData);
  lastDateInput.addEventListener("change", savePeriodData);

  renderPeriod();
  syncPeriodCalculationToNotes(false);
}

// ------------------------------------------
// 2. JIRA TASK TIMELINE LOGIC
// ------------------------------------------
function initJiraTaskTimeline() {
  const form = document.getElementById("jiraTaskForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskCategoryInput = document.getElementById("taskCategory");
  const taskStartDateInput = document.getElementById("taskStartDate");
  const taskDueDateInput = document.getElementById("taskDueDate");
  const taskPriorityInput = document.getElementById("taskPriority");
  const taskStatusInput = document.getElementById("taskStatus");

  const timelineList = document.getElementById("jiraTimelineList");
  const alertBanner = document.getElementById("jiraAlertBanner");
  const alertText = document.getElementById("jiraAlertText");
  const taskCounter = document.getElementById("jiraTaskCounter");

  const btnViewTimeline = document.getElementById("btnViewTimeline");
  const btnViewKanban = document.getElementById("btnViewKanban");
  const timelineView = document.getElementById("jiraTimelineView");
  const kanbanView = document.getElementById("jiraKanbanView");

  const kanbanListTodo = document.getElementById("kanbanListTodo");
  const kanbanListProgress = document.getElementById("kanbanListProgress");
  const kanbanListDone = document.getElementById("kanbanListDone");
  const countTodo = document.getElementById("countTodo");
  const countProgress = document.getElementById("countProgress");
  const countDone = document.getElementById("countDone");

  if (!form || !timelineList) return;

  // Default dates in form: Today & 4 days ahead
  const todayObj = new Date();
  const formatYmd = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const dueObj = new Date(todayObj);
  dueObj.setDate(dueObj.getDate() + 4);

  taskStartDateInput.value = formatYmd(todayObj);
  taskDueDateInput.value = formatYmd(dueObj);

  // Load saved tasks
  const savedTasksStr = localStorage.getItem("bday_jira_tasks");
  let tasks = [];

  if (savedTasksStr) {
    try {
      tasks = JSON.parse(savedTasksStr);
    } catch(e) { tasks = []; }
  }

  // Preload friendly starter tasks if empty
  if (!tasks || tasks.length === 0) {
    tasks = [
      {
        id: "task_" + Date.now() + "_1",
        title: "Siap-siap Rayakan Ulang Tahun Bareng Ayang 🎂",
        category: "Pribadi 🎀",
        startDate: formatYmd(todayObj),
        dueDate: formatYmd(dueObj),
        priority: "high",
        status: "in_progress"
      },
      {
        id: "task_" + Date.now() + "_2",
        title: "Makan Enak W.D.B & Slice Cake di Wheels 🍽️",
        category: "Pribadi 🎀",
        startDate: formatYmd(todayObj),
        dueDate: formatYmd(dueObj),
        priority: "medium",
        status: "todo"
      }
    ];
    localStorage.setItem("bday_jira_tasks", JSON.stringify(tasks));
  }

  function saveAndRender() {
    localStorage.setItem("bday_jira_tasks", JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const msPerDay = 1000 * 60 * 60 * 24;

    taskCounter.textContent = `Total: ${tasks.length} Tugas`;

    // Check for urgent reminders (due today or within 2 days, not done)
    const urgentTasks = tasks.filter(t => {
      if (t.status === "done") return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((due - now) / msPerDay);
      return daysLeft <= 2;
    });

    if (urgentTasks.length > 0) {
      alertBanner.style.display = "flex";
      alertText.textContent = `Ada ${urgentTasks.length} tugas mendekati deadline ("${urgentTasks[0].title}")! Semangat ya sayang, kamu pasti bisa! 💪💖`;
    } else {
      alertBanner.style.display = "none";
    }

    // 1. Render Timeline (Gantt) View
    timelineList.innerHTML = "";
    if (tasks.length === 0) {
      timelineList.innerHTML = '<div style="text-align:center; padding: 24px; color: #94a3b8; font-size: 0.85rem;">Belum ada tugas di timeline. Tambahkan tugas pertamamu di atas ya sayang! 🌸</div>';
    } else {
      tasks.forEach(task => {
        const start = new Date(task.startDate);
        start.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);

        const totalSpan = Math.max(1, (due - start) / msPerDay);
        const elapsed = Math.max(0, (now - start) / msPerDay);
        let progress = Math.min(100, Math.round((elapsed / totalSpan) * 100));
        if (task.status === "done") progress = 100;

        const daysLeft = Math.ceil((due - now) / msPerDay);

        let dueBadgeClass = "due-badge-normal";
        let dueBadgeText = `⏳ Sisa ${daysLeft} hari`;
        let fillClass = "";

        if (task.status === "done") {
          dueBadgeClass = "due-badge-done";
          dueBadgeText = "✅ Selesai!";
          fillClass = "fill-done";
        } else if (daysLeft < 0) {
          dueBadgeClass = "due-badge-late";
          dueBadgeText = `🚨 Terlambat ${Math.abs(daysLeft)} hari!`;
          fillClass = "fill-late";
        } else if (daysLeft === 0) {
          dueBadgeClass = "due-badge-today";
          dueBadgeText = "⚠️ Deadline Hari Ini!";
          fillClass = "fill-late";
        } else if (daysLeft === 1) {
          dueBadgeClass = "due-badge-today";
          dueBadgeText = "⚡ Deadline Besok!";
        }

        const card = document.createElement("div");
        card.className = `timeline-task-card priority-${task.priority} ${task.status === 'done' ? 'task-card-done' : ''}`;
        card.innerHTML = `
          <div class="task-top-row">
            <div class="task-meta-left">
              <span class="task-badge-cat">${task.category}</span>
              <span class="task-badge-priority priority-badge-${task.priority}">
                ${task.priority === 'high' ? '🔴 Urgent' : task.priority === 'medium' ? '🟡 Sedang' : '🟢 Santai'}
              </span>
            </div>
            <span class="task-due-badge ${dueBadgeClass}">${dueBadgeText}</span>
          </div>

          <h5 class="task-title-text">${task.title}</h5>

          <div class="task-timeline-bar-wrap">
            <div class="timeline-dates-row">
              <span>Mulai: ${formatIndoDateShort(task.startDate)}</span>
              <span>Deadline: ${formatIndoDateShort(task.dueDate)}</span>
            </div>
            <div class="timeline-progress-track">
              <div class="timeline-progress-fill ${fillClass}" style="width: ${progress}%"></div>
            </div>
          </div>

          <div class="task-bottom-row">
            <div class="task-status-pills">
              <button type="button" class="task-status-btn ${task.status === 'todo' ? 'active-status' : ''}" data-status="todo">To Do</button>
              <button type="button" class="task-status-btn ${task.status === 'in_progress' ? 'active-status' : ''}" data-status="in_progress">In Progress</button>
              <button type="button" class="task-status-btn ${task.status === 'done' ? 'active-status' : ''}" data-status="done">Done ✅</button>
            </div>
            <button type="button" class="task-delete-btn" title="Hapus Tugas">🗑️</button>
          </div>
        `;

        // Status buttons
        const statusBtns = card.querySelectorAll(".task-status-btn");
        statusBtns.forEach(b => {
          b.addEventListener("click", () => {
            const newStatus = b.getAttribute("data-status");
            task.status = newStatus;
            saveAndRender();
            try { playKeySound(newStatus === 'done' ? 880 : 540); } catch(e) {}
            if (newStatus === 'done') {
              try { triggerConfettiStorm(); } catch(e) {}
            }
          });
        });

        // Delete button
        const delBtn = card.querySelector(".task-delete-btn");
        delBtn.addEventListener("click", () => {
          if (confirm(`Hapus tugas "${task.title}"?`)) {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
            try { playKeySound(300); } catch(e) {}
          }
        });

        timelineList.appendChild(card);
      });
    }

    // 2. Render Kanban View
    kanbanListTodo.innerHTML = "";
    kanbanListProgress.innerHTML = "";
    kanbanListDone.innerHTML = "";

    const todoTasks = tasks.filter(t => t.status === "todo");
    const progressTasks = tasks.filter(t => t.status === "in_progress");
    const doneTasks = tasks.filter(t => t.status === "done");

    countTodo.textContent = todoTasks.length;
    countProgress.textContent = progressTasks.length;
    countDone.textContent = doneTasks.length;

    function createKanbanCard(task) {
      const el = document.createElement("div");
      el.className = "kanban-card";
      el.innerHTML = `
        <div class="kanban-card-meta">
          <span class="task-badge-cat" style="font-size:0.6rem;">${task.category}</span>
          <small>${formatIndoDateShort(task.dueDate)}</small>
        </div>
        <div class="kanban-card-title">${task.title}</div>
        <div class="kanban-card-actions">
          ${task.status !== 'todo' ? '<button class="kanban-action-btn btn-to-todo" title="Pindah ke To Do">⬅️ To Do</button>' : ''}
          ${task.status !== 'in_progress' ? '<button class="kanban-action-btn btn-to-prog" title="Pindah ke In Progress">⏳ Mulai</button>' : ''}
          ${task.status !== 'done' ? '<button class="kanban-action-btn btn-to-done" title="Tandai Selesai">✅ Done</button>' : ''}
        </div>
      `;

      const btnTodo = el.querySelector(".btn-to-todo");
      if (btnTodo) btnTodo.addEventListener("click", () => { task.status = "todo"; saveAndRender(); });

      const btnProg = el.querySelector(".btn-to-prog");
      if (btnProg) btnProg.addEventListener("click", () => { task.status = "in_progress"; saveAndRender(); });

      const btnDone = el.querySelector(".btn-to-done");
      if (btnDone) btnDone.addEventListener("click", () => { task.status = "done"; saveAndRender(); triggerConfettiStorm(); });

      return el;
    }

    todoTasks.forEach(t => kanbanListTodo.appendChild(createKanbanCard(t)));
    progressTasks.forEach(t => kanbanListProgress.appendChild(createKanbanCard(t)));
    doneTasks.forEach(t => kanbanListDone.appendChild(createKanbanCard(t)));
  }

  // Switch between Timeline and Kanban views
  btnViewTimeline.addEventListener("click", () => {
    btnViewTimeline.classList.add("active");
    btnViewKanban.classList.remove("active");
    timelineView.style.display = "block";
    kanbanView.style.display = "none";
    try { playKeySound(500); } catch(e) {}
  });

  btnViewKanban.addEventListener("click", () => {
    btnViewKanban.classList.add("active");
    btnViewTimeline.classList.remove("active");
    timelineView.style.display = "none";
    kanbanView.style.display = "block";
    try { playKeySound(500); } catch(e) {}
  });

  // Handle new task submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (!title) return;

    const newTask = {
      id: "task_" + Date.now(),
      title: title,
      category: taskCategoryInput.value,
      startDate: taskStartDateInput.value,
      dueDate: taskDueDateInput.value,
      priority: taskPriorityInput.value,
      status: taskStatusInput.value
    };

    tasks.unshift(newTask);
    saveAndRender();
    taskTitleInput.value = "";
    try { playSuccessFanfare(); } catch(e) {}
  });

  renderTasks();
}

// ------------------------------------------
// 3. STICKY NOTES CANTIK LOGIC
// ------------------------------------------
function initNotesCantik() {
  const titleInput = document.getElementById("noteTitleInput");
  const contentInput = document.getElementById("noteContentInput");
  const addBtn = document.getElementById("addNoteBtn");
  const gridWall = document.getElementById("notesGridWall");
  const periodShortcutBtn = document.getElementById("notesPeriodShortcutBtn");

  if (!addBtn || !gridWall) return;

  const savedNotesStr = localStorage.getItem("bday_user_notes");
  let notes = [];

  if (savedNotesStr) {
    try {
      notes = JSON.parse(savedNotesStr);
    } catch(e) { notes = []; }
  }

  // Preload cute starter notes if empty
  if (!notes || notes.length === 0) {
    notes = [
      {
        id: "note_1",
        title: "Pesan Spesial dari Ayang 💖",
        content: "Semangat terus ya kesayanganku! Jangan pernah lupa kalau kamu itu orang paling hebat, paling manis, dan selalu jadi juara di hatiku~ 🥰✨",
        color: "pink",
        date: "Hari Ini"
      },
      {
        id: "note_2",
        title: "Daftar Makanan Kesukaan 🍰",
        content: "1. W.D.B Wheels 🍲\n2. Slice Cake manis 🍰\n3. Es krim & coklat kesayangan 🍦",
        color: "tosca",
        date: "Hari Ini"
      }
    ];
    localStorage.setItem("bday_user_notes", JSON.stringify(notes));
  }

  function saveAndRenderNotes() {
    localStorage.setItem("bday_user_notes", JSON.stringify(notes));
    renderNotes();
  }

  function renderNotes() {
    gridWall.innerHTML = "";
    if (notes.length === 0) {
      gridWall.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: #94a3b8; font-size: 0.85rem;">Papan catatan masih kosong. Tulis ide atau catatan lucumu di atas ya sayang! 📌</div>';
      return;
    }

    notes.forEach(note => {
      const isPeriodNote = note.isPeriod || (note.id && (note.id.startsWith("note_sym_") || note.id === "note_period_calc"));
      const card = document.createElement("div");
      card.className = `sticky-note-card note-${note.color || 'pink'} ${isPeriodNote ? 'note-period-linked' : ''}`;
      card.innerHTML = `
        <span class="note-pin-decor">📌</span>
        ${isPeriodNote ? '<span class="note-period-badge">🌸 Perhitungan Mens</span>' : ''}
        <div class="note-header-row">
          <h5 class="note-title-txt">${note.title || 'Catatan Cantik'}</h5>
          <button type="button" class="note-del-btn" title="Hapus Catatan">🗑️</button>
        </div>
        <p class="note-body-txt">${note.content}</p>
        <div class="note-footer-row">
          <span>📅 ${note.date || 'Tersimpan'}</span>
          ${isPeriodNote ? '<button type="button" class="note-jump-period-btn" title="Buka Siklus di Perhitungan Mens">🌸 Buka Siklus</button>' : '<span>🎀 Chiikawa Note</span>'}
        </div>
      `;

      const delBtn = card.querySelector(".note-del-btn");
      delBtn.addEventListener("click", () => {
        if (confirm("Hapus catatan ini?")) {
          notes = notes.filter(n => n.id !== note.id);
          saveAndRenderNotes();
          try { playKeySound(320); } catch(e) {}
        }
      });

      const jumpBtn = card.querySelector(".note-jump-period-btn");
      if (jumpBtn) {
        jumpBtn.addEventListener("click", () => {
          const periodBtn = document.querySelector('.others-subtab-btn[data-subtab="subtab-period"]');
          if (periodBtn) {
            periodBtn.click();
            try { playKeySound(600); } catch(e) {}
          }
        });
      }

      gridWall.appendChild(card);
    });
  }

  if (periodShortcutBtn) {
    periodShortcutBtn.addEventListener("click", () => {
      const periodSubtabBtn = document.querySelector('.others-subtab-btn[data-subtab="subtab-period"]');
      if (periodSubtabBtn) {
        periodSubtabBtn.click();
        try { playKeySound(620); } catch(e) {}
      }
    });
  }

  addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!content && !title) {
      alert("Tulis dulu isi atau judul catatannya ya sayang~ 🌸");
      return;
    }

    const selectedColorRadio = document.querySelector('input[name="noteColor"]:checked');
    const color = selectedColorRadio ? selectedColorRadio.value : "pink";

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][now.getMonth()]}`;

    const newNote = {
      id: "note_" + Date.now(),
      title: title || "Catatan Manis 🌸",
      content: content,
      color: color,
      date: dateFormatted
    };

    notes.unshift(newNote);
    saveAndRenderNotes();

    titleInput.value = "";
    contentInput.value = "";
    try { playKeySound(750); } catch(e) {}
  });

  // Listen for auto-generated notes from period tracker
  window.addEventListener("notesUpdated", () => {
    try {
      const freshStr = localStorage.getItem("bday_user_notes");
      if (freshStr) notes = JSON.parse(freshStr);
    } catch(e) {}
    renderNotes();
  });

  renderNotes();
}

// ==========================================
// 4. CELENGAN IMPIAN & TARGET NABUNG (WISHLIST & ESTIMATOR)
// ==========================================
function initSavingsTracker() {
  const container = document.getElementById("subtab-savings");
  if (!container) return;

  const STORAGE_KEY = "bday_savings_data";
  const ACTIVE_ID_KEY = "bday_savings_active_id";

  const DEFAULT_SAVINGS_GOALS = [
    {
      id: "goal_evita_1",
      name: "Tas Lucu Impian Evita",
      targetPrice: 3500000,
      savedAmount: 500000,
      planType: "daily",
      planAmount: 25000,
      photoUrl: "",
      emoji: "👜",
      createdAt: "2026-11-08",
      history: [
        {
          id: "dep_init_1",
          amount: 500000,
          date: "8 Nov 2026, 10:00",
          note: "Tabungan awal celengan ayang ✨"
        }
      ]
    },
    {
      id: "goal_evita_2",
      name: "iPad Air Pink Lucu 🌸",
      targetPrice: 11500000,
      savedAmount: 2500000,
      planType: "daily",
      planAmount: 50000,
      photoUrl: "",
      emoji: "📱",
      createdAt: "2026-11-08",
      history: [
        {
          id: "dep_init_2",
          amount: 2500000,
          date: "8 Nov 2026, 10:00",
          note: "Modal awal nabung iPad ayang 💕"
        }
      ]
    }
  ];

  // Load goals from localStorage
  let goals = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      goals = JSON.parse(raw);
    }
  } catch (e) {
    goals = [];
  }

  if (!goals || !Array.isArray(goals) || goals.length === 0) {
    goals = JSON.parse(JSON.stringify(DEFAULT_SAVINGS_GOALS));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {}
  }

  let activeGoalId = localStorage.getItem(ACTIVE_ID_KEY);
  if (!activeGoalId || !goals.some(g => g.id === activeGoalId)) {
    activeGoalId = goals[0] ? goals[0].id : null;
  }

  // DOM Elements
  const addItemBtn = document.getElementById("savingsAddItemBtn");
  const formCard = document.getElementById("savingsFormCard");
  const formTitle = document.getElementById("savingsFormTitle");
  const formCloseBtn = document.getElementById("savingsFormCloseBtn");
  const goalForm = document.getElementById("savingsGoalForm");
  const formGoalId = document.getElementById("savingsGoalId");
  const formItemName = document.getElementById("savingsItemName");
  const formItemPrice = document.getElementById("savingsItemPrice");
  const formInitialAmount = document.getElementById("savingsInitialAmount");
  const formPlanType = document.getElementById("savingsPlanType");
  const formPlanAmount = document.getElementById("savingsPlanAmount");
  const formCancelBtn = document.getElementById("savingsCancelBtn");

  // Photo / Emoji Picker in Form
  const photoPreviewEmoji = document.getElementById("photoPreviewEmoji");
  const photoPreviewImg = document.getElementById("photoPreviewImg");
  const photoFileInput = document.getElementById("savingsPhotoFileInput");
  const uploadPhotoBtn = document.getElementById("savingsUploadPhotoBtn");
  const emojiPresetsWrap = document.getElementById("savingsEmojiPresets");

  // Tabs & Showcase
  const itemsTabs = document.getElementById("savingsItemsTabs");
  const showcaseCard = document.getElementById("savingsShowcaseCard");
  const emptyState = document.getElementById("savingsEmptyState");
  const createFirstGoalBtn = document.getElementById("createFirstGoalBtn");

  const showcasePhotoImg = document.getElementById("showcasePhotoImg");
  const showcasePhotoEmoji = document.getElementById("showcasePhotoEmoji");
  const showcaseTitle = document.getElementById("showcaseTitle");
  const showcaseStatusBadge = document.getElementById("showcaseStatusBadge");
  const showcaseTargetPrice = document.getElementById("showcaseTargetPrice");
  const showcasePlanText = document.getElementById("showcasePlanText");
  const showcaseEditBtn = document.getElementById("showcaseEditBtn");
  const showcaseDeleteBtn = document.getElementById("showcaseDeleteBtn");

  const showcaseSavedAmount = document.getElementById("showcaseSavedAmount");
  const showcasePercent = document.getElementById("showcasePercent");
  const showcaseRemainingAmount = document.getElementById("showcaseRemainingAmount");
  const showcaseProgressFill = document.getElementById("showcaseProgressFill");

  // Forecast Banner
  const forecastDaysBold = document.getElementById("forecastDaysBold");
  const forecastApproxText = document.getElementById("forecastApproxText");
  const forecastDescText = document.getElementById("forecastDescText");
  const forecastTargetDate = document.getElementById("forecastTargetDate");

  // Quick Deposit Elements
  const depositQuickPresets = document.getElementById("depositQuickPresets");
  const depositAmountInput = document.getElementById("depositAmountInput");
  const depositNoteInput = document.getElementById("depositNoteInput");
  const depositSubmitBtn = document.getElementById("depositSubmitBtn");

  // Simulation Calculator Elements
  const simRangeSlider = document.getElementById("simRangeSlider");
  const simValDisplay = document.getElementById("simValDisplay");
  const simQuickChips = document.getElementById("simQuickChips");
  const simDaysResult = document.getElementById("simDaysResult");
  const simApproxResult = document.getElementById("simApproxResult");
  const simDateResult = document.getElementById("simDateResult");
  const simRecText = document.getElementById("simRecText");

  // History Accordion Elements
  const historyToggleBtn = document.getElementById("savingsHistoryToggleBtn");
  const historyCount = document.getElementById("savingsHistoryCount");
  const historyToggleArrow = document.getElementById("historyToggleArrow");
  const historyList = document.getElementById("savingsHistoryList");

  // State for form photo / emoji
  let currentFormPhoto = "";
  let currentFormEmoji = "🛍️";

  // Helpers
  function formatMoney(num) {
    const val = Math.max(0, Math.round(Number(num) || 0));
    return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function formatFullDateIndo(d) {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatDateTimeIndo(d) {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hours}:${mins}`;
  }

  function saveGoals() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      if (activeGoalId) {
        localStorage.setItem(ACTIVE_ID_KEY, activeGoalId);
      }
    } catch (e) {
      console.warn("Storage full or error:", e);
    }
  }

  function getActiveGoal() {
    return goals.find(g => g.id === activeGoalId) || null;
  }

  function showToast(msg, icon = "🐷") {
    let toast = document.getElementById("savingsFloatingToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "savingsFloatingToast";
      toast.style.position = "fixed";
      toast.style.bottom = "28px";
      toast.style.right = "28px";
      toast.style.background = "linear-gradient(135deg, #0f172a, #1e293b)";
      toast.style.color = "#fff";
      toast.style.padding = "14px 20px";
      toast.style.borderRadius = "16px";
      toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
      toast.style.fontSize = "0.88rem";
      toast.style.fontWeight = "600";
      toast.style.zIndex = "100000";
      toast.style.display = "flex";
      toast.style.alignItems = "center";
      toast.style.gap = "10px";
      toast.style.maxWidth = "90vw";
      toast.style.transition = "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size: 1.4rem;">${icon}</span> <span>${msg}</span>`;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 3800);
  }

  // Render Tabs
  function renderTabs() {
    if (!itemsTabs) return;
    itemsTabs.innerHTML = "";

    goals.forEach(goal => {
      const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetPrice) * 100));
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `savings-item-tab-pill ${goal.id === activeGoalId ? "active" : ""}`;
      btn.dataset.goalId = goal.id;

      const iconHtml = goal.photoUrl
        ? `<img src="${goal.photoUrl}" alt="icon" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;">`
        : `<span style="font-size: 1.1rem;">${goal.emoji || "🛍️"}</span>`;

      btn.innerHTML = `
        <span class="tab-pill-icon">${iconHtml}</span>
        <span class="tab-pill-name">${goal.name}</span>
        <span class="tab-pill-pct">${pct}%</span>
      `;

      btn.addEventListener("click", () => {
        activeGoalId = goal.id;
        localStorage.setItem(ACTIVE_ID_KEY, activeGoalId);
        try { playKeySound(580); } catch(e) {}
        renderTabs();
        renderActiveGoal();
      });

      itemsTabs.appendChild(btn);
    });
  }

  // Render Active Goal Showcase
  function renderActiveGoal() {
    const goal = getActiveGoal();

    if (!goal) {
      if (showcaseCard) showcaseCard.style.display = "none";
      if (itemsTabs && itemsTabs.parentElement) itemsTabs.parentElement.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (showcaseCard) showcaseCard.style.display = "block";
    if (itemsTabs && itemsTabs.parentElement) itemsTabs.parentElement.style.display = "flex";
    if (emptyState) emptyState.style.display = "none";

    // Photo / Emoji
    if (goal.photoUrl) {
      showcasePhotoImg.src = goal.photoUrl;
      showcasePhotoImg.style.display = "block";
      showcasePhotoEmoji.style.display = "none";
    } else {
      showcasePhotoImg.style.display = "none";
      showcasePhotoEmoji.style.display = "inline-block";
      showcasePhotoEmoji.textContent = goal.emoji || "🛍️";
    }

    // Header info
    showcaseTitle.textContent = goal.name;
    showcaseTargetPrice.textContent = formatMoney(goal.targetPrice);

    const planLabel = goal.planType === "monthly" ? "bulan" : "hari";
    showcasePlanText.textContent = `Rencana: Nabung ${formatMoney(goal.planAmount)} / ${planLabel}`;

    const isCompleted = goal.savedAmount >= goal.targetPrice;
    if (isCompleted) {
      showcaseStatusBadge.textContent = "🎉 Target Tercapai! Horeee!";
      showcaseStatusBadge.style.background = "#dcfce7";
      showcaseStatusBadge.style.color = "#15803d";
      showcaseStatusBadge.style.borderColor = "#86efac";
    } else {
      showcaseStatusBadge.textContent = "Sedang Menabung 🏃‍♀️";
      showcaseStatusBadge.style.background = "#e0f2fe";
      showcaseStatusBadge.style.color = "#0369a1";
      showcaseStatusBadge.style.borderColor = "#bae6fd";
    }

    // Amounts & Progress
    const sisa = Math.max(0, goal.targetPrice - goal.savedAmount);
    const pct = Math.min(100, Math.max(0, (goal.savedAmount / goal.targetPrice) * 100));

    showcaseSavedAmount.textContent = formatMoney(goal.savedAmount);
    showcaseRemainingAmount.textContent = formatMoney(sisa);
    showcasePercent.textContent = pct.toFixed(1) + "%";
    showcaseProgressFill.style.width = pct + "%";

    // Time Estimator Banner (Perhitungan Berapa Hari Lagi Terbelinya)
    const dailyRate = goal.planType === "monthly" ? Math.max(1, goal.planAmount / 30) : Math.max(1, goal.planAmount);

    if (isCompleted) {
      forecastDaysBold.textContent = "Alhamdulillah Sudah Terbeli! 💖";
      forecastApproxText.textContent = "(Target 100%)";
      forecastDescText.innerHTML = `Horeee! Celengan untuk <b>${goal.name}</b> sudah penuh 100%! Selamat sayang, barang impian ini sudah siap langsung kamu checkout dan miliki sekarang juga! 🛍️✨`;
    } else {
      const daysNeeded = Math.ceil(sisa / dailyRate);
      const monthsApprox = (daysNeeded / 30).toFixed(1);

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysNeeded);
      const targetDateStr = formatFullDateIndo(targetDate);

      forecastDaysBold.textContent = `Tinggal ${daysNeeded} Hari Lagi!`;
      forecastApproxText.textContent = `(~${monthsApprox} Bulan)`;
      forecastDescText.innerHTML = `Dengan menabung rutin <b>${formatMoney(goal.planAmount)} / ${planLabel}</b>, barang impian ini diperkirakan siap kamu beli pada: <span class="forecast-date-highlight" id="forecastTargetDate">${targetDateStr}</span> ✨`;
    }

    // Update Simulation Calculator with current goal's sisa
    updateSimulation();

    // Render Deposit History
    renderHistory(goal);
  }

  // Update Simulation Calculator (What-If Bantuan Target Cepat)
  function updateSimulation() {
    const goal = getActiveGoal();
    if (!goal) return;

    const sisa = Math.max(0, goal.targetPrice - goal.savedAmount);
    const simRate = Number(simRangeSlider.value) || 50000;

    simValDisplay.textContent = `${formatMoney(simRate)} / hari`;

    if (sisa <= 0) {
      simDaysResult.textContent = "0 Hari (Sudah Terbeli!)";
      simApproxResult.textContent = "(Target 100%)";
      simDateResult.innerHTML = "🎉 Sudah lunas terbeli sekarang!";
      simRecText.innerHTML = "Hebat banget sayang! Celengan ini sudah berhasil terkumpul 100%! 🛍️✨";
      return;
    }

    const simDays = Math.ceil(sisa / simRate);
    const simMonths = (simDays / 30).toFixed(1);

    const simDate = new Date();
    simDate.setDate(simDate.getDate() + simDays);
    const simDateStr = formatFullDateIndo(simDate);

    simDaysResult.textContent = `${simDays} Hari Lagi`;
    simApproxResult.textContent = `(~${simMonths} Bulan)`;
    simDateResult.innerHTML = `📅 Perkiraan terbeli: <b>${simDateStr}</b>`;

    // Dynamic smart recommendation
    const rateFor30 = Math.ceil(sisa / 30 / 1000) * 1000;
    const rateFor14 = Math.ceil(sisa / 14 / 1000) * 1000;
    const rateFor7 = Math.ceil(sisa / 7 / 1000) * 1000;

    if (simDays > 30) {
      simRecText.innerHTML = `Mau kebeli lebih cepat dalam <b>30 hari (1 bulan)</b>? Cukup sisihkan <b>${formatMoney(rateFor30)} / hari</b>! 💡`;
    } else if (simDays > 14) {
      simRecText.innerHTML = `Mau ngebut dalam <b>2 minggu (14 hari)</b>? Sisihkan <b>${formatMoney(rateFor14)} / hari</b> sayang! 🚀`;
    } else if (simDays > 7) {
      simRecText.innerHTML = `Mau langsung dapat dalam <b>1 minggu (7 hari)</b>? Sisihkan <b>${formatMoney(rateFor7)} / hari</b>! ⚡`;
    } else {
      simRecText.innerHTML = `Tinggal hitungan hari! Dengan nabung <b>${formatMoney(simRate)} / hari</b>, barang impian ini segera jadi milikmu! 😍`;
    }
  }

  // Render Deposit History List
  function renderHistory(goal) {
    if (!historyList || !historyCount) return;

    const list = goal.history || [];
    historyCount.textContent = list.length;
    historyList.innerHTML = "";

    if (list.length === 0) {
      historyList.innerHTML = '<div style="text-align: center; padding: 14px; color: #94a3b8; font-size: 0.82rem;">Belum ada riwayat pengisian celengan. Yuk isi pertama kali! 🪙</div>';
      return;
    }

    list.forEach(item => {
      const row = document.createElement("div");
      row.className = "savings-history-item";
      row.innerHTML = `
        <div class="history-item-left">
          <span class="history-coin-icon">🪙</span>
          <div class="history-meta">
            <span class="history-amount">+${formatMoney(item.amount)}</span>
            <span class="history-note">${item.note || "Nabung celengan"}</span>
          </div>
        </div>
        <div class="history-item-right">
          <span class="history-date">${item.date || "-"}</span>
          <button type="button" class="btn-del-history" title="Hapus catatan riwayat ini">🗑️</button>
        </div>
      `;

      const delBtn = row.querySelector(".btn-del-history");
      delBtn.addEventListener("click", () => {
        if (confirm(`Hapus catatan riwayat nabung ${formatMoney(item.amount)} ini? Saldo celengan akan dikurangi kembali.`)) {
          goal.savedAmount = Math.max(0, goal.savedAmount - item.amount);
          goal.history = goal.history.filter(h => h.id !== item.id);
          saveGoals();
          try { playKeySound(350); } catch(e) {}
          renderTabs();
          renderActiveGoal();
          showToast(`Riwayat dihapus & saldo disesuaikan (-${formatMoney(item.amount)})`, "🗑️");
        }
      });

      historyList.appendChild(row);
    });
  }

  // Slider & Simulation Event Listeners
  if (simRangeSlider) {
    simRangeSlider.addEventListener("input", () => {
      document.querySelectorAll(".sim-chip").forEach(c => {
        if (Number(c.dataset.amt) === Number(simRangeSlider.value)) {
          c.classList.add("selected");
        } else {
          c.classList.remove("selected");
        }
      });
      updateSimulation();
    });
  }

  if (simQuickChips) {
    const chips = simQuickChips.querySelectorAll(".sim-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("selected"));
        chip.classList.add("selected");
        const amt = Number(chip.dataset.amt) || 50000;
        if (simRangeSlider) simRangeSlider.value = amt;
        try { playKeySound(720); } catch(e) {}
        updateSimulation();
      });
    });
  }

  // Quick Deposit Presets
  if (depositQuickPresets) {
    const presetBtns = depositQuickPresets.querySelectorAll(".preset-btn");
    presetBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = Number(btn.dataset.val) || 0;
        const current = Number(depositAmountInput.value) || 0;
        depositAmountInput.value = current + val;
        try { playKeySound(800); } catch(e) {}
        depositAmountInput.focus();
      });
    });
  }

  // Quick Deposit Submit Button
  if (depositSubmitBtn) {
    depositSubmitBtn.addEventListener("click", () => {
      const goal = getActiveGoal();
      if (!goal) return;

      const depositVal = Number(depositAmountInput.value);
      if (!depositVal || depositVal <= 0) {
        alert("Masukkan nominal uang yang ingin kamu tabung ya sayang~ 🪙");
        depositAmountInput.focus();
        return;
      }

      const wasCompleted = goal.savedAmount >= goal.targetPrice;
      goal.savedAmount += depositVal;
      const isCompletedNow = goal.savedAmount >= goal.targetPrice;

      // Add history entry
      const noteVal = depositNoteInput.value.trim() || "Nabung celengan 🪙";
      goal.history = goal.history || [];
      goal.history.unshift({
        id: "dep_" + Date.now(),
        amount: depositVal,
        date: formatDateTimeIndo(new Date()),
        note: noteVal
      });

      saveGoals();

      // Clear input fields
      depositAmountInput.value = "";
      depositNoteInput.value = "";

      // Re-render
      renderTabs();
      renderActiveGoal();

      // Piggy animation feedback
      if (showcaseProgressFill) {
        showcaseProgressFill.classList.add("celebrating");
        setTimeout(() => showcaseProgressFill.classList.remove("celebrating"), 1200);
      }

      // Check for celebration
      if (!wasCompleted && isCompletedNow) {
        try { playSuccessFanfare(); } catch(e) {}
        try { triggerConfettiStorm(); } catch(e) {}
        showToast(`ALHAMDULILLAH! 🎉 Celengan "${goal.name}" sudah 100% terkumpul! Kamu luar biasa sayang!`, "💖");
      } else {
        try { playKeySound(920); } catch(e) {}
        const sisa = Math.max(0, goal.targetPrice - goal.savedAmount);
        const dailyRate = goal.planType === "monthly" ? Math.max(1, goal.planAmount / 30) : Math.max(1, goal.planAmount);
        const daysLeft = Math.ceil(sisa / dailyRate);
        showToast(`Yeay! +${formatMoney(depositVal)} masuk celengan! Sisa ${daysLeft} hari lagi! 💕`, "🐷");
      }
    });
  }

  // Toggle History Accordion
  if (historyToggleBtn && historyList) {
    historyToggleBtn.addEventListener("click", () => {
      const isHidden = historyList.style.display === "none";
      historyList.style.display = isHidden ? "flex" : "none";
      if (historyToggleArrow) {
        historyToggleArrow.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
      }
      try { playKeySound(500); } catch(e) {}
    });
  }

  // Form Management: Open, Close, Submit, Upload, Emoji
  function resetForm() {
    formGoalId.value = "";
    formItemName.value = "";
    formItemPrice.value = "";
    formInitialAmount.value = "0";
    formPlanType.value = "daily";
    formPlanAmount.value = "";
    currentFormPhoto = "";
    currentFormEmoji = "🛍️";
    photoPreviewImg.src = "";
    photoPreviewImg.style.display = "none";
    photoPreviewEmoji.style.display = "inline-block";
    photoPreviewEmoji.textContent = "🛍️";
    photoFileInput.value = "";

    if (emojiPresetsWrap) {
      emojiPresetsWrap.querySelectorAll(".emoji-opt").forEach(opt => {
        if (opt.dataset.emoji === "🛍️") opt.classList.add("selected");
        else opt.classList.remove("selected");
      });
    }
  }

  function openAddForm() {
    resetForm();
    formTitle.textContent = "✨ Tambah Target Barang Impian";
    formCard.style.display = "block";
    formCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    formItemName.focus();
    try { playKeySound(650); } catch(e) {}
  }

  function openEditForm(goal) {
    resetForm();
    formTitle.textContent = "✏️ Edit Target Barang Impian";
    formGoalId.value = goal.id;
    formItemName.value = goal.name;
    formItemPrice.value = goal.targetPrice;
    formInitialAmount.value = goal.savedAmount;
    formPlanType.value = goal.planType || "daily";
    formPlanAmount.value = goal.planAmount;

    if (goal.photoUrl) {
      currentFormPhoto = goal.photoUrl;
      photoPreviewImg.src = goal.photoUrl;
      photoPreviewImg.style.display = "block";
      photoPreviewEmoji.style.display = "none";
    } else {
      currentFormEmoji = goal.emoji || "🛍️";
      photoPreviewImg.style.display = "none";
      photoPreviewEmoji.style.display = "inline-block";
      photoPreviewEmoji.textContent = currentFormEmoji;
      if (emojiPresetsWrap) {
        emojiPresetsWrap.querySelectorAll(".emoji-opt").forEach(opt => {
          if (opt.dataset.emoji === currentFormEmoji) opt.classList.add("selected");
          else opt.classList.remove("selected");
        });
      }
    }

    formCard.style.display = "block";
    formCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    try { playKeySound(650); } catch(e) {}
  }

  function closeForm() {
    formCard.style.display = "none";
    resetForm();
  }

  if (addItemBtn) addItemBtn.addEventListener("click", openAddForm);
  if (createFirstGoalBtn) createFirstGoalBtn.addEventListener("click", openAddForm);
  if (formCloseBtn) formCloseBtn.addEventListener("click", closeForm);
  if (formCancelBtn) formCancelBtn.addEventListener("click", closeForm);

  if (showcaseEditBtn) {
    showcaseEditBtn.addEventListener("click", () => {
      const goal = getActiveGoal();
      if (goal) openEditForm(goal);
    });
  }

  if (showcaseDeleteBtn) {
    showcaseDeleteBtn.addEventListener("click", () => {
      const goal = getActiveGoal();
      if (!goal) return;

      if (confirm(`Hapus wishlist & target celengan "${goal.name}"?`)) {
        goals = goals.filter(g => g.id !== goal.id);
        activeGoalId = goals.length > 0 ? goals[0].id : null;
        saveGoals();
        try { playKeySound(380); } catch(e) {}
        renderTabs();
        renderActiveGoal();
        showToast("Target celengan berhasil dihapus 🗑️", "✨");
      }
    });
  }

  // Photo Upload Handler
  if (uploadPhotoBtn && photoFileInput) {
    uploadPhotoBtn.addEventListener("click", () => {
      photoFileInput.click();
    });

    photoFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (file.size > 3 * 1024 * 1024) {
        alert("Ukuran foto maksimal 3MB ya sayang~ 📸");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        currentFormPhoto = ev.target.result;
        photoPreviewImg.src = currentFormPhoto;
        photoPreviewImg.style.display = "block";
        photoPreviewEmoji.style.display = "none";

        if (emojiPresetsWrap) {
          emojiPresetsWrap.querySelectorAll(".emoji-opt").forEach(opt => opt.classList.remove("selected"));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Emoji Presets Click Handler
  if (emojiPresetsWrap) {
    emojiPresetsWrap.querySelectorAll(".emoji-opt").forEach(opt => {
      opt.addEventListener("click", () => {
        emojiPresetsWrap.querySelectorAll(".emoji-opt").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");

        currentFormEmoji = opt.dataset.emoji || "🛍️";
        currentFormPhoto = "";
        photoFileInput.value = "";

        photoPreviewImg.style.display = "none";
        photoPreviewEmoji.style.display = "inline-block";
        photoPreviewEmoji.textContent = currentFormEmoji;
        try { playKeySound(750); } catch(e) {}
      });
    });
  }

  // Form Submit Handler
  if (goalForm) {
    goalForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = formItemName.value.trim();
      const targetPrice = Number(formItemPrice.value);
      const initialAmount = Number(formInitialAmount.value) || 0;
      const planType = formPlanType.value || "daily";
      const planAmount = Number(formPlanAmount.value);

      if (!name) {
        alert("Isi nama barang impianmu dulu ya sayang~ 🌸");
        formItemName.focus();
        return;
      }

      if (!targetPrice || targetPrice <= 0) {
        alert("Masukkan target harga barang yang valid ya sayang~ 💰");
        formItemPrice.focus();
        return;
      }

      if (!planAmount || planAmount <= 0) {
        alert("Masukkan rencana nominal menabungmu ya sayang~ 📅");
        formPlanAmount.focus();
        return;
      }

      const existingId = formGoalId.value;

      if (existingId) {
        const goalIndex = goals.findIndex(g => g.id === existingId);
        if (goalIndex !== -1) {
          goals[goalIndex].name = name;
          goals[goalIndex].targetPrice = targetPrice;
          goals[goalIndex].savedAmount = initialAmount;
          goals[goalIndex].planType = planType;
          goals[goalIndex].planAmount = planAmount;
          goals[goalIndex].photoUrl = currentFormPhoto;
          goals[goalIndex].emoji = currentFormEmoji;

          activeGoalId = existingId;
          showToast(`Target "${name}" berhasil diperbarui! ✨`, "💾");
        }
      } else {
        const newGoal = {
          id: "goal_" + Date.now(),
          name: name,
          targetPrice: targetPrice,
          savedAmount: initialAmount,
          planType: planType,
          planAmount: planAmount,
          photoUrl: currentFormPhoto,
          emoji: currentFormEmoji,
          createdAt: new Date().toISOString(),
          history: initialAmount > 0 ? [
            {
              id: "dep_" + Date.now(),
              amount: initialAmount,
              date: formatDateTimeIndo(new Date()),
              note: "Tabungan awal celengan ✨"
            }
          ] : []
        };

        goals.push(newGoal);
        activeGoalId = newGoal.id;
        showToast(`Target impian "${name}" berhasil ditambahkan! Yuk semangat nabung! 🐷`, "🎉");
      }

      saveGoals();
      closeForm();
      try { playKeySound(850); } catch(e) {}
      renderTabs();
      renderActiveGoal();
    });
  }

  // Initial render
  renderTabs();
  renderActiveGoal();
}

// ==========================================
// CUTE THEMED CLOCK CARD WIDGET
// ==========================================
let currentClockTheme = "tosca";
let clockIntervalId = null;

const SWEET_CLOCK_QUOTES = {
  tosca: [
    "⏰ Setiap detik bersamamu selalu terasa sejuk dan damai~ 🌊",
    "🌿 Detik demi detik, Chiikawa dan bubub selalu sayang Evita!",
    "💚 Waktu boleh berputar cepat, rasa sayangku tetap abadi untukmu~",
    "⭐ Hari ini dan seterusnya adalah waktu bahagia milik Evita!",
    "🌸 Jam manis Chiikawa berdetak: Jangan lupa tersenyum ya cantik~"
  ],
  pink: [
    "💖 Detik ini, jam ini, dan selamanya Tuan Putri kesayangan bubub! 🌸",
    "🎀 Waktu tercantik di dunia adalah saat melihat senyum manismu~",
    "🍓 Jam cinta kita selalu berdetak bahagia khusus untuk Evita!",
    "💕 Princess Evita, semoga setiap detik harimu penuh cinta dan tawa!",
    "👑 Waktu berharga ini tercipta untuk merayakan lahirnya bidadariku~"
  ],
  seventeen: [
    "💎 Pretty U, Evita Ayu Nuranissa! Seindah Rose Quartz & Serenity~ ✨",
    "✨ Gadis paling pretty dan manis di hatiku cuma Evita!",
    "🎵 Di setiap ketukan detik lagu Pretty U, ada jutaan cinta buat kamu~",
    "🌌 Evita, kamu adalah kilau bintang paling indah di setiap waktu!",
    "💎 Jam spesial Pretty U khusus untuk Evita tercinta~ ✨"
  ]
};

function initCuteClock() {
  const clockCard = document.getElementById("cuteClockWidget");
  const savedTheme = localStorage.getItem("bday_theme") || "tosca";

  updateClockTheme(savedTheme);
  renderClockTick();

  // Tick every second
  if (clockIntervalId) clearInterval(clockIntervalId);
  clockIntervalId = setInterval(renderClockTick, 1000);

  // Click interaction: pop animation, sweet chime & romantic bubble toast
  if (clockCard) {
    clockCard.addEventListener("click", () => {
      try {
        if (typeof playKeySound === "function") playKeySound(840);
      } catch (e) {}

      clockCard.classList.add("clock-card-pop");
      setTimeout(() => clockCard.classList.remove("clock-card-pop"), 400);

      showSweetClockToast();
    });
  }
}

function updateClockTheme(themeName) {
  currentClockTheme = themeName || "tosca";
  const dateIcon = document.getElementById("clockDateIcon");
  const heartPulse = document.getElementById("clockHeartPulse");

  if (themeName === "pink") {
    if (dateIcon) dateIcon.textContent = "🌸";
    if (heartPulse) heartPulse.textContent = "💖";
  } else if (themeName === "seventeen") {
    if (dateIcon) dateIcon.textContent = "💎";
    if (heartPulse) heartPulse.textContent = "✨";
  } else {
    // tosca
    if (dateIcon) dateIcon.textContent = "📅";
    if (heartPulse) heartPulse.textContent = "💕";
  }

  // Refresh clock render immediately
  renderClockTick();
}

function renderClockTick() {
  const hourVal = document.getElementById("clockHourVal");
  const minVal = document.getElementById("clockMinVal");
  const secondsEl = document.getElementById("clockSeconds");
  const dayDateEl = document.getElementById("clockDayDate");
  const greetingEl = document.getElementById("clockGreeting");

  if (!hourVal || !minVal || !secondsEl) return;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  hourVal.textContent = hours;
  minVal.textContent = minutes;
  secondsEl.textContent = seconds;

  // Tanggal, Bulan, Tahun (Indonesian format)
  if (dayDateEl) {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    const yearNum = now.getFullYear();
    dayDateEl.textContent = `${dateNum} ${monthName} ${yearNum}`;
  }

  // Dynamic sweet greeting based on hour & theme
  if (greetingEl) {
    greetingEl.textContent = getCuteClockGreeting(now.getHours(), currentClockTheme);
  }
}

function getCuteClockGreeting(hour, theme) {
  if (theme === "pink") {
    if (hour >= 4 && hour < 11) return "Pagi Pink Princess 💖";
    if (hour >= 11 && hour < 15) return "Siang Manis Princess 🌸";
    if (hour >= 15 && hour < 18) return "Sore Cantik Ayang 🎀";
    return "Malam Manis, Sayang 🌙";
  } else if (theme === "seventeen") {
    // "buat yang pretty gpp pertahanin aja"
    return "Pretty U, Evita! 💎✨";
  } else {
    // tosca (Chiikawa)
    if (hour >= 4 && hour < 11) return "Pagi Sejuk Chiikawa 🌿";
    if (hour >= 11 && hour < 15) return "Siang Ceria Ayang 🌊";
    if (hour >= 15 && hour < 18) return "Sore Nyaman Tosca 🍃";
    return "Malam Bintang, Cantik! ✨";
  }
}

function showSweetClockToast() {
  const theme = currentClockTheme || "tosca";
  const quotes = SWEET_CLOCK_QUOTES[theme] || SWEET_CLOCK_QUOTES.tosca;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  showClockToast(quote);
}

function showClockToast(message) {
  const existing = document.querySelector(".clock-bubble-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "clock-bubble-toast";
  toast.innerHTML = `<span class="toast-heart" style="font-size:1.1rem; line-height:1;">💌</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
