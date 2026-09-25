// =====================================================================
// GAME CONFIGURATION - UPDATED WITH CORRECT FILE PATHS
// =====================================================================
const GameConfig = {
  SKILL_ORDER: ['apchagi', 'narochagi', 'bakchagi3'],
  ANIMATIONS: {
    BOY: {
      IDLE: { frames: ['assets/images/characters/boy_char/boy_idle.webp'], fps: 1, loop: true },
      KICK: { frames: [
          'assets/images/characters/boy_char/apchagi/ready_boy.webp',
          'assets/images/characters/boy_char/apchagi/ready_boy.webp',
          'assets/images/characters/boy_char/apchagi/chamber_boy.webp',
          'assets/images/characters/boy_char/apchagi/extension_boy.webp',
          'assets/images/characters/boy_char/apchagi/extension_boy.webp',
          'assets/images/characters/boy_char/apchagi/recoil_boy.webp',
          'assets/images/characters/boy_char/apchagi/return_boy.webp'
        ], fps: 8, loop: false, holdLast: 800,
        onComplete: (animator) => {
          if (animator.element) animator.element.classList.remove('is-kicking');
          animator.play('IDLE');
        }
      },
      WIN: { frames: [
          'assets/images/characters/boy_char/boy_win_1.webp',
          'assets/images/characters/boy_char/boy_win_2.webp',
          'assets/images/characters/boy_char/boy_win_1.webp',
          'assets/images/characters/boy_char/boy_win_2.webp'
        ], fps: 4, loop: true }
    },
    GIRL: {
      IDLE: { frames: ['assets/images/characters/girl_char/girl_idle.webp'], fps: 1, loop: true },
      KICK: { frames: [
          'assets/images/characters/girl_char/apchagi/ready_girl.webp',
          'assets/images/characters/girl_char/apchagi/ready_girl.webp',
          'assets/images/characters/girl_char/apchagi/chamber_girl.webp',
          'assets/images/characters/girl_char/apchagi/extension_girl.webp',
          'assets/images/characters/girl_char/apchagi/extension_girl.webp',
          'assets/images/characters/girl_char/apchagi/recoil_girl.webp',
          'assets/images/characters/girl_char/apchagi/return_girl.webp'
        ], fps: 8, loop: false, holdLast: 800,
        onComplete: (animator) => {
          if (animator.element) animator.element.classList.remove('is-kicking');
          animator.play('IDLE');
        }
      },
      WIN: { frames: [
          'assets/images/characters/girl_char/girl_win_1.webp',
          'assets/images/characters/girl_char/girl_win_1.webp'
        ], fps: 3, loop: true }
    },
    COACH: {
      IDLE: { frames: ['assets/images/characters/coach_yang/coach_idle.webp'], fps: 1, loop: true },
      DEMO: { frames: [
          'assets/images/characters/coach_yang/ready_coach.webp',
          'assets/images/characters/coach_yang/ready_coach.webp',
          'assets/images/characters/coach_yang/chamber_coach.webp',
          'assets/images/characters/coach_yang/extension_coach.webp',
          'assets/images/characters/coach_yang/extension_coach.webp',
          'assets/images/characters/coach_yang/recoil_coach.webp',
          'assets/images/characters/coach_yang/return_coach.webp',
          'assets/images/characters/coach_yang/return_coach.webp'
        ], fps: 6, loop: false,
        onComplete: (animator) => { animator.play('IDLE'); }
      }
    }
  },

  // Every screen gets its own background instead of all of them silently
  // falling back to the home-screen art (the previous map only had HOME +
  // an unused DOJO key, and setBackground()'s .toUpperCase() lookup never
  // matched a real screen id, so every screen — Learning, Games, Quiz,
  // Puzzle, etc. — always showed the main-menu image). 10 pieces of art
  // already sat unused in assets/images/backgrounds/ with names that map
  // 1:1 onto these screens; this just wires them up.
  BACKGROUNDS: {
    HOME:            'assets/images/backgrounds/main_menu_bg.webp',
    LEARNING:        'assets/images/backgrounds/dojo_interior_bg.webp',
    WARMUP:          'assets/images/backgrounds/dojo_interior_bg.webp',
    COOLDOWN:        'assets/images/backgrounds/dojo_interior_bg.webp',
    'SKILL-MENU':    'assets/images/backgrounds/basic_techniques_bg.webp',
    GAMES:           'assets/images/backgrounds/arena_bg.webp',
    'FORM-CONTROL':  'assets/images/backgrounds/forms_practice_bg.webp',
    PUZZLE:          'assets/images/backgrounds/puzzle_challenge_bg.webp',
    PERFORMANCE:     'assets/images/backgrounds/reflex_arena_bg.webp',
    ACTION:          'assets/images/backgrounds/sparring_training_bg.webp',
    'ERROR-HUNT':    'assets/images/backgrounds/belt_training_bg.webp',
    QUIZ:            'assets/images/backgrounds/technique_quiz_bg.webp',
    'QUIZ-BLAST':    'assets/images/backgrounds/quiz_room_bg.webp',
    'TROPHY-ROOM':   'assets/images/backgrounds/memory_dojo_bg.webp',
    'CHARACTER-CHANGE': 'assets/images/backgrounds/main_menu_bg.webp',
    WINNER:          'assets/images/backgrounds/main_menu_bg.webp',
    REPORT:          'assets/images/backgrounds/main_menu_bg.webp',
    DOJO:            'assets/images/backgrounds/dojo_interior_bg.webp',
    'BOARD-BREAK':   'assets/images/backgrounds/dojo_interior_bg.webp',
    'PADDLE-REFLEX': 'assets/images/backgrounds/reflex_arena_bg.webp',
    'PHASE-RHYTHM':  'assets/images/backgrounds/arena_bg.webp',
    'SPARRING-DUEL': 'assets/images/backgrounds/sparring_training_bg.webp',
    'BALANCE-HOLD':  'assets/images/backgrounds/forms_practice_bg.webp',
    'HEAVY-BAG':     'assets/images/backgrounds/dojo_interior_bg.webp',
    DASHBOARD:       'assets/images/backgrounds/memory_dojo_bg.webp',
    CURRICULUM:      'assets/images/backgrounds/belt_training_bg.webp'
  },

  // Per-skill data: technical profile + asset folder + tutorial video + 5 learning phases.
  // apchagi keeps its existing flat asset paths (already produced). narochagi/bakchagi3
  // use the new per-kick subfolders described in the asset restructuring plan — drop the
  // real frame images into these paths and everything below picks them up automatically.
  SKILLS: {
    apchagi: {
      id: 'apchagi', nextSkill: 'narochagi',
      name: { en: 'Ap Chagi', ar: 'آب تشاجي' },
      description: { en: 'Front Kick', ar: 'الركلة الأمامية المستقيمة' },
      assetFolder: null, // flat legacy paths, no subfolder
      video: 'assets/videos/apchagi-tutorial.mp4',
      technical: {
        strikingSurface: { en: 'Ball of the foot / instep', ar: 'مقدمة الرجل (مشط القدم) أو ظهرها' },
        target: { en: 'Face / Abdomen', ar: 'الوش / البطن' },
        pivotAngle: { en: '~90° pivot (outward)', ar: 'لفّة ~90° لبرّه' }
      },
      phases: [
        { num: 1, key: 'ready',
          title: { en: '1️⃣ Ready Stance (Junbi)', ar: '1️⃣ وضعية الاستعداد (جونبي)' },
          image: { boy: 'assets/images/characters/boy_char/apchagi/ready_boy.webp', girl: 'assets/images/characters/girl_char/apchagi/ready_girl.webp' },
          focus: { en: '👀 Focus: Feet shoulder-width apart — body straight', ar: '👀 خلي بالك: رجليك مفتوحين قد عرض كتافك — وجسمك مفرود' },
          tips: {
            en: ['✅ Hands up in front of chest for guard', '✅ Eyes always forward', '⚠️ Do not lean forward or back'],
            ar: ['✅ إيديك قدام صدرك عشان تحميك', '✅ عينك لقدام على طول', '⚠️ ماتميلش لقدام ولا لورا']
          }, color: '#2a9d8f' },
        { num: 2, key: 'chamber',
          title: { en: '2️⃣ Knee Lift (Chamber)', ar: '2️⃣ رفع الركبة (التجهيز)' },
          image: { boy: 'assets/images/characters/boy_char/apchagi/chamber_boy.webp', girl: 'assets/images/characters/girl_char/apchagi/chamber_girl.webp' },
          focus: { en: '👀 Focus: Pivot the standing foot ~90° outward and drive the knee up to chest height', ar: '👀 خلي بالك: لفّ الرجل اللي واقف عليها ~90° لبرّه وارفع ركبتك لحد صدرك بقوة' },
          tips: {
            en: ['✅ Knee must reach chest level, folded tight to the standing thigh', '✅ Standing foot pivots about 90° outward on its ball', '⚠️ Do not lift the knee out and away from the standing leg (that turns it into a circular kick)'],
            ar: ['✅ الركبة توصل لحد صدرك ولازقة في فخد الرجل اللي واقف عليها', '✅ الرجل اللي واقف عليها تلف حوالي 90° لبرّه على مشطها', '⚠️ ماتبعدش الركبة عن فخد الرجل اللي واقف عليها (ده بيحوّلها لركلة دائرية)']
          }, color: '#e76f51' },
        { num: 3, key: 'extension',
          title: { en: '3️⃣ Kick Extension (Strike)', ar: '3️⃣ فرد الركلة (الضربة)' },
          image: { boy: 'assets/images/characters/boy_char/apchagi/extension_boy.webp', girl: 'assets/images/characters/girl_char/apchagi/extension_girl.webp' },
          focus: { en: '👀 Focus: Snap the knee straight and drive the hip forward — strike with the ball of the foot', ar: '👀 خلي بالك: افرد ركبتك بسرعة وزق وسطك لقدام — واضرب بمشط رجلك' },
          tips: {
            en: ['✅ Leg fully extends forward as the hip pushes forward (and up, on high kicks)', '✅ Toes pulled back to expose the ball of the foot; keep the torso upright, not leaning back', '⚠️ Never strike with the toes, and never let the torso fall backward'],
            ar: ['✅ الرجل تتفرد على آخرها لقدام وإنت بتزق وسطك لقدام (ولفوق في الركلات العالية)', '✅ صوابع رجلك مثنية لورا عشان يبان المشط — وجسمك يفضل مفرود من غير ما تميل لورا', '⚠️ ماتضربش بصوابع رجلك، وماتميلش بجسمك لورا زيادة عن اللزوم']
          }, color: '#ff6b35' },
        { num: 4, key: 'recoil',
          title: { en: '4️⃣ Recoil (Pull Back)', ar: '4️⃣ سحب الرجل (الرجوع)' },
          image: { boy: 'assets/images/characters/boy_char/apchagi/recoil_boy.webp', girl: 'assets/images/characters/girl_char/apchagi/recoil_girl.webp' },
          focus: { en: '👀 Focus: Snap the leg back immediately after the strike', ar: '👀 خلي بالك: اسحب رجلك لورا بسرعة بعد الضربة على طول' },
          tips: {
            en: ['✅ Recoil as fast as the extension', '✅ Protects against leg grabs', '⚠️ Never leave the leg hanging'],
            ar: ['✅ اسحبها بنفس سرعة ما فردتها', '✅ كده محدش يعرف يمسك رجلك', '⚠️ ماتسيبش رجلك متعلقة في الهوا']
          }, color: '#e9c46a' },
        { num: 5, key: 'return',
          title: { en: '5️⃣ Return to Stance', ar: '5️⃣ الرجوع للوضعية' },
          image: { boy: 'assets/images/characters/boy_char/apchagi/return_boy.webp', girl: 'assets/images/characters/girl_char/apchagi/return_girl.webp' },
          focus: { en: '👀 Focus: Step down smoothly and regain your ready stance', ar: '👀 خلي بالك: نزّل رجلك على الأرض بالراحة وخلي توازنك مظبوط' },
          tips: {
            en: ['✅ Return to guard position immediately', '✅ Maintain balance throughout', '⚠️ Do not stomp the foot down'],
            ar: ['✅ ارجع لوضعية الاستعداد على طول', '✅ خليك متوازن طول الوقت', '⚠️ ماترميش رجلك على الأرض بتقل']
          }, color: '#457b9d' }
      ]
    },

    narochagi: { // Naeryeo Chagi (axe kick) — vertical rise, strike with heel/sole downward onto head/face
      id: 'narochagi', nextSkill: 'bakchagi3',
      name: { en: 'Naeryeo Chagi', ar: 'نارو تشاجي' },
      description: { en: 'Axe Kick', ar: 'الركلة المطرقية من فوق لتحت' },
      assetFolder: 'narochagi',
      video: 'assets/videos/naeryeochagi-tutorial.mp4',
      technical: {
        strikingSurface: { en: 'Heel', ar: 'الكعب' },
        target: { en: 'Head / Shoulder / Collarbone', ar: 'الراس / الكتف / الترقوة' },
        pivotAngle: { en: 'Minimal pivot (0°–45°)', ar: 'لفّة بسيطة (0° – 45°)' }
      },
      phases: [
        { num: 1, key: 'ready',
          title: { en: '1️⃣ Ready Stance (Junbi)', ar: '1️⃣ وضعية الاستعداد (جونبي)' },
          image: { boy: 'assets/images/characters/boy_char/narochagi/ready_boy.webp', girl: 'assets/images/characters/girl_char/narochagi/ready_girl.webp' },
          focus: { en: '👀 Focus: Guard up, weight centered, ready to raise the leg straight', ar: '👀 خلي بالك: إيديك مرفوعة للحماية ووزنك في النص وإنت جاهز ترفع رجلك مفرودة' },
          tips: { en: ['✅ Standing leg slightly bent for balance', '✅ Eyes on the target', '⚠️ Do not lean back early'],
                  ar: ['✅ الرجل اللي واقف عليها مثنية شوية عشان التوازن', '✅ عينك على الهدف', '⚠️ ماتميلش بجسمك لورا بدري'] }, color: '#2a9d8f' },
        { num: 2, key: 'chamber',
          title: { en: '2️⃣ Vertical Rise', ar: '2️⃣ الرفع لفوق' },
          image: { boy: 'assets/images/characters/boy_char/narochagi/rise_boy.webp', girl: 'assets/images/characters/girl_char/narochagi/rise_girl.webp' },
          focus: { en: '👀 Focus: Raise the straight leg vertically as high as possible — hips push upward and torso leans back slightly for balance', ar: '👀 خلي بالك: ارفع رجلك وهي مفرودة لفوق على قد ما تقدر — زق وسطك لفوق وميّل جسمك لورا شوية عشان التوازن' },
          tips: { en: ['✅ Keep the leg locked straight (or nearly straight) the whole way up — never bend the knee to reach higher', '✅ The standing foot only pivots a little (0°–45°)', '⚠️ Do not bend the knee while rising — that softens the whole strike'],
                  ar: ['✅ خلي رجلك مفرودة تقريبًا طول ما إنت بترفعها — ماتثنيش الركبة عشان توصل أعلى', '✅ الرجل اللي واقف عليها تلف شوية بس (0° – 45°)', '⚠️ ماتثنيش الركبة وإنت بترفع — ده بيضعّف الضربة كلها'] }, color: '#e76f51' },
        { num: 3, key: 'extension',
          title: { en: '3️⃣ Heel Drop (Strike)', ar: '3️⃣ نزول الكعب (الضربة)' },
          image: { boy: 'assets/images/characters/boy_char/narochagi/drop_boy.webp', girl: 'assets/images/characters/girl_char/narochagi/drop_girl.webp' },
          focus: { en: '👀 Focus: Snap the heel down sharply onto the target, letting gravity add force — ideal power hits around a 45° angle from vertical on the way down', ar: '👀 خلي بالك: نزّل الكعب لتحت بقوة وخلي الجاذبية تساعدك — أقوى ضربة بتبقى لما رجلك تكون بزاوية ~45° من الوضع الرأسي وهي نازلة' },
          tips: { en: ['✅ Strike with the heel — let the foot relax and fall freely', '✅ Drive downward, not forward, using the momentum of the drop', '⚠️ Do not strike with the toes or the ball of the foot'],
                  ar: ['✅ اضرب بالكعب — وسيب رجلك مرتخية تنزل براحتها', '✅ الضربة لتحت مش لقدام، وخلي قوة النزول تساعدك', '⚠️ ماتضربش بصوابع رجلك ولا بمشطها'] }, color: '#ff6b35' },
        { num: 4, key: 'recoil',
          title: { en: '4️⃣ Recoil', ar: '4️⃣ السحب' },
          image: { boy: 'assets/images/characters/boy_char/narochagi/recoil_boy.webp', girl: 'assets/images/characters/girl_char/narochagi/recoil_girl.webp' },
          focus: { en: '👀 Focus: Pull the leg back up quickly after impact', ar: '👀 خلي بالك: اسحب رجلك لفوق بسرعة بعد الضربة' },
          tips: { en: ['✅ Do not let the foot drop straight to the floor', '✅ Reset balance immediately', '⚠️ Avoid over-rotating the hips'],
                  ar: ['✅ ماتسيبش رجلك تقع على الأرض على طول', '✅ ظبّط توازنك على طول', '⚠️ ماتلفّش وسطك زيادة عن اللزوم'] }, color: '#e9c46a' },
        { num: 5, key: 'return',
          title: { en: '5️⃣ Return to Stance', ar: '5️⃣ الرجوع للوضعية' },
          image: { boy: 'assets/images/characters/boy_char/narochagi/return_boy.webp', girl: 'assets/images/characters/girl_char/narochagi/return_girl.webp' },
          focus: { en: '👀 Focus: Step down under control and reset your guard', ar: '👀 خلي بالك: انزل بالراحة وارجع ارفع إيديك للحماية' },
          tips: { en: ['✅ Land softly, knees soft', '✅ Return to ready stance', '⚠️ Do not stomp down'],
                  ar: ['✅ انزل بالراحة وركبك مرنة', '✅ ارجع لوضعية الاستعداد', '⚠️ ماتنزلش بقوة على الأرض'] }, color: '#457b9d' }
      ]
    },

    bakchagi3: { // Bik Chagi (Yeop Chagi / 옆차기) — the straight SIDE kick: body turns
                 // side-on to the target, standing foot pivots up to 180°, strike lands
                 // with the heel / outer blade edge of the foot (not the instep).
      id: 'bakchagi3', nextSkill: null,
      name: { en: 'Bik Chagi (Side Kick)', ar: 'بيك تشاجي (الركلة الجانبية)' },
      description: { en: 'Straight Side Kick', ar: 'الركلة الجانبية المستقيمة' },
      assetFolder: 'bikchagi',
      video: 'assets/videos/bikchagi-tutorial.mp4',
      technical: {
        strikingSurface: { en: 'Heel / outer blade (knife-edge) of the foot', ar: 'الكعب / حرف الرجل الخارجي (حرف السكينة)' },
        target: { en: 'Knee / Ribs / Chest / Head', ar: 'الركبة / الضلوع / الصدر / الراس' },
        pivotAngle: { en: 'Full 180° pivot', ar: 'لفّة كاملة 180°' }
      },
      phases: [
        { num: 1, key: 'ready',
          title: { en: '1️⃣ Ready Stance (Junbi)', ar: '1️⃣ وضعية الاستعداد (جونبي)' },
          image: { boy: 'assets/images/characters/boy_char/bikchagi/return_boy.webp', girl: 'assets/images/characters/girl_char/bikchagi/ready_girl.webp' },
          focus: { en: '👀 Focus: Guard up, weight balanced, ready to turn side-on to the target', ar: '👀 خلي بالك: إيديك مرفوعة للحماية ووزنك متوازن وإنت جاهز تلف بجنبك ناحية الهدف' },
          tips: { en: ['✅ Weight balanced on both feet', '✅ Keep the target in sight as you prepare to turn', '⚠️ Do not commit your weight forward too early'],
                  ar: ['✅ وزنك متقسم على رجليك الاتنين', '✅ خلي عينك على الهدف قبل ما تلف', '⚠️ ماترميش وزنك لقدام بدري'] }, color: '#2a9d8f' },
        { num: 2, key: 'chamber',
          title: { en: '2️⃣ Turn & Chamber the Knee', ar: '2️⃣ اللف ورفع الركبة (التجهيز)' },
          image: { boy: 'assets/images/characters/boy_char/bikchagi/recoil_boy.webp', girl: 'assets/images/characters/girl_char/bikchagi/chamber_girl.webp' },
          focus: { en: '👀 Focus: Turn your body side-on and lift the kicking knee to chest height, folded tight to protect it', ar: '👀 خلي بالك: لف جسمك بجنبك وارفع ركبة الرجل اللي هتضرب بيها لحد صدرك وهي مطوية كويس عشان تحميها' },
          tips: { en: ['✅ Pivot the standing foot toward 180° as the body turns sideways', '✅ Keep the back straight until the very last moment before kicking', '⚠️ Do not extend the leg before the knee has fully chambered'],
                  ar: ['✅ لف الرجل اللي واقف عليها لحد 180° وإنت بتلف جسمك بجنبك', '✅ خلي ضهرك مفرود لحد آخر لحظة قبل الركلة', '⚠️ ماتفردش رجلك قبل ما ترفع ركبتك للآخر'] }, color: '#e76f51' },
        { num: 3, key: 'extension',
          title: { en: '3️⃣ Straight Side Strike', ar: '3️⃣ الضربة الجانبية المستقيمة' },
          image: { boy: 'assets/images/characters/boy_char/bikchagi/extension_boy.webp', girl: 'assets/images/characters/girl_char/bikchagi/extension_girl.webp' },
          focus: { en: '👀 Focus: Complete the pivot to 180° and drive the leg out in a straight line, rotating the hip into the strike — hit with the heel / outer blade of the foot', ar: '👀 خلي بالك: كمّل اللفة لحد 180° وازق رجلك في خط مستقيم ولف وسطك عشان الضربة تبقى أقوى — اضرب بالكعب أو حرف الرجل الخارجي' },
          tips: { en: ['✅ Full 180° pivot on the standing foot, body/hip/knee/foot aligned toward the target in one straight line', '✅ Strike with the heel or the outer blade edge — toes pulled back', '⚠️ Never strike with the instep, and do not stop the rotation halfway'],
                  ar: ['✅ لفّة كاملة 180° على الرجل اللي واقف عليها، وجسمك/وسطك/ركبتك/رجلك كلهم في خط واحد مستقيم ناحية الهدف', '✅ اضرب بالكعب أو حرف الرجل الخارجي وصوابعك مسحوبة لورا', '⚠️ ماتضربش بمشط رجلك خالص، وماتوقفش اللفة في النص'] }, color: '#ff6b35' },
        { num: 4, key: 'recoil',
          title: { en: '4️⃣ Recoil', ar: '4️⃣ السحب' },
          image: { boy: 'assets/images/characters/boy_char/bikchagi/recoil_boy.webp', girl: 'assets/images/characters/girl_char/bikchagi/recoil_girl.webp' },
          focus: { en: '👀 Focus: Pull the leg straight back into the chambered position after impact', ar: '👀 خلي بالك: اسحب رجلك لورا لوضعية الطي على طول بعد الضربة' },
          tips: { en: ['✅ Retract along the same straight line the kick traveled', '✅ Keep guard up while recovering', '⚠️ Do not let the leg drop or dangle after the strike'],
                  ar: ['✅ اسحب رجلك على نفس الخط المستقيم بتاع الضربة', '✅ خلي إيديك مرفوعة للحماية وإنت بترجع', '⚠️ ماتسيبش رجلك تقع أو تتدلدل بعد الضربة'] }, color: '#e9c46a' },
        { num: 5, key: 'return',
          title: { en: '5️⃣ Return to Stance', ar: '5️⃣ الرجوع للوضعية' },
          image: { boy: 'assets/images/characters/boy_char/bikchagi/return_boy.webp', girl: 'assets/images/characters/girl_char/bikchagi/ready_girl.webp' },
          focus: { en: '👀 Focus: Lower the foot gently and reset to a balanced, guarded stance', ar: '👀 خلي بالك: نزّل رجلك بالراحة وارجع لوضعية متوازنة وإيديك مرفوعة' },
          tips: { en: ['✅ Reset feet to ready stance', '✅ Keep hands up throughout', '⚠️ Do not stomp the foot down or drop your guard'],
                  ar: ['✅ ظبّط رجليك تاني على وضعية الاستعداد', '✅ خلي إيديك مرفوعة طول الوقت', '⚠️ ماتنزلش رجلك بتقل وماتنزلش إيديك'] }, color: '#457b9d' }
      ]
    }
  },

  SETTINGS: {
    PASSING_SCORE: 85,                 // per-activity "you passed this attempt" bar (used inside each mini-game)
    SEVERE_FAIL_SCORE: 40,             // below this an attempt counts as a "real" struggle, not just missing the pass bar
    SEVERE_FAIL_STREAK: 3,             // this many severe fails in a row (not just misses) sends the player back to Learning
    SKILL_UNLOCK_THRESHOLD: 80,        // OVERALL weighted skill score needed to unlock the next skill
    GAMES_REQUIRED_PER_SKILL: 4, // form-control, puzzle, performance, action — the 4 mini-games (Quiz is a separate "Test", not a game)
    SKILL_UNLOCK_MESSAGE: {
      en: '🎉 New Skill Unlocked! You can now learn {skill}!',
      ar: '🎉 مهارة جديدة اتفتحت! دلوقتي تقدر تتعلم {skill}!'
    }
  }
};

