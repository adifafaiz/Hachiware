# update_script_autosave.py

with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. In DOMContentLoaded, replace initCoupons(); with initAutoSaveEngine();
if 'initCoupons();' in js:
    js = js.replace('initCoupons();', 'initAutoSaveEngine();')
    print("Replaced initCoupons() with initAutoSaveEngine()")
elif 'initAutoSaveEngine();' not in js:
    js = js.replace('initWishesBoard();', 'initWishesBoard();\n  initAutoSaveEngine();')
    print("Added initAutoSaveEngine()")

# 2. Add the Auto-Save Engine and updated Wishes Board implementation
autosave_code = r'''
// ==========================================
// COMPREHENSIVE AUTO-SAVE ENGINE & PERSISTENCE
// ==========================================
let autoSaveDebounceTimer = null;

function showAutoSaveStatus(state) {
  const pill = document.getElementById('autoSaveIndicator');
  const txt = document.getElementById('saveText');
  if (!pill || !txt) return;

  if (state === 'saving') {
    pill.className = 'auto-save-pill saving';
    txt.textContent = 'Menyimpan...';
  } else if (state === 'saved') {
    pill.className = 'auto-save-pill saved';
    txt.textContent = 'Tersimpan otomatis! ✨';
    setTimeout(() => {
      pill.className = 'auto-save-pill';
      txt.textContent = 'Auto-save Aktif';
    }, 1800);
  }
}

function initAutoSaveEngine() {
  const princessName = document.getElementById('princessName');
  const bdayTitle = document.getElementById('bdayTitle');
  const bdaySubtitle = document.getElementById('bdaySubtitle');
  const letterTitle = document.getElementById('letterTitle');
  const letterContent = document.getElementById('letterContent');
  const letterSigDate = document.getElementById('letterSigDate');
  const letterSigName = document.getElementById('letterSigName');

  // 1. Load saved texts from localStorage if available
  if (princessName && localStorage.getItem('bday_name')) {
    princessName.textContent = localStorage.getItem('bday_name');
  }
  if (bdayTitle && localStorage.getItem('bday_title')) {
    bdayTitle.textContent = localStorage.getItem('bday_title');
  }
  if (bdaySubtitle && localStorage.getItem('bday_subtitle')) {
    bdaySubtitle.textContent = localStorage.getItem('bday_subtitle');
  }
  if (letterTitle && localStorage.getItem('bday_letter_title')) {
    letterTitle.textContent = localStorage.getItem('bday_letter_title');
  }
  if (letterContent && localStorage.getItem('bday_letter_body')) {
    letterContent.innerHTML = localStorage.getItem('bday_letter_body');
  }
  if (letterSigDate && localStorage.getItem('bday_letter_date')) {
    letterSigDate.textContent = localStorage.getItem('bday_letter_date');
  }
  if (letterSigName && localStorage.getItem('bday_letter_sig')) {
    letterSigName.textContent = localStorage.getItem('bday_letter_sig');
  }

  // 2. Attach instant auto-save listeners to all editable elements
  const editableItems = [
    { el: princessName, key: 'bday_name', isHtml: false },
    { el: bdayTitle, key: 'bday_title', isHtml: false },
    { el: bdaySubtitle, key: 'bday_subtitle', isHtml: false },
    { el: letterTitle, key: 'bday_letter_title', isHtml: false },
    { el: letterContent, key: 'bday_letter_body', isHtml: true },
    { el: letterSigDate, key: 'bday_letter_date', isHtml: false },
    { el: letterSigName, key: 'bday_letter_sig', isHtml: false }
  ];

  editableItems.forEach(item => {
    if (!item.el) return;

    item.el.addEventListener('input', () => {
      showAutoSaveStatus('saving');
      clearTimeout(autoSaveDebounceTimer);

      autoSaveDebounceTimer = setTimeout(() => {
        const val = item.isHtml ? item.el.innerHTML : item.el.textContent;
        localStorage.setItem(item.key, val);
        showAutoSaveStatus('saved');
      }, 350);
    });

    item.el.addEventListener('blur', () => {
      const val = item.isHtml ? item.el.innerHTML : item.el.textContent;
      localStorage.setItem(item.key, val);
      showAutoSaveStatus('saved');
    });
  });

  // 3. Load saved hearts for photo gallery
  const heartBtns = document.querySelectorAll('.heart-react-btn');
  heartBtns.forEach((btn, idx) => {
    const saved = localStorage.getItem('bday_heart_' + idx);
    if (saved) {
      const countEl = btn.querySelector('.heart-count');
      if (countEl) countEl.textContent = `${saved}+`;
    }

    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.heart-count');
      if (countEl) {
        let current = parseInt(countEl.textContent.replace(/\D/g, "")) || 99;
        localStorage.setItem('bday_heart_' + idx, current);
        showAutoSaveStatus('saved');
      }
    });
  });

  // 4. Load persisted wishes
  loadSavedWishes();
}

// Persisted Wishes Board
function loadSavedWishes() {
  const wishesList = document.getElementById('wishesList');
  if (!wishesList) return;

  const saved = localStorage.getItem('bday_wishes');
  let wishes = [];
  if (saved) {
    try {
      wishes = JSON.parse(saved);
    } catch(e) {}
  } else {
    wishes = [
      { id: 1, text: "Semoga selalu sehat, bahagia terus, dan hubungan kita makin erat sampai masa depan!", author: "Dari Hatiku" }
    ];
    localStorage.setItem('bday_wishes', JSON.stringify(wishes));
  }

  renderWishes(wishes);
}

function renderWishes(wishes) {
  const wishesList = document.getElementById('wishesList');
  if (!wishesList) return;
  wishesList.innerHTML = '';

  wishes.forEach(w => {
    const item = document.createElement('div');
    item.className = 'wish-card-item';
    item.innerHTML = `
      <span class="wish-item-star">🌟</span>
      <div class="wish-item-text">"${escapeHtml(w.text)}"</div>
      <span class="wish-item-author">— ${escapeHtml(w.author)}</span>
      <button class="wish-delete-btn" title="Hapus doa ini">✕</button>
    `;

    const delBtn = item.querySelector('.wish-delete-btn');
    delBtn.onclick = () => {
      deleteWish(w.id);
    };

    wishesList.appendChild(item);
  });
}

function deleteWish(id) {
  let wishes = JSON.parse(localStorage.getItem('bday_wishes') || '[]');
  wishes = wishes.filter(w => w.id !== id);
  localStorage.setItem('bday_wishes', JSON.stringify(wishes));
  renderWishes(wishes);
  showAutoSaveStatus('saved');
}
'''

# Replace old initWishesBoard with new auto-saving wishes board
old_wishes_board = '''function initWishesBoard() {
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
}'''

new_wishes_board = '''function initWishesBoard() {
  if (!sendWishBtn || !wishTextarea || !wishesList) return;

  sendWishBtn.addEventListener("click", () => {
    const text = wishTextarea.value.trim();
    if (text.length === 0) {
      alert("Tuliskan doa atau harapanmu dulu ya sayang! 🌸");
      return;
    }

    let wishes = JSON.parse(localStorage.getItem('bday_wishes') || '[]');
    const newWish = {
      id: Date.now(),
      text: text,
      author: 'Tuan Putri 💖'
    };

    wishes.unshift(newWish);
    localStorage.setItem('bday_wishes', JSON.stringify(wishes));
    renderWishes(wishes);

    wishTextarea.value = "";
    playSuccessFanfare();
    triggerConfettiStorm();
    showAutoSaveStatus('saved');

    alert("Bintang doamu sudah berhasil diterbangkan & tersimpan otomatis! Semoga terkabul ya sayang~ ✨");
  });
}'''

if old_wishes_board in js:
    js = js.replace(old_wishes_board, new_wishes_board)
    print("Wishes board updated with persistence!")
else:
    print("old_wishes_board not found")

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js + '\n' + autosave_code)

print("script.js with complete Auto-Save engine updated!")

