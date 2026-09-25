// =====================================================================
// GAME 3: PERFORMANCE SYSTEM
// =====================================================================
class PerformanceSystem {

  // "Spot the Mistake" — shows ONE correct-form reference image per round, plus 3
  // short technique claims about it. Exactly one claim is a common technical error;
  // the other two are true. Player must tap the INCORRECT claim (genuine error-
  // detection/discrimination practice, not just image-matching).
  static getQuestionPool(skillId, isBoy, lang) {
    const ar = lang === 'ar';
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
    const img = (key) => (isBoy ? skill.phases.find(p => p.key === key)?.image.boy : skill.phases.find(p => p.key === key)?.image.girl)
                          || skill.phases[0].image[isBoy ? 'boy' : 'girl'];
    const colorOf = (key) => skill.phases.find(p => p.key === key)?.color;
    const prompt = ar ? 'بص على الصورة، واختار الجملة الوحيدة الغلط عن الأداء الصح'
                      : 'Look at the image and find the ONE statement that is technically WRONG';

    if (skillId === 'apchagi') return [
      {
        question: prompt,
        refImage: img('chamber'), refColor: colorOf('chamber'),
        cards: [
          { correct: false, text: ar ? 'الركبة بتطلع لمستوى الصدر' : 'The knee rises to chest height' },
          { correct: false, text: ar ? 'القدم الواقفة بتفضل ثابتة على الأرض' : 'The standing foot stays planted firmly' },
          { correct: true,  text: ar ? 'صوابع القدم لازم تبقى ممدودة لقدام في المرحلة دي' : 'The toes should already be extended forward at this stage' }
        ],
        correctFeedback: ar ? 'صح! الصوابع بتتسحب لورا وقت الضربة نفسها، مش وقت رفع الركبة — هنا المهم ارتفاع الركبة بس.'
                            : 'Correct! Toes only pull back at the strike moment, not during the knee lift — this phase is all about knee height.',
        wrongFeedback:   ar ? 'دي جملة صح عن رفع الركبة. دوّر على الجملة اللي بتوصف حاجة غلط في التكنيك.'
                            : 'That statement is actually true about the knee lift. Look for the technically incorrect one.'
      },
      {
        question: prompt,
        refImage: img('extension'), refColor: colorOf('extension'),
        cards: [
          { correct: false, text: ar ? 'الرجل ممدودة خالص لقدام' : 'The leg is fully extended forward' },
          { correct: true,  text: ar ? 'الركبة بتفضل مثنية شوية وقت الضربة عشان تمتص الصدمة' : 'The knee stays slightly bent at impact to absorb shock' },
          { correct: false, text: ar ? 'الضربة بتبقى بكرة القدم مش بالصوابع' : 'The strike lands with the ball of the foot, not the toes' }
        ],
        correctFeedback: ar ? 'صح! وقت الضربة الرجل لازم تبقى ممدودة خالص — الثني بيقلل القوة وممكن يعوّرك.'
                            : 'Correct! At impact the leg must be fully extended — bending it reduces power and risks injury.',
        wrongFeedback:   ar ? 'دي معلومة صح عن فرد الرجل. جرّب تاني ودوّر على الغلطة في التكنيك.'
                            : 'That is a true fact about the extension. Look for the technical error instead.'
      },
      {
        question: prompt,
        refImage: img('ready'), refColor: colorOf('ready'),
        cards: [
          { correct: false, text: ar ? 'رجليك مفتوحين قد عرض كتافك' : 'Feet are shoulder-width apart' },
          { correct: false, text: ar ? 'إيديك مرفوعين قدام صدرك للحماية' : 'Hands are up in front of the chest for guard' },
          { correct: true,  text: ar ? 'وزن جسمك كله على رجل واحدة عشان تستعد للركلة' : 'All body weight rests on one leg, ready to kick' }
        ],
        correctFeedback: ar ? 'صح! في وضعية الاستعداد الوزن لازم يبقى متوزع على الرجلين عشان تقدر تتحرك بسرعة في أي اتجاه.'
                            : 'Correct! In the ready stance, weight must stay balanced on both legs so you can move quickly in any direction.',
        wrongFeedback:   ar ? 'ده وصف صح لوضعية الاستعداد. دوّر على الجملة اللي فيها غلطة في التكنيك.'
                            : 'That correctly describes the ready stance. Look for the technically wrong statement.'
      }
    ];

    if (skillId === 'narochagi') return [
      {
        question: prompt,
        refImage: img('chamber'), refColor: colorOf('chamber'),
        cards: [
          { correct: false, text: ar ? 'الرجل بتطلع مفرودة لأعلى ما تقدر' : 'The leg rises straight to its maximum height' },
          { correct: false, text: ar ? 'القدم الواقفة بتلف لفّة صغيرة بس (0 لحد 45 درجة)' : 'The standing foot pivots only a small amount (0°–45°)' },
          { correct: true,  text: ar ? 'الركبة بتتني وهي طالعة عشان توصل أعلى' : 'The knee bends during the rise to reach higher' }
        ],
        correctFeedback: ar ? 'صح! الرجل لازم تفضل مفرودة خالص وهي طالعة — الثني بيقلل الارتفاع والقوة.'
                            : 'Correct! The leg must stay locked straight during the rise — bending it reduces both height and power.',
        wrongFeedback:   ar ? 'دي معلومة صح عن الرفع لفوق. دوّر على الغلطة في التكنيك.'
                            : 'That is true about the vertical rise. Look for the technical error instead.'
      },
      {
        question: prompt,
        refImage: img('extension'), refColor: colorOf('extension'),
        cards: [
          { correct: false, text: ar ? 'الضربة بتبقى بالكعب أو بباطن القدم' : 'The strike lands with the heel or sole' },
          { correct: true,  text: ar ? 'الحركة بتبقى لقدام مش لتحت' : 'The strike moves forward, not downward' },
          { correct: false, text: ar ? 'الهدف هو الراس أو الوش' : 'The target is the head or face' }
        ],
        correctFeedback: ar ? 'صح! نارو تشاجي ركلة نازلة — الكعب بينزل بقوة لتحت مش لقدام.'
                            : 'Correct! Naeryeo Chagi is a downward axe kick — the heel snaps down, not forward.',
        wrongFeedback:   ar ? 'دي معلومة صح. دوّر على الجملة اللي بتوصف الحركة غلط.'
                            : 'That is true. Look for the statement that describes the motion incorrectly.'
      }
    ];

    // bikchagi (side kick) — 180° pivot & heel/blade strike recognition
    return [
      {
        question: prompt,
        refImage: img('chamber'), refColor: colorOf('chamber'),
        cards: [
          { correct: false, text: ar ? 'الضهر بيفضل مفرود لحد آخر لحظة قبل الركلة' : 'The back stays straight until the last moment before kicking' },
          { correct: true,  text: ar ? 'القدم الواقفة بتفضل ثابتة من غير ما تلف خالص' : 'The standing foot stays still with no rotation' },
          { correct: false, text: ar ? 'الركبة بتطلع لمستوى الصدر مع أول اللفّة' : 'The knee lifts to chest height as the rotation begins' }
        ],
        correctFeedback: ar ? 'صح! القدم الواقفة لازم تلف واحدة واحدة لحد 180° عشان الجسم يلف جنب — لو فضلت ثابتة تبقى دي الغلطة.'
                            : 'Correct! The standing foot must gradually pivot toward 180° so the body turns side-on — staying still is the error.',
        wrongFeedback:   ar ? 'دي معلومة صح عن المرحلة دي. دوّر على الجملة الغلط.'
                            : 'That is true about this phase. Look for the wrong statement.'
      },
      {
        question: prompt,
        refImage: img('extension'), refColor: colorOf('extension'),
        cards: [
          { correct: false, text: ar ? 'الضربة بتبقى بالكعب أو بالحرف الخارجي للقدم' : 'The strike lands with the heel or the outer blade of the foot' },
          { correct: false, text: ar ? 'اللفّة بتكمل لحد 180° قبل الضربة' : 'The rotation completes a full 180° before the strike' },
          { correct: true,  text: ar ? 'الضربة بتبقى بمشط القدم (وش القدم)' : 'The strike lands with the instep (top of the foot)' }
        ],
        correctFeedback: ar ? 'صح! بيك تشاجي بتضرب بالكعب أو حرف القدم مش بمشط القدم — ده بتاع ركلة تانية خالص.'
                            : 'Correct! Bik Chagi strikes with the heel or the blade edge, not the instep — that belongs to a different kick.',
        wrongFeedback:   ar ? 'دي معلومة صح عن المرحلة دي. جرّب تاني.'
                            : 'That is true about this phase. Try again.'
      }
    ];
  }

  static initialize(gameState) {
    this.gameState    = gameState;
    this.skillId      = gameState.currentSkill;
    const poolSize    = PerformanceSystem.getQuestionPool(this.skillId, true, 'en').length;
    this.totalRounds  = Math.min(3, poolSize);
    this.currentRound = 0;
    this.correctCount = 0;
    this.streak       = 0;
    this.totalScore   = 0;
    this.usedIndices  = [];
    // Clear before dropping the reference — nulling a live interval left it
    // ticking forever, so after a restart the countdown ran at 2×, 3×… speed.
    this.stopTimer();
    this.baseTime     = gameState.currentLanguage === 'ar' ? 22 : 18;
    this.timeLeft     = this.baseTime;
    this.answered     = false;
    this.injectScoreUI();
    this.loadNextRound();
  }

  static injectScoreUI() {
    const qSection = document.querySelector('.performance-question');
    if (!qSection || document.getElementById('perf-hud')) return;
    const ar = this.gameState.currentLanguage === 'ar';
    const hud = document.createElement('div');
    hud.id = 'perf-hud';
    hud.innerHTML = `
      <div class="perf-streak"   id="perf-streak"></div>
      <div class="perf-score-display" id="perf-score-display">
        ${ar ? 'النقط:' : 'Score:'} <span id="perf-score-val">0</span>
      </div>
      <div class="perf-timer-text" id="perf-timer-text">⏱ 12</div>
      <div class="perf-timer-bar-wrap">
        <div class="perf-timer-bar-fill" id="perf-timer-fill"></div>
      </div>
    `;
    qSection.insertAdjacentElement('afterend', hud);
  }

  static startTimer() {
    this.stopTimer();
    this.timeLeft = this.baseTime;
    this.answered = false;
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      // Don't let the answer clock run out while the app is in the background
      // (phone locked, parent checks a message) — the child would come back
      // to "Time's up!" and a lost streak.
      if (document.hidden) return;
      this.timeLeft--;
      this.updateTimerUI();
      if (this.timeLeft <= 0) {
        this.stopTimer();
        if (!this.answered) this.timeOut();
      }
    }, 1000);
  }

  static stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  static updateTimerUI() {
    const timerEl = document.getElementById('perf-timer-text');
    const fillEl  = document.getElementById('perf-timer-fill');
    if (timerEl) {
      timerEl.textContent = `⏱ ${this.timeLeft}`;
      timerEl.classList.toggle('urgent', this.timeLeft <= 4);
    }
    if (fillEl) fillEl.style.width = `${(this.timeLeft / this.baseTime) * 100}%`;
  }

  static timeOut() {
    const ar = this.gameState.currentLanguage === 'ar';
    this.answered = true;
    this.streak   = 0;
    this.updateStreakUI();
    this.gameState.playSound('error');
    this.gameState.showNotification(ar ? '⏰ الوقت خلص!' : '⏰ Time\'s up!', 'warning');

    const correctCard = document.querySelector('.performance-card[data-correct="true"]');
    if (correctCard) correctCard.classList.add('selected');

    screenTimeout(() => {
      this.currentRound++;
      if (this.currentRound < this.totalRounds) this.loadNextRound();
      else this.finishGame();
    }, 2000);
  }

  static updateStreakUI() {
    const el = document.getElementById('perf-streak');
    if (!el) return;
    if (this.streak >= 3)      el.textContent = `🔥🔥🔥 ${this.streak}x Streak!`;
    else if (this.streak === 2) el.textContent = `🔥🔥 ${this.streak}x Streak!`;
    else if (this.streak === 1) el.textContent = `🔥 Good!`;
    else                        el.textContent = '';
  }

  static updateScoreUI() {
    const el = document.getElementById('perf-score-val');
    if (el) el.textContent = this.totalScore;
  }

  static showZoomOverlay() {
    const ar = this.gameState.currentLanguage === 'ar';
    const mistake = this.currentQuestion.shuffledCards.find(c => c.correct);
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.id = 'zoom-overlay';
    overlay.innerHTML = `
      <p class="zoom-overlay-msg" style="color:var(--danger-color);font-size:1.3rem;font-weight:bold;">
        ${ar ? '❌ الجملة الغلط كانت:' : '❌ The incorrect statement was:'}
      </p>
      <p class="zoom-overlay-msg" style="font-weight:600;">${mistake ? mistake.text : ''}</p>
      <div class="zoom-overlay-img ref-correct" data-img-url="${this.currentQuestion.refImage.replace(/ /g,'%20')}" style="background-image:url('${this.currentQuestion.refImage.replace(/ /g,'%20')}')"></div>
      <p class="zoom-overlay-msg" style="color:var(--text-gray);font-size:0.95rem;">
        ${this.currentQuestion.correctFeedback}
      </p>
      <button class="btn btn-success" id="zoom-close-btn" style="margin-top:10px;">
        ${ar ? 'فهمت ✓' : 'Got it ✓'}
      </button>
    `;
    document.body.appendChild(overlay);
    scanAndVerifyImages(overlay);
    document.getElementById('zoom-close-btn')?.addEventListener('click', () => {
      overlay.remove();
      this.currentRound++;
      if (this.currentRound < this.totalRounds) this.loadNextRound();
      else this.finishGame();
    });
  }

  static loadNextRound() {
    const isBoy = this.gameState.playerCharacter === 'boy';
    const lang  = this.gameState.currentLanguage;
    const pool  = PerformanceSystem.getQuestionPool(this.skillId, isBoy, lang);

    const available = pool.map((_, i) => i).filter(i => !this.usedIndices.includes(i));
    const idx = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : Math.floor(Math.random() * pool.length);
    this.usedIndices.push(idx);
    this.currentQuestion = pool[idx];
    this.currentQuestion.shuffledCards = this.shuffleArray([...this.currentQuestion.cards]);

    this.renderRound();
    this.startTimer();
  }

  static renderRound() {
    const lang = this.gameState.currentLanguage;
    const ar   = lang === 'ar';

    const qEl = document.querySelector('.performance-question h3');
    if (qEl) qEl.textContent = this.currentQuestion.question;

    let counterEl = document.getElementById('perf-round-counter');
    if (!counterEl) {
      const qSection = document.querySelector('.performance-question');
      if (qSection) {
        counterEl = document.createElement('p');
        counterEl.id = 'perf-round-counter';
        counterEl.style.cssText = 'color:var(--warning-color);font-weight:bold;margin-top:8px;font-size:1rem;';
        qSection.appendChild(counterEl);
      }
    }
    if (counterEl) {
      counterEl.textContent = ar
        ? `السؤال ${this.currentRound + 1} من ${this.totalRounds}`
        : `Question ${this.currentRound + 1} of ${this.totalRounds}`;
    }

    const feedback = document.getElementById('performance-feedback');
    if (feedback) feedback.classList.add('hidden');

    // Single shared reference image — created once, reused every round
    const qSection = document.querySelector('.performance-question');
    let refBox = document.getElementById('perf-ref-image');
    if (!refBox && qSection) {
      refBox = document.createElement('div');
      refBox.id = 'perf-ref-image';
      refBox.className = 'perf-ref-image';
      qSection.insertAdjacentElement('afterend', refBox);
    }
    if (refBox) {
      refBox.dataset.imgColor = this.currentQuestion.refColor || '';
      refBox.style.setProperty('--pending-color', this.currentQuestion.refColor || 'var(--primary-color)');
      setBgWithFallback(refBox, this.currentQuestion.refImage, this.currentQuestion.refColor);
    }

    const cardsContainer = document.querySelector('.performance-cards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = this.currentQuestion.shuffledCards.map((card, i) => `
      <div class="performance-card text-only" data-correct="${card.correct}" data-card="${i}">
        <div class="card-content">
          <span class="claim-icon">💬</span>
          <p style="margin:8px 0 0;font-size:1.05rem;line-height:1.5;">${card.text}</p>
        </div>
        <button class="btn select-card-btn" data-card="${i}">
          ${ar ? 'دي الغلط' : 'This is wrong'}
        </button>
      </div>
    `).join('');

    this.selectedAnswer = null;
    this.setupEventListeners();
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static setupEventListeners() {
    document.querySelectorAll('.performance-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-card-btn')) return;
        this.selectCard(card);
      });
    });
    document.querySelectorAll('.select-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCard(btn.closest('.performance-card'));
      });
    });
  }

  static selectCard(card) {
    if (this.answered || this.selectedAnswer !== null) return;

    this.stopTimer();
    this.answered = true;

    const isCorrect = card.dataset.correct === 'true';
    this.selectedAnswer = isCorrect ? 'correct' : 'incorrect';
    // which lesson step this picture shows → smart review
    const ph = (GameConfig.SKILLS[this.skillId]?.phases || []).findIndex(p => p.image && (p.image.boy === this.currentQuestion?.refImage || p.image.girl === this.currentQuestion?.refImage));
    if (ph >= 0) window.Review?.note('phase', isCorrect, { skill: this.skillId, phase: ph });

    document.querySelectorAll('.performance-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    this.gameState.playSound(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      const timeBonus  = Math.max(0, this.timeLeft) * 5;
      const streakBonus= (this.streak >= 3) ? 30 : (this.streak === 2) ? 15 : 0;
      this.totalScore += 100 + timeBonus + streakBonus;
      this.updateStreakUI();
      this.updateScoreUI();
      this.showFeedback(true);

      screenTimeout(() => {
        this.currentRound++;
        if (this.currentRound < this.totalRounds) this.loadNextRound();
        else this.finishGame();
      }, 1800);
    } else {
      this.streak = 0;
      this.updateStreakUI();
      this.showFeedback(false);

      const correctCard = document.querySelector('.performance-card[data-correct="true"]');
      if (correctCard) correctCard.classList.add('selected');

      screenTimeout(() => this.showZoomOverlay(), 1200);
    }
  }

  static showFeedback(isCorrect) {
    const feedback  = document.getElementById('performance-feedback');
    const title     = document.getElementById('feedback-title');
    const message   = document.getElementById('feedback-message');
    if (!feedback || !title || !message) return;

    feedback.classList.remove('hidden');
    if (isCorrect) {
      title.textContent  = this.currentQuestion.correctFeedback.split('!')[0] + '!';
      title.style.color  = 'var(--success-color)';
      message.textContent = this.currentQuestion.correctFeedback;
    } else {
      title.textContent  = this.gameState.currentLanguage === 'ar' ? '❌ غلط' : '❌ Incorrect';
      title.style.color  = 'var(--danger-color)';
      message.textContent = this.currentQuestion.wrongFeedback;
    }
  }

  static finishGame() {
    this.stopTimer();
    const ar       = this.gameState.currentLanguage === 'ar';
    const accuracy = Math.round((this.correctCount / this.totalRounds) * 100);

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      const isFirstClear = this.gameState.completeGame('performance', accuracy);
      this.gameState.playSound('win');
      WinnerSystem.show('performance', accuracy, this.gameState, isFirstClear);
    } else {
      this.gameState.playSound('error');
      const msg = ar
        ? `⚠️ جاوبت صح على ${this.correctCount} من ${this.totalRounds} (${accuracy}%). جرّب تاني!`
        : `⚠️ ${this.correctCount}/${this.totalRounds} correct (${accuracy}%). Try again!`;
      this.gameState.showNotification(msg, 'error');
      this.gameState.trackFailure(accuracy, 'performance');
      screenTimeout(() => this.initialize(this.gameState), 2000);
    }
  }
}

