# update_xox.py

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target_card = '''              <!-- Game Card 6: Balloon Pop -->
              <div class="game-select-card" data-game="pop">
                <div class="game-badge-tag">SERU 🎈</div>
                <div class="game-card-icon">🎈✨</div>
                <h4 class="game-card-title">Pecahkan Balon Cinta</h4>
                <p class="game-card-desc">Letuskan balon-balon ulang tahun tosca & emas yang terbang sebelum waktu habis!</p>
                <button class="play-game-btn">Mainkan Game 🚀</button>
              </div>'''

new_card = '''              <!-- Game Card 6: Balloon Pop -->
              <div class="game-select-card" data-game="pop">
                <div class="game-badge-tag">SERU 🎈</div>
                <div class="game-card-icon">🎈✨</div>
                <h4 class="game-card-title">Pecahkan Balon Cinta</h4>
                <p class="game-card-desc">Letuskan balon-balon ulang tahun tosca & emas yang terbang sebelum waktu habis!</p>
                <button class="play-game-btn">Mainkan Game 🚀</button>
              </div>

              <!-- Game Card 7: Tic-Tac-Toe (XOX) -->
              <div class="game-select-card" data-game="xox">
                <div class="game-badge-tag">ROMANTIS 💕</div>
                <div class="game-card-icon">❌⭕</div>
                <h4 class="game-card-title">Tic-Tac-Toe Cinta (XOX)</h4>
                <p class="game-card-desc">Main game XOX lawan Chiikawa AI yang pintar atau main berdua sama pacar!</p>
                <button class="play-game-btn">Mainkan Game 🚀</button>
              </div>'''

if target_card in html:
    html = html.replace(target_card, new_card)
    print("XOX card added to index.html!")
else:
    print("target_card not found")

target_container = '''                <!-- Whack A Mole Board -->
                <div id="whackGameContainer" class="whack-board" style="display: none;"></div>'''

new_container = '''                <!-- Whack A Mole Board -->
                <div id="whackGameContainer" class="whack-board" style="display: none;"></div>
                
                <!-- Tic-Tac-Toe (XOX) Container -->
                <div id="xoxGameContainer" class="xox-container" style="display: none;">
                  <div class="xox-mode-select">
                    <button class="xox-mode-btn active" id="xoxModeAi">🤖 Lawan AI Chiikawa</button>
                    <button class="xox-mode-btn" id="xoxMode2P">👩‍❤️‍👨 Main Berdua</button>
                  </div>
                  <div class="xox-turn-indicator" id="xoxTurnText">Giliran: 💖 Tuan Putri (X)</div>
                  <div class="xox-board" id="xoxBoard">
                    <div class="xox-cell" data-cell="0"></div>
                    <div class="xox-cell" data-cell="1"></div>
                    <div class="xox-cell" data-cell="2"></div>
                    <div class="xox-cell" data-cell="3"></div>
                    <div class="xox-cell" data-cell="4"></div>
                    <div class="xox-cell" data-cell="5"></div>
                    <div class="xox-cell" data-cell="6"></div>
                    <div class="xox-cell" data-cell="7"></div>
                    <div class="xox-cell" data-cell="8"></div>
                  </div>
                  <div class="xox-score-tracker">
                    <span>💖 Putri: <b id="xoxScoreX">0</b></span>
                    <span>🤝 Seri: <b id="xoxScoreDraw">0</b></span>
                    <span>🌸 Lawan: <b id="xoxScoreO">0</b></span>
                  </div>
                  <button class="xox-reset-btn" id="xoxResetBtn">Ronde Baru 🔄</button>
                </div>'''

if target_container in html:
    html = html.replace(target_container, new_container)
    print("XOX container added to index.html!")
else:
    print("target_container not found")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html done!")

