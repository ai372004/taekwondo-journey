// =====================================================================
// BONUS GAME (every kick): QUIZ BLAST -- the neon space quiz shooter
// A question is shown, four answers fall from the top of the arena and the
// player steers the helmet, fires lasers (or taps an answer) and must hit
// the RIGHT one. Every kick has its OWN question bank (BANK below), plus a
// couple of general Taekwondo questions per run (GENERAL, see the knob).
// Best score is stored in skillGameScores[skill].quizBlast. Like Error Hunt
// it is an extra practice game: it does NOT count towards the weighted
// mastery score that unlocks the next skill or the Test.
//
// Question format:  { q: [ar, en], a: [ar, en], w: [[ar, en], [ar, en], [ar, en]] }
//   q = question, a = the correct answer, w = the three wrong answers.
// To add or fix a question just edit the arrays below -- nothing else to touch.
// =====================================================================
class QuizBlastSystem {

  // ---- tuning knobs --------------------------------------------------
  static QUESTIONS_PER_ROUND = 8;      // questions in one run
  static GENERAL_PER_ROUND   = 2;      // how many of them come from GENERAL (0 = only the kick's own questions)
  static LIVES               = 3;      // every wrong shot costs one
  static SCORE_BY_MISTAKES   = [100, 70, 40];   // a question's score after 0 / 1 / 2 wrong shots
  static FIRE_DELAY          = 280;    // ms between two lasers
  static PLAYER_W            = 64;     // helmet size in px (keep in sync with .qb-player in style.css)
  static PLAYER_ZONE         = 84;     // bottom strip of the arena kept free for the helmet

  // ---- questions: one bank per kick ----------------------------------
  static BANK = {

    // Ap Chagi -- straight front kick
    apchagi: [
      { q: ['الركلة الأمامية المستقيمة في التايكوندو اسمها:', 'In Taekwondo, the straight front kick is called:'],
        a: ['آب تشاجي', 'Ap Chagi'],
        w: [['نارو تشاجي', 'Naeryeo Chagi'], ['أبتوليو تشاجي', 'Aptollyo Chagi'], ['يب تشاجي', 'Yeop Chagi']] },
      { q: ['الركلة الأمامية المستقيمة بتضرب بيها المنافس بـ:', 'The straight front kick is delivered to the opponent with the:'],
        a: ['كلوة القدم', 'Ball of the foot'],
        w: [['سيف القدم', 'Blade (edge) of the foot'], ['باطن القدم', 'Sole of the foot'], ['وش القدم', 'Instep']] },
      { q: ['أنهي حركة من دول بتتكرر في أول وآخر ركلة آب تشاجي؟', 'Which movement is repeated in both the preparatory and the final phase of Ap Chagi?'],
        a: ['ثني ركبة الرجل الضاربة', 'Bending the kicking-leg knee'],
        w: [['ثني ركبة قدم الارتكاز', 'Bending the standing-foot knee'], ['فرد ركبة قدم الارتكاز', 'Straightening the standing-foot knee'], ['فرد ركبة الرجل الضاربة', 'Straightening the kicking-leg knee']] },
      { q: ['الركلة الأمامية المستقيمة اللي بتروح للراس بتجيب للاعب:', 'A straight front kick to the head scores:'],
        a: ['تلات نقط', 'Three points'],
        w: [['نقطتين', 'Two points'], ['خمس نقط', 'Five points'], ['أربع نقط', 'Four points']] },
      { q: ['إيه الهدف الأساسي لركلة آب تشاجي؟', 'What is the main target of Ap Chagi?'],
        a: ['الوش / البطن', 'Face / abdomen'],
        w: [['الركبة بس', 'Knee only'], ['الكتف', 'Shoulder'], ['القدم', 'Foot']] },
      { q: ['قدم الارتكاز بتلف بزاوية قد إيه تقريبًا في آب تشاجي؟', 'About how far does the standing foot pivot in Ap Chagi?'],
        a: ['حوالي 90°', 'About 90°'],
        w: [['180° كاملين', 'A full 180°'], ['من 0° لـ 45° بس', 'Only 0°–45°'], ['مابتلفّش خالص', 'It does not pivot']] },
      { q: ['إيه أول مرحلة في آب تشاجي؟', 'What is the first phase of Ap Chagi?'],
        a: ['وضع الاستعداد (جونبي)', 'Ready stance (Junbi)'],
        w: [['رفع الركبة', 'Knee lift'], ['فرد الرجل', 'Kick extension'], ['سحب الرجل', 'Recoil']] },
      { q: ['آب تشاجي الكاملة فيها كام مرحلة أساسية؟', 'How many main phases does a complete Ap Chagi have?'],
        a: ['5 مراحل', '5 phases'],
        w: [['3 مراحل', '3 phases'], ['4 مراحل', '4 phases'], ['6 مراحل', '6 phases']] },
      { q: ['بنرفع الركبة لحد فين قبل ما نفرد الرجل؟', 'How high is the knee lifted before the leg extends?'],
        a: ['لحد مستوى الصدر', 'To chest level'],
        w: [['لحد مستوى الكاحل', 'To ankle level'], ['لحد مستوى الركبة التانية', 'To the level of the other knee'], ['فوق الراس', 'Above the head']] },
      { q: ['بنعمل إيه بصوابع الرجل واحنا بنضرب آب تشاجي؟', 'What do you do with your toes when striking in Ap Chagi?'],
        a: ['نشدّها لورا', 'Pull them back'],
        w: [['نفردها لقدام', 'Point them forward'], ['نتنيها لتحت', 'Curl them down'], ['نفتحها للجناب', 'Spread them apart']] },
      { q: ['ليه بنرجّع الرجل بسرعة بعد الضربة؟', 'Why do we pull the leg back quickly after the strike?'],
        a: ['عشان نحافظ على التوازن والحراسة', 'To keep balance and guard'],
        w: [['عشان نجيب نقط أكتر', 'To score more points'], ['عشان الحركة تبان أحلى', 'To make it look nicer'], ['عشان الحكم عايز كده', 'Because the referee asks for it']] }
    ],

    // Naeryeo Chagi (Naro Chagi) -- the hammer / axe kick
    narochagi: [
      { q: ['في ركلة نارو تشاجي، القدم الضاربة بتروح للهدف في مسار:', 'In Naeryeo Chagi the kicking foot travels toward the target along a path going:'],
        a: ['من فوق لتحت', 'From top to bottom'],
        w: [['من برا لجوا', 'From outside to inside'], ['من تحت لفوق', 'From bottom to top'], ['من قدام لورا', 'From front to back']] },
      { q: ['ركلة نارو تشاجي في التايكوندو معروفة باسم:', 'Naeryeo Chagi is also known as the:'],
        a: ['الركلة المطرقية', 'Hammer (axe) kick'],
        w: [['الركلة الأمامية الدائرية في البطن', 'Front circular kick to the abdomen'], ['الركلة الأمامية المستقيمة', 'Straight front kick'], ['الركلة الأمامية الدائرية في الوش', 'Front circular kick to the face']] },
      { q: ['الركلة الهجومية اللي بتنزل من فوق لتحت على راس المنافس اسمها:', 'The kick that travels from top to bottom toward the opponent\'s head is:'],
        a: ['نارو تشاجي', 'Naeryeo Chagi'],
        w: [['آب تشاجي', 'Ap Chagi'], ['أبتوليو تشاجي', 'Aptollyo Chagi'], ['يب تشاجي', 'Yeop Chagi']] },
      { q: ['ضربة نارو تشاجي بتتعمل بأنهي جزء من القدم؟', 'Which part of the foot lands the strike in Naeryeo Chagi?'],
        a: ['الكعب', 'The heel'],
        w: [['كلوة القدم', 'Ball of the foot'], ['سيف القدم', 'Blade of the foot'], ['وش القدم', 'Instep']] },
      { q: ['إيه الهدف الأساسي لركلة نارو تشاجي؟', 'What is the main target of Naeryeo Chagi?'],
        a: ['الراس / الكتف / الترقوة', 'Head / shoulder / collarbone'],
        w: [['الركبة', 'Knee'], ['البطن', 'Abdomen'], ['القدم', 'Foot']] },
      { q: ['قدم الارتكاز بتلف قد إيه في نارو تشاجي؟', 'How far does the standing foot pivot in Naeryeo Chagi?'],
        a: ['بسيطة (0° – 45°)', 'Minimal (0°–45°)'],
        w: [['90°', '90°'], ['180°', '180°'], ['360°', '360°']] },
      { q: ['إيه المرحلة التانية في نارو تشاجي؟', 'What is the second phase of Naeryeo Chagi?'],
        a: ['الرفع لفوق مستقيم', 'Vertical rise'],
        w: [['نزول الكعب', 'Heel drop'], ['سحب الرجل', 'Recoil'], ['الرجوع للوضعية', 'Return to stance']] },
      { q: ['مرحلة الضربة في نارو تشاجي اسمها إيه؟', 'What is the striking phase of Naeryeo Chagi called?'],
        a: ['نزول الكعب', 'Heel drop'],
        w: [['الرفع لفوق مستقيم', 'Vertical rise'], ['وضعية الاستعداد', 'Ready stance'], ['رفع الركبة', 'Knee lift']] },
      { q: ['الرجل بتطلع إزاي قبل ما تنزل؟', 'How does the leg rise before it drops?'],
        a: ['لفوق ومستقيمة', 'Straight up, vertically'],
        w: [['في لفّة دايرية لبرا', 'In a circle to the outside'], ['بالعرض لقدام', 'Horizontally forward'], ['لورا مع ثني الركبة', 'Backward with a bent knee']] },
      { q: ['ليه الرجل لازم تفضل مفرودة خالص وهي طالعة؟', 'Why must the leg stay straight during the rise?'],
        a: ['عشان تطلع ضربة نازلة قوية', 'To generate a powerful downward strike'],
        w: [['عشان شكلها أحلى', 'Because it looks better'], ['عشان أسهل في الأداء', 'Because it is easier'], ['مش مطلوب أصلًا', 'It is not required']] },
      { q: ['الجذع بيعمل إيه والرجل طالعة لفوق؟', 'What does the torso do while the leg rises?'],
        a: ['بيميل لورا شوية عشان التوازن', 'Leans back slightly for balance'],
        w: [['بينحني لقدام أوي', 'Bends far forward'], ['بيلف 180°', 'Turns 180°'], ['بيتني على الجنب', 'Folds to the side']] }
    ],

    // Bik Chagi -- the straight SIDE kick (as taught in this game's Learning stage and Test)
    bakchagi3: [
      { q: ['إيه الاسم الكوري للركلة الجانبية المستقيمة دي؟', 'What is the Korean name of this straight side kick?'],
        a: ['بيك تشاجي', 'Bik Chagi'],
        w: [['آب تشاجي', 'Ap Chagi'], ['نارو تشاجي', 'Naeryeo Chagi'], ['دوي تشاجي', 'Dwi Chagi']] },
      { q: ['ضربة بيك تشاجي بتتعمل بأنهي جزء من القدم؟', 'Which part of the foot strikes in Bik Chagi?'],
        a: ['الكعب / الحرف اللي برا في القدم', 'Heel / outer edge of the foot'],
        w: [['كلوة القدم', 'Ball of the foot'], ['وش القدم', 'Instep'], ['صوابع القدم', 'Toes']] },
      { q: ['إيه الأهداف الأساسية لركلة بيك تشاجي؟', 'What are the main targets of Bik Chagi?'],
        a: ['الركبة / الضلوع / الصدر / الراس', 'Knee / ribs / chest / head'],
        w: [['البطن بس', 'Abdomen only'], ['الضهر بس', 'Back only'], ['القدم بس', 'Foot only']] },
      { q: ['قدم الارتكاز بتلف قد إيه في بيك تشاجي؟', 'How far does the standing foot pivot in Bik Chagi?'],
        a: ['180° كاملين', 'A full 180°'],
        w: [['90°', '90°'], ['من 0° لـ 45°', '0°–45°'], ['مابتلفّش', 'No pivot']] },
      { q: ['الجسم بيبقى واخد أنهي اتجاه ناحية الهدف في بيك تشاجي؟', 'How does the body face the target in Bik Chagi?'],
        a: ['بالجنب', 'Side-on'],
        w: [['في وشه خالص', 'Fully facing it'], ['مدّيله ضهره خالص', 'Back fully turned'], ['مايل لقدام', 'Bent forward']] },
      { q: ['إيه اللي لازم يفضل في خط واحد مستقيم ناحية الهدف؟', 'What must stay in one straight line toward the target?'],
        a: ['الجسم والحوض والركبة والقدم', 'Body, hip, knee and foot'],
        w: [['الدراعين بس', 'The arms only'], ['العينين بس', 'The eyes only'], ['ولا حاجة معينة', 'Nothing in particular']] },
      { q: ['بنعمل إيه في المرحلة التانية من بيك تشاجي؟', 'What happens in the second phase of Bik Chagi?'],
        a: ['نلف الجسم ونرفع الركبة', 'Turn the body and lift the knee'],
        w: [['نفرد الرجل على طول', 'Extend the leg straight away'], ['نقعد على الأرض', 'Sit on the floor'], ['ننط لورا', 'Jump backward']] },
      { q: ['ليه بنفضل رافعين إيدينا واحنا بنلف بالجنب؟', 'Why do we keep the hands up while turning side-on?'],
        a: ['عشان الجسم بيبقى مكشوف أكتر وهو بيلف', 'The body is more exposed while turning'],
        w: [['عشان ده اختياري', 'Because it is optional'], ['عشان بتبطّأ الركلة', 'Because it slows the kick'], ['مفيش سبب', 'There is no reason']] },
      { q: ['بنرجّع الرجل إزاي بعد ضربة بيك تشاجي؟', 'How do you pull the leg back after a Bik Chagi strike?'],
        a: ['على نفس الخط المستقيم', 'Along the same straight line'],
        w: [['في حركة دايرية', 'In a circular sweep'], ['نسيبها متدلدلة', 'Let it dangle'], ['نخبطها جامد في الأرض', 'Stamp it down hard']] },
      { q: ['ركلة جانبية ضعيفة ومش متوازنة — إيه أكتر سبب محتمل؟', 'A side kick lands weak and off-balance. What is the most likely cause?'],
        a: ['الركبة ماترفعتش على الآخر قبل فرد الرجل', 'The knee was not fully chambered before extending'],
        w: [['كمّل اللفّة 180°', 'He completed the 180° pivot'], ['ضرب بالكعب', 'He struck with the heel'], ['خلّى إيديه للحراسة', 'He kept his guard up']] },
      { q: ['بيك تشاجي الكاملة فيها كام مرحلة أساسية؟', 'How many main phases does a complete Bik Chagi have?'],
        a: ['5 مراحل', '5 phases'],
        w: [['3 مراحل', '3 phases'], ['4 مراحل', '4 phases'], ['6 مراحل', '6 phases']] }
    ]
  };

  // ---- general Taekwondo questions (not tied to one kick) ------------
  // A few of these are mixed into every run -- see GENERAL_PER_ROUND.
  static GENERAL = [
    { q: ['وضع الاستعداد اللي اللاعب بياخده في الأول قبل الركلات الهجومية اسمه:', 'The starting ready position a player takes before attacking kicks is called:'],
      a: ['كروجي جومبي', 'Kyorugi Junbi'],
      w: [['شاريوت', 'Charyeot'], ['سي جاك', 'Sijak'], ['كومان', 'Keuman']] },
    { q: ['في الركلات الهجومية، رجوع القدم الضاربة وثني الركبة تاني بيحصل في:', 'Pulling the kicking foot back and re-bending the knee happens in the:'],
      a: ['المرحلة الأخيرة', 'Final phase'],
      w: [['مرحلة الاستعداد', 'Ready phase'], ['المرحلة التمهيدية', 'Preparatory phase'], ['المرحلة الأساسية', 'Main phase']] },
    { q: ['اللبس الرسمي بتاع لاعبين التايكوندو اسمه:', 'The official uniform of Taekwondo players is called:'],
      a: ['الدوبوك', 'Dobok'],
      w: [['الكيمونو', 'Kimono'], ['الهاكاما', 'Hakama'], ['الكيغوجي', 'Keikogi']] },
    { q: ['في ماتش الكروجي بنفرّق بين اللاعبين باللونين:', 'Players in a Kyorugi (sparring) match are told apart by the colors:'],
      a: ['الأحمر والأزرق', 'Red and blue'],
      w: [['الأزرق والأبيض', 'Blue and white'], ['الأحمر والأصفر', 'Red and yellow'], ['الأزرق والأخضر', 'Blue and green']] },
    { q: ['واقي الصدر اللي بيلبسه لاعب التايكوندو اسمه:', 'The chest protector a Taekwondo player wears is called:'],
      a: ['الهوجو', 'Hogu'],
      w: [['الهيد جارد', 'Head guard'], ['الشين جارد', 'Shin guard'], ['الدوبوك', 'Dobok']] },
    { q: ['في منافسات الكروجي، مسموح باللكمة المستقيمة على منطقة:', 'In Kyorugi, a straight punch may be aimed at the:'],
      a: ['الصدر', 'Chest'],
      w: [['الراس', 'Head'], ['الضهر', 'Back'], ['الرجل', 'Leg']] },
    { q: ['في ماتشات الكروجي، اسم «شونج» بيتقال على اللاعب اللي لابس اللون:', 'In Kyorugi, the player in which color is called "Chung"?'],
      a: ['الأزرق', 'Blue'],
      w: [['الأصفر', 'Yellow'], ['الأخضر', 'Green'], ['الأحمر', 'Red']] },
    { q: ['في ماتشات الكروجي، اسم «هونج» بيتقال على اللاعب اللي لابس اللون:', 'In Kyorugi, the player in which color is called "Hong"?'],
      a: ['الأحمر', 'Red'],
      w: [['الأصفر', 'Yellow'], ['الأخضر', 'Green'], ['الأزرق', 'Blue']] },
    { q: ['اللاعب ياخد إنذار (كام جام) لما:', 'A gam-jeom (penalty) is given to a player when:'],
      a: ['جزء من القدم يطلع برا خط الحدود', 'Part of the foot leaves the boundary line'],
      w: [['الرجلين يفضلوا جوا خط الحدود', 'Both feet stay inside the line'], ['يقف على خط الحدود', 'Standing on the line'], ['إنك تقرّب من خط الحدود', 'Getting close to the line']] },
    { q: ['ماتش الكيوروجي بيبقى فيه:', 'A Kyorugi match consists of:'],
      a: ['تلات جولات', 'Three rounds'],
      w: [['جولتين', 'Two rounds'], ['أربع جولات', 'Four rounds'], ['خمس جولات', 'Five rounds']] },
    { q: ['الجولة الواحدة في ماتش الكيوروجي مدتها قد إيه؟', 'One round of a Kyorugi match lasts:'],
      a: ['دقيقتين', 'Two minutes'],
      w: [['دقيقة واحدة', 'One minute'], ['دقيقة ونص', 'One and a half minutes'], ['دقيقتين ونص', 'Two and a half minutes']] },
    { q: ['لما اللاعب ياخد إنذار (كام جام)، إيه اللي بيحصل؟', 'When a gam-jeom is given to a player, the result is:'],
      a: ['المنافس بياخد نقطة', 'A point for the opponent'],
      w: [['بيتخصم نقطة من اللاعب', 'A point off the player'], ['بيتخصم نقطتين من المنافس', 'Two points off the opponent'], ['اللاعب بيتوقف', 'The player is suspended']] }
  ];

  // ---- texts ----------------------------------------------------------
  static TXT = {
    badge:  { en: (n, t) => `Question ${n} / ${t}`, ar: (n, t) => `سؤال ${n} / ${t}` },
    points: { en: (p) => `Points: ${p}`,            ar: (p) => `النقط: ${p}` },
    lives:  { en: (n) => `${n} lives left`,         ar: (n) => `المحاولات اللي فاضلة: ${n}` },
    correct: { en: 'Correct!',                      ar: 'إجابة صح!' },
    wrong:  { en: 'Not that one - try again',       ar: 'مش دي - جرّب تاني' },
    overTitle: { en: 'Out of lives',                ar: 'المحاولات خلصت' },
    overMsg:   { en: (n, t) => `You answered ${n} of ${t} questions. Try again!`,
                 ar: (n, t) => `جاوبت ${n} من ${t} أسئلة. جرّب تاني!` },
    retry:  { en: 'Try again',                      ar: 'جرّب تاني' },
    arena:  { en: 'Game area: move with the arrow keys, fire with Space, or tap the correct answer.',
              ar: 'منطقة اللعب: اتحرك بالأسهم واضرب بالمسافة، أو دوس على الإجابة الصح.' },
    moveLeft:  { en: 'Move left',  ar: 'شمال' },
    moveRight: { en: 'Move right', ar: 'يمين' },
    fire:      { en: 'Fire',       ar: 'اضرب' }
  };

  // ---- state ----------------------------------------------------------
  static gameState = null;
  static skillId = 'apchagi';
  static round = [];
  static qIndex = 0;
  static lives = 3;
  static points = 0;
  static answered = 0;
  static qMistakes = 0;
  static qScores = [];
  static targets = [];
  static bullets = [];
  static playerX = 0;
  static aimX = null;
  static aiming = false;
  static keys = { left: false, right: false, fire: false };
  static lastShot = 0;
  static running = false;
  static locked = false;
  static over = false;
  static fallSpeed = 0;
  static W = 0;
  static H = 0;
  static L = null;          // current layout (see computeLayout)
  static _raf = 0;
  static _last = 0;
  static _gen = 0;          // bumped on every (re)start / teardown so stale timers do nothing
  static _abort = null;     // removes every listener this game added
  static _toastTimer = 0;
  static _tick = (ts) => QuizBlastSystem.tick(ts);

  static get ar() { return this.gameState?.currentLanguage === 'ar'; }
  static pick(pair) { return this.ar ? pair[0] : pair[1]; }
  static t(key, ...args) {
    const v = this.TXT[key][this.ar ? 'ar' : 'en'];
    return typeof v === 'function' ? v(...args) : v;
  }
  static $(id) { return document.getElementById(id); }
  static shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  // setTimeout that does nothing if the player left the screen or restarted the run
  static later(fn, ms) {
    const gen = this._gen;
    screenTimeout(() => { if (gen === this._gen) fn(); }, ms);
  }

  // ---- lifecycle ------------------------------------------------------
  static initialize(gameState) {
    this.gameState = gameState;
    this.teardown();
    this.skillId = GameConfig.SKILLS[gameState.currentSkill] ? gameState.currentSkill : 'apchagi';
    this.round = this.buildRound(this.skillId);
    this.qIndex = 0;
    this.lives = this.LIVES;
    this.points = 0;
    this.answered = 0;
    this.qScores = [];
    this.over = false;
    this.locked = false;
    this.lastShot = 0;
    this.clearField();
    this.hideOverlay();
    this.measure();
    this.playerX = this.W / 2;
    this.bindControls();
    this.renderChrome();
    this.placePlayer(0);
    this.running = true;
    this._last = performance.now();
    this._raf = requestAnimationFrame(this._tick);
    this.startQuestion();
    try { this.$('qb-arena')?.focus({ preventScroll: true }); } catch (e) { /* not focusable yet */ }
  }

  // Called whenever the player leaves this screen (see ScreenManager.switchScreen).
  static teardown() {
    this._gen++;
    this.running = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._abort) { this._abort.abort(); this._abort = null; }
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    clearTimeout(this._toastTimer);
    const toast = this.$('qb-toast');
    if (toast) { toast.className = 'qb-toast'; toast.textContent = ''; }
    this.keys = { left: false, right: false, fire: false };
    this.aiming = false;
    this.aimX = null;
  }

  // A run = this kick's own questions + a few general ones, in random order.
  static buildRound(skillId) {
    const own = this.BANK[skillId] || this.BANK.apchagi;
    const total = this.QUESTIONS_PER_ROUND;
    const general = Math.min(this.GENERAL_PER_ROUND, total);
    const nOwn = Math.min(own.length, total - general);
    const picked = [
      ...this.shuffle(own).slice(0, nOwn),
      ...this.shuffle(this.GENERAL).slice(0, total - nOwn)
    ];
    return this.shuffle(picked);
  }

  static bindControls() {
    const { signal } = (this._abort = new AbortController());
    const arena = this.$('qb-arena');

    // Keyboard: arrows / A-D move, Space fires.
    const onKey = (e, down) => {
      if (ScreenManagerInstance?.currentScreen !== 'quiz-blast') return;
      const inField = e.target?.closest?.('button, a, input, textarea, select');
      if (e.key === 'ArrowLeft' || e.code === 'KeyA')       { this.keys.left = down;  e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.code === 'KeyD') { this.keys.right = down; e.preventDefault(); }
      else if ((e.key === ' ' || e.code === 'Space') && !inField)        { this.keys.fire = down;  e.preventDefault(); }
    };
    document.addEventListener('keydown', (e) => onKey(e, true), { signal });
    document.addEventListener('keyup',   (e) => onKey(e, false), { signal });

    // On-screen buttons (touch devices).
    [['qb-left', 'left'], ['qb-right', 'right'], ['qb-fire', 'fire']].forEach(([id, key]) => {
      const el = this.$(id);
      if (!el) return;
      const off = () => { this.keys[key] = false; el.classList.remove('is-down'); };
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.keys[key] = true; el.classList.add('is-down'); }, { signal });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => el.addEventListener(ev, off, { signal }));
      el.addEventListener('contextmenu', (e) => e.preventDefault(), { signal });
    });

    // Press / drag anywhere in the arena: the helmet slides there and keeps firing.
    if (arena) {
      const aimAt = (e) => { this.aimX = e.clientX - arena.getBoundingClientRect().left; };
      arena.addEventListener('pointerdown', (e) => {
        if (!this.running || this.over) return;
        this.aiming = true;
        this.keys.fire = true;
        aimAt(e);
        try { arena.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }, { signal });
      arena.addEventListener('pointermove', (e) => { if (this.aiming) aimAt(e); }, { signal });
      const stop = () => { this.aiming = false; this.keys.fire = false; };
      arena.addEventListener('pointerup', stop, { signal });
      arena.addEventListener('pointercancel', stop, { signal });

      if (typeof ResizeObserver === 'function') {
        this._ro = new ResizeObserver(() => this.onResize());
        this._ro.observe(arena);
      }
    }

  }

  static measure() {
    const arena = this.$('qb-arena');
    this.W = arena?.clientWidth || 320;
    this.H = arena?.clientHeight || 480;
  }

  static onResize() {
    if (!this.running) return;
    const prevW = this.W;
    this.measure();
    if (Math.abs(this.W - prevW) < 1 && this.L) return;
    this.playerX = Math.max(this.PLAYER_W / 2, Math.min(this.W - this.PLAYER_W / 2, this.playerX));
    this.applyLayout();
  }

  // ---- questions and targets -----------------------------------------
  static startQuestion() {
    const item = this.round[this.qIndex];
    if (!item) return;
    this.locked = false;
    this.qMistakes = 0;
    this.fallSpeed = this.H * 0.0020 * Math.pow(1.04, this.qIndex);   // px per 60fps frame, a touch quicker each question
    this.clearTargets();

    const answers = this.shuffle([
      { pair: item.a, ok: true },
      ...item.w.map(pair => ({ pair, ok: false }))
    ]);
    const field = this.$('qb-field');
    answers.forEach((ans, i) => {
      const el = document.createElement('div');
      el.className = 'qb-target';
      const body = document.createElement('button');
      body.type = 'button';
      body.className = 'qb-target-body';
      const label = document.createElement('span');
      label.className = 'qb-target-text';
      body.appendChild(label);
      el.appendChild(body);
      field.appendChild(el);

      const t = {
        el, body, label, pair: ans.pair, ok: ans.ok, i,
        x: 0, y: 0, cx: 0, size: 0, hitW: 0, stopY: 0, amp: 0,
        phase: Math.random() * Math.PI * 2, speed: 0.0015 + Math.random() * 0.0015,
        dead: false
      };
      // Tapping / clicking an answer counts as a direct hit; Enter/Space on a focused answer too.
      body.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); this.hit(t); });
      body.addEventListener('click', (e) => { if (e.detail === 0) this.hit(t); });
      this.targets.push(t);
    });

    this.applyLayout(true);
    this.renderChrome();
  }

  // Wide arena: one row of four. Narrow arena: two staggered rows so every
  // answer keeps a readable size and stays reachable by the laser.
  static computeLayout() {
    const W = this.W, H = this.H, margin = 16;
    let size = Math.max(96, Math.min(128, Math.round(W * 0.16)));
    let s = (W - 2 * margin - size) / 3;                 // centre-to-centre distance between neighbours
    let zig = false;
    if (s < size + 14) {
      zig = true;
      // two rows: answers two lanes apart (same row) must not touch -> 2s >= size + 4
      size = Math.min(128, Math.floor((2 * W - 4 * margin - 12) / 5));
      s = (W - 2 * margin - size) / 3;
    }
    const lowerStop = H - size - this.PLAYER_ZONE;
    const upperStop = Math.max(4, lowerStop - size - 12);
    return {
      size, s, margin, zig, lowerStop, upperStop,
      hitW: zig ? Math.max(24, s - 4) : size,            // lasers only meet the lane's centre in two-row mode
      amp: prefersReducedMotion() ? 0 : zig ? 3 : Math.max(0, Math.min(28, (s - size) / 2 - 4))
    };
  }

  static applyLayout(spawn = false) {
    const L = (this.L = this.computeLayout());
    this.targets.forEach(t => {
      t.size = L.size;
      t.hitW = L.hitW;
      t.amp = L.amp;
      t.cx = L.margin + L.size / 2 + t.i * L.s;
      t.stopY = (L.zig && t.i % 2 === 0) ? L.upperStop : L.lowerStop;
      if (spawn) {
        // Two-row mode: the upper row starts one row higher so both rows arrive together and never overlap on the way down.
        t.y = (L.zig && t.i % 2 === 0) ? -(2 * L.size + 12) : -L.size;
      } else {
        t.y = Math.min(t.y, t.stopY);
      }
      t.el.style.width = t.el.style.height = `${L.size}px`;
      this.labelTarget(t);
      this.placeTarget(t, 0);
    });
  }

  static labelTarget(t) {
    const txt = this.pick(t.pair);
    t.label.textContent = txt;
    t.body.setAttribute('aria-label', txt);
    t.body.dir = this.ar ? 'rtl' : 'ltr';
    const n = txt.length;
    const px = (n <= 6 ? 17 : n <= 12 ? 15 : n <= 20 ? 13 : n <= 30 ? 11.5 : n <= 40 ? 10.5 : 9.5) * Math.max(t.size / 128, 0.85);
    t.label.style.fontSize = `${px.toFixed(1)}px`;
  }

  static placeTarget(t, ts) {
    const sway = Math.sin(ts * t.speed + t.phase) * t.amp;
    t.x = Math.max(10, Math.min(this.W - t.size - 10, t.cx - t.size / 2 + sway));
    t.el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
  }

  static clearTargets() {
    this.targets.forEach(t => t.el.remove());
    this.targets = [];
  }

  static clearField() {
    const field = this.$('qb-field');
    if (field) field.innerHTML = '';
    this.targets = [];
    this.bullets = [];
  }

  // ---- game loop ------------------------------------------------------
  static tick(ts) {
    if (!this.running) return;
    const dt = Math.min((ts - this._last) / 16.667, 3);   // 1 = one 60fps frame
    this._last = ts;

    this.movePlayer(dt);
    if (this.keys.fire && !this.locked && !this.over) this.shoot(ts);
    this.moveBullets(dt);
    this.moveTargets(dt, ts);
    this.collide();

    if (this.running) this._raf = requestAnimationFrame(this._tick);
  }

  static movePlayer(dt) {
    const half = this.PLAYER_W / 2;
    const speed = Math.max(5, Math.min(11, this.W * 0.011)) * dt;
    const dir = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
    if (dir) {
      this.aimX = null;
      this.playerX += dir * speed;
    } else if (this.aimX !== null) {
      const d = this.aimX - this.playerX;
      if (Math.abs(d) <= speed * 1.5) this.playerX = this.aimX;
      else this.playerX += Math.sign(d) * speed * 1.5;
    }
    this.playerX = Math.max(half, Math.min(this.W - half, this.playerX));
    this.placePlayer(dir);
  }

  static placePlayer(dir) {
    const el = this.$('qb-player');
    if (el) el.style.transform = `translate3d(${(this.playerX - this.PLAYER_W / 2).toFixed(1)}px, 0, 0) rotate(${dir * 12}deg)`;
  }

  static shoot(ts) {
    if (ts - this.lastShot < this.FIRE_DELAY) return;
    this.lastShot = ts;
    const el = document.createElement('div');
    el.className = 'qb-bullet';
    this.$('qb-field').appendChild(el);
    this.bullets.push({ el, x: this.playerX - 2, y: this.H - 8 - this.PLAYER_W - 18, w: 4, h: 18, speed: this.H * 0.021, dead: false });
    this.gameState.playSound('click');
  }

  static moveBullets(dt) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.y -= b.speed * dt;
      if (b.dead || b.y < -24) { b.el.remove(); this.bullets.splice(i, 1); continue; }
      b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)`;
    }
  }

  static moveTargets(dt, ts) {
    this.targets.forEach(t => {
      if (t.dead) return;
      if (t.y < t.stopY) t.y = Math.min(t.stopY, t.y + this.fallSpeed * dt);
      this.placeTarget(t, ts);
    });
  }

  static collide() {
    for (const b of this.bullets) {
      if (b.dead || this.locked) continue;
      for (const t of this.targets) {
        if (t.dead) continue;
        const left = t.x + (t.size - t.hitW) / 2;
        if (b.x + b.w > left && b.x < left + t.hitW && b.y < t.y + t.size && b.y + b.h > t.y) {
          b.dead = true;
          this.hit(t);
          break;
        }
      }
    }
  }

  // ---- answering ------------------------------------------------------
  static hit(t) {
    if (!this.running || this.locked || this.over || t.dead) return;
    const gs = this.gameState;
    t.dead = true;
    this.boom(t.x + t.size / 2, t.y + t.size / 2);

    window.Review?.noteText(this.round?.[this.qIndex]?.q?.[1], !!t.ok, this.gameState?.currentSkill || TKD.gs()?.currentSkill);
    if (t.ok) {
      this.locked = true;
      const pts = this.SCORE_BY_MISTAKES[Math.min(this.qMistakes, this.SCORE_BY_MISTAKES.length - 1)];
      this.qScores.push(pts);
      this.points += pts;
      this.answered++;
      t.body.classList.add('is-right');
      this.targets.forEach(o => { if (o !== t) { o.dead = true; o.el.classList.add('is-gone'); } });
      gs.playSound('success');
      this.toast(`${this.t('correct')} +${pts}`, 'ok');
      this.renderChrome();
      this.later(() => {
        this.qIndex++;
        if (this.qIndex >= this.round.length) this.finish();
        else this.startQuestion();
      }, 950);
    } else {
      this.qMistakes++;
      this.lives--;
      t.body.classList.add('is-wrong');
      gs.playSound('error');
      this.toast(this.t('wrong'), 'bad');
      this.renderChrome();
      this.later(() => t.el.remove(), 320);
      if (this.lives <= 0) {
        this.locked = true;
        this.later(() => this.gameOver(), 650);
      }
    }
  }

  static finish() {
    const gs = this.gameState;
    const accuracy = Math.round(this.qScores.reduce((a, b) => a + b, 0) / this.round.length);
    if (accuracy < GameConfig.SETTINGS.PASSING_SCORE) { this.gameOver(); return; }
    this.running = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    const isFirstClear = gs.completeGame('quiz-blast', accuracy);
    gs.playSound('win');
    WinnerSystem.show('quiz-blast', accuracy, gs, isFirstClear);
  }

  static gameOver() {
    const gs = this.gameState;
    this.over = true;
    this.running = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    gs.playSound('error');
    // Same rule as the other games: three failed attempts send the player back to Learning.
    if (gs.trackFailure(0, 'quiz-blast')) return; // ran out of lives — always counts as a rough attempt
    this.showOverlay();
  }

  // ---- drawing --------------------------------------------------------
  static boom(x, y) {
    const field = this.$('qb-field');
    if (!field) return;
    const e = document.createElement('div');
    e.className = 'qb-boom';
    e.style.left = `${(x - 30).toFixed(0)}px`;
    e.style.top = `${(y - 30).toFixed(0)}px`;
    field.appendChild(e);
    setTimeout(() => e.remove(), 380);
  }

  static toast(msg, kind) {
    const el = this.$('qb-toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `qb-toast show ${kind}`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.className = 'qb-toast'; }, 1300);
  }

  // Texts only: safe to call at any time (also when the language changes).
  static renderChrome() {
    const set = (id, txt) => { const el = this.$(id); if (el) el.textContent = txt; };
    const total = this.round.length || this.QUESTIONS_PER_ROUND;
    set('qb-round-badge', this.t('badge', Math.min(this.qIndex + 1, total), total));
    set('qb-points', this.t('points', this.points));
    const lives = this.$('qb-lives');
    if (lives) {
      lives.textContent = '❤️'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, this.LIVES - this.lives));
      lives.setAttribute('aria-label', this.t('lives', Math.max(0, this.lives)));
    }
    const item = this.round[Math.min(this.qIndex, this.round.length - 1)];
    if (item) set('qb-question', this.pick(item.q));
    this.$('qb-arena')?.setAttribute('aria-label', this.t('arena'));
    this.$('qb-left')?.setAttribute('aria-label', this.t('moveLeft'));
    this.$('qb-right')?.setAttribute('aria-label', this.t('moveRight'));
    this.$('qb-fire')?.setAttribute('aria-label', this.t('fire'));
  }

  // Language switch while playing: keeps the question, the targets and the score.
  static refresh() {
    if (!this.gameState) return;
    this.renderChrome();
    this.targets.forEach(t => this.labelTarget(t));
    if (this.over) this.showOverlay();
  }

  static showOverlay() {
    const box = this.$('qb-overlay');
    if (!box) return;
    box.innerHTML = `
      <div class="qb-overlay-card">
        <div class="qb-overlay-icon">💥</div>
        <h3>${this.t('overTitle')}</h3>
        <p>${this.t('overMsg', this.answered, this.round.length)}</p>
        <button type="button" class="btn btn-success" id="qb-retry-btn"><i class="fas fa-redo"></i> <span>${this.t('retry')}</span></button>
      </div>`;
    box.classList.remove('hidden');
    this.$('qb-retry-btn')?.addEventListener('click', () => this.initialize(this.gameState));
  }

  static hideOverlay() {
    const box = this.$('qb-overlay');
    if (box) { box.classList.add('hidden'); box.innerHTML = ''; }
  }
}

