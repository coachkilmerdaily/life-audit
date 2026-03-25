const app = document.querySelector("#app");

const features = [
  ["Get your Life Score", "Start with a short free audit that gives people a fast read on where life feels strong, weak, or drifting."],
  ["See the real pattern", "Move beyond surface-level habits into identity, mental tabs, health, relationships, direction, and standards."],
  ["Leave with a plan", "Every result should end in diagnosis, priority fixes, and a practical 30-day reset instead of vague motivation."],
];

const categories = [
  "Self-Image",
  "Emotional Stability",
  "Physical Health",
  "Mental Clarity",
  "Discipline",
  "Relationships",
  "Communication",
  "Boundaries",
  "Screen-Life Balance",
  "Purpose & Direction",
  "Integrity & Alignment",
];

const steps = [
  { step: "01", title: "Try the free mini audit", body: "A quick but sharp entry point that gives users a score and enough insight to make the full audit feel worth it." },
  { step: "02", title: "Unlock the full deep dive", body: "Guide users through identity, fear, mental bandwidth, relationships, online drift, purpose, and standards." },
  { step: "03", title: "Get the breakdown", body: "Show category scores, recurring patterns, root issue, blind spots, and strongest areas in plain English." },
  { step: "04", title: "Follow the reset plan", body: "Finish with direct next steps: what to start, stop, reduce, rebuild, and keep non-negotiable for 30 days." },
];

const miniAuditQuestions = [
  ["clarity", "Clarity", "How clear do you feel about what matters most in your life right now?", [["Not clear at all", 1], ["Mostly confused", 2], ["Somewhat clear", 3], ["Mostly clear", 4], ["Very clear", 5]]],
  ["energy", "Health", "How would you rate your daily energy and physical upkeep?", [["Very poor", 1], ["Below average", 2], ["Inconsistent", 3], ["Mostly solid", 4], ["Strong and reliable", 5]]],
  ["followThrough", "Discipline", "When you decide something matters, how often do you actually follow through?", [["Almost never", 1], ["Rarely", 2], ["Sometimes", 3], ["Usually", 4], ["Consistently", 5]]],
  ["relationships", "Relationships", "How healthy and honest do your core relationships feel?", [["Very strained", 1], ["Unsteady", 2], ["Mixed", 3], ["Mostly healthy", 4], ["Strong and grounded", 5]]],
  ["alignment", "Direction", "How aligned does your current life feel with the person you want to be?", [["Not aligned", 1], ["Far off", 2], ["Partially aligned", 3], ["Mostly aligned", 4], ["Deeply aligned", 5]]],
];

function q(id, text, placeholder, prompt, why, example) {
  return {
    id,
    text,
    placeholder,
    prompts: [prompt, "Write the first honest thing that comes to mind.", "Notice what you keep circling around."],
    why,
    example,
  };
}

function r(afterCategory, title, prompt, body) {
  return { id: `reflection_${afterCategory}`, afterCategory, title, prompt, body };
}

let fullAuditSteps = [
  {
    id: "selfImage",
    title: "Self-Image",
    description: "Identity, self-perception, and the standards underneath them.",
    questions: [
      q("identity_driver", "What identity currently defines most of your decisions?", "Write the role or version of yourself that seems to be running the show.", "I'm the responsible one.", "This surfaces whether your life is being led by a conscious identity or by an inherited role.", "I've built an identity around being dependable, but it often means I rarely ask what I actually want."),
      q("identity_gap", "Describe the version of yourself you respect the most. Where does your current life still fall short?", "Name the standards or habits that version of you would live by.", "What does that version do consistently?", "The gap between current self and respected self explains more than surface productivity problems.", "The version of me I respect is calm and direct. Right now I still leak energy into avoidance and overcommitment."),
      q("identity_pressure", "Which version of yourself are you secretly exhausted from maintaining?", "Write the role or image that feels costly to keep up.", "Where do you feel pressure to look composed?", "Exhaustion often comes from carrying an identity that no longer fits.", "I'm tired of being the person who always seems fine. It keeps me functional, but emotionally overcontrolled."),
    ],
  },
  {
    id: "emotionalStability",
    title: "Emotional Stability",
    description: "Fear, triggers, and the reactions that quietly shape behaviour.",
    questions: [
      q("fear_pattern", "What fear still quietly shapes your decisions more than it should?", "Name the fear directly and write where it still shows up.", "Fear of disappointing someone.", "Fear becomes most powerful when it operates in the background without being named clearly.", "I still organise too much of my behaviour around disappointing people."),
      q("trigger_pattern", "What situations make your body tense up or your mind spiral faster than they should?", "Describe the situations or patterns that trigger you most reliably.", "When do you feel judged?", "Trigger awareness creates leverage. If you can recognise the pattern, you can stop mistaking it for objective truth.", "I tense up when I feel misread or cornered, then start rehearsing explanations."),
      q("regulation_response", "When you feel emotionally threatened, what do you usually do next?", "Write what your nervous system tends to default to under pressure.", "Do you shut down or overexplain?", "The reaction pattern matters because it tends to repeat across work, relationships, and self-trust.", "I become highly verbal and try to regain control by explaining everything."),
    ],
  },
  {
    id: "physicalHealth",
    title: "Physical Health",
    description: "Energy, recovery, and whether your body supports your standards.",
    questions: [
      q("health_energy", "How is your energy really, once the day gets honest?", "Describe your real baseline, not your ideal answer.", "When do you feel strongest?", "Energy shapes patience, clarity, discipline, and emotional steadiness.", "I can still get things done, but my energy is unstable and too dependent on momentum."),
      q("health_habits", "What weekly habits prove that you are in control of your body and energy?", "Write what is actually happening consistently, not what you intend to do.", "Sleep, movement, nutrition, recovery.", "The goal is not perfection. It is evidence.", "The only habit that feels solid is walking. Sleep and training are inconsistent."),
      q("health_leak", "Where are you leaking physical energy that you keep pretending does not matter?", "Name the habits or patterns costing more than they should.", "Poor sleep or overstimulation.", "A lot of friction that looks psychological is amplified by neglected physical basics.", "Late-night screen time and irregular sleep are doing more damage than I admit."),
    ],
  },
  {
    id: "mentalClarity",
    title: "Mental Clarity",
    description: "Mental tabs, unresolved loops, and what shapes your focus.",
    questions: [
      q("mental_tabs", "What unresolved issues are taking up the most background energy right now?", "List the open loops or postponed decisions that follow you around.", "A delayed decision.", "Mental noise is often just unresolved reality.", "The main tabs are a work decision, a delayed conversation, and uncertainty about direction."),
      q("mental_focus", "What drains your attention most: genuine complexity, avoidance, or too many things left open?", "Write what fragments your attention most often.", "What steals your focus first?", "Clarity improves once you stop treating all distraction as the same problem.", "I leave too many things unresolved, then carry them into every other task."),
      q("mental_decision", "What decision are you postponing that would reduce immediate friction if you made it honestly?", "Write the decision you already know is waiting.", "A conversation or boundary.", "Postponed decisions create disproportionate drag because they remain active in the system.", "I need to decide whether I am fully committing to my current work structure or changing it."),
    ],
  },
  {
    id: "discipline",
    title: "Discipline",
    description: "The gap between what matters to you and what your behaviour proves.",
    questions: [
      q("discipline_routines", "Which routines are genuinely serving you, and which ones are just fake productivity dressed as effort?", "Separate what creates real movement from what simply helps you feel occupied.", "What actually moves life forward?", "Discipline is not about busyness. It is about repeatable behaviour that supports the life you say you want.", "Writing first thing helps. Endless list-making does not."),
      q("discipline_followthrough", "What do you keep saying you will do but still do not reliably do?", "Write the promise that has become too familiar to postpone.", "A health behaviour or hard conversation.", "Repeated self-broken promises weaken self-trust faster than obvious failure does.", "I keep saying I will train consistently and protect my mornings."),
      q("discipline_honesty", "When nobody is checking on you, what does your behaviour reveal about your standards?", "Answer from observation, not aspiration.", "What do you default to in private?", "Private behaviour is often the cleanest measure of whether standards are internal or externally reinforced.", "Without structure around me, I loosen too quickly."),
    ],
  },
  {
    id: "relationships",
    title: "Relationships",
    description: "Support, drain, reciprocity, and whether your environment reflects your future.",
    questions: [
      q("relationships_peace", "Who brings peace into your life, and who brings chaos or drag?", "Write about the actual relational effect people have on your system.", "Who steadies you?", "Relationships are not neutral. They either reinforce your standards or wear them down.", "A few people stabilise me. One or two others consistently create emotional noise."),
      q("relationships_reciprocity", "Where are your relationships reciprocal, and where are you overgiving or being kept small?", "Write where the balance feels healthy and where it clearly does not.", "Where are you overfunctioning?", "Reciprocity matters because one-sided relationships train resentment and exhaustion.", "I have some strong reciprocal relationships, but I overfunction in a few places because I am used to being reliable."),
      q("relationships_environment", "Does your current environment reflect the standards of the person you are trying to become?", "Think home, work, training spaces, and the people around you most often.", "What environment elevates you?", "Trying to build a stronger life inside misaligned environments creates unnecessary friction.", "Parts of my environment are supportive, but some still reflect an older version of me."),
    ],
  },
  {
    id: "communication",
    title: "Communication",
    description: "How you speak, listen, avoid, and handle tension when it matters.",
    questions: [
      q("communication_direct", "Do you usually say what you mean at the right time, or do you let things build up?", "Write how communication actually works for you under pressure.", "Do you avoid difficult conversations?", "A surprising amount of life friction comes from timing failures in communication.", "I tend to let things build too long, then come in with too much explanation."),
      q("communication_pattern", "In conflict, what do you most often do: react, withdraw, dominate, explain, or shut down?", "Describe your most recognisable conflict pattern.", "What does your nervous system do first?", "Patterns in conflict reveal how much steadiness and honesty your communication can hold.", "I tend to become overly explanatory and move into control instead of real contact."),
      q("communication_strength", "What communication strength do you already have that is worth relying on more deliberately?", "Write the useful part of your communication style, not just the flaw.", "Directness, listening, calmness.", "The goal is to identify usable strengths as well as failure points.", "When I am settled, I can be very clear and fair. The issue is using that early enough."),
    ],
  },
  {
    id: "boundaries",
    title: "Boundaries",
    description: "What you tolerate, where people have too much access, and what would protect your energy.",
    questions: [
      q("boundaries_tolerate", "What do you tolerate that you already know should not have access to your life?", "Name the behaviour or expectation you keep allowing in.", "What leaves you resentful afterward?", "Boundary problems usually show up first as resentment, fatigue, or subtle self-betrayal.", "I tolerate too much last-minute access to my attention."),
      q("boundaries_no", "Where do you need to say no more often if you want your life to feel cleaner?", "Write the place where one clearer limit would create relief quickly.", "Time, energy, availability.", "A clean no often creates more stability than a complicated attempt to keep everyone comfortable.", "I need to say no more often to spillover that cuts into recovery and deep work."),
      q("boundaries_standard", "What boundary would immediately improve your life if you enforced it properly?", "Write the limit that would create a visible shift.", "A time boundary or digital limit.", "This identifies the first real leverage point rather than leaving boundaries vague.", "A hard evening cut-off on work and digital noise would improve sleep and attention."),
    ],
  },
  {
    id: "screenLife",
    title: "Screen-Life Balance",
    description: "Digital drift, online performance, and your ability to disconnect and recover.",
    questions: [
      q("screen_use", "What is your phone and screen behaviour actually doing for you right now: helping, avoiding, performing, or numbing?", "Write the real role your digital life is playing.", "Where are you escaping?", "Screen-life often hides both modern avoidance and modern identity performance.", "Some of it is useful, but a lot of it is low-grade avoidance."),
      q("screen_replace", "What real-world experiences are currently being replaced by screen time?", "Think attention, rest, presence, relationships, reading, silence, movement.", "What does scrolling replace?", "This makes the cost of screen drift concrete instead of abstract.", "It replaces silence, slow thinking, and sometimes the discomfort required to start things properly."),
      q("screen_stillness", "What happens when you sit in silence without your phone or stimulation?", "Write honestly about what the stillness brings up.", "Restlessness or relief.", "Your relationship with stillness says a lot about whether the system is regulated or constantly seeking escape.", "The first thing that comes up is restlessness, then a flood of things I have been postponing mentally."),
    ],
  },
  {
    id: "purpose",
    title: "Purpose and Direction",
    description: "What you want, what remains underused, and where your next chapter needs definition.",
    questions: [
      q("purpose_want", "What do you actually want from the next few years, beneath the vague language and surface goals?", "Write the chapter you would respect, not just the one that sounds acceptable.", "What would make you proud in three years?", "Direction gets stronger once desire becomes specific enough to organise behaviour around.", "I want a life that feels clean, physically strong, well-directed, and less split between potential and execution."),
      q("purpose_underused", "What part of your potential is most obviously underused right now?", "Name the capacity or ambition that is not being fully lived out.", "Leadership, discipline, creativity, courage.", "This turns purpose from fantasy into a clearer diagnosis of underused capacity.", "My ability to build things and sustain momentum is underused."),
      q("purpose_below_level", "Where are you still playing below your level, and what standard needs to rise?", "Write where you know you are underperforming against your own intelligence or capacity.", "What area is below your level?", "A lot of drift is really tolerated underperformance. Naming it changes the tone of the next chapter.", "I am still playing below my level in physical consistency and depth of focus."),
    ],
  },
  {
    id: "integrity",
    title: "Integrity / Alignment",
    description: "Whether your behaviour matches your values and what your life is reflecting back to you.",
    questions: [
      q("integrity_values", "Where are you currently living in line with your values, and where are you betraying them?", "Write where your life feels aligned and where it clearly does not.", "What do you stand for?", "Integrity becomes visible when values stop being ideals and start being compared against behaviour.", "I value truth and self-respect, but there are still places where I delay honesty because I want comfort."),
      q("integrity_mirror", "If your life is a mirror, what is it currently reflecting back to you about who you have become?", "Answer plainly. This is about accuracy, not sounding insightful.", "What truth are you avoiding?", "This compresses behaviour, standards, and denial into a single reflection.", "My life reflects a capable person with decent awareness who still leaves too much unresolved."),
      q("integrity_commitment", "What action would prove this audit actually mattered?", "Write the move that would make this more than self-observation.", "What are you no longer available for?", "Without commitment, insight stays elegant but weak.", "It would matter if I made one delayed decision, enforced one overdue boundary, and rebuilt one routine strongly enough that my week looked different."),
    ],
  },
];

let reflections = [
  r("selfImage", "Before moving on", "What is one memory from earlier life that still seems to explain something about who you became?", "Sometimes an old scene still quietly explains a modern pattern. Notice what comes up before you edit it."),
  r("emotionalStability", "Pause and notice", "Which answer so far felt the most true, even if it was not the most comfortable?", "Discomfort is not always a warning sign. Sometimes it is just the mind recognising something accurate."),
  r("mentalClarity", "Small interruption", "What pattern are you starting to see repeat across different parts of your life?", "When a theme shows up in multiple rooms of life, it is usually worth taking seriously."),
  r("discipline", "A different angle", "When did you last feel clean, disciplined, and genuinely proud of how you were living?", "The point is not nostalgia. It is evidence that your system already knows something about what works."),
  r("relationships", "Quiet check-in", "What answer in this section carried more emotion than you expected?", "Emotional charge often points toward unfinished material, not weakness."),
  r("screenLife", "Look ahead", "If the next 24 months were shaped by stronger standards, what would quietly disappear from your life first?", "A better future is often defined as much by what leaves as by what gets added."),
  r("purpose", "One more pause", "What would your future self be relieved to see you finally stop delaying?", "There are moments where progress is not about learning more. It is about ending a long hesitation."),
];

const extractedSectionDescriptions = {
  currentStateSnapshot: "A quick read on how life feels right now before the audit goes deeper.",
  whyAreYouHere: "The reason for doing this audit now, not later.",
  identityCompression: "The identity currently shaping your choices, standards, and direction.",
  theIdentityGap: "The distance between the version of you that exists and the version you respect.",
  positiveTraitsNegativeTraitsOrigins: "The useful and costly parts of your personality, and where they likely came from.",
  fearMapping: "The fears still shaping behaviour, whether or not they look obvious on the surface.",
  anxietyTriggerAwareness: "The moments that trigger tension, spiralling, or overreaction.",
  internalThreatAssessment: "The internal patterns that quietly sabotage progress.",
  mentalTabsAudit: "Unresolved loops, delayed conversations, and hidden background drag.",
  physicalHealthEnergy: "Whether your body is supporting the life you say you want.",
  routineDisciplineDelivery: "How well your life turns intention into repeatable action.",
  financialStructuralReality: "The practical structure underneath your stress, freedom, and options.",
  socialEnvironmentArchitecture: "The people and environments that either reinforce your future or keep you anchored to the past.",
  relationshipAudit: "The quality, reciprocity, and cost of the relationships closest to you.",
  communicationAudit: "How you speak, listen, avoid, and handle tension.",
  personalOperatingLimitsBoundaries: "The limits that protect your energy, attention, and self-respect.",
  onlineYouVsRealWorldYou: "Screen-life, performance, digital drift, and the cost of staying connected.",
  connectivityOffSwitch: "Rest, stillness, and your capacity to disconnect without guilt.",
  ambitionPurposePotential: "What you want, what remains underused, and where you are still playing below your level.",
  valuesNonNegotiables: "What you stand for, and whether your behaviour is actually aligned with it.",
  mirrorReportBrutalHonesty: "A direct summary of what your life is already revealing.",
  categoryScoring: "A self-rating layer across the core diagnostic categories.",
  patternRecognition: "The themes, root issue, strongest area, and weakest area starting to emerge.",
  priorityRepairList: "The issues that need attention first, not eventually.",
  the30DayResetPlan: "Turning diagnosis into immediate, practical movement.",
  finalCommitment: "Ending the audit with ownership, not just insight.",
};

if (Array.isArray(window.LIFE_AUDIT_FULL_STEPS) && window.LIFE_AUDIT_FULL_STEPS.length) {
  fullAuditSteps = window.LIFE_AUDIT_FULL_STEPS.map((section) => ({
    id: section.id,
    title: section.title,
    description: extractedSectionDescriptions[section.id] || section.description || "A deeper part of the audit.",
    questions: section.questions.map((text, index) =>
      q(
        `${section.id}_${index + 1}`,
        text,
        "Write plainly. Specific, honest answers are more useful than polished ones.",
        "Start with the first concrete example that comes to mind.",
        "This question is here to surface a pattern that will matter later in the diagnosis.",
        "Answer in your own words. A few honest sentences are enough to begin."
      )
    ),
  }));

  reflections = [
    r("whyAreYouHere", "Before going deeper", "What answer already feels more important than you expected?", "Sometimes the real starting point appears before the audit is even fully underway."),
    r("theIdentityGap", "Pause and notice", "What part of your current identity now feels outdated or too expensive to keep carrying?", "When a role no longer fits, forcing it usually creates more friction than clarity."),
    r("internalThreatAssessment", "Small interruption", "What theme is beginning to repeat across identity, fear, and self-sabotage?", "When the same pattern appears in multiple sections, it usually deserves more attention than the mind wants to give it."),
    r("routineDisciplineDelivery", "A different angle", "When did your life last feel cleaner, stronger, or more disciplined than it does now?", "The point is not nostalgia. It is evidence that your system already knows something about what works."),
    r("relationshipAudit", "Quiet check-in", "Which answer about people or environment carried more emotion than you expected?", "Emotional charge is often a clue that the issue is still active, not resolved."),
    r("onlineYouVsRealWorldYou", "Reset", "What would quietly improve if your attention became less fragmented?", "Modern friction often looks normal until you imagine life with more stillness and less noise."),
    r("mirrorReportBrutalHonesty", "Look directly", "What truth now feels too obvious to keep softening?", "There is a point in honest reflection where the useful move is not more analysis, but more accuracy."),
    r("priorityRepairList", "Final pause", "Which repair matters first because it would make the rest easier to face?", "Not every problem deserves equal attention. Sequencing matters."),
  ];
}

const pricing = [
  { name: "Free Mini Audit", price: "$0", subtitle: "Fast hook", items: ["Quick life score", "Short diagnostic snapshot", "One key friction point", "Strong CTA into full audit"], cta: "Start free", featured: false },
  { name: "Full Life Audit", price: "$199", subtitle: "Main product", items: ["Full guided assessment", "Category scoring dashboard", "Root issue detection", "Priority fixes + 30-day reset"], cta: "Unlock full audit", featured: true },
];

const faqs = [
  { q: "Is this therapy?", a: "No. It is structured self-assessment. Direct, practical, and built to turn reflection into action." },
  { q: "How long does the full audit take?", a: "The mini audit should feel fast. The full audit should feel deep, but cleanly guided so people keep moving." },
  { q: "What do I get at the end?", a: "A score, category breakdown, core diagnosis, strengths, blind spots, likely root issue, priority fixes, and a 30-day reset plan." },
];

const auditorPoints = [
  "Thinking prompts when the user blanks",
  "Why this question matters",
  "Example answers that feel real, not robotic",
  "Gentle interventions when the user stalls",
  "Small reflection moments between sections",
];

const tagItems = ["Identity", "Mental clarity", "Relationships", "Direction", "30-day reset"];

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderSite() {
  app.innerHTML = `<div class="site-shell" id="main-site">
    <div id="top"></div>
    <div class="hero-orb" aria-hidden="true"></div>
    <section class="hero">
      <div class="container">
        <header class="topbar reveal">
          <a class="brand" href="#top"><span class="brand-mark" aria-hidden="true"></span><span>LIFE AUDIT</span></a>
          <nav class="topbar-links" aria-label="Primary">
            <a href="#mini-audit">Mini Audit</a>
            <a href="#audit" data-start-full-audit="true">Full Audit</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
        </header>
        <div class="hero-grid">
          <div class="reveal">
            <div class="eyebrow">Life Audit / clarity, diagnosis, action</div>
            <h1>Stop guessing where your life is at.<span>Run the audit. See the pattern. Fix what matters.</span></h1>
            <p class="hero-copy">A direct self-assessment for people who know something feels off, messy, underused, or misaligned and want an honest read on what to do next.</p>
            <div class="hero-actions">
              <a class="button button-primary" href="#mini-audit">Start free mini audit</a>
              <a class="button button-secondary" href="#audit" data-start-full-audit="true">Start Full Audit</a>
            </div>
            <div class="hero-tags">${tagItems.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
          </div>
          <div class="hero-card-wrap reveal">
            <div class="hero-card"><div class="inner-card">
              <div class="card-head"><div><p class="label">Preview</p><h3>Your Life Score</h3></div><div class="completion"><p class="label">Completion</p><strong>34%</strong></div></div>
              <div class="score-panel"><div class="score-line"><div><p class="label">Preliminary score</p><p class="score-value">61<span>/100</span></p></div><div class="score-pill">Friction Present</div></div><p>Based on your answers so far, your strongest area looks like self-awareness. Your weakest area looks like mental clarity. The bigger issue is not lack of potential. It is unresolved friction and inconsistent follow-through.</p></div>
            </div></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="mini-audit">
      <div class="container">
        <div class="audit-layout">
          <div class="section-copy reveal">
            <p class="section-kicker">Mini Audit</p>
            <h2>Get a fast read on where your life stands.</h2>
            <p>Answer five quick questions. Each answer carries a score. At the end, you will get a simple result and a clear path into the full audit.</p>
          </div>
          <div class="audit-shell reveal">
            <form class="audit-form" id="mini-audit-form">
              ${miniAuditQuestions.map((item, index) => `<fieldset class="audit-question"><legend><span class="question-index">0${index + 1}</span><span>${item[2]}</span></legend><div class="audit-options">${item[3].map(([label, score]) => `<label class="audit-option"><input type="radio" name="${item[0]}" value="${score}" /><span>${label}</span></label>`).join("")}</div></fieldset>`).join("")}
              <div class="audit-actions"><button class="button button-primary" type="submit">See my result</button></div>
            </form>
            <div class="audit-result" id="mini-audit-result" hidden>
              <p class="section-kicker">Your result</p>
              <div class="audit-score" id="mini-audit-score">0/100</div>
              <h3 id="mini-audit-title">Stable but Stretched</h3>
              <p id="mini-audit-message">Some parts of life are still carrying you, but the pattern underneath suggests strain, split focus, and uneven follow-through.</p>
              <div class="audit-meta">
                <div class="audit-meta-row"><span>Strongest area</span><strong id="mini-audit-strongest">Clarity</strong></div>
                <div class="audit-meta-row"><span>Weakest area</span><strong id="mini-audit-weakest">Discipline</strong></div>
                <div class="audit-meta-row"><span>Biggest friction point</span><strong id="mini-audit-friction">You can see the gap, but your execution is not fully supporting your priorities.</strong></div>
              </div>
              <div class="audit-upgrade"><p>The full Life Audit goes deeper into identity, health, relationships, discipline, clarity, direction, and hidden friction.</p></div>
              <a class="button button-secondary" href="#audit" data-start-full-audit="true">Start Full Audit</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-muted" id="mental-tabs">
      <div class="container">
        <div class="mental-tabs-layout">
          <div class="section-copy reveal">
            <p class="section-kicker">Mental Tabs</p>
            <h2>Most people are not only tired. They are running too many things in the background.</h2>
            <p>
              Unfinished decisions, unresolved conversations, low-grade pressure, and emotional friction do not disappear when ignored.
              They stay mentally open. Over time, they reduce clarity, fragment attention, and make ordinary life feel heavier than it should.
            </p>
          </div>
          <div class="mental-tabs-visual reveal" aria-hidden="true">
            <div class="mental-tabs-frame">
              <div class="mental-tabs-topbar">
                <span></span><span></span><span></span>
              </div>
              <div class="mental-tabs-stack">
                <div class="mental-tab mental-tab-primary">
                  <strong>Unfinished decision</strong>
                  <p>Still running in the background</p>
                </div>
                <div class="mental-tab mental-tab-secondary">
                  <strong>Unspoken conflict</strong>
                  <p>Quietly pulling attention</p>
                </div>
                <div class="mental-tab mental-tab-tertiary">
                  <strong>Pressure to perform</strong>
                  <p>Draining clean thinking</p>
                </div>
                <div class="mental-tab mental-tab-muted">
                  <strong>Direction uncertainty</strong>
                  <p>Keeping the system noisy</p>
                </div>
              </div>
              <div class="mental-tabs-core">
                <div class="mental-tabs-ring"></div>
                <div class="mental-tabs-ring mental-tabs-ring-delay"></div>
                <div class="mental-tabs-center">
                  <span>Clarity</span>
                  <strong>Gets diluted</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="flow"><div class="container"><div class="section-heading reveal"><p class="section-kicker">How it flows</p><h2>Designed to hook fast, go deep, then turn into action.</h2></div><div class="step-grid">${steps.map((item) => `<article class="step-card reveal"><div class="step-num">${item.step}</div><h3>${item.title}</h3><p>${item.body}</p></article>`).join("")}</div></div></section>
    <section class="section" id="pricing"><div class="container"><div class="section-heading reveal"><p class="section-kicker">Pricing</p><h2>Simple offer structure. Easy to understand.</h2></div><div class="pricing-grid">${pricing.map((tier) => `<article class="pricing-card reveal ${tier.featured ? "featured" : ""}"><div class="price-row"><div><p class="price-tagline">${tier.subtitle}</p><h3>${tier.name}</h3></div><div class="price-value">${tier.price}</div></div><div class="pricing-list">${tier.items.map((item) => `<div class="pricing-item">${item}</div>`).join("")}</div><a class="button ${tier.featured ? "" : "button-primary"}" href="${tier.featured ? "#audit" : "#mini-audit"}"${tier.featured ? ' data-start-full-audit="true"' : ""}>${tier.cta}</a></article>`).join("")}</div></div></section>
    <section class="section section-muted" id="faq"><div class="container"><div class="faq-layout"><div class="faq-copy reveal"><p class="section-kicker">FAQ</p><h2>Questions people will ask before buying.</h2></div><div class="faq-list">${faqs.map((item) => `<article class="faq-item reveal"><h3>${item.q}</h3><p>${item.a}</p></article>`).join("")}</div></div></div></section>
    <footer class="footer"><div class="container"><div class="footer-row reveal"><div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>LIFE AUDIT</span></div><a class="footer-cta" href="#top">Back to top</a></div></div></footer>
  </div>
  <section class="audit-mode" id="full-audit-mode" hidden aria-label="Full Life Audit session">
    <div class="audit-mode-shell">
      <div class="audit-mode-bar">
        <span class="audit-mode-label">Full Life Audit</span>
        <button class="audit-exit" type="button" data-action="exit-audit">Exit Full Audit</button>
      </div>
      <div class="full-audit-stage" id="full-audit-app"></div>
    </div>
  </section>`;
}

renderSite();
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
} else {
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
}

const miniAuditForm = document.querySelector("#mini-audit-form");
const miniAuditResult = document.querySelector("#mini-audit-result");
const miniAuditScore = document.querySelector("#mini-audit-score");
const miniAuditTitle = document.querySelector("#mini-audit-title");
const miniAuditMessage = document.querySelector("#mini-audit-message");
const miniAuditStrongest = document.querySelector("#mini-audit-strongest");
const miniAuditWeakest = document.querySelector("#mini-audit-weakest");
const miniAuditFriction = document.querySelector("#mini-audit-friction");
const mainSite = document.querySelector("#main-site");
const fullAuditMode = document.querySelector("#full-audit-mode");
const fullAuditRoot = document.querySelector("#full-audit-app");

const resultBands = [
  { max: 39, title: "Off Track", message: "The pattern here is not just low energy or a rough patch. It suggests your life is being run with too little structure, too little clarity, or too little honesty about what is not working." },
  { max: 59, title: "Stable but Stretched", message: "There is enough stability to keep things moving, but not enough coherence to make life feel clean. You are likely carrying avoidable friction in the background." },
  { max: 79, title: "High Potential, Poor Alignment", message: "This looks less like lack of capacity and more like misdirected capacity. You likely have real upside, but your current setup is not converting that into consistent momentum." },
  { max: 100, title: "Strong Foundation, Needs Precision", message: "The base is there. What is missing is precision. A few unresolved weak points are likely keeping good performance from becoming fully aligned performance." },
];

const frictionCopyByArea = {
  Clarity: "You may be functioning without a sharp enough picture of what actually matters, which makes good effort scatter.",
  Health: "Your physical state may be quietly reducing patience, clarity, and consistency more than you think.",
  Discipline: "You can likely identify what matters, but your routines and follow-through are not reliably backing it up.",
  Relationships: "Relational strain or avoidance may be taking up more mental bandwidth than is obvious on the surface.",
  Direction: "Part of the friction appears to be misalignment between how you are living and what you actually want to respect.",
};

if (miniAuditForm && miniAuditResult) {
  miniAuditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(miniAuditForm);
    const answers = miniAuditQuestions.map((question) => Number(formData.get(question[0])));
    if (answers.some((value) => Number.isNaN(value) || value === 0)) {
      miniAuditTitle.textContent = "Complete all 5 questions";
      miniAuditMessage.textContent = "Choose one answer for each question so the audit can calculate your score.";
      miniAuditScore.textContent = "--/100";
      miniAuditStrongest.textContent = "--";
      miniAuditWeakest.textContent = "--";
      miniAuditFriction.textContent = "The audit needs all five answers before it can point to the main source of drag.";
      miniAuditResult.hidden = false;
      return;
    }
    const totalScore = answers.reduce((sum, value) => sum + value, 0);
    const scoreOutOf100 = totalScore * 4;
    const band = resultBands.find((item) => scoreOutOf100 <= item.max) ?? resultBands[resultBands.length - 1];
    const scoredAreas = miniAuditQuestions.map((question, index) => ({ area: question[1], score: answers[index] }));
    const strongest = [...scoredAreas].sort((a, b) => b.score - a.score)[0];
    const weakest = [...scoredAreas].sort((a, b) => a.score - b.score)[0];
    miniAuditScore.textContent = `${scoreOutOf100}/100`;
    miniAuditTitle.textContent = band.title;
    miniAuditMessage.textContent = band.message;
    miniAuditStrongest.textContent = `${strongest.area} (${strongest.score}/5)`;
    miniAuditWeakest.textContent = `${weakest.area} (${weakest.score}/5)`;
    miniAuditFriction.textContent = frictionCopyByArea[weakest.area] ?? "A weaker area is likely creating more background drag than it first appears.";
    miniAuditResult.hidden = false;
  });
}

const storageKey = "lifeAudit.fullAuditState";
const frictionPointByCategory = { selfImage: "Identity drift appears to be weakening your decision-making and personal standards.", emotionalStability: "Unprocessed fear or emotional reactivity may be shaping more of your choices than it should.", physicalHealth: "Your body may not be supporting the output, patience, and consistency your life now requires.", mentalClarity: "Too many open loops and unresolved decisions may be quietly draining your mental bandwidth.", discipline: "The gap between what matters and what gets executed looks like a real source of friction.", relationships: "Relational drag or environmental mismatch may be making progress harder than it needs to be.", communication: "Avoided conversations or unclear communication may be multiplying preventable friction.", boundaries: "Too much access and too little enforcement may be costing you energy, calm, and self-respect.", screenLife: "Digital escape or constant stimulation may be crowding out recovery, presence, and real-world traction.", purpose: "Direction appears too loose, which makes effort harder to organise and trust.", integrity: "There may be a widening gap between your standards and your current behaviour." };
const rootIssueByCategory = { selfImage: "Your current identity may not be strong or current enough to organise the rest of your life properly.", emotionalStability: "Emotional threat patterns may be interfering with clear decisions, steadiness, and follow-through.", physicalHealth: "Low physical support may be suppressing multiple other categories at the same time.", mentalClarity: "Mental overload may be acting like a bottleneck across focus, decision-making, and consistency.", discipline: "Execution appears to be the core issue: you may know more than you are currently acting on.", relationships: "Your environment may be resisting the standards and direction you are trying to build.", communication: "Avoidance or unclear communication may be keeping key problems unresolved for too long.", boundaries: "Insufficient self-protection may be creating resentment, exhaustion, and diluted focus.", screenLife: "Escape-based coping may be quietly replacing reflection, recovery, and real movement.", purpose: "Lack of defined direction may be creating drift across otherwise capable parts of your life.", integrity: "The deeper issue may be internal contradiction: knowing better without fully living it yet." };
const actionPlanByCategory = { selfImage: ["Clarify the identity you are building", "Define the standards that identity would enforce", "Remove one role that no longer deserves authority"], emotionalStability: ["Name the fear pattern directly", "Build one recovery response you can repeat under pressure", "Reduce one trigger loop you already recognise"], physicalHealth: ["Stabilise sleep and energy first", "Reinstall a basic movement rhythm", "Reduce one habit that consistently drains recovery"], mentalClarity: ["Close one major open loop", "Make one delayed decision honestly", "Reduce one source of recurring mental noise"], discipline: ["Pick one routine that proves follow-through", "Reduce fake productivity", "Create visible evidence of execution this week"], relationships: ["Identify the relationship creating the most drag", "Strengthen one environment that supports your future", "Reduce one guilt-based connection pattern"], communication: ["Have one delayed conversation", "Say one thing earlier than usual", "Tighten your habit of directness under tension"], boundaries: ["Enforce one overdue limit", "Reduce unnecessary access to your time and attention", "Choose one clean no that protects energy"], screenLife: ["Cut one avoidant screen habit", "Create one daily off-switch window", "Rebuild one real-world replacement for digital drift"], purpose: ["Define the next chapter more concretely", "Set one practical target that reduces drift", "Raise one standard that signals seriousness"], integrity: ["Name the clearest contradiction", "Choose one action that makes your standards visible again", "Stop one behaviour that weakens self-respect"] };

const fullAuditState = loadState();
const flow = buildFlow();
const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const voiceState = {
  supported: Boolean(SpeechRecognitionApi),
  listening: false,
  activeQuestionId: null,
  message: "",
};
let voiceRecognition = null;

function loadState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return { started: false, currentIndex: 0, answers: {}, reflections: {}, supportOpen: null, disclaimerChecked: false, disclaimerAccepted: false };
    const parsed = JSON.parse(raw);
    return { started: Boolean(parsed.started), currentIndex: Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0, answers: parsed.answers || {}, reflections: parsed.reflections || {}, supportOpen: parsed.supportOpen || null, disclaimerChecked: Boolean(parsed.disclaimerChecked), disclaimerAccepted: Boolean(parsed.disclaimerAccepted) };
  } catch {
    return { started: false, currentIndex: 0, answers: {}, reflections: {}, supportOpen: null, disclaimerChecked: false, disclaimerAccepted: false };
  }
}

function saveState() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(fullAuditState));
  } catch {
    // Keep the site usable when localStorage is unavailable from a local file context.
  }
}
function setAuditMode(isActive) {
  if (mainSite) mainSite.hidden = isActive;
  if (fullAuditMode) fullAuditMode.hidden = !isActive;
  document.body.classList.toggle("is-audit-mode", isActive);
  if (!isActive) {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}
function enterFullAudit() {
  fullAuditState.started = false;
  fullAuditState.currentIndex = 0;
  fullAuditState.supportOpen = null;
  fullAuditState.disclaimerChecked = false;
  fullAuditState.disclaimerAccepted = false;
  clearVoiceState();
  saveState();
  setAuditMode(true);
  renderFullAudit();
}
function exitFullAudit() {
  fullAuditState.supportOpen = null;
  clearVoiceState();
  saveState();
  setAuditMode(false);
}
function clearVoiceState() {
  if (voiceRecognition && voiceState.listening) {
    voiceRecognition.stop();
  }
  voiceState.listening = false;
  voiceState.activeQuestionId = null;
  voiceState.message = "";
}
function buildFlow() {
  const items = [];
  fullAuditSteps.forEach((step, index) => {
    const nextStep = fullAuditSteps[index + 1];
    items.push({ type: "section", id: `${step.id}_intro`, categoryId: step.id, title: step.title, description: step.description, nextTitle: nextStep?.title || "Results" });
    step.questions.forEach((question) => items.push({ type: "question", categoryId: step.id, categoryTitle: step.title, ...question }));
    const reflection = reflections.find((item) => item.afterCategory === step.id);
    if (reflection) items.push({ type: "reflection", ...reflection });
    items.push({ type: "milestone", id: `${step.id}_milestone`, categoryId: step.id, title: step.title, nextTitle: nextStep?.title || "Results" });
  });
  return items;
}
function questionItems() { return flow.filter((item) => item.type === "question"); }
function sectionQuestionItems(categoryId) { return questionItems().filter((item) => item.categoryId === categoryId); }
function sectionNumber(categoryId) { return fullAuditSteps.findIndex((step) => step.id === categoryId) + 1; }
function answer(categoryId, questionId) { return fullAuditState.answers[categoryId]?.[questionId] ?? ""; }
function setAnswer(categoryId, questionId, value) { if (!fullAuditState.answers[categoryId]) fullAuditState.answers[categoryId] = {}; fullAuditState.answers[categoryId][questionId] = value; saveState(); }
function reflectionAnswer(id) { return fullAuditState.reflections[id] ?? ""; }
function setReflectionAnswer(id, value) { fullAuditState.reflections[id] = value; saveState(); }
function questionProgress(item) { const list = questionItems(); return { current: list.findIndex((question) => question.id === item.id) + 1, total: list.length }; }
function sectionProgress(item) {
  const list = sectionQuestionItems(item.categoryId);
  const current = item.type === "question" ? list.findIndex((question) => question.id === item.id) + 1 : list.length;
  return { current: Math.max(current, 0), total: list.length };
}
function journeyProgress(item) {
  const sectionCurrent = sectionNumber(item.categoryId);
  const sectionTotal = fullAuditSteps.length;
  const within = sectionProgress(item);
  const fraction = item.type === "question" ? within.current / Math.max(within.total, 1) : item.type === "section" ? 0 : 1;
  return {
    sectionCurrent,
    sectionTotal,
    withinCurrent: within.current,
    withinTotal: within.total,
    percent: ((sectionCurrent - 1 + fraction) / sectionTotal) * 100,
  };
}
function pacingLine(item) {
  const lines = [
    "Honesty matters more than perfection.",
    "First instinct is often enough to begin.",
    "Keep moving. Clarity usually arrives through the answer.",
    "This next layer may show a different pattern.",
  ];
  return lines[(sectionProgress(item).current - 1) % lines.length];
}
function categoryScore(step) { const answers = step.questions.map((question) => answer(step.id, question.id).trim()).filter(Boolean); if (!answers.length) return null; const avg = answers.reduce((sum, current) => sum + current.length, 0) / answers.length; return Math.min(10, Math.max(3.5, Number((avg / 42).toFixed(1)))); }
function summary() { const categoryScores = fullAuditSteps.map((step) => ({ id: step.id, title: step.title, score: categoryScore(step) })); const assessed = categoryScores.filter((item) => item.score !== null); const strongest = [...assessed].sort((a, b) => b.score - a.score).slice(0, 3); const weakest = [...assessed].sort((a, b) => a.score - b.score).slice(0, 3); const root = weakest[0]; return { completion: Math.round((questionItems().reduce((sum, item) => sum + (answer(item.categoryId, item.id).trim() ? 1 : 0), 0) / questionItems().length) * 100), categoryScores, strongest, weakest, frictions: weakest.map((item) => frictionPointByCategory[item.id] || `${item.title} appears to be carrying meaningful friction that is worth examining more closely.`), rootIssue: root ? (rootIssueByCategory[root.id] || `${root.title} may be exposing a broader pattern that sits underneath several other answers.`) : "Root issue will appear once more of the audit is completed.", actionPlan: root ? (actionPlanByCategory[root.id] || ["Name the core issue directly", "Choose the first action that reduces drag", "Turn one insight into a visible behavioural shift"]) : ["Complete more questions", "Then identify the first repair priority", "Use the next pass to turn reflection into sequence"] }; }
function startAuditFlow() {
  fullAuditState.started = true;
  fullAuditState.currentIndex = 0;
  fullAuditState.supportOpen = null;
  clearVoiceState();
  saveState();
  renderFullAudit();
}
function acceptDisclaimer() {
  fullAuditState.disclaimerAccepted = true;
  saveState();
  renderFullAudit();
}
function startVoiceCapture(item) {
  if (!voiceState.supported) {
    voiceState.message = "Voice input is not supported in this browser. You can continue by typing.";
    renderFullAudit();
    return;
  }
  clearVoiceState();
  voiceRecognition = new SpeechRecognitionApi();
  voiceRecognition.lang = navigator.language || "en-AU";
  voiceRecognition.interimResults = false;
  voiceRecognition.maxAlternatives = 1;
  voiceRecognition.continuous = false;
  voiceState.listening = true;
  voiceState.activeQuestionId = item.id;
  voiceState.message = "Listening. Speak naturally, then pause.";
  renderFullAudit();
  voiceRecognition.onresult = (event) => {
    const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
    if (transcript) {
      const current = answer(item.categoryId, item.id).trim();
      const nextValue = current ? `${current}\n\n${transcript}` : transcript;
      setAnswer(item.categoryId, item.id, nextValue);
      voiceState.message = "Voice note added to your answer.";
    } else {
      voiceState.message = "No speech was captured. You can try again or keep typing.";
    }
  };
  voiceRecognition.onerror = () => {
    voiceState.message = "Voice input could not start cleanly in this browser. You can continue by typing.";
    voiceState.listening = false;
    voiceState.activeQuestionId = null;
    renderFullAudit();
  };
  voiceRecognition.onend = () => {
    voiceState.listening = false;
    voiceState.activeQuestionId = null;
    renderFullAudit();
  };
  try {
    voiceRecognition.start();
  } catch {
    voiceState.listening = false;
    voiceState.activeQuestionId = null;
    voiceState.message = "Voice input is unavailable right now. You can continue by typing.";
    renderFullAudit();
  }
}

function renderProgressHeader(item) {
  const progress = journeyProgress(item);
  return `<div class="full-audit-progressbar"><div class="full-audit-progresscopy"><div class="full-audit-meta"><span>${item.title || item.categoryTitle}</span><span>Section ${progress.sectionCurrent} of ${progress.sectionTotal}</span></div><div class="full-audit-submeta"><span>${item.type === "question" ? `Question ${progress.withinCurrent} of ${progress.withinTotal}` : item.type === "milestone" ? "Section complete" : "Chapter transition"}</span><span>${pacingLine(item)}</span></div></div><div class="progress-bar progress-bar-journey"><span style="width:${progress.percent}%"></span></div></div>`;
}
function renderDisclaimer() { return `<div class="full-audit-view full-audit-card full-audit-card-disclaimer"><div class="full-audit-meta"><span>Full Life Audit</span><span>Before you begin</span></div><div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Disclaimer</p><h2 class="full-audit-title">Use this as a reflective tool, not a verdict.</h2><p class="full-audit-lead">This audit is designed to help you think clearly and answer honestly. It is not therapy, crisis support, or a medical assessment. If something feels heavy, pause when needed and come back with a clearer head.</p><p class="full-audit-note">The goal here is perspective, not pressure. Honest answers matter more than polished ones.</p></div><label class="audit-check"><input type="checkbox" data-action="toggle-disclaimer" ${fullAuditState.disclaimerChecked ? "checked" : ""} /><span>I understand and agree</span></label><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="exit-audit">Back</button><button class="button button-primary" type="button" data-action="accept-disclaimer" ${fullAuditState.disclaimerChecked ? "" : "disabled"}>Continue</button></div></div>`; }
function renderIntro() { return `<div class="full-audit-view full-audit-card full-audit-card-welcome"><div class="full-audit-meta"><span>Full Life Audit</span><span>${fullAuditSteps.length} chapters</span></div><div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Welcome</p><h2 class="full-audit-title">Enter the audit properly.</h2><p class="full-audit-lead">This is a guided session, not a race. You do not need polished answers. What matters is that your answers are honest enough to be useful.</p><p class="full-audit-note">You will move chapter by chapter. Some sections will go quickly. Others may ask more of you. Accuracy matters more than performance.</p></div><div class="full-audit-statline"><div class="result-line">One chapter at a time</div><div class="result-line">Clear section transitions</div><div class="result-line">The Auditor helps with pacing as well as reflection</div></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="exit-audit">Not now</button><button class="button button-primary" type="button" data-action="start">Begin the Audit</button></div></div>`; }
function renderSection(item) { const progress = journeyProgress(item); return `<div class="full-audit-view full-audit-card full-audit-card-intro">${renderProgressHeader(item)}<div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Section transition</p><h2 class="full-audit-title">${item.title}</h2><p class="full-audit-lead">${item.description}</p><p class="full-audit-note">This next section explores a different layer. Keep the answers direct. First instinct is often enough to begin.</p></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back" ${progress.sectionCurrent === 1 ? "disabled" : ""}>Back</button><button class="button button-primary" type="button" data-action="next">Enter section</button></div></div>`; }
function renderQuestion(item) { const sectionInfo = sectionProgress(item); const value = answer(item.categoryId, item.id); const open = fullAuditState.supportOpen === item.id; const voiceActive = voiceState.activeQuestionId === item.id; return `<div class="full-audit-view full-audit-card full-audit-card-question">${renderProgressHeader(item)}<div class="full-audit-copy-block"><h2 class="full-audit-title">${item.text}</h2><p class="full-audit-lead">Question ${sectionInfo.current} of ${sectionInfo.total} in this section. Write the first honest answer, then refine it if needed.</p></div><div class="full-audit-input-wrap"><textarea class="full-audit-textarea" data-kind="question" data-category-id="${item.categoryId}" data-question-id="${item.id}" placeholder="${item.placeholder}">${h(value)}</textarea><div class="voice-tools"><button class="voice-button ${voiceActive ? "is-listening" : ""}" type="button" data-action="voice" data-category-id="${item.categoryId}" data-question-id="${item.id}">${voiceActive ? "Listening..." : "Use voice input"}</button><span class="voice-copy">${voiceState.message ? h(voiceState.message) : voiceState.supported ? "Optional. Speak if you want a faster first draft." : "Voice input may not be available in this browser."}</span></div></div><div class="auditor-inline"><button class="auditor-toggle" type="button" data-action="support" data-id="${item.id}">${open ? "Hide support" : "Need help thinking?"}</button>${open ? `<div class="auditor-drawer"><div class="auditor-drawer-block"><strong>Thinking prompts</strong><ul>${item.prompts.map((prompt) => `<li>${prompt}</li>`).join("")}</ul></div><div class="auditor-drawer-block"><strong>Why this matters</strong><p>${item.why}</p></div><div class="auditor-drawer-block"><strong>Example answer</strong><p>${item.example}</p></div><div class="auditor-drawer-block"><strong>Pacing note</strong><p>${pacingLine(item)}</p></div></div>` : ""}</div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="next">Next</button></div></div>`; }
function renderReflection(item) { return `<div class="full-audit-view full-audit-card full-audit-card-reflection">${renderProgressHeader(item)}<div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Reflection moment</p><h2 class="full-audit-title">${item.prompt}</h2><p class="full-audit-lead">${item.body}</p><p class="full-audit-note">Honesty matters more than perfection. A short, direct answer is enough.</p></div><div class="full-audit-input-wrap"><textarea class="full-audit-textarea full-audit-textarea-reflection" data-kind="reflection" data-reflection-id="${item.id}" placeholder="Optional. Write a few lines if something clear comes up.">${h(reflectionAnswer(item.id))}</textarea></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="next">Continue</button></div></div>`; }
function renderMilestone(item) { return `<div class="full-audit-view full-audit-card full-audit-card-milestone">${renderProgressHeader(item)}<div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Section complete</p><h2 class="full-audit-title">${item.title} is complete.</h2><p class="full-audit-lead">Keep moving. The point is not to answer perfectly. The point is to keep making the pattern more visible.</p><p class="full-audit-note">Next section: ${item.nextTitle}</p></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="next">${item.nextTitle === "Results" ? "See results" : "Continue"}</button></div></div>`; }
function renderResults() { const data = summary(); return `<div class="full-audit-view full-audit-card full-audit-card-results"><div class="full-audit-meta"><span>Full Results</span><span>${data.completion}% complete</span></div><div class="full-audit-copy-block"><h2 class="full-audit-title">Results scaffold</h2><p class="full-audit-lead">This screen is prepared for the fuller scoring engine. For now it uses the guided flow and stored answers to scaffold the final product shape.</p></div><div class="results-block"><h4>Category scores</h4><div class="results-grid">${data.categoryScores.map((item) => `<div class="result-tile"><span>${item.title}</span><strong>${item.score === null ? "Not yet assessed" : `${item.score}/10`}</strong></div>`).join("")}</div></div><div class="results-block"><h4>Strongest areas</h4><div class="results-list">${data.strongest.length ? data.strongest.map((item) => `<div class="result-line">${item.title} <strong>${item.score}/10</strong></div>`).join("") : `<div class="result-line">Complete more questions to surface strongest areas.</div>`}</div></div><div class="results-block"><h4>Weakest areas</h4><div class="results-list">${data.weakest.length ? data.weakest.map((item) => `<div class="result-line">${item.title} <strong>${item.score}/10</strong></div>`).join("") : `<div class="result-line">Complete more questions to surface weakest areas.</div>`}</div></div><div class="results-block"><h4>Friction points</h4><div class="results-list">${data.frictions.length ? data.frictions.map((item) => `<div class="result-line">${item}</div>`).join("") : `<div class="result-line">Friction points will appear once categories have enough material.</div>`}</div></div><div class="results-block"><h4>Root issue</h4><div class="result-focus">${data.rootIssue}</div></div><div class="results-block"><h4>Action plan</h4><div class="results-list">${data.actionPlan.map((item) => `<div class="result-line">${item}</div>`).join("")}</div></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="restart">Start again</button><button class="button button-primary" type="button" data-action="review">Review session</button></div></div>`; }
function renderFullAudit() { if (!fullAuditState.disclaimerAccepted) { fullAuditRoot.innerHTML = renderDisclaimer(); return; } if (!fullAuditState.started) { fullAuditRoot.innerHTML = renderIntro(); return; } if (fullAuditState.currentIndex >= flow.length) { fullAuditRoot.innerHTML = renderResults(); return; } const item = flow[fullAuditState.currentIndex]; fullAuditRoot.innerHTML = item.type === "section" ? renderSection(item) : item.type === "question" ? renderQuestion(item) : item.type === "milestone" ? renderMilestone(item) : renderReflection(item); }
function resetState() { fullAuditState.started = false; fullAuditState.currentIndex = 0; fullAuditState.answers = {}; fullAuditState.reflections = {}; fullAuditState.supportOpen = null; fullAuditState.disclaimerChecked = false; fullAuditState.disclaimerAccepted = false; clearVoiceState(); saveState(); renderFullAudit(); }

if (fullAuditRoot) {
  fullAuditRoot.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.kind === "question") setAnswer(target.dataset.categoryId, target.dataset.questionId, target.value);
    if (target.dataset.kind === "reflection") setReflectionAnswer(target.dataset.reflectionId, target.value);
  });

}

if (fullAuditMode) {
  fullAuditMode.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "exit-audit") {
      exitFullAudit();
      return;
    }
    if (action === "start") {
      startAuditFlow();
      return;
    }
    if (action === "toggle-disclaimer") {
      fullAuditState.disclaimerChecked = !fullAuditState.disclaimerChecked;
      saveState();
      renderFullAudit();
      return;
    }
    if (action === "accept-disclaimer") {
      if (fullAuditState.disclaimerChecked) {
        acceptDisclaimer();
      }
      return;
    }
    if (action === "voice") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question") {
        startVoiceCapture(item);
      }
      return;
    }
    if (action === "next") {
      clearVoiceState();
      fullAuditState.currentIndex += 1;
      fullAuditState.supportOpen = null;
      saveState();
      renderFullAudit();
      return;
    }
    if (action === "back") {
      clearVoiceState();
      fullAuditState.currentIndex = Math.max(0, fullAuditState.currentIndex - 1);
      fullAuditState.supportOpen = null;
      saveState();
      renderFullAudit();
      return;
    }
    if (action === "support") {
      fullAuditState.supportOpen = fullAuditState.supportOpen === target.dataset.id ? null : target.dataset.id;
      saveState();
      renderFullAudit();
      return;
    }
    if (action === "restart") {
      resetState();
      return;
    }
    if (action === "review") {
      clearVoiceState();
      fullAuditState.currentIndex = 0;
      fullAuditState.supportOpen = null;
      saveState();
      renderFullAudit();
    }
  });
}

renderFullAudit();
setAuditMode(false);

document.querySelectorAll('a[data-start-full-audit="true"]').forEach((node) => {
  node.addEventListener("click", (event) => {
    event.preventDefault();
    enterFullAudit();
  });
});
