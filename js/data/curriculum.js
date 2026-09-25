// ============================================================================
// FULL CURRICULUM (v26) — belts → techniques → poomsae.
//
// This is the complete STRUCTURE of the syllabus: every belt, every stance,
// block, strike, kick and poomsae, with names (romanized Korean, Hangul,
// English, Egyptian Arabic), key points and common mistakes. Media (pictures
// and videos) are *slots*: the paths below are where the artists / coach drop
// the files. Nothing breaks while a file is missing — the screen shows a
// "coming soon" card. Run  python3 tools/check-curriculum.py  to see exactly
// which files are still missing (CONTENT_GUIDE.md has the specs).
//
// ⚠️ TEMPLATE: this follows a common Kukkiwon / World Taekwondo club syllabus
// for kids. Every club and federation orders things a little differently —
// the head coach should confirm (or re-order) it before release. Moving an
// item to another belt = moving its line; nothing else needs to change.
//
// status:  'playable' → already a full training path in the game (skillId)
//          'content'  → text is written, waiting for pictures/video
// ============================================================================

const Curriculum = (() => {
  const P = (en, ar) => ({ en, ar });

  // media slots, by kind. Kicks follow the same frame layout the three
  // playable kicks already use, so a new kick becomes playable just by
  // adding its frames + a GameConfig.SKILLS entry.
  const KICK_PHASES = ['ready', 'chamber', 'extension', 'recoil', 'return'];
  function mediaFor(it) {
    if (it.kind === 'kick') {
      const f = it.folder || it.id;
      return {
        frames: KICK_PHASES.flatMap(ph => ['boy', 'girl'].map(c => `assets/images/characters/${c}_char/${f}/${ph}_${c}.webp`)),
        photo: `assets/images/characters/boy_char/${f}/extension_boy.webp`,
        video: it.video || `assets/videos/${f}-tutorial.mp4`
      };
    }
    if (it.kind === 'poomsae') return {
      frames: [`assets/images/curriculum/${it.id}_diagram.webp`],
      photo: `assets/images/curriculum/${it.id}_diagram.webp`,
      video: `assets/videos/curriculum/${it.id}.mp4`
    };
    return {
      frames: ['boy', 'girl'].map(c => `assets/images/curriculum/${it.id}_${c}.webp`),
      photo: `assets/images/curriculum/${it.id}_boy.webp`,
      video: `assets/videos/curriculum/${it.id}.mp4`
    };
  }

  const KINDS = {
    basics:   { icon: '🙇', name: P('Basics & etiquette', 'الأساسيات والاحترام') },
    stance:   { icon: '🦶', name: P('Stances (Seogi)', 'الوقفات (سوجي)') },
    block:    { icon: '🛡️', name: P('Blocks (Makki)', 'الصدّات (ماكي)') },
    strike:   { icon: '👊', name: P('Punches & strikes', 'اللكمات والضربات') },
    kick:     { icon: '🦵', name: P('Kicks (Chagi)', 'الركلات (تشاجي)') },
    poomsae:  { icon: '🧭', name: P('Poomsae (forms)', 'البومسي (الأشكال)') },
    sparring: { icon: '🥊', name: P('Sparring & breaking', 'القتال والتكسير') }
  };

  // helper to write items compactly: points / mistakes are [en, ar] pairs
  const I = (id, kind, ko, hangul, en, ar, extra = {}) => ({
    ...extra, id, kind, ko, hangul, name: P(en, ar),
    points: (extra.points || []).map(([e, a]) => P(e, a)),
    mistakes: (extra.mistakes || []).map(([e, a]) => P(e, a)),
    status: extra.skillId ? 'playable' : 'content'
  });
  const T = (n, ko, trigram, meaningEn, meaningAr, moves, focusEn, focusAr) =>
    I(`taegeuk-${n}`, 'poomsae', `Taegeuk ${ko} Jang`, `태극 ${['일', '이', '삼', '사', '오', '육', '칠', '팔'][n - 1]}장`,
      `Taegeuk ${n}`, `تيجوك ${['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨'][n - 1]}`, {
        trigram, moves,
        points: [[`Meaning: ${meaningEn}`, `المعنى: ${meaningAr}`], [`${moves} movements — ${focusEn}`, `${moves} حركة — ${focusAr}`],
                 ['Start and finish on the same spot', 'تبدأ وتخلّص في نفس النقطة']],
        mistakes: [['Rushing — every move must finish before the next starts', 'الاستعجال — كل حركة لازم تخلص قبل اللي بعدها']]
      });

  const BELTS = [
    { id: 'white', color: '#f8fafc', accent: '#cbd5e1', geup: P('10th–9th Geup', 'الجوب ١٠–٩'), name: P('White Belt', 'الحزام الأبيض'),
      goal: P('Learn to stand, bow, punch and do the front kick.', 'تتعلم تقف صح وتحيّي وتلكم وتعمل الركلة الأمامية.'),
      items: [
        I('gyeongnye', 'basics', 'Charyeot · Gyeongnye', '차렷 · 경례', 'Attention & bow', 'انتباه وتحية', {
          points: [['Heels together, hands by your sides', 'الكعبين لازقين والإيدين جنبك'], ['Bow about 30°, eyes down', 'انحني حوالي ٣٠° وعينك لتحت']],
          mistakes: [['Bowing with the head only', 'إنك تحني راسك بس']] }),
        I('junbi', 'basics', 'Junbi', '준비', 'Ready stance', 'وقفة الاستعداد', {
          points: [['Feet one foot apart, fists in front of the belt', 'رجليك بينهم قد رجل، وقبضاتك قدام الحزام'], ['Breathe out and focus', 'خد نفس وركّز']] }),
        I('gihap', 'basics', 'Gihap', '기합', 'Kihap (the shout)', 'الكياي (الصرخة)', {
          points: [['Short and strong, from the belly', 'قصيرة وقوية من بطنك'], ['Shout at the moment of the strike', 'اصرخ لحظة الضربة بالظبط']] }),
        I('counting', 'basics', 'Hana · Dul · Set …', '하나 · 둘 · 셋 …', 'Counting 1–10 in Korean', 'العد من ١ لـ ١٠ بالكوري', {
          points: [['Hana, dul, set, net, daseot', 'هانا، دول، سيت، نيت، داسوت'], ['Yeoseot, ilgop, yeodeol, ahop, yeol', 'يوسوت، إلجوب، يودول، آهوب، يول']] }),
        I('naranhi-seogi', 'stance', 'Naranhi Seogi', '나란히서기', 'Parallel stance', 'الوقفة المتوازية', {
          points: [['Feet parallel, one foot-width apart', 'رجليك متوازيين وبينهم عرض رجل'], ['Weight in the middle', 'وزنك في النص']] }),
        I('ap-seogi', 'stance', 'Ap Seogi', '앞서기', 'Walking stance', 'وقفة المشي', {
          points: [['One natural step long', 'طولها خطوة عادية'], ['Both legs straight, weight in the middle', 'الرجلين مفرودين ووزنك في النص']],
          mistakes: [['Feet on one line (you lose balance)', 'الرجلين على خط واحد (هتفقد توازنك)']] }),
        I('ap-kubi', 'stance', 'Ap Kubi', '앞굽이', 'Front stance', 'الوقفة الأمامية', {
          points: [['Long stance, front knee over the toes', 'وقفة طويلة والركبة اللي قدام فوق صوابعك'], ['Back leg straight, about 2/3 weight on the front', 'الرجل اللي ورا مفرودة وحوالي ٢/٣ وزنك قدام']],
          mistakes: [['Back heel lifted', 'كعب الرجل اللي ورا مرفوع']] }),
        I('arae-makki', 'block', 'Arae Makki', '아래막기', 'Low block', 'الصدّة التحتانية', {
          points: [['Start the fist at the opposite shoulder', 'القبضة تبدأ عند الكتف التاني'], ['Stop one fist above the thigh', 'تقف فوق الفخد بمسافة قبضة']] }),
        I('momtong-an-makki', 'block', 'Momtong An Makki', '몸통안막기', 'Middle inside block', 'صدّة الوسط من جوّه', {
          points: [['Forearm sweeps from outside to the centre', 'الدراع بيلف من برّه لنص جسمك'], ['Fist at shoulder height', 'القبضة في مستوى كتفك']] }),
        I('momtong-jireugi', 'strike', 'Momtong Jireugi', '몸통지르기', 'Middle punch', 'لكمة الوسط', {
          points: [['Fist turns over at the very end', 'القبضة تلف في آخر لحظة'], ['Other fist pulls back to the hip', 'القبضة التانية ترجع على وسطك']],
          mistakes: [['Bent wrist', 'رسغ مكسور']] }),
        I('apchagi', 'kick', 'Ap Chagi', '앞차기', 'Front kick', 'الركلة الأمامية', { skillId: 'apchagi', folder: 'apchagi',
          points: [['Knee up first, then snap the foot', 'ارفع الركبة الأول وبعدين افرد رجلك بسرعة'], ['Hit with the ball of the foot', 'اضرب بمشط رجلك']] }),
        I('ap-ollyeo-chagi', 'kick', 'Ap Ollyeo Chagi', '앞올려차기', 'Front rising kick', 'الركلة الأمامية الطالعة', {
          points: [['Straight leg swings up like a pendulum', 'الرجل مفرودة وبتطلع زي البندول'], ['Stretching kick — control it on the way down', 'ركلة إطالة — تحكّم فيها وهي نازلة']] }),
        T(1, 'Il', 'Keon ☰', 'Heaven and light — the beginning', 'السما والنور — البداية', 18, 'walking & front stance, low block, middle punch, front kick', 'وقفة المشي والأمامية، صدّة تحتانية، لكمة وسط، ركلة أمامية')
      ] },

    { id: 'yellow', color: '#facc15', accent: '#a16207', geup: P('8th–7th Geup', 'الجوب ٨–٧'), name: P('Yellow Belt', 'الحزام الأصفر'),
      goal: P('High block, the roundhouse and axe kicks, Taegeuk 2 and 3.', 'الصدّة العالية، الركلة الدائرية والمطرقية، وتيجوك ٢ و٣.'),
      items: [
        I('olgul-makki', 'block', 'Eolgul Makki', '얼굴막기', 'High block', 'الصدّة العالية', {
          points: [['Forearm one fist above the forehead', 'الدراع فوق جبهتك بمسافة قبضة'], ['Arm slightly angled so the hit slides off', 'الدراع مايل شوية عشان الضربة تتزحلق']] }),
        I('bakkat-makki', 'block', 'Momtong Bakkat Makki', '몸통바깥막기', 'Middle outside block', 'صدّة الوسط لبرّه', {
          points: [['Forearm sweeps from the centre outwards', 'الدراع يلف من نص جسمك لبرّه'], ['Fist at shoulder height', 'القبضة في مستوى كتفك']] }),
        I('dubeon-jireugi', 'strike', 'Dubeon Jireugi', '두번지르기', 'Double punch', 'لكمتين ورا بعض', {
          points: [['Two punches, one rhythm', 'لكمتين في إيقاع واحد'], ['Hips stay square', 'وسطك يفضل مستقيم']] }),
        I('sonnal-mok-chigi', 'strike', 'Sonnal Mok Chigi', '손날목치기', 'Knife-hand neck strike', 'ضربة حد الإيد للرقبة', {
          points: [['Hit with the edge of the open hand', 'اضرب بحرف إيدك وهي مفتوحة'], ['Palm faces up at the end', 'كف إيدك لفوق في الآخر']] }),
        I('dollyo-chagi', 'kick', 'Dollyeo Chagi', '돌려차기', 'Roundhouse kick', 'الركلة الدائرية', {
          points: [['Pivot the standing foot and turn the hip over', 'لف الرجل اللي واقف عليها ولف وسطك'], ['Hit with the instep (top of the foot)', 'اضرب بوش رجلك']],
          mistakes: [['Kicking without turning the hip', 'تركل من غير ما تلف وسطك']] }),
        I('bandal-chagi', 'kick', 'Bandal Chagi', '반달차기', 'Half-moon (crescent) kick', 'ركلة نص القمر', {
          points: [['Halfway between front and roundhouse kick', 'في النص بين الأمامية والدائرية'], ['Fast and short — great for sparring', 'سريعة وقصيرة — ممتازة في القتال']] }),
        I('naeryeo-chagi', 'kick', 'Naeryeo Chagi', '내려차기', 'Axe kick', 'الركلة المطرقية', { skillId: 'narochagi', folder: 'narochagi', video: 'assets/videos/naeryeochagi-tutorial.mp4', aka: P('In the game: Naeryeo Chagi', 'في اللعبة: نارو تشاجي'),
          points: [['Leg rises high and straight', 'الرجل تطلع لفوق ومفرودة'], ['Heel drops down hard', 'الكعب ينزل بقوة لتحت']] }),
        T(2, 'I', 'Tae ☱', 'Joy — calm inside, strong outside', 'الفرحة — هادي من جوّه وقوي من برّه', 18, 'high block and front kick + punch combos', 'صدّة عالية وتركيبات ركلة أمامية + لكمة'),
        T(3, 'Sam', 'Ri ☲', 'Fire — energy and passion', 'النار — طاقة وحماس', 20, 'knife-hand strikes, back stance, double punches', 'ضربات حد الإيد، الوقفة الخلفية، لكمتين ورا بعض')
      ] },

    { id: 'green', color: '#22c55e', accent: '#15803d', geup: P('6th–5th Geup', 'الجوب ٦–٥'), name: P('Green Belt', 'الحزام الأخضر'),
      goal: P('Back stance, the side kick and push kick, Taegeuk 4 and 5.', 'الوقفة الخلفية، الركلة الجانبية وركلة الدفع، وتيجوك ٤ و٥.'),
      items: [
        I('dwit-kubi', 'stance', 'Dwit Kubi', '뒷굽이', 'Back stance', 'الوقفة الخلفية', {
          points: [['Feet in an L, about 70% weight on the back leg', 'رجليك على شكل حرف L وحوالي ٧٠٪ من وزنك على اللي ورا'], ['Both knees bent', 'الركبتين مثنيين']] }),
        I('beom-seogi', 'stance', 'Beom Seogi', '범서기', 'Tiger stance', 'وقفة النمر', {
          points: [['Front foot touches with the ball only', 'الرجل اللي قدام بتلمس بالمشط بس'], ['Almost all weight on the back leg', 'تقريبًا كل وزنك على اللي ورا']] }),
        I('juchum-seogi', 'stance', 'Juchum Seogi', '주춤서기', 'Horse-riding stance', 'وقفة الفارس', {
          points: [['Feet two foot-lengths apart, toes forward', 'بين رجليك قد رجلين وصوابعك لقدام'], ['Knees pushed out, back straight', 'الركب لبرّه وضهرك مفرود']] }),
        I('sonnal-makki', 'block', 'Sonnal Makki', '손날막기', 'Knife-hand block', 'صدّة حد الإيد', {
          points: [['Usually done in back stance', 'غالبًا بتتعمل في الوقفة الخلفية'], ['Both hands open, the back one guards the solar plexus', 'الإيدين مفتوحين واللي ورا بتحمي بطنك']] }),
        I('deung-jumeok', 'strike', 'Deung Jumeok Ap Chigi', '등주먹앞치기', 'Back-fist strike', 'ضربة ضهر القبضة', {
          points: [['Snap from the elbow', 'الضربة طالعة من الكوع بسرعة'], ['Hit with the two big knuckles', 'اضرب بالعقلتين الكبار']] }),
        I('palkup-chigi', 'strike', 'Palkup Dollyeo Chigi', '팔굽돌려치기', 'Turning elbow strike', 'ضربة الكوع الدائرية', {
          points: [['Turn the hips with the elbow', 'لف وسطك مع الكوع'], ['Short distance, big power', 'مسافة قصيرة وقوة كبيرة']] }),
        I('yeop-chagi', 'kick', 'Yeop Chagi', '옆차기', 'Side kick', 'الركلة الجانبية', { skillId: 'bakchagi3', folder: 'bikchagi', video: 'assets/videos/bikchagi-tutorial.mp4', aka: P('In the game: Bik Chagi', 'في اللعبة: بيك تشاجي'),
          points: [['Body turns side-on, standing foot pivots', 'جسمك يلف بجنبه والرجل الواقفة تلف'], ['Hit with the heel / blade of the foot', 'اضرب بالكعب أو حرف رجلك']] }),
        I('mireo-chagi', 'kick', 'Mireo Chagi', '밀어차기', 'Push kick', 'ركلة الدفع', {
          points: [['Push with the whole sole', 'ادفع بكل باطن رجلك'], ['Used to make distance', 'بتستخدمها عشان تبعد المنافس']] }),
        T(4, 'Sa', 'Jin ☳', 'Thunder — courage and calm in danger', 'الرعد — شجاعة وهدوء وقت الخطر', 20, 'knife-hand blocks, side kicks, back-fist', 'صدّات حد الإيد، ركلات جانبية، ضربة ضهر القبضة'),
        T(5, 'O', 'Seon ☴', 'Wind — gentle but strong', 'الريح — هادية بس قوية', 20, 'hammer-fist, elbow strikes, side kick', 'ضربة المطرقة، ضربات الكوع، الركلة الجانبية')
      ] },

    { id: 'blue', color: '#3b82f6', accent: '#1d4ed8', geup: P('4th–3rd Geup', 'الجوب ٤–٣'), name: P('Blue Belt', 'الحزام الأزرق'),
      goal: P('Back kick, hook kick, jumping kicks, Taegeuk 6 and 7, first sparring.', 'الركلة الخلفية، الخطافية، الركلات بالنطة، تيجوك ٦ و٧، وأول قتال.'),
      items: [
        I('hecheo-makki', 'block', 'Hecheo Makki', '헤쳐막기', 'Wedging block', 'الصدّة المفتوحة', {
          points: [['Both forearms open outwards together', 'الدراعين يفتحوا لبرّه مع بعض'], ['Fists at shoulder width', 'القبضات قد عرض كتافك']] }),
        I('pyeonsonkkeut', 'strike', 'Pyeonsonkkeut Sewo Jjireugi', '편손끝세워찌르기', 'Spear-hand thrust', 'طعنة أطراف الصوابع', {
          points: [['Fingers together and slightly bent', 'صوابعك لازقين ومثنيين شوية'], ['Other hand presses under the elbow', 'الإيد التانية تحت الكوع']] }),
        I('dwi-chagi', 'kick', 'Dwi Chagi', '뒤차기', 'Back kick', 'الركلة الخلفية', {
          points: [['Look over the shoulder before you kick', 'بص من فوق كتفك قبل ما تركل'], ['Kick in a straight line, heel first', 'اركل في خط مستقيم والكعب الأول']],
          mistakes: [['Spinning all the way round (turns into a side kick)', 'تلف لفة كاملة (بتقلب ركلة جانبية)']] }),
        I('huryeo-chagi', 'kick', 'Huryeo Chagi', '후려차기', 'Hook kick', 'الركلة الخطافية', {
          points: [['Kick past the target, then hook back', 'اركل جنب الهدف وبعدين اسحب لورا'], ['Hit with the heel or sole', 'اضرب بالكعب أو باطن الرجل']] }),
        I('twio-ap-chagi', 'kick', 'Twio Ap Chagi', '뛰어앞차기', 'Jumping front kick', 'الركلة الأمامية بالنطة', {
          points: [['Drive the other knee up to jump', 'ارفع الركبة التانية عشان تنط'], ['Land on both feet, guard up', 'انزل على رجليك الاتنين وإيديك فوق']] }),
        I('hanbeon-kyorugi', 'sparring', 'Hanbeon Kyorugi', '한번겨루기', 'One-step sparring', 'القتال بخطوة واحدة', {
          points: [['Partner attacks once, you defend and counter', 'زميلك يهجم مرة وإنت تصد وترد'], ['Control every strike — never hit for real', 'تحكّم في كل ضربة — ماتضربش بجد']] }),
        T(6, 'Yuk', 'Gam ☵', 'Water — keep going around obstacles', 'المية — كمّل حتى لو فيه عقبات', 19, 'roundhouse kicks, high knife-hand, wedging block', 'ركلات دائرية، حد الإيد العالي، الصدّة المفتوحة'),
        T(7, 'Chil', 'Gan ☶', 'Mountain — stop and move at the right moment', 'الجبل — اقف واتحرك في الوقت الصح', 25, 'tiger stance, crescent kicks, knee strike', 'وقفة النمر، ركلات نص القمر، ضربة الركبة')
      ] },

    { id: 'red', color: '#ef4444', accent: '#b91c1c', geup: P('2nd–1st Geup', 'الجوب ٢–١'), name: P('Red Belt', 'الحزام الأحمر'),
      goal: P('Spinning and jumping kicks, Taegeuk 8, sparring rules and breaking.', 'الركلات اللي بتلف وبالنطة، تيجوك ٨، قوانين القتال والتكسير.'),
      items: [
        I('dwi-huryeo-chagi', 'kick', 'Dwi Huryeo Chagi', '뒤후려차기', 'Spinning hook kick', 'الركلة الخطافية اللي بتلف', {
          points: [['Spin on the ball of the front foot', 'لف على مشط الرجل اللي قدام'], ['Head turns first, then the leg follows', 'راسك تلف الأول والرجل وراها']] }),
        I('twio-dollyo-chagi', 'kick', 'Twio Dollyeo Chagi', '뛰어돌려차기', 'Jumping roundhouse kick', 'الركلة الدائرية بالنطة', {
          points: [['Jump up, not forward', 'نط لفوق مش لقدام'], ['Turn the hip in the air', 'لف وسطك وإنت في الهوا']] }),
        I('narae-chagi', 'kick', 'Narae Chagi', '나래차기', 'Double roundhouse kick', 'الركلة الدائرية المزدوجة', {
          points: [['Two roundhouse kicks, left-right, with a small jump', 'ركلتين دائريتين شمال ويمين بنطة صغيرة'], ['Keep the rhythm fast', 'خلي الإيقاع سريع']] }),
        I('kyorugi', 'sparring', 'Kyorugi', '겨루기', 'Sparring rules', 'قوانين القتال', {
          points: [['Points for kicks to the body and head, punches to the body', 'نقط للركلات على الجسم والراس وللكمات على الجسم'], ['No attacks below the belt or to the back of the head', 'ممنوع تحت الحزام أو ورا الراس']] }),
        I('gyeokpa', 'sparring', 'Gyeokpa', '격파', 'Board breaking', 'تكسير الخشب', {
          points: [['Aim through the board, not at it', 'صوّب لورا اللوح مش عليه'], ['Only with the coach and the right boards', 'مع المدرب وبالألواح المناسبة بس']] }),
        T(8, 'Pal', 'Gon ☷', 'Earth — the end and a new beginning', 'الأرض — النهاية وبداية جديدة', 24, 'jumping double front kick, back stance, elbow strikes', 'ركلة أمامية مزدوجة بالنطة، الوقفة الخلفية، ضربات الكوع')
      ] },

    { id: 'black', color: '#111827', accent: '#f59e0b', geup: P('1st Poom / Dan', 'البوم / الدان الأول'), name: P('Black Belt', 'الحزام الأسود'),
      goal: P('Koryo, all eight Taegeuk, free sparring and breaking.', 'كوريو، كل التيجوك التمانية، القتال الحر والتكسير.'),
      items: [
        I('hakdari-seogi', 'stance', 'Hakdari Seogi', '학다리서기', 'Crane stance', 'وقفة الكركي', {
          points: [['Stand on one leg, the other foot at the knee', 'اقف على رجل واحدة والتانية عند ركبتك'], ['Standing knee slightly bent', 'الركبة الواقفة مثنية شوية']] }),
        I('koryo', 'poomsae', 'Koryo', '고려', 'Koryo', 'كوريو', { moves: 30,
          points: [['Meaning: the strong spirit of the Koryo people', 'المعنى: روح شعب كوريو القوية'], ['30 movements — first black-belt form', '٣٠ حركة — أول شكل للحزام الأسود'], ['Double side kicks, knife-hand and crane stance', 'ركلات جانبية مزدوجة، حد الإيد، ووقفة الكركي']] }),
        I('taegeuk-review', 'poomsae', 'Taegeuk 1–8', '태극 1–8장', 'All Taegeuk review', 'مراجعة كل التيجوك', {
          points: [['Any Taegeuk, called by the examiner', 'أي تيجوك يطلبه الممتحن'], ['Power, speed and rhythm are marked', 'بيتقيّم القوة والسرعة والإيقاع']] }),
        I('free-kyorugi', 'sparring', 'Jayu Kyorugi', '자유겨루기', 'Free sparring', 'القتال الحر', {
          points: [['Full gear: helmet, chest guard, shin and arm guards, mouth guard', 'كل الحماية: خوذة، صدرية، واقي رجل ودراع، وواقي سنان'], ['Respect the referee and the partner', 'احترم الحكم والزميل']] })
      ] }
  ];

  // attach media slots + belt id to every item
  BELTS.forEach(b => b.items.forEach(it => { it.belt = b.id; it.media = mediaFor(it); }));

  const all = () => BELTS.flatMap(b => b.items);
  const byId = id => all().find(i => i.id === id);
  const count = () => ({ belts: BELTS.length, items: all().length, playable: all().filter(i => i.status === 'playable').length,
                         poomsae: all().filter(i => i.kind === 'poomsae').length, kicks: all().filter(i => i.kind === 'kick').length });
  return { BELTS, KINDS, KICK_PHASES, all, byId, count, mediaFor };
})();
if (typeof window !== 'undefined') window.Curriculum = Curriculum;
