# الرسوم والحركة — اللي اتعمل، واللي محتاجه منك بالظبط
*(The English spec for an artist is further down.)*

## الشخصيات الأساسية (اتثبتت)
كان في اللعبة **٢ ولاد و٣ بنات** مختلفين: ولد بشعر أسود وولد بشعر بني، وبنت بشعر أسود ناعم وبنت بديل حصان وبنت بأسلوب غامق.
اخترت **الولد بالشعر البني** و**البنت بديل الحصان**: هما اللي في أغلب صور الركلات، وعندهم صور من الجنب نضيفة اتبنى منها الهيكل العظمي.
الصور القديمة كلها محفوظة في `assets/images/characters/_originals/` و`assets/images/error_hunt/_originals/` — لو عايز الولد التاني أو البنت التانية تبقى هي الأساس، قولّي وأعيد بنفس الطريقة (محتاج صورة من الجنب ليها زي اللي تحت).

## اللي اتعمل في النسخة دي (من غير رسام)
1. **هيكل عظمي حقيقي** لكل شخصية، متقطّع من الرسمة الموجودة نفسها (الراس، الجسم، الفخد، الساق، القدم لكل رجل، وديل الحصان للبنت).
   اللي كان ورا الجاكيت أو تحت البنطلون اتلوّن بحيث ماتبانش فتحات لما الرجل تتحرك.
2. **الحركة بقت ناعمة** ٦٠ صورة في الثانية بدل ٥ صور بتتبدّل: رفع الركبة، الضربة، الرجوع، وبتوازن الجسم (الرجل الواقفة ثابتة في الأرض — فيه اختبار بيتأكد إنها مابتتزحلقش).
   الحركات: الركلة الأمامية، الركلة المطرقية، الركلة الأمامية الطالعة، ركلة الدفع، وقفة الاستعداد بتتنفّس، رد الفعل لما تتضرب، نطة الفوز، والمشي.
   ديل الحصان بيتمرجح لوحده مع الحركة (فيزيا بسيطة).
3. **في الدروس**: الشخصية بتتحرك ببطء لحد المرحلة، ومعاها "ظل" خفيف للمرحلة اللي قبلها، وفيه زرار «الركلة كاملة» وزرار «بطيء».
4. **في الألعاب**: الـ٦ ألعاب والتحدي ١×١ بقوا بيستخدموا الهيكل للركلة الأمامية والمطرقية، والمنافس في «القتال» بقى الشخصية التانية بنفس الأسلوب وبيتحرك ويترد عليه.
5. **كل الصور اتوحّدت**: صور مراحل الركلتين، وصور «صيد الغلطة» (٤ غلطات × ولد وبنت، ومناطق اللمس اتحسبت أوتوماتيك من أعضاء الجسم)، وصورة الشخصية في الكروت، وصور الفوز — كلها بقت نفس الولد ونفس البنت.
6. **الكود جاهز يستقبل شغل احترافي**: ملفات الهيكل بنفس صيغة برنامج **Spine** (JSON + atlas). لو رسام صدّر من Spine بنفس أسماء العظام، الملفات بتتحط مكان ملفاتنا وتشتغل من غير أي تعديل.

## اللي لسه ماينفعش من غير رسم جديد
| الأولوية | الحاجة | ليه مش ممكنة دلوقتي |
|---|---|---|
| ١ | **الركلة الجانبية (يوب/بيك تشاجي)** | الجسم لازم يلف ويبان من ضهره أو من قدامه — الرسمة الحالية من الجنب بس. لسه بتستخدم الصور القديمة (غير متسقة). |
| ٢ | **الركلات اللي بتلف** (الدائرية، نص القمر، الخلفية، الخطافية) | نفس السبب: محتاجة الجسم من زوايا تانية (٣/٤ من قدام و٣/٤ من ورا). |
| ٣ | **الإيدين** (اللكمات، الصدّات، رفع الإيدين في الفوز) | الدراعين مرسومين لازقين في الجسم، مش قطع لوحدها. |
| ٤ | **المدرب يانج** | صوره متسقة، بس لسه مالوش هيكل. |
| ٥ | **تعبيرات الوش** (يرمش، يبتسم، يصرخ كياي) | محتاجة رسومات للراس بتعبيرات مختلفة. |

## الركلة الجانبية: الملفات بالظبط (اتفحصت بالكود، مش تقدير)
دي الحاجة الوحيدة اللي لسه فيها أكتر من شخصية في نفس المجموعة. باقي المجموعات (الركلة الأمامية والمطرقية للاتنين) بقت شخصية واحدة وبمقاس واحد، وفيه اختبار أوتوماتيك (`art: each kick set is one consistent character`) بيتأكد من ده كل مرة، وبيفشل لو حد رجّع صورة غريبة تاني.

| الملف | مقاسه دلوقتي | المشكلة اللي اتشافت |
|---|---|---|
| `boy_char/bikchagi/extension_boy.webp` | 818×870 | ولد تاني: شعر أسود وأسلوب رسم مختلف، والجسم من ورا |
| `boy_char/bikchagi/recoil_boy.webp` | 732×1400 | ولد بشعر **أسود** و**حزام أسود** — مش ولد اللعبة (بني + ياقة سودا) |
| `boy_char/bikchagi/return_boy.webp` | 438×1400 | ولد بشعر بني وحزام أبيض بس **بمقاس أصغر** من اللي قبله |
| `boy_char/bikchagi/` (ناقص) | — | مفيش `ready` ولا `chamber` خالص للولد |
| `girl_char/bikchagi/ready_girl.webp` | 499×949 | دي **بنت اللعبة الصح** (ديل حصان بني) — المرجع |
| `girl_char/bikchagi/chamber_girl.webp` | 475×1400 | بنت تانية: شعر أسود منفوش، دوبوك لونه وردي فاتح، إضاءة مختلفة |
| `girl_char/bikchagi/extension_girl.webp` | 531×1400 | نفس البنت التانية |
| `girl_char/bikchagi/recoil_girl.webp` | 480×1400 | نفس البنت التانية |
| `girl_char/bikchagi/` (ناقص) | — | مفيش `return` للبنت |

**المطلوب:** ٥ صور للولد و٥ للبنت (`ready`, `chamber`, `extension`, `recoil`, `return`)، **كلهم بنفس المقاس داخل المجموعة الواحدة** وبنفس تأطير الركلة الأمامية (الجسم كله، الرجل الواقفة على نفس خط الأرض في كل الصور)، ونفس الولد/البنت بتوع `boy_idle.webp` و`girl_idle.webp`.
لو الصور جت كده، الاختبار المذكور فوق هيفشل ويقول "شيل الركلة الجانبية من قايمة الاستثناءات" — وده معناه إن الشغل خلص صح.

> ملاحظة تانية اتشافت بالفحص: في الركلة الأمامية للولد والبنت، صورتَي `chamber` و`recoil` متطابقتين تقريبًا (فرق أقل من ٠٫٠٥٪ من البكسلات). مش غلط فني (الرجل فعلاً بتعدي من نفس الوضع وهي راجعة)، بس الطفل مش بيشوف حركة بين الخطوتين. لو هتولّد صور جديدة، خلي `recoil` الركبة فيها أوطى شوية من `chamber`.

## المطلوب منك بالظبط — اختار طريق واحد
### الطريق أ: رسام محترف (أحسن نتيجة)
ابعته الجزء الإنجليزي اللي تحت كما هو. المطلوب منه **ملف طبقات** (PSD) أو **مشروع Spine**، بنفس شكل الشخصيتين بالظبط.

### الطريق ب: تولّد الصور بنفسك بنفس البرنامج اللي عمل الصور الأصلية (ببلاش تقريبًا)
ابعتلي الصور دي، وأنا أقطّعها وأركّبها زي ما عملت دلوقتي. **مع كل طلب حُط صورة الشخصية الحالية كمرجع** (`boy_idle.webp` أو `girl_idle.webp`).

| # | الصورة | وصف تكتبه للمولّد (بالإنجليزي) |
|---|---|---|
| ١ | الولد من الجنب والدراعين بعيد عن الجسم | `same boy as reference, full body, exact side view facing right, standing on both feet slightly apart, BOTH ARMS STRETCHED STRAIGHT FORWARD at shoulder height with fists closed (arms not touching the body), white dobok with black collar, white belt, barefoot, plain light grey background, soft studio light, no shadow` |
| ٢ | نفس الطلب للبنت | نفس الوصف مع `same girl as reference, brown ponytail` |
| ٣ | الولد ٣/٤ من ورا | `same boy, full body, three-quarter BACK view, turned so his back faces the camera, looking over his right shoulder to the right, fighting stance, fists up, plain light grey background` |
| ٤ | الولد ٣/٤ من قدام | `same boy, full body, three-quarter FRONT view facing right, fighting stance, fists up, plain light grey background` |
| ٥ و٦ | نفس ٣ و٤ للبنت | — |
| ٧ | راس الولد ٤ تعبيرات | `same boy, head and shoulders, exact side view facing right, four versions: neutral, eyes closed (blink), big smile, shouting "kihap" with open mouth` |
| ٨ | نفس ٧ للبنت | — |
| ٩ | المدرب من الجنب رافع رجله | `same coach as reference, full body, exact side view facing right, one leg raised straight forward at hip height, fists up, plain light grey background` |

**مواصفات كل صورة:** طولها ١٤٠٠ بكسل على الأقل، الجسم كله باين (من الشعر لحد صوابع الرجل)، خلفية سادة، نفس الإضاءة، ومن غير علامة مائية.
ابدأ بـ **١ و٢** (بيفتحوا الإيدين: لكمات وصدّات وفوز) وبعدها **٣ و٤** (بيفتحوا الركلة الجانبية والركلات اللي بتلف).

### وفي الحالتين
- **خلّي المدرب يتفرج على الحركة** (زرار «الركلة كاملة» في الدروس، أو `tools/rig/preview.html`) ويقولّك لو التوقيت أو الزوايا محتاجة تتظبط. كل ركلة معمولة في `tools/rig/animate.py` كأوضاع بالدرجات، والتعديل عليها سهل.

---

# Artist spec (English) — Taekwondo Journey characters

**Characters:** the brown-haired boy and the ponytail girl already in the game
(reference: `assets/images/characters/boy_char/boy_idle.webp`, `girl_char/girl_idle.webp`,
side view: `_originals/boy_char/narochagi/rise_boy.webp`, `_originals/girl_char/narochagi/drop_girl.webp`).
Match them exactly (proportions, face, hair, white dobok with black collar, white belt, barefoot). 3D-render look, soft studio light.

**Deliverable, per character:** a layered PSD (or a Spine 4.1 project) for three views —
**side (facing right)**, **3/4 front**, **3/4 back** — with every part on its own layer and **overlap at the joints**
(each limb continues ~20% past the joint under the neighbouring part, so rotations never show gaps).

| Layer / bone name | Notes |
|---|---|
| `head` | + expressions as swaps: `head_blink`, `head_smile`, `head_kihap` |
| `ponytail` (girl) | separate, pivot at the hair tie |
| `body` | torso + jacket skirt + belt knot, **no arms** |
| `armUpperF`, `armLowerF`, `fistF`, `armUpperB`, `armLowerB`, `fistB` | near (F) and far (B) arm; also an open-hand (`handF_open`) for knife-hand |
| `thighF`, `shinF`, `footF`, `thighB`, `shinB`, `footB` | near (F) / far (B) leg; feet: flat, pointed, toes pulled back (ball), blade edge |
| `beltTail` | optional, for secondary motion |

**If delivering Spine:** JSON export 4.x + .atlas, **region attachments only** (no meshes/IK needed — the game's runtime supports bones, slots, region attachments, rotate/translate/scale timelines with linear/stepped/bezier curves, and events). Keep the bone names above; root at the floor under the pelvis; y up. Put a `phase` event (int 0–4) on each of the 5 lesson phases of every kick and an `impact` event at contact.
Animations wanted: `idle`, `apchagi`, `naeryeo`, `yeop` (side kick), `dollyo` (roundhouse), `bandal`, `dwi` (back kick), `huryeo` (hook), `mireo`, `ap-ollyeo`, `punch`, `block-low`, `block-high`, `hit`, `win`, `walk`.

**Files go to:** `assets/anim/<boy|girl|coach>/<name>.json`, `.atlas`, page images. Run `npm test` — it checks the phases and that the standing foot does not slide.
