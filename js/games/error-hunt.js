// =====================================================================
// BONUS GAME (Ap Chagi only): ERROR HUNT
// The player sees an Ap Chagi kick with ONE hidden technical mistake per
// level and taps the body part that is wrong (head / kicking leg / torso /
// standing foot). It is an extra practice game: its best score is stored in
// skillGameScores.apchagi.errorHunt, but it does NOT count towards the
// weighted mastery score that unlocks the next skill.
// =====================================================================
class ErrorHuntSystem {

  // Each level shows the player's own character (boy / girl) with ONE deliberate flaw.
  // `art` = which prepared picture to use, `zone` = the body part that is wrong.
  static LEVELS = [
    {
      art: 'head', zone: 'head',
      title:   { en: 'Head and Eyes', ar: 'الراس والعينين' },
      desc:    { en: 'A fighter always keeps the eyes on the target. Check the head.',
                 ar: 'المقاتل عينه دايمًا على الهدف. بص على وضع الراس.' },
      success: { en: 'Spot on! Keep the head up and the eyes forward on the target — never look down at your own kick.',
                 ar: 'عينك حلوة أوي! خلّي راسك مرفوعة وعينك على الهدف، وماتبصش لتحت وإنت بتركل.' },
      fail:    { en: 'That part looks fine. Look at where the fighter is looking.',
                 ar: 'الجزء ده شكله سليم. بص المقاتل باصص على فين.' }
    },
    {
      art: 'knee', zone: 'kick',
      title:   { en: 'The Kicking Leg', ar: 'رجل الركلة' },
      desc:    { en: 'The kick should snap out and finish with a straight leg. Check the kicking leg.',
                 ar: 'لازم الركلة تطلع وتخلص والرجل مفرودة. بص على رجل الركلة.' },
      success: { en: 'Great! The knee must snap fully straight at the end of the kick — a bent knee steals the power.',
                 ar: 'جامد! لازم الركبة تتفرد على الآخر في آخر الركلة، الركبة المتنية بتضعّف القوة.' },
      fail:    { en: 'That part looks fine. Look at the shape of the kicking leg — is it fully extended?',
                 ar: 'الجزء ده شكله سليم. بص على شكل رجل الركلة: هي مفرودة على الآخر؟' }
    },
    {
      art: 'lean', zone: 'torso',
      title:   { en: 'Torso and Back Posture', ar: 'استقامة الجذع والضهر' },
      desc:    { en: 'The drive is good, but your balance depends on the position of the upper body.',
                 ar: 'قوة الدفع كويسة، بس توازن الجسم بيتأثر بوضع الجزء اللي فوق من الجذع.' },
      success: { en: 'Exactly! Leaning too far back drains the kick\'s power and throws you off balance.',
                 ar: 'صح جدًا! الميلان الزيادة لورا بيضيّع قوة الركلة ويبوّظ توازن المقاتل.' },
      fail:    { en: 'That part looks fine. Look at how the upper body leans compared with the hips.',
                 ar: 'الجزء ده شكله سليم. بص على ميل الجزء اللي فوق من الجسم مقارنةً بالوسط.' }
    },
    {
      art: 'heel', zone: 'stand',
      title:   { en: 'Base of Support (Standing Foot)', ar: 'قاعدة الارتكاز (رجل السند)' },
      desc:    { en: 'A powerful kick starts from a solid base. Check the foot you are standing on.',
                 ar: 'الركلة القوية بتبدأ من قاعدة ثابتة. بص على الرجل اللي واقف عليها.' },
      success: { en: 'Excellent! Pivot first, then plant the standing foot firmly — a lifted heel at impact wastes the energy.',
                 ar: 'برافو! لفّ قدم الارتكاز الأول وبعدين ثبّتها كويس في الأرض؛ لأن الكعب المرفوع وقت الضربة بيضيّع الطاقة.' },
      fail:    { en: 'That part looks fine. Check how the foot you are standing on meets the floor.',
                 ar: 'الجزء ده شكله سليم. شوف الرجل اللي واقف عليها لامسة الأرض إزاي.' }
    }
  ];

  static ZONE_LABELS = {
    head:  { en: 'Head and eyes',   ar: 'الراس والعينين' },
    torso: { en: 'Torso and arms',  ar: 'الجذع والدراعين' },
    kick:  { en: 'Kicking leg',     ar: 'رجل الركلة' },
    stand: { en: 'Standing foot',   ar: 'رجل الارتكاز' }
  };

  static MISS_HINT = {
    en: 'Tap directly on one of the fighter\'s parts: the head, torso, kicking leg or standing foot.',
    ar: 'دوس على طول على جزء من المقاتل: الراس، الجذع، رجل الركلة، أو قدم الارتكاز.'
  };

  // Prepared pictures (assets/images/error_hunt/<boy|girl>_<art>.webp) and the tappable
  // polygons for each, in the pictures' own pixel coordinates.
  static ART = {"boy":{"levels":{"head":{"image":"assets/images/error_hunt/boy_head.webp","w":903,"h":910,"zones":{"head":[[[249,53],[237,70],[213,73],[187,122],[188,185],[216,239],[213,269],[257,285],[344,284],[372,254],[370,224],[379,217],[384,176],[415,152],[414,88],[400,83],[396,68],[308,52]]],"torso":[[[220,262],[208,302],[210,359],[260,446],[291,479],[329,562],[365,567],[453,509],[455,471],[443,470],[405,346],[386,341],[407,316],[403,282],[377,263],[332,271],[345,258],[345,233]]],"kick":[[[827,231],[816,221],[784,223],[779,264],[750,327],[561,349],[360,399],[334,433],[338,491],[384,526],[408,526],[647,450],[766,422],[794,424],[807,377],[839,359]]],"stand":[[[404,424],[354,426],[330,446],[324,464],[331,591],[354,640],[313,801],[308,892],[317,901],[443,886],[440,856],[387,837],[421,831],[460,681],[453,490],[443,484],[430,438]]]}},"knee":{"image":"assets/images/error_hunt/boy_knee.webp","w":903,"h":910,"zones":{"head":[[[338,45],[290,36],[262,51],[204,57],[173,73],[169,96],[149,104],[145,185],[161,219],[218,265],[218,286],[289,283],[348,255],[359,222],[345,137],[357,115],[357,80]]],"torso":[[[220,262],[208,302],[210,359],[260,446],[291,479],[329,562],[365,567],[453,509],[455,471],[443,470],[405,346],[386,341],[407,316],[403,282],[377,263],[332,271],[345,258],[345,233]]],"kick":[[[333,438],[340,494],[386,526],[425,522],[576,465],[674,544],[695,547],[697,564],[754,559],[769,569],[800,568],[885,496],[880,459],[753,485],[752,463],[636,357],[586,350],[583,343],[473,362],[443,378],[367,396],[346,410]]],"stand":[[[404,424],[354,426],[330,446],[324,464],[331,591],[354,640],[313,801],[308,892],[317,901],[443,886],[440,856],[387,837],[421,831],[460,681],[453,490],[443,484],[430,438]]]}},"lean":{"image":"assets/images/error_hunt/boy_lean.webp","w":903,"h":910,"zones":{"head":[[[106,105],[104,121],[89,122],[83,141],[41,169],[32,197],[23,198],[18,262],[26,264],[33,300],[70,331],[155,343],[158,361],[184,361],[221,335],[257,282],[250,222],[232,216],[219,188],[195,168],[194,134],[177,112],[155,102]]],"torso":[[[237,269],[220,285],[219,299],[204,299],[154,333],[163,414],[189,445],[289,511],[356,575],[391,576],[454,489],[450,452],[435,451],[359,353],[333,351],[341,332],[337,296],[316,286],[278,286],[265,308],[255,308],[263,270]]],"kick":[[[817,228],[777,225],[772,266],[743,329],[553,351],[352,401],[326,438],[334,498],[377,528],[401,528],[575,469],[759,423],[787,426],[800,378],[823,372],[833,354]]],"stand":[[[399,426],[342,430],[317,465],[329,596],[355,642],[313,801],[308,892],[317,901],[443,886],[440,856],[387,837],[421,832],[462,680],[447,490],[437,484],[427,445]]]}},"heel":{"image":"assets/images/error_hunt/boy_heel.webp","w":903,"h":910,"zones":{"head":[[[341,27],[294,18],[265,33],[207,39],[176,55],[172,78],[152,86],[148,166],[164,201],[221,246],[222,268],[292,265],[354,231],[363,176],[353,167],[349,117],[361,96],[361,65]]],"torso":[[[223,244],[212,282],[215,344],[263,427],[294,461],[333,544],[371,548],[457,491],[459,453],[446,451],[409,328],[390,323],[410,299],[406,263],[380,245],[336,253],[349,240],[349,215]]],"kick":[[[828,208],[788,205],[785,238],[754,309],[564,331],[362,382],[337,416],[343,475],[387,508],[411,508],[586,449],[766,410],[769,403],[797,406],[811,358],[834,352],[843,338]]],"stand":[[[374,405],[343,417],[328,445],[337,572],[362,624],[327,799],[297,821],[296,854],[381,909],[413,909],[414,880],[388,839],[397,817],[432,811],[467,679],[457,469],[447,464],[437,424],[413,407]]]}}}},"girl":{"levels":{"head":{"image":"assets/images/error_hunt/girl_head.webp","w":801,"h":926,"zones":{"head":[[[195,32],[177,50],[162,91],[161,164],[154,185],[134,196],[135,255],[215,254],[220,269],[269,289],[336,281],[368,265],[380,225],[411,189],[418,164],[413,117],[384,74],[350,53],[300,48],[289,28],[269,19],[231,19]]],"torso":[[[125,282],[125,307],[143,314],[182,313],[212,299],[211,346],[226,417],[272,467],[294,534],[321,575],[335,585],[375,583],[429,563],[449,545],[462,570],[502,563],[502,537],[487,509],[508,503],[505,468],[427,476],[427,502],[418,503],[400,425],[404,409],[427,405],[427,380],[394,366],[403,358],[403,330],[383,302],[350,305],[306,255],[248,264],[187,255],[185,273],[168,281]]],"kick":[[[741,283],[730,276],[697,280],[677,363],[508,362],[439,382],[381,384],[377,402],[340,411],[318,434],[314,489],[321,506],[353,528],[428,530],[551,483],[688,469],[693,431],[749,424],[762,411]]],"stand":[[[350,461],[325,476],[312,503],[323,620],[347,658],[311,809],[311,834],[319,837],[313,897],[458,902],[462,866],[409,842],[417,841],[457,709],[448,522],[415,467]]]}},"knee":{"image":"assets/images/error_hunt/girl_knee.webp","w":801,"h":926,"zones":{"head":[[[351,78],[308,52],[273,46],[216,55],[160,48],[135,61],[108,102],[111,173],[140,242],[128,254],[134,305],[173,313],[211,296],[212,284],[299,289],[319,265],[348,254],[363,233],[361,171],[370,150],[370,109]]],"torso":[[[125,282],[125,307],[143,314],[182,313],[212,299],[211,346],[226,417],[272,467],[294,534],[321,575],[335,585],[375,583],[429,563],[449,545],[462,570],[502,563],[502,537],[487,509],[508,503],[505,468],[427,476],[427,502],[418,503],[400,425],[404,409],[427,405],[427,380],[394,366],[403,358],[403,330],[383,302],[350,305],[306,255],[248,264],[187,255],[185,273],[168,281]]],"kick":[[[314,449],[318,500],[344,525],[432,528],[462,520],[494,496],[523,492],[594,562],[622,562],[636,551],[668,585],[705,585],[782,511],[776,470],[746,470],[723,485],[683,493],[580,370],[537,369],[533,357],[378,384],[375,401],[328,420]]],"stand":[[[350,461],[325,476],[312,503],[323,620],[347,658],[311,809],[311,834],[319,837],[313,897],[458,902],[462,866],[409,842],[417,841],[457,709],[448,522],[415,467]]]}},"lean":{"image":"assets/images/error_hunt/girl_lean.webp","w":801,"h":926,"zones":{"head":[[[175,122],[88,123],[52,144],[32,170],[0,176],[0,317],[68,372],[68,399],[87,400],[87,419],[128,418],[158,360],[181,358],[223,332],[231,300],[245,286],[246,218],[224,197],[205,139]]],"torso":[[[62,380],[62,405],[107,405],[135,385],[147,361],[150,397],[195,471],[254,500],[302,557],[342,586],[383,590],[440,544],[454,514],[471,531],[496,531],[507,518],[507,492],[482,469],[491,460],[486,428],[459,427],[414,453],[412,484],[365,407],[381,398],[381,373],[340,370],[342,337],[313,316],[285,316],[277,326],[223,299],[198,299],[147,332],[110,333],[110,355],[99,367]]],"kick":[[[735,285],[691,281],[671,364],[505,363],[436,383],[374,386],[371,403],[331,414],[310,439],[314,507],[344,529],[425,531],[546,484],[682,470],[687,432],[742,426],[755,414]]],"stand":[[[338,464],[318,478],[305,507],[321,626],[347,662],[311,809],[311,834],[319,837],[313,897],[458,902],[462,866],[410,843],[417,842],[458,712],[459,641],[442,522],[423,482],[405,467]]]}},"heel":{"image":"assets/images/error_hunt/girl_heel.webp","w":801,"h":926,"zones":{"head":[[[355,62],[301,32],[248,30],[220,38],[160,32],[120,64],[111,87],[111,137],[143,224],[131,238],[139,290],[175,297],[214,280],[215,267],[302,272],[323,249],[351,238],[366,217],[364,155],[374,127],[373,92]]],"torso":[[[128,266],[128,290],[150,298],[182,297],[215,283],[214,328],[229,400],[274,449],[298,518],[338,569],[411,555],[453,528],[465,554],[505,546],[505,519],[491,493],[511,487],[508,451],[432,459],[430,485],[421,486],[403,409],[407,392],[430,389],[430,364],[397,349],[406,342],[406,311],[388,287],[353,288],[309,239],[227,248],[215,238],[190,238],[189,255],[168,266]]],"kick":[[[745,267],[734,260],[700,264],[680,346],[514,345],[445,365],[384,368],[379,386],[341,396],[320,421],[324,489],[358,512],[434,513],[556,466],[692,452],[697,414],[751,408],[765,395]]],"stand":[[[351,445],[329,459],[315,488],[328,603],[353,645],[326,804],[308,822],[308,852],[386,915],[434,916],[433,889],[407,843],[409,824],[427,824],[464,691],[466,627],[452,508],[435,467],[416,449]]]}}}}};

  // Level score by number of wrong taps on that level. One slip costs 30
  // points; a run needs 85% (GameConfig.SETTINGS.PASSING_SCORE) to count.
  static SCORE_BY_MISTAKES = [100, 70, 40];

  static gameState = null;
  static levelIndex = 0;
  static levelMistakes = 0;
  static totalMistakes = 0;
  static levelScores = [];
  static locked = false;
  static feedback = null;      // { ok: boolean, kind: 'success' | 'fail' | 'miss' } | null
  static _fbToken = 0;

  static get ar() { return this.gameState?.currentLanguage === 'ar'; }
  static pick(obj) { return this.ar ? obj.ar : obj.en; }

  static initialize(gameState) {
    this.gameState = gameState;
    // Error Hunt is drawn for the front kick only. The card is hidden for
    // other skills; this is just a safety net.
    if (gameState.currentSkill !== 'apchagi') {
      screenTimeout(() => ScreenManagerInstance.switchScreen('games'), 0);
      return;
    }
    this.levelIndex = 0;
    this.totalMistakes = 0;
    this.levelScores = [];
    const ch = gameState.playerCharacter === 'girl' ? 'girl' : 'boy';
    // These are the same character images already used in Learning, so
    // they're almost always warm in the browser cache already — this just
    // covers the case where a player jumps straight to Error Hunt first.
    this.LEVELS.forEach(l => { const im = new Image(); im.src = this.ART[ch].levels[l.art].image.replace(/ /g, '%20'); });
    this.bindControls();
    this.loadLevel();
  }

  // Delegated listeners on the board + the Next button, attached once.
  static bindControls() {
    const board = document.getElementById('eh-board');
    if (board && !board._ehBound) {
      board._ehBound = true;
      board.addEventListener('click', (e) => {
        const zone = e.target.closest('[data-eh-zone]');
        if (zone) this.handleTap(zone.dataset.ehZone);
        else if (e.target.closest('svg')) this.handleTap(null);
      });
      board.addEventListener('keydown', (e) => {
        const zone = e.target.closest?.('[data-eh-zone]');
        if (zone && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          this.handleTap(zone.dataset.ehZone);
        }
      });
    }
    const next = document.getElementById('eh-next-btn');
    if (next && !next._ehBound) {
      next._ehBound = true;
      next.addEventListener('click', () => this.next());
    }
  }

  static loadLevel() {
    this.locked = false;
    this.levelMistakes = 0;
    this.feedback = null;
    this._fbToken++;
    const level = this.LEVELS[this.levelIndex];
    const board = document.getElementById('eh-board');
    if (board) board.innerHTML = this.buildBoard(level);
    this.render();
  }

  // Text-only refresh: safe to call at any time (also on language change)
  // without touching the drawing or the player's progress.
  static render() {
    const level = this.LEVELS[this.levelIndex];
    if (!level) return;
    const ar = this.ar;
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    set('eh-level-badge', ar ? `المستوى ${this.levelIndex + 1} / ${this.LEVELS.length}`
                             : `Level ${this.levelIndex + 1} / ${this.LEVELS.length}`);
    set('eh-mistakes', ar ? `الأخطاء: ${this.totalMistakes}` : `Mistakes: ${this.totalMistakes}`);
    set('eh-level-title', this.pick(level.title));
    set('eh-level-desc', this.pick(level.desc));

    document.querySelectorAll('#eh-board [data-eh-zone]').forEach((z) => {
      z.setAttribute('aria-label', this.pick(this.ZONE_LABELS[z.dataset.ehZone]));
    });

    const box = document.getElementById('eh-feedback');
    const nextBtn = document.getElementById('eh-next-btn');
    if (!box) return;
    if (!this.feedback) {
      box.classList.add('hidden');
      if (nextBtn) nextBtn.classList.add('hidden');
      return;
    }
    const { ok, kind } = this.feedback;
    box.classList.remove('hidden', 'ok', 'bad');
    box.classList.add(ok ? 'ok' : 'bad');
    set('eh-fb-icon', ok ? '✓' : '✕');
    set('eh-fb-title', ok ? (ar ? 'جبتها!' : 'Nailed it!')
                          : (ar ? 'مش ده الغلط' : 'Not the mistake'));
    set('eh-fb-msg', kind === 'success' ? this.pick(level.success)
                   : kind === 'fail'    ? this.pick(level.fail)
                   :                      this.pick(this.MISS_HINT));
    if (nextBtn) {
      nextBtn.classList.toggle('hidden', !ok);
      const last = this.levelIndex === this.LEVELS.length - 1;
      set('eh-next-label', last ? (ar ? 'خلّص' : 'Finish') : (ar ? 'المستوى اللي بعده' : 'Next Level'));
    }
  }

  static handleTap(zoneId) {
    if (this.locked) return;
    const level = this.LEVELS[this.levelIndex];
    const gs = this.gameState;
    const zones = zoneId ? [...document.querySelectorAll(`#eh-board [data-eh-zone="${zoneId}"]`)] : [];

    if (zoneId) window.Review?.note(level.art, zoneId === level.zone, { skill: 'apchagi' });
    if (zoneId && zoneId === level.zone) {
      this.locked = true;
      this.levelScores.push(this.SCORE_BY_MISTAKES[Math.min(this.levelMistakes, this.SCORE_BY_MISTAKES.length - 1)]);
      zones.forEach((z) => z.classList.add('eh-correct'));
      gs.playSound('success');
      this.feedback = { ok: true, kind: 'success' };
    } else {
      this.levelMistakes++;
      this.totalMistakes++;
      gs.playSound('error');
      zones.forEach((z) => {
        z.classList.remove('eh-wrong');
        void z.getBoundingClientRect();     // restart the flash animation
        z.classList.add('eh-wrong');
      });
      this.feedback = { ok: false, kind: zoneId ? 'fail' : 'miss' };
      // A wrong answer's message clears itself so the panel doesn't clutter up.
      const token = ++this._fbToken;
      screenTimeout(() => {
        if (token === this._fbToken && !this.locked) { this.feedback = null; this.render(); }
      }, 4000);
    }
    this.render();
  }

  static next() {
    if (!this.locked) return;
    this.gameState.playSound('click');
    this.levelIndex++;
    if (this.levelIndex >= this.LEVELS.length) this.finishGame();
    else this.loadLevel();
  }

  static finishGame() {
    const gs = this.gameState;
    const ar = this.ar;
    const accuracy = Math.round(this.levelScores.reduce((a, b) => a + b, 0) / this.LEVELS.length);

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      const isFirstClear = gs.completeGame('error-hunt', accuracy);
      gs.playSound('win');
      WinnerSystem.show('error-hunt', accuracy, gs, isFirstClear);
    } else {
      gs.playSound('error');
      gs.showNotification(
        ar ? `محتاج تركّز أكتر: ${accuracy}%. جرّب تاني!`
           : `Look a little closer: ${accuracy}%. Try again!`,
        'error'
      );
      gs.trackFailure(accuracy, 'error-hunt');
      screenTimeout(() => this.initialize(gs), 2000);
    }
  }

  // The picture for this level with the invisible tappable zones on top. Each
  // level now uses the SAME character art shown everywhere else in the game
  // (Ready Stance / Chamber / Recoil / Kick Extension) instead of a separate
  // generated illustration, so the zones are hand-placed rectangles over the
  // real photo's head / torso / kicking leg / standing foot rather than
  // polygons traced from custom art.
  static buildBoard(level) {
    const ch = this.gameState.playerCharacter === 'girl' ? 'girl' : 'boy';
    const lv = this.ART[ch].levels[level.art];
    const zone = (id) => (lv.zones[id] || []).map(pts =>
      `<polygon class="eh-zone" data-eh-zone="${id}" tabindex="0" role="button" points="${pts.map(p => p.join(',')).join(' ')}" stroke-linejoin="round"/>`
    ).join('');
    const safeUrl = lv.image.replace(/ /g, '%20');
    return `
    <svg viewBox="0 0 ${lv.w} ${lv.h}" class="eh-svg" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Ap Chagi front kick" xmlns="http://www.w3.org/2000/svg">
      <image href="${safeUrl}" x="0" y="0" width="${lv.w}" height="${lv.h}"/>
      <g class="eh-zones">${zone('torso')}${zone('head')}${zone('stand')}${zone('kick')}</g>
    </svg>`;
  }
}

