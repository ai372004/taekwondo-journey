// =====================================================================
// GAME 4: QUIZ SYSTEM
// =====================================================================
class QuizSystem {

  // Parallel question sections per skill: Korean term, pivot angle, target, striking
  // surface, and phase order — each skill gets its own bank, pulled by currentSkill.
  static QUESTION_BANK = {
    apchagi: [
      {
        question: 'What is the Korean name for front kick?',
        questionAr: 'إيه الاسم الكوري للركلة الأمامية؟',
        options: ['Ap Chagi', 'Naeryeo Chagi', 'Bik Chagi', 'Dwi Chagi'],
        optionsAr: ['آب تشاجي', 'نارو تشاجي', 'بيك تشاجي', 'دوي تشاجي'],
        correctText: 'Ap Chagi',
        image: 'assets/images/characters/boy_char/apchagi/extension_boy.webp',
        explanation: 'Ap Chagi (앞차기) literally means "front kick" in Korean.',
        explanationAr: 'آب تشاجي معناها "الركلة الأمامية" بالكوري.'
      },
      {
        question: 'Which part of the foot makes contact in Ap Chagi?',
        questionAr: 'أنهي جزء من الرجل بنستخدمه في الآب تشاجي؟',
        options: ['Toes', 'Heel', 'Ball of foot', 'Side of foot'],
        optionsAr: ['صوابع القدم', 'الكعب', 'كرة القدم (الجزء اللي قدام)', 'جنب الرجل'],
        correctText: 'Ball of foot',
        image: 'assets/images/characters/girl_char/apchagi/extension_girl.webp',
        explanation: 'The ball of the foot is the striking surface for Ap Chagi.',
        explanationAr: 'الجزء اللي قدام من باطن الرجل هو اللي بيلمس الهدف في الآب تشاجي.'
      },
      {
        question: 'What is the main TARGET of Ap Chagi?',
        questionAr: 'إيه الهدف الأساسي لركلة الآب تشاجي؟',
        options: ['Head / Face', 'Face / Abdomen', 'Knee', 'Shoulder'],
        optionsAr: ['الراس بس', 'الوش / البطن', 'الركبة', 'الكتف'],
        correctText: 'Face / Abdomen',
        image: 'assets/images/characters/boy_char/apchagi/extension_boy.webp',
        explanation: 'Ap Chagi targets the opponent\'s face or abdomen with a straight forward strike.',
        explanationAr: 'الآب تشاجي بتضرب وش الخصم أو بطنه بضربة مستقيمة لقدام.'
      },
      {
        question: 'What is the pivot angle used in Ap Chagi?',
        questionAr: 'القدم الواقفة بتلف بزاوية قد إيه في الآب تشاجي؟',
        options: ['~90°', 'Slight pivot only', '180°', 'No pivot at all'],
        optionsAr: ['~90°', 'لفة خفيفة بس', '180°', 'من غير أي لف خالص'],
        correctText: '~90°',
        image: 'assets/images/characters/boy_char/apchagi/ready_boy.webp',
        explanation: 'The standing (support) foot pivots about 90° outward on its ball as the knee lifts.',
        explanationAr: 'القدم الواقفة (اللي شايلاك) بتلف حوالي 90° لبرّه على مشطها وإنت بترفع الركبة.'
      },
      {
        question: 'What is the FIRST phase of Ap Chagi?',
        questionAr: 'إيه أول مرحلة في الآب تشاجي؟',
        options: ['Kick extension', 'Knee lift', 'Ready stance', 'Recoil'],
        optionsAr: ['فرد الرجل', 'رفع الركبة', 'وضعية الاستعداد', 'السحب'],
        correctText: 'Ready stance',
        image: 'assets/images/characters/girl_char/apchagi/ready_girl.webp',
        explanation: 'The ready stance (Junbi) is always the first step.',
        explanationAr: 'وضعية الاستعداد (جونبي) دايمًا هي أول خطوة.'
      },
      {
        question: 'How many main phases does a complete Ap Chagi have?',
        questionAr: 'الآب تشاجي الكاملة فيها كام مرحلة أساسية؟',
        options: ['3', '4', '5', '6'],
        optionsAr: ['3', '4', '5', '6'],
        correctText: '5',
        image: 'assets/images/characters/boy_char/apchagi/chamber_boy.webp',
        explanation: 'Ap Chagi has 5 phases: Ready Stance → Knee Lift → Extension → Recoil → Return.',
        explanationAr: 'الآب تشاجي ليها 5 مراحل: الاستعداد ← رفع الركبة ← فرد الرجل ← السحب ← الرجوع.'
      },
      {
        question: 'What does "Junbi" mean in Taekwondo?',
        questionAr: 'يعني إيه كلمة "جونبي" في التايكوندو؟',
        options: ['Attack', 'Ready', 'Stop', 'Kick'],
        optionsAr: ['هجوم', 'استعداد', 'وقوف', 'ركلة'],
        correctText: 'Ready',
        image: 'assets/images/characters/boy_char/apchagi/ready_boy.webp',
        explanation: 'Junbi (준비) means "ready" — the preparation position.',
        explanationAr: 'جونبي معناها "استعداد" — وضعية التحضير.'
      },
      {
        question: 'Why is the recoil phase important in Ap Chagi?',
        questionAr: 'ليه مرحلة السحب مهمة في الآب تشاجي؟',
        options: ['To score more points', 'To maintain balance and guard', 'To kick faster', 'To look better'],
        optionsAr: ['عشان نجيب نقط أكتر', 'عشان نحافظ على التوازن والحراسة', 'عشان تركل أسرع', 'عشان الشكل يبقى أحلى'],
        correctText: 'To maintain balance and guard',
        image: 'assets/images/characters/boy_char/apchagi/recoil_boy.webp',
        explanation: 'Pulling the leg back quickly restores balance and protects against counter-attacks.',
        explanationAr: 'لما تسحب رجلك لورا بسرعة بترجّع توازنك وبتحمي نفسك من الهجمات المضادة.'
      },
      {
        question: 'What does "Chagi" mean in Korean?',
        questionAr: 'يعني إيه كلمة "تشاجي" بالكوري؟',
        options: ['Block', 'Punch', 'Kick', 'Stance'],
        optionsAr: ['صد', 'لكمة', 'ركلة', 'وضعية'],
        correctText: 'Kick',
        image: 'assets/images/characters/boy_char/apchagi/extension_boy.webp',
        explanation: 'Chagi (차기) means "kick" in Korean — used in all kick names.',
        explanationAr: 'تشاجي معناها "ركلة" بالكوري، وبتيجي في أسامي كل الركلات.'
      },
      {
        question: 'A coach says a student\'s kick reaches the target but has very little power. What is the most likely cause?',
        questionAr: 'المدرب لاحظ إن ركلة الطالب بتوصل الهدف بس قوتها ضعيفة أوي — إيه أرجح سبب؟',
        options: ['The knee never lifted to chest height before extension', 'The standing foot pivoted slightly', 'The hands stayed up in guard', 'The leg recoiled quickly after the strike'],
        optionsAr: ['الركبة ما ارتفعتش لمستوى الصدر قبل فرد الرجل', 'القدم الواقفة لفّت شوية', 'الإيدين فضلوا في وضع الحراسة', 'الرجل اتسحبت بسرعة بعد الضربة'],
        correctText: 'The knee never lifted to chest height before extension',
        image: 'assets/images/characters/boy_char/apchagi/chamber_boy.webp',
        explanation: 'The chamber (knee lift) is where the kick stores its power — skip the height and the extension has nothing to release.',
        explanationAr: 'رفع الركبة هو اللي بيخزّن قوة الركلة — لو الركبة مطلعتش كفاية، مفيش طاقة تطلع وقت فرد الرجل.'
      }
    ],

    narochagi: [
      {
        question: 'What is the Korean name for this axe-style kick?',
        questionAr: 'إيه الاسم الكوري للركلة اللي شكلها زي الفاس دي؟',
        options: ['Naeryeo Chagi', 'Ap Chagi', 'Bik Chagi', 'Dollyo Chagi'],
        optionsAr: ['نارو تشاجي', 'آب تشاجي', 'بيك تشاجي', 'دوليو تشاجي'],
        correctText: 'Naeryeo Chagi',
        image: 'assets/images/characters/boy_char/narochagi/drop_boy.webp',
        explanation: 'Naeryeo Chagi is the vertical axe kick — the leg rises straight then drops.',
        explanationAr: 'نارو تشاجي هي ركلة الفاس العمودية — الرجل بتطلع مفرودة وبعدين تنزل.'
      },
      {
        question: 'Which part of the foot strikes in Naeryeo Chagi?',
        questionAr: 'أنهي جزء من الرجل بيضرب في نارو تشاجي؟',
        options: ['Ball of foot', 'Instep', 'Sole / heel', 'Toes'],
        optionsAr: ['كرة القدم', 'المشط', 'باطن / كعب الرجل', 'صوابع القدم'],
        correctText: 'Sole / heel',
        image: 'assets/images/characters/boy_char/narochagi/drop_boy.webp',
        explanation: 'Naeryeo Chagi strikes downward with the sole or heel of the foot.',
        explanationAr: 'نارو تشاجي بتضرب لتحت بباطن الرجل أو الكعب.'
      },
      {
        question: 'What is the main TARGET of Naeryeo Chagi?',
        questionAr: 'إيه الهدف الأساسي لركلة نارو تشاجي؟',
        options: ['Knee', 'Abdomen', 'Head / Shoulder / Collarbone', 'Foot'],
        optionsAr: ['الركبة', 'البطن', 'الراس / الكتف / الترقوة', 'القدم'],
        correctText: 'Head / Shoulder / Collarbone',
        image: 'assets/images/characters/boy_char/narochagi/rise_boy.webp',
        explanation: 'The downward heel strike of Naeryeo Chagi is aimed at the head, shoulder, or collarbone.',
        explanationAr: 'ضربة الكعب النازلة في نارو تشاجي بتستهدف الراس أو الكتف أو عضمة الترقوة.'
      },
      {
        question: 'What pivot angle does Naeryeo Chagi use on the standing foot?',
        questionAr: 'القدم الواقفة بتلف بزاوية قد إيه في نارو تشاجي؟',
        options: ['No pivot at all', 'Minimal (0°–45°)', '90°', '180°'],
        optionsAr: ['من غير أي لف خالص', 'بسيطة (0° – 45°)', '90°', '180°'],
        correctText: 'Minimal (0°–45°)',
        image: 'assets/images/characters/boy_char/narochagi/rise_boy.webp',
        explanation: 'Naeryeo Chagi only needs a small pivot (0°–45°) since the leg rises and drops mostly in place.',
        explanationAr: 'نارو تشاجي محتاجة لفة بسيطة بس (0° – 45°) عشان الرجل بتطلع وتنزل تقريبًا في مكانها.'
      },
      {
        question: 'What is the SECOND phase of Naeryeo Chagi?',
        questionAr: 'إيه المرحلة التانية في نارو تشاجي؟',
        options: ['Heel drop', 'Vertical rise', 'Recoil', 'Return to stance'],
        optionsAr: ['نزول الكعب', 'الرفع لفوق مستقيم', 'السحب', 'الرجوع للوضعية'],
        correctText: 'Vertical rise',
        image: 'assets/images/characters/boy_char/narochagi/rise_boy.webp',
        explanation: 'After the ready stance, the leg rises straight and vertically before the strike.',
        explanationAr: 'بعد وضعية الاستعداد، الرجل بتطلع مفرودة لفوق قبل الضربة.'
      },
      {
        question: 'Why must the leg stay LOCKED STRAIGHT during the rise?',
        questionAr: 'ليه لازم الرجل تفضل مفرودة خالص وإنت بترفعها؟',
        options: ['It looks better', 'To generate a sharp, powerful downward strike', 'It is easier', 'It is not required'],
        optionsAr: ['شكلها أحلى', 'عشان تطلع ضربة نازلة قوية وحادة', 'أسهل', 'مش مهم'],
        correctText: 'To generate a sharp, powerful downward strike',
        image: 'assets/images/characters/boy_char/narochagi/drop_boy.webp',
        explanation: 'A locked straight leg lets the heel snap down with maximum force.',
        explanationAr: 'لما الرجل تبقى مفرودة خالص، الكعب بينزل بأقصى قوة.'
      },
      {
        question: 'A student\'s strike lands but feels weak and soft, not sharp. What is the likely cause?',
        questionAr: 'الطالب عمل الركلة بس الضربة جت خفيفة وناعمة مش حادة — إيه أرجح سبب؟',
        options: ['They pivoted 90° on the standing foot', 'Their knee bent slightly before the heel dropped', 'They struck with the heel', 'They kept the leg straight during the rise'],
        optionsAr: ['لفّوا القدم الواقفة 90°', 'الركبة اتثنت شوية قبل ما الكعب ينزل', 'ضربوا بالكعب', 'فضلوا فاردين الرجل وهما بيرفعوها'],
        correctText: 'Their knee bent slightly before the heel dropped',
        image: 'assets/images/characters/boy_char/narochagi/rise_boy.webp',
        explanation: 'Any bend in the knee before the drop bleeds off the force the strike needed.',
        explanationAr: 'أي ثنية في الركبة قبل النزول بتضيّع القوة اللي الضربة كانت محتاجاها.'
      }
    ],

    bakchagi3: [
      {
        question: 'What is the Korean name for this straight side kick?',
        questionAr: 'إيه الاسم الكوري للركلة الجانبية المستقيمة دي؟',
        options: ['Bik Chagi', 'Ap Chagi', 'Naeryeo Chagi', 'Dwi Chagi'],
        optionsAr: ['بيك تشاجي', 'آب تشاجي', 'نارو تشاجي', 'دوي تشاجي'],
        correctText: 'Bik Chagi',
        image: 'assets/images/characters/boy_char/bikchagi/extension_boy.webp',
        explanation: 'Bik Chagi (옆차기), also written Yeop Chagi, is a straight side kick — the body turns side-on to the target as the standing foot pivots up to 180°.',
        explanationAr: 'بيك تشاجي (옆차기)، وبتتكتب كمان يوب تشاجي، هي ركلة جانبية مستقيمة — الجسم بيلف بجنبه ناحية الهدف والقدم الواقفة بتلف لحد 180°.'
      },
      {
        question: 'Which part of the foot strikes in Bik Chagi?',
        questionAr: 'أنهي جزء من الرجل بيضرب في بيك تشاجي؟',
        options: ['Heel / outer blade of the foot', 'Instep / top of foot', 'Toes', 'Ball of the foot'],
        optionsAr: ['الكعب / الحرف اللي برا في القدم', 'مشط / وش الرجل', 'صوابع القدم', 'كرة القدم'],
        correctText: 'Heel / outer blade of the foot',
        image: 'assets/images/characters/boy_char/bikchagi/extension_boy.webp',
        explanation: 'Bik Chagi strikes with the heel or the outer blade (knife-edge) of the foot, with the toes pulled back.',
        explanationAr: 'بيك تشاجي بتضرب بالكعب أو بالحرف الخارجي للرجل (حرف السكينة)، وصوابعك مسحوبة لورا.'
      },
      {
        question: 'What are the main TARGETS of Bik Chagi?',
        questionAr: 'إيه الأهداف الأساسية لركلة بيك تشاجي؟',
        options: ['Knee / ribs / chest / head', 'Only the abdomen', 'Only the groin', 'Only the foot'],
        optionsAr: ['الركبة / الضلوع / الصدر / الراس', 'البطن بس', 'العانة بس', 'القدم بس'],
        correctText: 'Knee / ribs / chest / head',
        image: 'assets/images/characters/boy_char/bikchagi/extension_boy.webp',
        explanation: 'Thanks to its penetrating straight power, Bik Chagi can target the knee, belly, ribs, chest, or head.',
        explanationAr: 'عشان قوتها المستقيمة بتخترق، بيك تشاجي بتستهدف ركبة الخصم أو بطنه أو ضلوعه أو صدره أو راسه.'
      },
      {
        question: 'What pivot angle does Bik Chagi use on the standing foot?',
        questionAr: 'القدم الواقفة بتلف بزاوية قد إيه في بيك تشاجي؟',
        options: ['Slight pivot', '90°', 'Full 180°', 'No pivot'],
        optionsAr: ['لفة خفيفة', '90°', '180° كاملين', 'من غير لف'],
        correctText: 'Full 180°',
        image: 'assets/images/characters/boy_char/bikchagi/recoil_boy.webp',
        explanation: 'The standing foot pivots up to a full 180°, turning to point away from the target so the body is side-on to it.',
        explanationAr: 'القدم الواقفة بتلف لحد 180° كاملة لحد ما تبقى عكس الهدف، فجسمك يبقى بجنبه خالص ناحيته.'
      },
      {
        question: 'What must stay in one straight line during Bik Chagi?',
        questionAr: 'إيه اللي لازم يفضل على خط واحد مستقيم في بيك تشاجي؟',
        options: ['Only the arms', 'Head, shoulders, waist, hip, knee, and foot', 'Only the eyes', 'Nothing in particular'],
        optionsAr: ['الدراعين بس', 'الراس والكتفين والوسط والحوض والركبة والرجل', 'العينين بس', 'ولا حاجة معينة'],
        correctText: 'Head, shoulders, waist, hip, knee, and foot',
        image: 'assets/images/characters/boy_char/bikchagi/recoil_boy.webp',
        explanation: 'The kicking line must be straight from head to striking foot — that alignment is what makes the kick both accurate and powerful.',
        explanationAr: 'خط الركلة لازم يبقى مستقيم من الراس لحد الرجل اللي بتضرب — الاستقامة دي هي اللي بتخلي الركلة دقيقة وقوية في نفس الوقت.'
      },
      {
        question: 'Why must you keep your guard up while turning side-on?',
        questionAr: 'ليه لازم تفضل حارس نفسك وإنت بتلف بجنبك؟',
        options: ['It is optional', 'You are briefly more exposed while your body turns', 'It slows the kick', 'No reason'],
        optionsAr: ['مش ضروري', 'إنت بتبقى مكشوف شوية وإنت بتلف جسمك', 'بتبطّأ الركلة', 'مفيش سبب'],
        correctText: 'You are briefly more exposed while your body turns',
        image: 'assets/images/characters/boy_char/bikchagi/recoil_boy.webp',
        explanation: 'Turning side-on briefly reduces how much of the opponent you can see, so guard and control matter throughout the pivot.',
        explanationAr: 'لما بتلف بجنبك بتشوف الخصم أقل لثواني، عشان كده الحراسة والتحكم مهمين طول اللفة.'
      },
      {
        question: 'A student\'s side kick lands weak and off-balance. What is the most likely cause?',
        questionAr: 'ركلة الطالب الجانبية وصلت ضعيفة وهو مش متوازن — إيه أرجح سبب؟',
        options: ['They completed the full 180° pivot', 'The knee never fully chambered to chest height before extension', 'They struck with the heel', 'They kept their guard up'],
        optionsAr: ['كمّل اللفة 180° كلها', 'الركبة ما ارتفعتش كويس لمستوى الصدر قبل فرد الرجل', 'ضرب بالكعب', 'فضل حارس بإيديه'],
        correctText: 'The knee never fully chambered to chest height before extension',
        image: 'assets/images/characters/boy_char/bikchagi/recoil_boy.webp',
        explanation: 'Without a full knee chamber to chest height, there is no stored energy for the hip to release into the strike.',
        explanationAr: 'من غير ما الركبة تطلع كويس لمستوى الصدر، مفيش طاقة متخزّنة الوسط يطلّعها وقت الضربة.'
      }
    ]
  };

  static initialize(gameState) {
    this.gameState           = gameState;
    this.skillId              = gameState.currentSkill;
    this.score               = 0;
    this.currentQuestionIndex = 0;
    this.selectedAnswer      = null;

    const unlocked = Array.from(gameState.unlockedSkills || ['apchagi']);
    let pool;
    this.interleaved = unlocked.length > 1;
    if (this.interleaved) {
      // Interleaved practice: pull a few questions from EVERY unlocked skill,
      // not just the current one — mixing topics strengthens retention more
      // than drilling one skill in isolation.
      const perSkillCap = 4;
      pool = [];
      unlocked.forEach(sk => {
        const bank = QuizSystem.QUESTION_BANK[sk] || [];
        const shuffled = this.shuffleArray([...bank]);
        pool.push(...shuffled.slice(0, perSkillCap).map(q => ({ ...q, _fromSkill: sk })));
      });
    } else {
      const bank = QuizSystem.QUESTION_BANK[this.skillId] || QuizSystem.QUESTION_BANK.apchagi;
      pool = bank.map(q => ({ ...q, _fromSkill: this.skillId }));
    }
    this.sessionQuestions = this.shuffleArray(pool);

    const totalEl = document.getElementById('total-questions');
    if (totalEl) totalEl.textContent = this.sessionQuestions.length;

    this.loadQuestion(0);
    this.setupEventListeners();
  }

  static shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  static loadQuestion(index) {
    if (index >= this.sessionQuestions.length) { this.completeQuiz(); return; }

    const ar  = this.gameState.currentLanguage === 'ar';
    const q   = this.sessionQuestions[index];

    const questionText = document.getElementById('question-text');
    if (questionText) questionText.textContent = ar ? q.questionAr : q.question;

    // When interleaving multiple skills, show a small badge so the learner
    // knows which kick this question is reviewing.
    let badge = document.getElementById('quiz-skill-badge');
    const qTextParent = questionText?.parentElement;
    if (this.interleaved && qTextParent) {
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'quiz-skill-badge';
        badge.className = 'quiz-skill-badge';
        qTextParent.insertBefore(badge, questionText);
      }
      const skill = GameConfig.SKILLS[q._fromSkill] || GameConfig.SKILLS.apchagi;
      badge.textContent = `🥋 ${ar ? skill.name.ar : skill.name.en}`;
      badge.style.display = '';
    } else if (badge) {
      badge.style.display = 'none';
    }

    const questionImage = document.getElementById('question-image');
    if (questionImage && q.image) setBgWithFallback(questionImage, q.image);

    const optionPairs = q.options.map((opt, i) => ({ en: opt, ar: q.optionsAr[i] }));
    this.shuffledOptions = this.shuffleArray([...optionPairs]);

    this.shuffledOptions.forEach((opt, i) => {
      const textEl = document.getElementById(`option${i + 1}-text`);
      if (textEl) textEl.textContent = ar ? opt.ar : opt.en;
    });

    this.selectedAnswer = null;
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.classList.remove('selected', 'correct', 'incorrect');
      btn.disabled = false;
    });

    const feedback = document.getElementById('quiz-feedback');
    if (feedback) feedback.classList.add('hidden');

    this.updateProgress(index);
  }

  static setupEventListeners() {
    if (this._quizAbort) this._quizAbort.abort();
    this._quizAbort = new AbortController();
    const { signal } = this._quizAbort;
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', (event) => {
        if (this.selectedAnswer !== null) return;
        this.selectAnswer(parseInt(event.currentTarget.dataset.answer));
      }, { signal });
    });

    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) {
      const clone = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(clone, nextBtn);
      clone.addEventListener('click', () => this.nextQuestion());
    }
  }

  static selectAnswer(answerIndex) {
    this.selectedAnswer  = answerIndex;
    const ar             = this.gameState.currentLanguage === 'ar';
    const q              = this.sessionQuestions[this.currentQuestionIndex];

    const chosenOption   = this.shuffledOptions[answerIndex - 1];
    const isCorrect      = chosenOption && chosenOption.en === q.correctText;
    window.Review?.noteText(q.question, !!isCorrect, this.gameState?.currentSkill);

    const selectedBtn = document.querySelector(`.quiz-option[data-answer="${answerIndex}"]`);
    if (selectedBtn) selectedBtn.classList.add('selected');

    this.shuffledOptions.forEach((opt, i) => {
      if (opt.en === q.correctText) {
        const btn = document.querySelector(`.quiz-option[data-answer="${i + 1}"]`);
        if (btn) btn.classList.add('correct');
      }
    });
    if (!isCorrect && selectedBtn) selectedBtn.classList.add('incorrect');

    document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

    this.showFeedback(isCorrect, ar ? q.explanationAr : q.explanation,
                                 ar ? q.optionsAr[q.options.indexOf(q.correctText)] : q.correctText);
    this.gameState.playSound(isCorrect ? 'success' : 'error');

    if (isCorrect) this.score += 20;
    this.updateScoreDisplay();

    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) nextBtn.disabled = false;
  }

  static showFeedback(isCorrect, explanation, correctAnswerText) {
    const ar       = this.gameState.currentLanguage === 'ar';
    const feedback = document.getElementById('quiz-feedback');
    const title    = document.getElementById('quiz-result-title');
    const expEl    = document.getElementById('quiz-explanation');
    if (!feedback || !title || !expEl) return;

    feedback.classList.remove('hidden');
    if (isCorrect) {
      title.textContent = ar ? '🎉 إجابة صح!' : '🎉 Correct!';
      title.style.color = 'var(--success-color)';
    } else {
      title.textContent = ar
        ? `❌ غلط — الإجابة الصح: "${correctAnswerText}"`
        : `❌ Wrong — Correct answer: "${correctAnswerText}"`;
      title.style.color = 'var(--danger-color)';
    }
    expEl.textContent = explanation;
  }

  static updateProgress(index) {
    const currentEl = document.getElementById('current-question');
    const totalEl   = document.getElementById('total-questions');
    if (currentEl) currentEl.textContent = (index ?? this.currentQuestionIndex) + 1;
    if (totalEl)   totalEl.textContent   = this.sessionQuestions.length;
    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) nextBtn.disabled = true;
  }

  static updateScoreDisplay() {
    const scoreEl = document.getElementById('quiz-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }

  static nextQuestion() {
    this.currentQuestionIndex++;
    this.loadQuestion(this.currentQuestionIndex);
    this.gameState.playSound('click');
  }

  static completeQuiz() {
    const ar       = this.gameState.currentLanguage === 'ar';
    const maxScore = this.sessionQuestions.length * 20;
    const accuracy = Math.round((this.score / maxScore) * 100);

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      const isFirstClear = this.gameState.completeGame('quiz', accuracy);
      this.gameState.playSound('win');
      const msg = ar
        ? `🎉 خلّصت الاختبار! نقطك ${this.score}/${maxScore} (${accuracy}%)`
        : `🎉 Quiz complete! Score: ${this.score}/${maxScore} (${accuracy}%)`;
      this.gameState.showNotification(msg, 'success');
      screenTimeout(() => WinnerSystem.show('quiz', accuracy, this.gameState, isFirstClear), 1000);
    } else {
      this.gameState.playSound('error');
      if (this.gameState.trackFailure(accuracy, 'quiz')) return;
      const msg = ar
        ? `⚠️ محتاج تراجع أكتر! نقطك ${this.score}/${maxScore} (${accuracy}%)`
        : `⚠️ Needs more study! Score: ${this.score}/${maxScore} (${accuracy}%)`;
      this.gameState.showNotification(msg, 'error');
      screenTimeout(() => this.initialize(this.gameState), 2000);
    }
  }
}

