const app = document.querySelector("#app");

const features = [
  ["Get your Life Score", "Start with a short free trial audit that gives people an initial insight into where life feels strong, weak, or drifting."],
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
  { step: "01", title: "Start with an initial audit", body: "Get a first layer of insight into where you are right now." },
  { step: "02", title: "See your initial result", body: "Understand what's working and where things feel off." },
  { step: "03", title: "Go deeper", body: "Work through each area of your life with guided questions." },
  { step: "04", title: "Get your breakdown", body: "See your strengths, weak spots, and hidden friction." },
  { step: "05", title: "Know what to do next", body: "Walk away with clear next steps and a simple plan." },
];

const miniAuditQuestions = [
  ["clarity", "Clarity", "How clear do you feel about what matters most in your life right now?", [["Not clear at all", 1], ["Mostly confused", 2], ["Somewhat clear", 3], ["Mostly clear", 4], ["Very clear", 5]]],
  ["energy", "Health", "How would you rate your daily energy and physical upkeep?", [["Very poor", 1], ["Below average", 2], ["Inconsistent", 3], ["Mostly solid", 4], ["Strong and reliable", 5]]],
  ["followThrough", "Discipline", "When you decide something matters, how often do you actually follow through?", [["Almost never", 1], ["Rarely", 2], ["Sometimes", 3], ["Usually", 4], ["Consistently", 5]]],
  ["relationships", "Relationships", "How healthy and honest do your core relationships feel?", [["Very strained", 1], ["Unsteady", 2], ["Mixed", 3], ["Mostly healthy", 4], ["Strong and grounded", 5]]],
  ["alignment", "Direction", "How aligned does your current life feel with the person you want to be?", [["Not aligned", 1], ["Far off", 2], ["Partially aligned", 3], ["Mostly aligned", 4], ["Deeply aligned", 5]]],
];

function inferQuestionMeta(sectionId, text) {
  const normalized = String(text || "").toLowerCase().trim();
  const isScale = /out of 10|from 1 to 10/.test(normalized) || normalized.startsWith("rate ");
  if (isScale) {
    return { inputType: "scale", minWords: 0, scaleMin: 1, scaleMax: 10 };
  }

  const isShort =
    /one sentence/.test(normalized) ||
    normalized.startsWith("what are your best qualities") ||
    normalized.startsWith("what are your worst habits") ||
    normalized.startsWith("what compliments do you receive") ||
    normalized.startsWith("what criticisms do you receive") ||
    normalized.startsWith("who do you fear") ||
    normalized.startsWith("what fear used to control you") ||
    normalized.startsWith("what helps calm you down") ||
    normalized.startsWith("what thought patterns hurt you the most");

  if (isShort) {
    return { inputType: "short", minWords: 0 };
  }

  const deeperSections = new Set([
    "identityCompression",
    "theIdentityGap",
    "fearMapping",
    "anxietyTriggerAwareness",
    "internalThreatAssessment",
    "mentalTabsAudit",
    "ambitionPurposePotential",
    "valuesNonNegotiables",
    "mirrorReportBrutalHonesty",
    "patternRecognition",
    "priorityRepairList",
    "finalCommitment",
  ]);

  return {
    inputType: "reflective",
    minWords: deeperSections.has(sectionId) ? 18 : 14,
  };
}

function q(id, text, placeholder, prompt, why, example, meta = {}) {
  const inferred = inferQuestionMeta("", text);
  return {
    id,
    text,
    placeholder,
    prompts: [prompt, "Write the first honest thing that comes to mind.", "Notice what you keep circling around."],
    why,
    example,
    inputType: inferred.inputType,
    minWords: inferred.minWords,
    scaleMin: inferred.scaleMin,
    scaleMax: inferred.scaleMax,
    ...meta,
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
        "Answer in your own words. A few honest sentences are enough to begin.",
        inferQuestionMeta(section.id, text)
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
  {
    name: "Free Trial Audit",
    price: "$0",
    subtitle: "Opening insight",
    items: ["Initial life score", "First layer of insight", "Identify where things feel off"],
    details: [
      "A short guided entry into the Life Audit.",
      "Five questions answered one at a time.",
      "A personalised opening read based on your response pattern.",
      "A clearer sense of whether the deeper audit is worth doing.",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Full Life Audit",
    price: "$199",
    subtitle: "A real diagnosis",
    items: ["A sharper read on what is actually off", "See the patterns draining performance and peace", "Understand what is underneath the friction", "Leave with clear next moves, not more theory"],
    details: [
      "A guided one-question-at-a-time assessment across identity, standards, mental load, discipline, health, relationships, communication, direction, and alignment.",
      "A deep result that pulls your answers into one coherent read: what is working, what is breaking down, what is being avoided, and what is costing you most.",
      "A report designed to feel closer to several weeks of sharp coaching than a generic self-assessment, without dragging you into endless sessions.",
      "Practical next steps that show what to address first, what to stop tolerating, and how to start moving into a cleaner next chapter.",
    ],
    cta: "Continue to Members Access",
    featured: true,
    value: "For the person who is functioning, carrying a lot, and knows something is off but wants a real answer, not another vague growth exercise.",
    accessNote: "Full Audit access is managed through Members Access. Sign in or create an account to continue.",
  },
];

const faqs = [
  { q: "What is Life Audit?", a: "Life Audit is a structured self-assessment that helps you understand what is working, what is draining you, and what needs attention next. It is not coaching, therapy, or generic motivation." },
  { q: "Who is this for?", a: "It is for business owners, high performers, people who feel stuck or unclear, and people who know something is off but cannot quite pinpoint it. If your life looks functional on the outside but feels uneven underneath, this is for you." },
  { q: "Is my information private?", a: "Yes. Your responses are not shared, your data is not sold, and your answers remain confidential. The experience is designed to feel personal, contained, and safe to answer honestly." },
  { q: "Is this therapy or professional advice?", a: "No. Life Audit is not medical, psychological, or professional advice. It is a self-guided reflection tool designed to help you think clearly and see patterns more accurately." },
  { q: "What do I get at the end?", a: "You get a category breakdown, your strongest and weakest areas, key friction points, a likely root issue, and clear next steps so the result is useful, not vague." },
  { q: "How long does it take?", a: "The free trial audit is designed as an initial insight. The full audit goes deeper and takes more time, but you can move through it at your own pace." },
  { q: "Do I need to answer perfectly?", a: "No. Honesty matters more than perfection. Simple, direct answers are enough to make the audit useful." },
  { q: "Is there a refund policy?", a: "All purchases are final and non-refundable due to the nature of the product as a completed digital experience." },
];

const auditorPoints = [
  "Thinking prompts when the user blanks",
  "Why this question matters",
  "Example answers that feel real, not robotic",
  "Gentle interventions when the user stalls",
  "Small reflection moments between sections",
];

const tagItems = ["Identity", "Mental clarity", "Relationships", "Direction", "30-day reset"];
const conceptSlides = [
  {
    id: "mental-tabs",
    eyebrow: "Mental Tabs",
    title: "What stays unresolved keeps running in the background.",
    body: "Unfinished decisions, pressure, emotional friction, and half-closed loops do not disappear when ignored. They stay mentally open, quietly reducing clarity, energy, and clean attention.",
  },
  {
    id: "identity",
    eyebrow: "Identity",
    title: "A lot of decisions still come from an old role.",
    body: "Many people are still operating from an old self-image, old responsibility, or version of themselves they never properly examined. The full audit helps surface the identity that is still driving the system.",
  },
  {
    id: "energy",
    eyebrow: "Energy",
    title: "Low energy affects more than just how you feel.",
    body: "Poor sleep, chronic stress, and weak physical maintenance influence clarity, discipline, mood, and follow-through. What looks like a mindset issue is often partly an energy issue.",
  },
];

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const auditDeveloperMode = (() => {
  try {
    const hostname = window.location.hostname || "";
    const protocol = window.location.protocol || "";
    const isLocalEnvironment =
      protocol === "file:" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local");
    if (!isLocalEnvironment) {
      window.localStorage.removeItem("lifeAudit.auditDeveloperMode");
      return false;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("auditdev") === "1") {
      window.localStorage.setItem("lifeAudit.auditDeveloperMode", "true");
    }
    if (params.get("auditdev") === "0") {
      window.localStorage.removeItem("lifeAudit.auditDeveloperMode");
    }
    return window.localStorage.getItem("lifeAudit.auditDeveloperMode") === "true";
  } catch {
    return false;
  }
})();

function renderSite() {
  app.innerHTML = `<div class="site-shell" id="main-site">
    <div id="top"></div>
    <div class="hero-orb" aria-hidden="true"></div>
    <section class="hero">
      <div class="container">
        <header class="topbar reveal">
          <a class="brand" href="#top"><span class="brand-mark" aria-hidden="true"></span><span>LIFE AUDIT</span></a>
          <nav class="topbar-links" aria-label="Primary">
            <a href="#mini-audit">Free Trial Audit</a>
            <a href="#pricing">Unlock Full Audit</a>
            <a href="./portal.html">Members Access</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
        </header>
        <div class="hero-grid">
          <div class="hero-main reveal">
            <div class="hero-typed" aria-label="Life Audit"><span>LIFE AUDIT</span></div>
            <h1>You already know something's off. This shows you exactly what's going on, and what to do about it.</h1>
            <p class="hero-subtext">A structured self-assessment that goes beneath the surface, revealing what is actually driving your decisions, patterns, and results.</p>
            <p class="hero-support">So you can see clearly what is working, what is not, and what needs to change.</p>
            <div class="hero-actions">
              <a class="button button-primary" href="#mini-audit">Start your free trial audit</a>
              <a class="button button-secondary" href="#pricing">Unlock Full Audit</a>
            </div>
            <div class="hero-tags">${tagItems.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="mini-audit">
      <div class="container">
        <div class="mini-audit-intro reveal">
          <p class="section-kicker">Free Trial Audit</p>
          <h2>Get an initial insight into where you're at.</h2>
          <p>Begin with the first layer of the Life Audit. Five questions, one at a time, and an opening diagnosis of where life feels steady or strained.</p>
        </div>
        <div class="mini-audit-wrap reveal">
          <div class="audit-shell mini-audit-shell">
            <div id="mini-audit-flow"></div>
            <div class="audit-result" id="mini-audit-result" hidden>
              <p class="section-kicker">Opening diagnosis</p>
              <p class="mini-audit-personal" id="mini-audit-personal" hidden></p>
              <div class="audit-score" id="mini-audit-score">0/100</div>
              <h3 id="mini-audit-title">Stable but Stretched</h3>
              <p id="mini-audit-message">Some parts of life are still carrying you, but the pattern underneath suggests strain, split focus, and uneven follow-through.</p>
              <div class="audit-insight">
                <p class="audit-insight-label">Pattern insight</p>
                <p id="mini-audit-pattern">The way you are carrying things may be shaping the result as much as the result itself.</p>
              </div>
              <div class="audit-meta">
                <div class="audit-meta-row"><span>Strongest area</span><strong id="mini-audit-strongest">Clarity</strong></div>
                <div class="audit-meta-row"><span>Biggest friction point</span><strong id="mini-audit-friction">You can see the gap, but your execution is not fully supporting your priorities.</strong></div>
                <div class="audit-meta-row"><span>Next step</span><strong id="mini-audit-next-step">Reduce one source of drag and make one cleaner decision.</strong></div>
              </div>
              <div class="audit-upgrade"><p id="mini-audit-upgrade">The full Life Audit goes deeper into identity, health, relationships, discipline, clarity, direction, and hidden friction.</p></div>
              <a class="button button-secondary" href="#pricing">Unlock Full Audit</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-muted" id="mental-tabs">
      <div class="container">
        <div class="mental-preview reveal">
          <div class="mental-preview-intro">
            <p class="section-kicker">Inside the Full Audit</p>
            <h2>A preview of the deeper ideas the full audit explores.</h2>
            <p>These are the kinds of hidden patterns the full Life Audit helps bring into focus beneath the surface.</p>
          </div>
          <div class="mental-carousel" data-concept-carousel>
            <div class="mental-carousel-viewport">
              <div class="mental-carousel-track" id="concept-track">
                ${conceptSlides.map((slide) => `
                  <article class="mental-slide">
                    <p class="mental-slide-kicker">${slide.eyebrow}</p>
                    <h3>${slide.title}</h3>
                    <p>${slide.body}</p>
                  </article>
                `).join("")}
              </div>
            </div>
            <div class="mental-carousel-controls">
              <button class="mental-carousel-button" type="button" data-concept-prev aria-label="Previous concept">Previous</button>
              <div class="mental-carousel-dots" aria-label="Concept slides">
                ${conceptSlides.map((slide, index) => `<button class="mental-dot ${index === 0 ? "is-active" : ""}" type="button" data-concept-dot="${index}" aria-label="Go to ${slide.eyebrow}"></button>`).join("")}
              </div>
              <button class="mental-carousel-button" type="button" data-concept-next aria-label="Next concept">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="flow"><div class="container"><div class="section-heading reveal"><p class="section-kicker">What happens</p><h2>A clear path from first insight to next steps.</h2><p>Move from an opening diagnosis of where life stands to a clearer understanding of what needs attention.</p></div><div class="journey-visual reveal"><div class="journey-track">${steps.map((item) => `<article class="journey-node"><span>${item.step}</span><strong>${item.title}</strong><p>${item.body}</p></article>`).join("")}</div><div class="journey-outcome"><p class="journey-label">End result</p><h3>Clarity on what is working, what is draining you, and what to do next.</h3><div class="journey-outcome-points"><span>Clearer direction</span><span>Visible friction points</span><span>A practical next step</span></div></div></div></div></section>
    <section class="section" id="pricing"><div class="container"><div class="section-heading reveal"><p class="section-kicker">Pricing</p><h2>One clear step from surface-level answers to a more honest diagnosis.</h2><p>Start with an initial insight. If it feels accurate, go deeper and get the fuller picture.</p></div><div class="pricing-grid">${pricing.map((tier) => `<article class="pricing-card reveal ${tier.featured ? "featured" : ""}"><div class="price-row"><div><p class="price-tagline">${tier.subtitle}</p><h3>${tier.name}</h3></div><div class="price-value">${tier.price}</div></div><div class="pricing-list">${tier.items.map((item) => `<div class="pricing-item">${item}</div>`).join("")}</div><details class="pricing-details"><summary>See what is included</summary><div class="pricing-details-body">${tier.details.map((item) => `<div class="pricing-detail-line">${item}</div>`).join("")}</div></details>${tier.value ? `<p class="pricing-value">${tier.value}</p>` : ""}${tier.accessNote ? `<p class="pricing-access-note">${tier.accessNote}</p>` : ""}<a class="button ${tier.featured ? "" : "button-primary"}" href="${tier.featured ? "./portal.html" : "#mini-audit"}">${tier.cta}</a></article>`).join("")}</div><p class="pricing-trust reveal">Built for people who are tired of carrying friction without being able to name it properly.</p></div></section>
    <section class="section section-muted" id="faq"><div class="container"><div class="faq-layout"><div class="faq-copy reveal"><p class="section-kicker">FAQ</p><h2>Questions you may have before you start.</h2><p>Everything you need to know before taking the audit.</p></div><div class="faq-list">${faqs.map((item, index) => `<details class="faq-item reveal" ${index === 0 ? "open" : ""}><summary><span>${item.q}</span><span class="faq-toggle" aria-hidden="true"></span></summary><div class="faq-answer"><p>${item.a}</p></div></details>`).join("")}</div></div></div></section>
    <footer class="footer"><div class="container"><div class="footer-row reveal"><div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>LIFE AUDIT</span></div><div class="footer-links"><a class="footer-link" href="./portal.html">Members Access</a><a class="footer-link" href="./privacy.html">Privacy Policy</a><a class="footer-link" href="./terms.html">Terms &amp; Disclaimer</a><a class="footer-cta" href="#top">Back to top</a></div></div></div></footer>
  </div>
  <div class="resume-overlay" id="full-audit-resume-overlay" hidden></div>
  <section class="audit-mode" id="full-audit-mode" hidden aria-label="Full Life Audit session">
    <div class="audit-mode-shell">
      <div class="audit-mode-bar">
        <span class="audit-mode-label">Full Life Audit</span>
        <div class="audit-mode-actions">
          ${auditDeveloperMode ? '<button class="audit-dev" type="button" data-action="toggle-dev-map">Developer View</button>' : ""}
          <button class="audit-focus" type="button" data-action="toggle-focus-mode">Enter Focus Mode</button>
          <button class="audit-exit" type="button" data-action="exit-audit">Exit Full Audit</button>
        </div>
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

const miniAuditFlow = document.querySelector("#mini-audit-flow");
const miniAuditResult = document.querySelector("#mini-audit-result");
const miniAuditScore = document.querySelector("#mini-audit-score");
const miniAuditTitle = document.querySelector("#mini-audit-title");
const miniAuditMessage = document.querySelector("#mini-audit-message");
const miniAuditPattern = document.querySelector("#mini-audit-pattern");
const miniAuditStrongest = document.querySelector("#mini-audit-strongest");
const miniAuditFriction = document.querySelector("#mini-audit-friction");
const miniAuditNextStep = document.querySelector("#mini-audit-next-step");
const miniAuditUpgrade = document.querySelector("#mini-audit-upgrade");
const miniAuditPersonal = document.querySelector("#mini-audit-personal");
const conceptCarousel = document.querySelector("[data-concept-carousel]");
const mainSite = document.querySelector("#main-site");
const resumeOverlay = document.querySelector("#full-audit-resume-overlay");
const fullAuditMode = document.querySelector("#full-audit-mode");
const fullAuditRoot = document.querySelector("#full-audit-app");

const frictionCopyByArea = {
  Clarity: "You may be functioning without a sharp enough picture of what actually matters, which makes good effort scatter.",
  Health: "Your physical state may be quietly reducing patience, clarity, and consistency more than you think.",
  Discipline: "You can likely identify what matters, but your routines and follow-through are not reliably backing it up.",
  Relationships: "Relational strain or avoidance may be taking up more mental bandwidth than is obvious on the surface.",
  Direction: "Part of the friction appears to be misalignment between how you are living and what you actually want to respect.",
};

const miniAuditState = {
  stage: "capture",
  index: 0,
  answers: {},
  user: loadMiniAuditUser(),
};
window.lifeAuditUser = { ...miniAuditState.user };

function loadMiniAuditUser() {
  try {
    const raw = window.localStorage.getItem("lifeAudit.miniAuditUser");
    if (!raw) return { name: "", email: "" };
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return { name: "", email: "" };
  }
}

function saveMiniAuditUser() {
  try {
    window.localStorage.setItem("lifeAudit.miniAuditUser", JSON.stringify(miniAuditState.user));
  } catch {}
  window.lifeAuditUser = { ...miniAuditState.user };
  if (fullAuditState?.user) {
    fullAuditState.user = { ...fullAuditState.user, ...miniAuditState.user };
  }
}

function mentalLoadScore(areas) {
  return Math.max(1, Math.min(5, Math.round(6 - ((areas.clarity + areas.alignment) / 2))));
}

function analyseMiniAudit(areas) {
  const strongest = Object.entries(areas).sort((a, b) => b[1] - a[1])[0];
  const weakest = Object.entries(areas).sort((a, b) => a[1] - b[1])[0];
  const mentalLoad = mentalLoadScore(areas);
  const directionLow = areas.alignment <= 2;
  const clarityLow = areas.clarity <= 2;
  const energyLow = areas.energy <= 2;
  const disciplineLow = areas.followThrough <= 2;
  const relationshipLow = areas.relationships <= 2;
  const insightHighExecutionLow = areas.clarity >= 4 && areas.alignment >= 4 && areas.followThrough <= 2;
  const stableButFlat = Object.values(areas).every((score) => score >= 3) && Object.values(areas).every((score) => score <= 4);

  let diagnosis = "Something important is being carried in the background.";
  let summary = "The surface may still look functional, but the pattern underneath suggests avoidable drag and split attention.";
  let pattern = "You seem to be compensating around the issue rather than properly resolving it.";
  let nextStep = "Name the one source of friction you already know is costing more energy than it should.";
  let upgrade = "The full Life Audit helps separate surface symptoms from the deeper pattern driving them.";

  if (mentalLoad >= 4 && !relationshipLow) {
    diagnosis = "You're not lacking effort. You're carrying too much in the background.";
    summary = "Your answers suggest mental load is quietly eating into clarity and follow-through. This does not read like low capability. It reads like too many unresolved tabs staying open at once.";
    pattern = "You may be trying to function at a decent level while carrying unfinished decisions, diffuse pressure, or low-grade internal noise in the background.";
    nextStep = "Close or clearly define one open loop that has been following you around longer than it should.";
    upgrade = "The full Life Audit goes deeper into hidden friction, mental tabs, and the unresolved patterns still shaping your decisions.";
  } else if (insightHighExecutionLow) {
    diagnosis = "You can see what matters, but your life is not fully backing it up.";
    summary = "This looks less like confusion and more like a gap between insight and execution. You likely know more than your current structure is helping you act on.";
    pattern = "The pattern here is under-converted clarity: strong awareness, but not enough protection, rhythm, or follow-through to make it real.";
    nextStep = "Choose one standard you already believe in and make it visible in your week within the next seven days.";
    upgrade = "The full Life Audit helps trace why clear insight is not yet turning into stable action.";
  } else if (energyLow && disciplineLow) {
    diagnosis = "Your system looks under-supported, not under-motivated.";
    summary = "The result suggests your energy and follow-through are interfering with each other. When the physical base drops, discipline usually becomes harder to trust.";
    pattern = "What may feel like inconsistency could partly be a maintenance problem: lower energy, weaker recovery, then less reliable execution.";
    nextStep = "Stabilise one physical basic first: sleep, movement, or recovery. Do not try to fix everything at once.";
    upgrade = "The full Life Audit goes further into how energy, discipline, and internal pressure are feeding each other.";
  } else if (directionLow && clarityLow) {
    diagnosis = "You may not be off track. You may be under-defined.";
    summary = "Your answers point to a lack of clear internal direction. When the picture is too loose, effort tends to scatter and life starts to feel heavier than it should.";
    pattern = "The pattern here is not a lack of intelligence. It is a lack of a strong enough organising direction.";
    nextStep = "Write down what actually matters most right now in one sentence, without trying to make it impressive.";
    upgrade = "The full Life Audit helps uncover the identity, standards, and direction your current life is actually being organised around.";
  } else if (relationshipLow) {
    diagnosis = "Part of the strain may be relational, not just internal.";
    summary = "Your answers suggest that people, honesty, or relational tension may be taking up more space than is obvious on the surface.";
    pattern = "When relationships feel unsteady, they tend to drain mental bandwidth long before the problem becomes fully visible.";
    nextStep = "Name the one relationship or conversation that is costing more energy than you have admitted.";
    upgrade = "The full Life Audit goes deeper into relationships, communication, and the hidden tension that keeps showing up elsewhere.";
  } else if (stableButFlat) {
    diagnosis = "The surface looks stable, but it may be flatter than it should be.";
    summary = "Nothing here looks chaotic, but it also does not look fully aligned. This kind of pattern often means the real issue is subtle enough to stay unchallenged for too long.";
    pattern = "You may be functioning reasonably well while slowly normalising a version of life that is less sharp, honest, or energised than it could be.";
    nextStep = "Do not ask what is broken. Ask what feels quietly below your level.";
    upgrade = "The full Life Audit is designed to surface the deeper patterns that do not show up as obvious crisis, but still shape the whole system.";
  }

  return {
    diagnosis,
    summary,
    pattern,
    strongest,
    weakest,
    nextStep,
    upgrade,
    mentalLoad,
  };
}

function completeMiniAudit() {
  const answers = miniAuditQuestions.map((question) => Number(miniAuditState.answers[question[0]]));
  if (answers.some((value) => Number.isNaN(value) || value === 0)) {
    miniAuditFlow.hidden = true;
    miniAuditTitle.textContent = "Complete all 5 questions";
    miniAuditMessage.textContent = "Choose one answer for each question so the audit can calculate your score.";
    miniAuditScore.textContent = "--/100";
    if (miniAuditPattern) miniAuditPattern.textContent = "The result needs all five answers before it can recognise the pattern properly.";
    miniAuditStrongest.textContent = "--";
    miniAuditFriction.textContent = "The audit needs all five answers before it can point to the main source of drag.";
    if (miniAuditNextStep) miniAuditNextStep.textContent = "Complete the full free trial audit first.";
    if (miniAuditUpgrade) miniAuditUpgrade.textContent = "The full Life Audit goes deeper into identity, health, relationships, discipline, clarity, direction, and hidden friction.";
    miniAuditResult.hidden = false;
    return;
  }

  const totalScore = answers.reduce((sum, value) => sum + value, 0);
  const scoreOutOf100 = totalScore * 4;
  const areas = Object.fromEntries(miniAuditQuestions.map((question, index) => [question[0], answers[index]]));
  const analysis = analyseMiniAudit(areas);
  const firstName = miniAuditState.user.name.trim().split(/\s+/)[0];

  miniAuditScore.textContent = `${scoreOutOf100}/100`;
  miniAuditTitle.textContent = analysis.diagnosis;
  miniAuditMessage.textContent = analysis.summary;
  if (miniAuditPattern) miniAuditPattern.textContent = analysis.pattern;
  miniAuditStrongest.textContent = `${miniAuditQuestions.find((question) => question[0] === analysis.strongest[0])?.[1] || analysis.strongest[0]} (${analysis.strongest[1]}/5)`;
  miniAuditFriction.textContent = frictionCopyByArea[miniAuditQuestions.find((question) => question[0] === analysis.weakest[0])?.[1] || ""] ?? "One weaker area is likely creating more background drag than it first appears.";
  if (miniAuditNextStep) miniAuditNextStep.textContent = analysis.nextStep;
  if (miniAuditUpgrade) miniAuditUpgrade.textContent = analysis.upgrade;
  if (miniAuditPersonal) {
    miniAuditPersonal.hidden = !firstName;
    miniAuditPersonal.textContent = firstName ? `${firstName}, here's what stands out.` : "";
  }
  miniAuditState.stage = "results";
  miniAuditFlow.hidden = true;
  miniAuditResult.hidden = false;
}

function renderMiniAudit() {
  if (!miniAuditFlow) return;
  miniAuditFlow.hidden = false;
  if (miniAuditState.stage === "capture") {
    miniAuditFlow.innerHTML = `
      <form class="mini-audit-card mini-audit-capture" id="mini-audit-capture">
        <div class="mini-audit-head">
          <div>
            <p class="mini-audit-kicker">Before you begin</p>
            <h3>Start your free trial audit.</h3>
          </div>
        </div>
          <p class="mini-audit-capture-copy">This works best when your answers are honest and uninterrupted.</p>
        <div class="mini-audit-fields">
          <label class="mini-audit-field">
            <span>Name</span>
            <input type="text" name="name" value="${h(miniAuditState.user.name)}" placeholder="Your name" autocomplete="name" required />
          </label>
          <label class="mini-audit-field">
            <span>Email</span>
            <input type="email" name="email" value="${h(miniAuditState.user.email)}" placeholder="you@example.com" autocomplete="email" required />
          </label>
        </div>
        <div class="mini-audit-footer">
          <button class="button button-primary" type="submit">Begin the audit</button>
        </div>
      </form>
    `;
    return;
  }
  const item = miniAuditQuestions[miniAuditState.index];
  const selected = miniAuditState.answers[item[0]];
  const isLast = miniAuditState.index === miniAuditQuestions.length - 1;
  const progressNodes = miniAuditQuestions.map((_, index) => {
    const state = index < miniAuditState.index ? "is-complete" : index === miniAuditState.index ? "is-current" : "is-pending";
    return `<span class="mini-audit-progress-node ${state}"></span>`;
  }).join("");

  miniAuditFlow.innerHTML = `
    <div class="mini-audit-card">
      <div class="mini-audit-head">
        <div>
          <p class="mini-audit-kicker">First look beneath the surface</p>
          <h3>${h(item[2])}</h3>
        </div>
      </div>
      <div class="mini-audit-progress" aria-hidden="true">
        <div class="mini-audit-progress-line"></div>
        <div class="mini-audit-progress-network">${progressNodes}</div>
      </div>
      <div class="audit-options mini-audit-options">
        ${item[3].map(([label, score]) => `
          <button class="mini-audit-option ${selected === score ? "is-selected" : ""}" type="button" data-mini-score="${score}">
            <span>${h(label)}</span>
          </button>
        `).join("")}
      </div>
      <div class="mini-audit-footer">
        <button class="button button-secondary" type="button" data-mini-back ${miniAuditState.index === 0 ? "disabled" : ""}>Back</button>
        <button class="button button-primary" type="button" data-mini-next ${selected ? "" : "disabled"}>${isLast ? "See my result" : "Next"}</button>
      </div>
    </div>
  `;
}

if (miniAuditFlow && miniAuditResult) {
  renderMiniAudit();

  miniAuditFlow.addEventListener("click", (event) => {
    const optionButton = event.target.closest("[data-mini-score]");
    if (optionButton) {
      const item = miniAuditQuestions[miniAuditState.index];
      miniAuditState.answers[item[0]] = Number(optionButton.dataset.miniScore);
      miniAuditFlow.hidden = false;
      miniAuditResult.hidden = true;
      renderMiniAudit();
      return;
    }

    const backButton = event.target.closest("[data-mini-back]");
    if (backButton && miniAuditState.index > 0) {
      miniAuditState.index -= 1;
      miniAuditFlow.hidden = false;
      miniAuditResult.hidden = true;
      renderMiniAudit();
      return;
    }

    const nextButton = event.target.closest("[data-mini-next]");
    if (!nextButton) return;
    const current = miniAuditQuestions[miniAuditState.index];
    if (!miniAuditState.answers[current[0]]) return;

    if (miniAuditState.index === miniAuditQuestions.length - 1) {
      completeMiniAudit();
      return;
    }

    miniAuditState.index += 1;
    miniAuditFlow.hidden = false;
    miniAuditResult.hidden = true;
    renderMiniAudit();
  });

  miniAuditFlow.addEventListener("submit", (event) => {
    const captureForm = event.target.closest("#mini-audit-capture");
    if (!captureForm) return;
    event.preventDefault();
    const formData = new FormData(captureForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    if (!name || !email) return;
    miniAuditState.user = { name, email };
    miniAuditState.stage = "questions";
    saveMiniAuditUser();
    miniAuditResult.hidden = true;
    renderMiniAudit();
  });
}

if (conceptCarousel) {
  const track = conceptCarousel.querySelector("#concept-track");
  const prev = conceptCarousel.querySelector("[data-concept-prev]");
  const next = conceptCarousel.querySelector("[data-concept-next]");
  const dots = [...conceptCarousel.querySelectorAll("[data-concept-dot]")];
  let currentConcept = 0;

  function renderConcept(index) {
    currentConcept = (index + conceptSlides.length) % conceptSlides.length;
    if (track) {
      track.style.transform = `translateX(-${currentConcept * 100}%)`;
    }
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentConcept);
    });
  }

  prev?.addEventListener("click", () => renderConcept(currentConcept - 1));
  next?.addEventListener("click", () => renderConcept(currentConcept + 1));
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => renderConcept(index));
  });
  renderConcept(0);
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
let introTypingRun = 0;
let fullAuditEntryRequested = false;
let fullAuditRenderMode = "static";
let cloudSyncTimer = null;
let cloudBootstrapStarted = false;
const resultReflectionSections = ["diagnosis", "rootIssue", "firstFix"];
let auditDeveloperPanelOpen = false;

function readMiniAuditUser() {
  try {
    const raw = window.localStorage.getItem("lifeAudit.miniAuditUser");
    if (!raw) return { name: "", email: "" };
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return { name: "", email: "" };
  }
}

function defaultFullAuditState() {
  return {
    started: false,
    currentIndex: 0,
    restartCount: 0,
    completedAt: null,
    answers: {},
    reflections: {},
    resultReflections: {},
    supportOpen: null,
    depthPromptQuestionId: null,
    depthPromptBypass: {},
    skipPromptQuestionId: null,
    skippedQuestionIds: {},
    focusMode: false,
    disclaimerChecked: false,
    disclaimerAccepted: false,
    user: readMiniAuditUser(),
  };
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultFullAuditState();
    const parsed = JSON.parse(raw);
    const fallbackUser = readMiniAuditUser();
    return {
      started: Boolean(parsed.started),
      currentIndex: Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0,
      restartCount: Number.isInteger(parsed.restartCount) ? parsed.restartCount : 0,
      completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : null,
      answers: parsed.answers || {},
      reflections: parsed.reflections || {},
      resultReflections: parsed.resultReflections || {},
      supportOpen: parsed.supportOpen || null,
      depthPromptQuestionId: typeof parsed.depthPromptQuestionId === "string" ? parsed.depthPromptQuestionId : null,
      depthPromptBypass: parsed.depthPromptBypass || {},
      skipPromptQuestionId: typeof parsed.skipPromptQuestionId === "string" ? parsed.skipPromptQuestionId : null,
      skippedQuestionIds: parsed.skippedQuestionIds || {},
      focusMode: Boolean(parsed.focusMode),
      disclaimerChecked: Boolean(parsed.disclaimerChecked),
      disclaimerAccepted: Boolean(parsed.disclaimerAccepted),
      user: {
        name: typeof parsed.user?.name === "string" ? parsed.user.name : fallbackUser.name,
        email: typeof parsed.user?.email === "string" ? parsed.user.email : fallbackUser.email,
      },
    };
  } catch {
    return defaultFullAuditState();
  }
}

function saveState() {
  try {
    syncFullAuditUser();
    window.localStorage.setItem(storageKey, JSON.stringify(fullAuditState));
  } catch {
    // Keep the site usable when localStorage is unavailable from a local file context.
  }
  queueCloudSync();
}

function normalizedCloudState(raw) {
  if (!raw || typeof raw !== "object") return null;
  const fallbackUser = readMiniAuditUser();
  return {
    started: Boolean(raw.started),
    currentIndex: Number.isInteger(raw.currentIndex) ? raw.currentIndex : 0,
    restartCount: Number.isInteger(raw.restartCount) ? raw.restartCount : 0,
    completedAt: typeof raw.completedAt === "string" ? raw.completedAt : null,
    answers: raw.answers || {},
    reflections: raw.reflections || {},
    resultReflections: raw.resultReflections || {},
    supportOpen: raw.supportOpen || null,
    depthPromptQuestionId: typeof raw.depthPromptQuestionId === "string" ? raw.depthPromptQuestionId : null,
    depthPromptBypass: raw.depthPromptBypass || {},
    skipPromptQuestionId: typeof raw.skipPromptQuestionId === "string" ? raw.skipPromptQuestionId : null,
    skippedQuestionIds: raw.skippedQuestionIds || {},
    focusMode: Boolean(raw.focusMode),
    disclaimerChecked: Boolean(raw.disclaimerChecked),
    disclaimerAccepted: Boolean(raw.disclaimerAccepted),
    user: {
      name: typeof raw.user?.name === "string" ? raw.user.name : fallbackUser.name,
      email: typeof raw.user?.email === "string" ? raw.user.email : fallbackUser.email,
    },
  };
}

function cloudSyncPayload() {
  syncFullAuditUser();
  return {
    ...fullAuditState,
    syncedAt: new Date().toISOString(),
  };
}

function queueCloudSync() {
  if (!window.lifeAuditCloud?.configured) return;
  window.clearTimeout(cloudSyncTimer);
  cloudSyncTimer = window.setTimeout(async () => {
    const cloud = window.lifeAuditCloud;
    if (!cloud) return;
    const { session } = await cloud.getSession();
    if (!session?.user) return;
    await cloud.saveDraft("full", cloudSyncPayload());
  }, 650);
}
function syncFullAuditUser() {
  const miniUser = readMiniAuditUser();
  const globalUser = window.lifeAuditUser || {};
  fullAuditState.user = {
    name: fullAuditState.user?.name || globalUser.name || miniUser.name || "",
    email: fullAuditState.user?.email || globalUser.email || miniUser.email || "",
  };
}
function hasSavedFullAuditProgress() {
  const hasAnswers = Object.values(fullAuditState.answers || {}).some((group) =>
    Object.values(group || {}).some((value) => String(value || "").trim())
  );
  const hasReflections = Object.values(fullAuditState.reflections || {}).some((value) => String(value || "").trim());
  return hasAnswers || hasReflections || fullAuditState.currentIndex > 0 || fullAuditState.started || fullAuditState.disclaimerAccepted;
}
async function bootstrapCloudFullAuditState() {
  if (cloudBootstrapStarted || !window.lifeAuditCloud?.configured) return;
  cloudBootstrapStarted = true;
  const cloud = window.lifeAuditCloud;
  const { session } = await cloud.getSession();
  if (!session?.user) return;
  const { data, error } = await cloud.loadDraft("full");
  if (error || !data?.state) return;
  if (hasSavedFullAuditProgress()) return;
  const remoteState = normalizedCloudState(data.state);
  if (!remoteState) return;
  Object.assign(fullAuditState, remoteState);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(fullAuditState));
  } catch {}
  renderAudit("static");
}
function renderResumePrompt() {
  if (!resumeOverlay) return;
  const firstName = (fullAuditState.user?.name || "").trim().split(/\s+/)[0];
  resumeOverlay.innerHTML = `
    <div class="resume-dialog">
      <p class="section-kicker" style="margin-top: 0;">Full Life Audit</p>
      <h3>Resume your Full Audit?</h3>
      <p>${firstName ? `${h(firstName)}, your previous session is still here.` : "Your previous session is still here."} You can continue where you left off, or return to the portal to manage this audit.</p>
      <div class="resume-actions">
        <button class="button button-secondary" type="button" data-resume-action="portal">Back to portal</button>
        <button class="button button-primary" type="button" data-resume-action="resume">Resume</button>
      </div>
    </div>
  `;
  resumeOverlay.hidden = false;
}
function renderAuthGatePrompt() {
  if (!resumeOverlay) return;
  resumeOverlay.innerHTML = `
    <div class="resume-dialog">
      <p class="section-kicker" style="margin-top: 0;">Full Life Audit</p>
      <h3>Sign in to access the Full Audit</h3>
      <p>Create an account or sign in first. This keeps the Full Life Audit saved to your portal and tied to the right user before we add the paywall later.</p>
      <div class="resume-actions">
        <button class="button button-secondary" type="button" data-resume-action="cancel">Back</button>
        <button class="button button-primary" type="button" data-resume-action="portal">Go to portal</button>
      </div>
    </div>
  `;
  resumeOverlay.hidden = false;
}
function hideResumePrompt() {
  if (!resumeOverlay) return;
  resumeOverlay.hidden = true;
  resumeOverlay.innerHTML = "";
}
function setAuditMode(isActive) {
  if (mainSite) mainSite.hidden = isActive;
  if (fullAuditMode) fullAuditMode.hidden = !isActive;
  document.body.classList.toggle("is-audit-mode", isActive);
  if (isActive || !fullAuditEntryRequested) hideResumePrompt();
  if (!isActive) {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}
async function enterFullAudit() {
  fullAuditEntryRequested = true;
  if (window.lifeAuditCloud?.configured) {
    const { session } = await window.lifeAuditCloud.getSession();
    if (!session?.user) {
      renderAuthGatePrompt();
      return;
    }
  }
  if (hasSavedFullAuditProgress()) {
    renderResumePrompt();
    return;
  }
  startFreshFullAudit();
}
function startFreshFullAudit() {
  fullAuditEntryRequested = true;
  syncFullAuditUser();
  fullAuditState.started = false;
  fullAuditState.currentIndex = 0;
  fullAuditState.answers = {};
  fullAuditState.reflections = {};
  fullAuditState.supportOpen = null;
  fullAuditState.depthPromptQuestionId = null;
  fullAuditState.depthPromptBypass = {};
  fullAuditState.skipPromptQuestionId = null;
  fullAuditState.skippedQuestionIds = {};
  fullAuditState.focusMode = false;
  fullAuditState.disclaimerChecked = false;
  fullAuditState.disclaimerAccepted = false;
  fullAuditState.completedAt = null;
  clearVoiceState();
  saveState();
  setAuditMode(true);
  renderAudit("step");
}
function resumeFullAudit() {
  fullAuditEntryRequested = true;
  syncFullAuditUser();
  setAuditMode(true);
  renderAudit("step");
}
function exitFullAudit() {
  fullAuditEntryRequested = false;
  fullAuditState.supportOpen = null;
  fullAuditState.depthPromptQuestionId = null;
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
function setAnswer(categoryId, questionId, value) { if (!fullAuditState.answers[categoryId]) fullAuditState.answers[categoryId] = {}; fullAuditState.answers[categoryId][questionId] = value; if (String(value || "").trim() && fullAuditState.skippedQuestionIds?.[questionId]) { delete fullAuditState.skippedQuestionIds[questionId]; } saveState(); }
function reflectionAnswer(id) { return fullAuditState.reflections[id] ?? ""; }
function setReflectionAnswer(id, value) { fullAuditState.reflections[id] = value; saveState(); }
function resultReflection(id) { return fullAuditState.resultReflections?.[id] || { reaction: "", response: "" }; }
function setResultReflection(id, patch) {
  if (!fullAuditState.resultReflections) fullAuditState.resultReflections = {};
  fullAuditState.resultReflections[id] = {
    ...resultReflection(id),
    ...patch,
  };
  saveState();
}
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
function wordCount(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}
function questionLead(item, sectionInfo) {
  if (item.inputType === "scale") {
    return `Question ${sectionInfo.current} of ${sectionInfo.total} in this section. Choose the number that feels most accurate, not most flattering.`;
  }
  if (item.inputType === "short") {
    return `Question ${sectionInfo.current} of ${sectionInfo.total} in this section. Keep it direct. A clear line is enough.`;
  }
  return `Question ${sectionInfo.current} of ${sectionInfo.total} in this section. Write the first honest answer, then refine it if needed.`;
}
function depthPromptContent(item) {
  const bySection = {
    currentStateSnapshot: ["Name the area that feels strongest, the area that feels most strained, and why that matters now.", "Where do you feel stable, and where are you quietly drifting?", "What part of your current life state is easiest to minimise but hardest to ignore?"],
    whyAreYouHere: ["What changed recently, or what has been building for longer than you admit?", "What pattern are you tired of carrying?", "What would make this process feel genuinely worthwhile?"],
    identityCompression: ["What role are you still living from?", "Where did that identity come from?", "What is it costing you now?"],
    theIdentityGap: ["What standards belong to the version of you that you respect?", "Where is your real life not matching that version yet?", "What behaviour keeps widening that gap?"],
    positiveTraitsNegativeTraitsOrigins: ["Which trait helps you most, and which one quietly creates the most damage?", "What early pattern or role shaped that trait?", "Where do those older origins still show up now?"],
    fearMapping: ["What are you protecting yourself from?", "What would the feared outcome seem to mean about you?", "Where is that fear still shaping behaviour?"],
    anxietyTriggerAwareness: ["What situations change your internal state fastest?", "What theme keeps repeating underneath those reactions?", "What do you usually do when that trigger gets activated?"],
    internalThreatAssessment: ["What story, excuse, or emotional loop keeps sabotaging you?", "Where do you know better but still repeat the pattern?", "What inner threat feels most active right now?"],
    mentalTabsAudit: ["What remains mentally open in the background?", "What decision, conversation, or pressure keeps following you around?", "What would feel lighter if it were finally resolved?"],
    physicalHealthEnergy: ["What does your energy actually feel like across a normal week?", "What habit is supporting you, and what habit is quietly draining you?", "Where is your body making life harder than it needs to be?"],
    routineDisciplineDelivery: ["What do your actual routines prove right now?", "Where do you keep breaking promises to yourself?", "What behaviour gap is most visible?"],
    financialStructuralReality: ["What pressure is structural, not just emotional?", "Where does money or instability affect your decisions?", "What practical reality needs to be named more directly?"],
    socialEnvironmentArchitecture: ["Who and what around you reinforces your future?", "What environment still reflects an older version of you?", "Where are you adapting to the wrong atmosphere?"],
    relationshipAudit: ["Which relationship feels most steady, and which one feels most costly?", "Where are you overgiving, avoiding, or shrinking?", "What dynamic is taking more energy than it should?"],
    communicationAudit: ["What do you tend to leave unsaid?", "How do you usually respond under tension?", "What communication pattern keeps repeating?"],
    personalOperatingLimitsBoundaries: ["Where do people have too much access to you?", "What do you keep tolerating?", "Which one clear limit would improve life quickly?"],
    onlineYouVsRealWorldYou: ["What is your digital life replacing?", "When do you reach for stimulation instead of stillness?", "What kind of friction is screen-life helping you avoid?"],
    connectivityOffSwitch: ["What happens when the noise drops?", "Can you rest without reaching for distraction?", "What comes up when you are not stimulated?"],
    ambitionPurposePotential: ["What do you actually want, beneath the acceptable answer?", "Where are you underusing your potential?", "What standard would make the next chapter feel more serious?"],
    valuesNonNegotiables: ["What do you say you stand for?", "Where is your behaviour aligned, and where is it not?", "What non-negotiable needs to become visible again?"],
    mirrorReportBrutalHonesty: ["If your life were a mirror, what would it be saying back to you?", "What truth now feels harder to soften?", "What pattern is too obvious to keep dressing up?"],
    patternRecognition: ["What theme is repeating across multiple sections?", "What seems strongest, weakest, or most conflicted?", "What is the pattern underneath the surface details?"],
    priorityRepairList: ["What needs attention first?", "Which repair would reduce the most drag?", "What issue is making several other issues harder?"],
    the30DayResetPlan: ["What should start, stop, reduce, or rebuild?", "What would a realistic 30-day reset include?", "What would make the next month visibly different?"],
    finalCommitment: ["What action would prove this audit mattered?", "What are you no longer available for?", "What will you do next, specifically?"],
  };

  return {
    title: "There may be a bit more here worth exploring.",
    body: "A more detailed answer here will make your result more accurate.",
    prompts: bySection[item.categoryId] || ["What is actually going on here?", "What sits underneath the first answer?", "What would make this answer more honest or more specific?"],
  };
}
function shouldOfferDepthPrompt(item) {
  if (item.type !== "question" || item.inputType !== "reflective") return false;
  if (fullAuditState.depthPromptBypass?.[item.id]) return false;
  const value = answer(item.categoryId, item.id).trim();
  if (!value) return false;
  return wordCount(value) < (item.minWords || 14);
}
function focusCurrentAuditField() {
  window.requestAnimationFrame(() => {
    const field = fullAuditRoot?.querySelector(".full-audit-textarea, .full-audit-input");
    field?.focus();
    if (field?.setSelectionRange) {
      const end = field.value.length;
      field.setSelectionRange(end, end);
    }
  });
}
function syncAuditChrome() {
  if (!fullAuditMode) return;
  const currentItem = flow[fullAuditState.currentIndex];
  const canUseFocusMode = fullAuditState.disclaimerAccepted && fullAuditState.started && currentItem?.type === "question";
  fullAuditMode.classList.toggle("is-focus-mode", Boolean(fullAuditState.focusMode && canUseFocusMode));
  const focusButton = fullAuditMode.querySelector("[data-action='toggle-focus-mode']");
  if (focusButton) {
    focusButton.hidden = !canUseFocusMode || auditDeveloperPanelOpen;
    focusButton.textContent = fullAuditState.focusMode ? "Exit Focus Mode" : "Enter Focus Mode";
  }
  const devButton = fullAuditMode.querySelector("[data-action='toggle-dev-map']");
  if (devButton) {
    devButton.textContent = auditDeveloperPanelOpen ? "Close Developer View" : "Developer View";
  }
}
function renderAudit(mode = "static") {
  fullAuditRenderMode = mode;
  renderFullAudit();
}
function isQuestionAnswered(item) {
  return Boolean(answer(item.categoryId, item.id).trim());
}
function pendingSkippedQuestions() {
  return questionItems().filter((item) => fullAuditState.skippedQuestionIds?.[item.id] && !isQuestionAnswered(item));
}
function flowIndexForQuestion(questionId) {
  return flow.findIndex((item) => item.type === "question" && item.id === questionId);
}
function flowIndexForSectionIntro(categoryId) {
  return flow.findIndex((item) => item.type === "section" && item.categoryId === categoryId);
}
function advanceAudit() {
  clearVoiceState();
  fullAuditState.currentIndex += 1;
  fullAuditState.supportOpen = null;
  fullAuditState.depthPromptQuestionId = null;
  fullAuditState.skipPromptQuestionId = null;
  saveState();
  renderAudit("step");
}
function dismissDepthPrompt(questionId, preserveBypass = false) {
  if (fullAuditState.depthPromptQuestionId === questionId) {
    fullAuditState.depthPromptQuestionId = null;
  }
  if (!preserveBypass && fullAuditState.depthPromptBypass?.[questionId]) {
    delete fullAuditState.depthPromptBypass[questionId];
  }
}
function renderQuestionInput(item, value) {
  if (item.inputType === "scale") {
    const min = item.scaleMin || 1;
    const max = item.scaleMax || 10;
    const numericValue = Number(value);
    return `<div class="full-audit-scale-wrap"><div class="full-audit-scale" role="radiogroup" aria-label="${h(item.text)}">${Array.from({ length: max - min + 1 }, (_, index) => {
      const option = min + index;
      return `<button class="scale-option ${numericValue === option ? "is-active" : ""}" type="button" data-action="set-scale" data-value="${option}" aria-pressed="${numericValue === option ? "true" : "false"}">${option}</button>`;
    }).join("")}</div><p class="full-audit-scale-copy">Choose the number that feels most accurate, not most flattering.</p></div>`;
  }
  if (item.inputType === "short") {
    return `<input class="full-audit-input" type="text" data-kind="question" data-category-id="${item.categoryId}" data-question-id="${item.id}" placeholder="${item.placeholder}" value="${h(value)}" />`;
  }
  return `<textarea class="full-audit-textarea" data-kind="question" data-category-id="${item.categoryId}" data-question-id="${item.id}" placeholder="${item.placeholder}">${h(value)}</textarea>`;
}
function renderDepthPrompt(item) {
  if (fullAuditState.depthPromptQuestionId !== item.id) return "";
  const prompt = depthPromptContent(item);
  return `<div class="depth-prompt"><p class="depth-prompt-kicker">Go one layer deeper</p><h3>${prompt.title}</h3><p>${prompt.body}</p><ul>${prompt.prompts.map((entry) => `<li>${entry}</li>`).join("")}</ul><div class="depth-prompt-actions"><button class="button button-secondary" type="button" data-action="depth-add-more">Add more</button><button class="button button-primary" type="button" data-action="depth-continue">Continue anyway</button></div></div>`;
}
function renderSkipPrompt(item) {
  if (fullAuditState.skipPromptQuestionId !== item.id) return "";
  const skippedBefore = Boolean(fullAuditState.skippedQuestionIds?.[item.id]);
  return `<div class="skip-prompt"><p class="skip-prompt-kicker">${skippedBefore ? "This was skipped earlier" : "This question is still blank"}</p><h3>${skippedBefore ? "This one still needs an answer before results." : "Are you sure you want to skip this for now?"}</h3><p>${skippedBefore ? "Add anything you can here. The audit will keep bringing skipped questions back before it completes." : "You can pass it for now and return later, but it will be followed up before the audit is complete."}</p><div class="skip-prompt-actions"><button class="button button-secondary" type="button" data-action="skip-add-answer">Add answer</button><button class="button button-primary" type="button" data-action="skip-for-now">${skippedBefore ? "Skip again for now" : "Skip for now"}</button></div></div>`;
}
const signalLexicon = {
  positive: ["clear", "clarity", "calm", "steady", "stable", "strong", "supportive", "honest", "aligned", "grounded", "healthy", "clean", "capable", "direct", "settled", "respect", "proud"],
  action: ["decide", "decision", "action", "act", "follow through", "follow-through", "routine", "habit", "commit", "discipline", "train", "protect", "enforce", "build", "consistent", "structure"],
  negative: ["stuck", "confused", "messy", "weak", "drifting", "chaos", "chaotic", "overwhelmed", "drained", "tired", "exhausted", "resentful", "avoid", "avoiding", "postpon", "noise", "unresolved", "stress", "strained", "guilt"],
  severity: ["burnout", "burned out", "spiral", "panic", "collapse", "numb", "shut down", "shutdown", "trapped", "ashamed", "afraid", "fear", "anxious", "anxiety"],
  avoidance: ["avoid", "postpon", "later", "someday", "delay", "scroll", "numb", "escape", "pretend", "ignore", "minimise", "minimize"],
  support: ["sleep", "movement", "training", "rest", "nutrition", "recovery", "conversation", "boundary", "support", "friend", "partner", "family", "environment"],
};

const categoryMeaning = {
  selfImage: { strength: "You still have some self-awareness and an ability to step back from yourself accurately.", weakness: "Your identity may be carrying roles that no longer deserve authority.", prompt: "Clarify which version of you should be making decisions now." },
  emotionalStability: { strength: "There is some emotional awareness here, even if steadiness is not complete yet.", weakness: "Reactivity, fear, or old triggers may still be shaping too much of your behaviour.", prompt: "Name the pattern that takes over fastest when you feel threatened." },
  physicalHealth: { strength: "Your physical base is giving you at least some usable support.", weakness: "Your body may be under-supporting the standards you are trying to live by.", prompt: "Stabilise one physical basic before trying to fix everything else." },
  mentalClarity: { strength: "You still have some reflective ability and can see what is happening beneath the surface.", weakness: "Too many unresolved tabs may be reducing clarity and clean decision-making.", prompt: "Close one unresolved loop that keeps following you around." },
  discipline: { strength: "There is still a standards-based part of you that wants a cleaner life than this.", weakness: "Execution may be lagging behind awareness, which weakens self-trust.", prompt: "Choose one behaviour this week that proves follow-through, not intention." },
  relationships: { strength: "There is likely at least one stabilising connection or environment still helping you.", weakness: "Relational drag or mismatch may be costing more energy than it first appears.", prompt: "Name the relationship or dynamic creating the most drag." },
  communication: { strength: "You likely do have a usable communication strength when you are settled enough to access it.", weakness: "What goes unsaid may be creating avoidable friction.", prompt: "Say one true thing earlier than usual." },
  boundaries: { strength: "You seem to know, at least in part, where cleaner limits would help.", weakness: "Too much access may be diluting your energy and self-respect.", prompt: "Enforce one overdue limit cleanly." },
  screenLife: { strength: "You can still see the role digital life is playing, which matters.", weakness: "Stimulation or escape may be replacing stillness, recovery, and honest contact.", prompt: "Reduce one avoidant digital habit and replace it with something real." },
  purpose: { strength: "There is still some sense of what kind of life you would respect.", weakness: "Your direction may be too loose to organise behaviour properly.", prompt: "Define the next chapter in one sentence, without trying to make it impressive." },
  integrity: { strength: "You still care about alignment, which is why the gap is visible at all.", weakness: "There may be a widening gap between your standards and your lived behaviour.", prompt: "Choose one action that makes your standards visible again this week." },
};

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function countSignals(text, signals) {
  return signals.reduce((count, signal) => (text.includes(signal) ? count + 1 : count), 0);
}

function answerBundle(step) {
  const responses = step.questions.map((question) => ({
    id: question.id,
    text: answer(step.id, question.id).trim(),
    inputType: question.inputType,
  }));
  const answered = responses.filter((response) => response.text);
  const combined = answered.map((response) => response.text).join(" \n ");
  const normalized = normalizeText(combined);
  const averageWords = answered.length ? answered.reduce((sum, response) => sum + wordCount(response.text), 0) / answered.length : 0;
  return { responses, answered, combined, normalized, averageWords };
}

function categoryScore(step) {
  const bundle = answerBundle(step);
  if (!bundle.answered.length) return null;

  const signalCounts = {
    positive: countSignals(bundle.normalized, signalLexicon.positive),
    action: countSignals(bundle.normalized, signalLexicon.action),
    negative: countSignals(bundle.normalized, signalLexicon.negative),
    severity: countSignals(bundle.normalized, signalLexicon.severity),
    avoidance: countSignals(bundle.normalized, signalLexicon.avoidance),
    support: countSignals(bundle.normalized, signalLexicon.support),
  };

  const richness = Math.max(0, Math.min(1.6, bundle.averageWords / 22));
  const answeredRatio = bundle.answered.length / step.questions.length;
  const score =
    5.1 +
    signalCounts.positive * 0.35 +
    signalCounts.action * 0.28 +
    signalCounts.support * 0.18 +
    richness * 1.15 -
    signalCounts.negative * 0.32 -
    signalCounts.avoidance * 0.4 -
    signalCounts.severity * 0.48 +
    answeredRatio * 0.4;

  return Number(Math.min(9.4, Math.max(2.8, score)).toFixed(1));
}

function categoryInsight(step, score) {
  const meaning = categoryMeaning[step.id];
  if (!meaning) return score >= 6.2 ? "There is some usable strength here." : "This category looks more strained than supported.";
  return score >= 6.2 ? meaning.strength : meaning.weakness;
}

function contradictionReads(categoryScores) {
  const byId = Object.fromEntries(categoryScores.map((item) => [item.id, item.score]));
  const contradictions = [];
  if ((byId.purpose ?? 0) >= 6 && (byId.discipline ?? 10) <= 5.4) contradictions.push("You appear able to name what matters more clearly than you are currently living it.");
  if ((byId.selfImage ?? 0) >= 6 && (byId.integrity ?? 10) <= 5.4) contradictions.push("Your self-concept may be ahead of your day-to-day behaviour, which creates internal friction.");
  if ((byId.relationships ?? 0) >= 6 && (byId.boundaries ?? 10) <= 5.4) contradictions.push("You may care deeply about connection while still letting too much access erode your steadiness.");
  if ((byId.mentalClarity ?? 10) <= 5.2 && (byId.discipline ?? 10) <= 5.4) contradictions.push("This does not read like laziness. It reads more like unresolved friction reducing execution.");
  if ((byId.physicalHealth ?? 10) <= 5.2 && (byId.emotionalStability ?? 10) <= 5.4) contradictions.push("Part of the emotional strain may be amplified by physical under-recovery rather than psychology alone.");
  return contradictions.slice(0, 3);
}

function rootDiagnosis(weakest, categoryScores) {
  const byId = Object.fromEntries(categoryScores.map((item) => [item.id, item.score]));
  if ((byId.mentalClarity ?? 10) <= 5.4 && (byId.discipline ?? 10) <= 5.5) {
    return {
      headline: "You may not be lacking effort. You may be carrying too much unresolved friction.",
      summary: "The answers suggest a pattern where mental noise, postponed decisions, and uneven follow-through are reinforcing each other. This tends to make life feel heavier than it should, even when the person is capable.",
    };
  }
  if ((byId.selfImage ?? 10) <= 5.5 && (byId.integrity ?? 10) <= 5.5) {
    return {
      headline: "The strongest friction may be identity misalignment, not lack of insight.",
      summary: "There appears to be a gap between the version of you that you respect and the version currently running too many decisions. When identity is unclear or outdated, the rest of life becomes harder to organise.",
    };
  }
  if ((byId.physicalHealth ?? 10) <= 5.4 && (byId.emotionalStability ?? 10) <= 5.5) {
    return {
      headline: "Your system looks under-supported, not simply under-motivated.",
      summary: "The answers point to a body-and-nervous-system issue affecting multiple other layers. Lower energy and recovery often distort clarity, mood, and consistency at the same time.",
    };
  }
  if ((byId.relationships ?? 10) <= 5.5 && (byId.boundaries ?? 10) <= 5.5) {
    return {
      headline: "Relational drag may be costing more than it first appears.",
      summary: "There are signs that access, relational tension, or one-sided dynamics may be draining bandwidth in the background. That kind of drag often spills into focus, patience, and self-trust.",
    };
  }
  if ((byId.purpose ?? 10) <= 5.5 && (byId.mentalClarity ?? 10) <= 5.6) {
    return {
      headline: "The issue may be less chaos and more under-defined direction.",
      summary: "There is a sense of drift here that looks tied to a direction problem. When the next chapter is too vague, effort fragments and life starts to feel heavier than it should.",
    };
  }
  const root = weakest[0];
  return {
    headline: frictionPointByCategory[root?.id] || "One area appears to be carrying more friction than the rest.",
    summary: root ? categoryInsight(fullAuditSteps.find((step) => step.id === root.id), root.score) : "More answers are needed before a clearer diagnostic read is possible.",
  };
}

function patternReads(categoryScores) {
  const byId = Object.fromEntries(categoryScores.map((item) => [item.id, item.score]));
  const reads = [];
  if ((byId.mentalClarity ?? 10) <= 5.5) reads.push("Open loops and unresolved decisions seem to be taking up more background energy than they should.");
  if ((byId.discipline ?? 10) <= 5.5) reads.push("The gap between what matters to you and what your behaviour proves still looks significant.");
  if ((byId.purpose ?? 10) <= 5.5) reads.push("Direction appears loose enough that effort may be scattering rather than organising around a clear next chapter.");
  if ((byId.boundaries ?? 10) <= 5.5) reads.push("There may be too much outside access shaping your energy and attention.");
  if ((byId.integrity ?? 10) <= 5.5) reads.push("You seem aware of at least one place where your standards and behaviour are no longer matching cleanly.");
  return reads.slice(0, 3);
}

function buildActionPlan(root, weakest, contradictions) {
  const primary = root ? (actionPlanByCategory[root.id] || []) : [];
  const plan = [...primary];
  if (weakest[1] && actionPlanByCategory[weakest[1].id]) {
    plan.push(actionPlanByCategory[weakest[1].id][0]);
  }
  if (contradictions.length) {
    plan.push("Choose one contradiction in the result and resolve it through behaviour, not more reflection.");
  }
  if (!plan.length) {
    plan.push("Name the core issue directly.");
    plan.push("Choose one action that reduces drag this week.");
    plan.push("Turn one insight into visible follow-through.");
  }
  return [...new Set(plan)].slice(0, 4);
}

function sentenceFragments(text) {
  return String(text || "")
    .split(/[\n.!?]+/)
    .map((part) => part.trim())
    .filter((part) => wordCount(part) >= 6);
}

function mirroredLine(categoryId) {
  const responses = sectionQuestionItems(categoryId)
    .map((item) => answer(item.categoryId, item.id).trim())
    .filter(Boolean);
  for (const response of responses) {
    const fragment = sentenceFragments(response)[0];
    if (fragment) {
      const clean = fragment.replace(/^["']|["']$/g, "");
      return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
    }
  }
  return "";
}

function strongestRead(strongest) {
  if (!strongest.length) return "There is enough awareness here to begin, but not yet enough material to trust the read fully.";
  if (strongest.length === 1) {
    return `${strongest[0].title} looks like your strongest current asset. ${strongest[0].insight}`;
  }
  return `${strongest[0].title} and ${strongest[1].title} look like the parts of you that are still holding the line. They suggest there is more strength here than the friction may have let you feel lately.`;
}

function consequenceReads(weakest) {
  const lines = [];
  const ids = weakest.map((item) => item.id);
  if (ids.includes("mentalClarity")) lines.push("This is likely reducing clean focus, making decisions feel heavier, and keeping too much mental bandwidth tied up in the background.");
  if (ids.includes("discipline")) lines.push("It is probably weakening self-trust, because the issue stops being whether you know what matters and becomes whether you believe yourself when you say you will act.");
  if (ids.includes("relationships") || ids.includes("boundaries")) lines.push("It may also be leaking into relationships, because what is unresolved internally tends to show up as overextension, avoidance, or resentment.");
  if (ids.includes("physicalHealth")) lines.push("Your energy and patience are likely lower than they should be, which means other problems feel more psychological than they actually are.");
  if (ids.includes("purpose") || ids.includes("selfImage")) lines.push("The next chapter remains harder to organise when identity and direction are not strong enough to give the rest of life a clean shape.");
  return lines.slice(0, 4);
}

function protectivePatternRead(root, contradictions) {
  if (!root) {
    return "Once the pattern becomes visible, the real question is whether you will use that clarity or soften it back into abstraction.";
  }
  const byRoot = {
    mentalClarity: "You may be more attached to keeping everything mentally open than you realise. Open loops preserve options, postpone discomfort, and let life remain unresolved for a little longer.",
    discipline: "You may be protecting the story that you still could change at any time, while avoiding the discomfort of proving it through repeatable action.",
    selfImage: "Some part of you may still be loyal to an older role. That loyalty can feel safer than becoming the version of you that would actually have to live differently.",
    purpose: "Vagueness can be protective. A blurred future lets you avoid the risk of committing to a real direction and then being measured by it.",
    integrity: "At this point the issue may not be awareness. It may be whether you are willing to stop protecting the contradiction.",
    boundaries: "If you have been shaped by being available, useful, or low-maintenance, stronger boundaries can feel like identity loss before they feel like relief.",
    relationships: "People often say they want peace while still protecting the very dynamic that keeps them emotionally occupied.",
    physicalHealth: "It is possible to keep calling this a mindset issue because that feels more noble than admitting the body has been under-supported for too long.",
  };
  const contradictionLine = contradictions[0] ? ` The clearest contradiction in your result is this: ${contradictions[0].charAt(0).toLowerCase()}${contradictions[0].slice(1)}` : "";
  return `${byRoot[root.id] || "Many people enjoy the accuracy of the diagnosis, then protect the pattern anyway because it is familiar."}${contradictionLine}`;
}

function firstFixRead(root, weakest) {
  if (!root) return "Pick the one issue that is making several other areas heavier than they need to be.";
  const secondary = weakest[1];
  if (!secondary) return categoryMeaning[root.id]?.prompt || "Choose the first repair that reduces the most friction.";
  return `${categoryMeaning[root.id]?.prompt || "Fix the clearest issue first."} Then stabilise ${secondary.title.toLowerCase()} so the problem does not simply shift shape.`;
}

function resetPlan(root, weakest) {
  const primary = root ? (actionPlanByCategory[root.id] || []) : [];
  const secondary = weakest[1] ? (actionPlanByCategory[weakest[1].id] || []) : [];
  return {
    start: [...new Set([primary[0], secondary[0], "Create one weekly check-in where you review whether your behaviour matched the result."]).values()].filter(Boolean).slice(0, 3),
    stop: [
      "Stop calling the whole problem 'stress' if the real issue is more specific than that.",
      root?.id === "mentalClarity" ? "Stop leaving the heaviest decisions mentally open." : "Stop protecting one pattern you already know is costing too much.",
      root?.id === "discipline" ? "Stop negotiating with yourself around the standard that matters most." : "Stop using insight as a substitute for change.",
    ],
    reduce: [
      root?.id === "screenLife" ? "Reduce avoidant screen time and low-grade stimulation." : "Reduce one recurring source of noise, friction, or access.",
      "Reduce the amount of energy spent managing appearances instead of reality.",
    ],
    rebuild: [...new Set([primary[1], secondary[1], "Rebuild trust with yourself through one visible non-negotiable."]).values()].filter(Boolean).slice(0, 3),
    nonNegotiables: [
      "One honest action each week that you would normally delay.",
      "One protected block for reflection, not distraction.",
      "One behavioural standard that stays in place even when your mood drops.",
    ],
  };
}

function nextChapterRead(root, strongest) {
  const base = strongest.length
    ? `The encouraging part is that ${strongest[0].title.toLowerCase()} still looks usable. This is not a situation with no strengths left to work with.`
    : "The encouraging part is that the pattern is visible enough now to work with directly.";
  const rootLine = root
    ? ` The next chapter of your life likely begins the moment you stop letting ${root.title.toLowerCase()} be managed passively and start treating it as a central issue.`
    : " The next chapter begins when one part of the pattern is turned into real behaviour.";
  return `${base}${rootLine}`;
}

function reflectionPromptsFor(sectionId) {
  const prompts = {
    diagnosis: {
      accurate: {
        title: "Good. Now make it usable.",
        body: "If this diagnosis feels accurate, the next move is not more agreement. It is naming where it is most visible in your life right now.",
        followUp: "Where does this feel most true: your mind, your behaviour, or your relationships?",
      },
      unsure: {
        title: "Then test the pattern, not the wording.",
        body: "You do not need to agree with the exact label yet. What matters is whether the pattern underneath still feels familiar.",
        followUp: "What part feels off: the diagnosis itself, the cause, or the conclusion?",
      },
      disagree: {
        title: "Then say what feels more true.",
        body: "Disagreement can still be useful if it gets you closer to a cleaner explanation instead of a safer one.",
        followUp: "If this is not the right diagnosis, what is the more accurate one?",
      },
    },
    rootIssue: {
      accurate: {
        title: "That matters, because this is the lever.",
        body: "When the root issue becomes clearer, the rest of the result stops feeling like separate problems and starts feeling like one system.",
        followUp: "Where has this root issue been shaping life more than you wanted to admit?",
      },
      unsure: {
        title: "Then narrow the real bottleneck.",
        body: "If the root issue does not feel right yet, the useful question is what seems to be creating the most drag across multiple areas at once.",
        followUp: "What issue seems to make several other problems heavier?",
      },
      disagree: {
        title: "Then challenge it properly.",
        body: "If this root issue is wrong, replacing it with a clearer one is more useful than simply rejecting it.",
        followUp: "What do you believe is the real bottleneck instead?",
      },
    },
    firstFix: {
      accurate: {
        title: "Then remove ambiguity.",
        body: "If the first fix feels accurate, the next step is to make it behavioural enough that it cannot hide behind good intentions.",
        followUp: "What would this look like in action over the next 7 days?",
      },
      unsure: {
        title: "Then make it more concrete.",
        body: "Sometimes a good first fix still feels vague. The solution is not to discard it but to translate it into a clearer move.",
        followUp: "What specific action would make this feel more real and less abstract?",
      },
      disagree: {
        title: "Then choose the real first move.",
        body: "If this is not the right first fix, there is probably another action you already know should come first.",
        followUp: "What needs to happen before anything else can improve cleanly?",
      },
    },
  };
  return prompts[sectionId]?.[resultReflection(sectionId).reaction] || null;
}

function renderResultReflection(sectionId, label, sourceText, summaryLine) {
  const state = resultReflection(sectionId);
  const prompt = reflectionPromptsFor(sectionId);
  const voiceActive = voiceState.activeQuestionId === `result:${sectionId}`;
  return `<div class="results-block">
    <h4>Work with this result: ${label}</h4>
    <div class="result-focus">${h(sourceText)}</div>
    <div class="results-reaction-row">
      <button class="result-reaction ${state.reaction === "accurate" ? "is-active" : ""}" type="button" data-action="set-result-reaction" data-result-section="${sectionId}" data-value="accurate">This feels accurate</button>
      <button class="result-reaction ${state.reaction === "unsure" ? "is-active" : ""}" type="button" data-action="set-result-reaction" data-result-section="${sectionId}" data-value="unsure">I'm not sure</button>
      <button class="result-reaction ${state.reaction === "disagree" ? "is-active" : ""}" type="button" data-action="set-result-reaction" data-result-section="${sectionId}" data-value="disagree">I disagree</button>
    </div>
    ${prompt ? `<div class="result-reflection-panel"><h5>${prompt.title}</h5><p>${prompt.body}</p><p class="result-reflection-followup">${prompt.followUp}</p><textarea class="full-audit-textarea result-reflection-textarea" data-kind="result-reflection" data-result-section="${sectionId}" placeholder="Write or speak your response here.">${h(state.response || "")}</textarea><div class="voice-tools"><button class="voice-button ${voiceActive ? "is-listening" : ""}" type="button" data-action="result-voice" data-result-section="${sectionId}">${voiceActive ? "Listening..." : "Use voice input"}</button><span class="voice-copy">${voiceState.message ? h(voiceState.message) : voiceState.supported ? "Optional. Speak if it helps the thought come through more honestly." : "Voice input may not be available in this browser."}</span></div></div>` : `<div class="result-reflection-hint">${h(summaryLine)}</div>`}
  </div>`;
}

function summary() {
  const categoryScores = fullAuditSteps.map((step) => {
    const score = categoryScore(step);
    return {
      id: step.id,
      title: step.title,
      score,
      insight: score === null ? "Not enough material yet." : categoryInsight(step, score),
    };
  });
  const assessed = categoryScores.filter((item) => item.score !== null);
  const strongest = [...assessed].sort((a, b) => b.score - a.score).slice(0, 3);
  const weakest = [...assessed].sort((a, b) => a.score - b.score).slice(0, 3);
  const completion = Math.round((questionItems().reduce((sum, item) => sum + (answer(item.categoryId, item.id).trim() ? 1 : 0), 0) / questionItems().length) * 100);
  const overallScore = assessed.length ? Number((assessed.reduce((sum, item) => sum + item.score, 0) / assessed.length * 10).toFixed(0)) : null;
  const contradictions = contradictionReads(assessed);
  const diagnosis = rootDiagnosis(weakest, assessed);
  const patterns = patternReads(assessed);
  const root = weakest[0];
  const mirrored = root ? mirroredLine(root.id) : "";
  const consequences = consequenceReads(weakest);
  const reset = resetPlan(root, weakest);

  return {
    completion,
    overallScore,
    categoryScores,
    strongest,
    weakest,
    diagnosis,
    patterns,
    contradictions,
    frictions: weakest.map((item) => frictionPointByCategory[item.id] || `${item.title} appears to be carrying meaningful friction that is worth examining more closely.`),
    rootIssue: root ? (rootIssueByCategory[root.id] || `${root.title} may be exposing a broader pattern that sits underneath several other answers.`) : "Root issue will appear once more of the audit is completed.",
    actionPlan: buildActionPlan(root, weakest, contradictions),
    mirrored,
    strongestRead: strongestRead(strongest),
    consequences,
    protectivePattern: protectivePatternRead(root, contradictions),
    firstFix: firstFixRead(root, weakest),
    reset,
    nextChapter: nextChapterRead(root, strongest),
  };
}
function startAuditFlow() {
  fullAuditState.started = true;
  fullAuditState.currentIndex = 0;
  fullAuditState.supportOpen = null;
  clearVoiceState();
  saveState();
  renderAudit("step");
}
function acceptDisclaimer() {
  fullAuditState.disclaimerAccepted = true;
  saveState();
  renderAudit("step");
}
function startVoiceCapture(item) {
  if (!voiceState.supported) {
    voiceState.message = "Voice input is not supported in this browser. You can continue by typing.";
    renderAudit("static");
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
  renderAudit("static");
  voiceRecognition.onresult = (event) => {
    const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
    if (transcript) {
      if (item.resultSection) {
        const current = resultReflection(item.resultSection).response.trim();
        const nextValue = current ? `${current}\n\n${transcript}` : transcript;
        setResultReflection(item.resultSection, { response: nextValue });
        voiceState.message = "Voice note added to your reflection.";
      } else {
        const current = answer(item.categoryId, item.id).trim();
        const nextValue = current ? `${current}\n\n${transcript}` : transcript;
        setAnswer(item.categoryId, item.id, nextValue);
        voiceState.message = "Voice note added to your answer.";
      }
    } else {
      voiceState.message = "No speech was captured. You can try again or keep typing.";
    }
  };
  voiceRecognition.onerror = () => {
    voiceState.message = "Voice input could not start cleanly in this browser. You can continue by typing.";
    voiceState.listening = false;
    voiceState.activeQuestionId = null;
    renderAudit("static");
  };
  voiceRecognition.onend = () => {
    voiceState.listening = false;
    voiceState.activeQuestionId = null;
    renderAudit("static");
  };
  try {
    voiceRecognition.start();
  } catch {
    voiceState.listening = false;
    voiceState.activeQuestionId = null;
    voiceState.message = "Voice input is unavailable right now. You can continue by typing.";
    renderAudit("static");
  }
}

function renderProgressHeader(item) {
  const progress = journeyProgress(item);
  return `<div class="full-audit-progressbar"><div class="full-audit-progresscopy"><div class="full-audit-meta"><span>${item.title || item.categoryTitle}</span><span>Section ${progress.sectionCurrent} of ${progress.sectionTotal}</span></div><div class="full-audit-submeta"><span>${item.type === "question" ? `Question ${progress.withinCurrent} of ${progress.withinTotal}` : item.type === "milestone" ? "Section complete" : "Chapter transition"}</span><span>${pacingLine(item)}</span></div></div><div class="progress-bar progress-bar-journey"><span style="width:${progress.percent}%"></span></div></div>`;
}
function renderDeveloperAuditMap() {
  return `<div class="full-audit-view full-audit-card full-audit-card-results">
    <div class="full-audit-meta"><span>Developer View</span><span>Audit map</span></div>
    <div class="full-audit-copy-block">
      <p class="section-kicker" style="margin-top: 0;">Section map</p>
      <h2 class="full-audit-title">Jump anywhere in the Full Audit.</h2>
      <p class="full-audit-lead">This view is for visual QA and content review. Normal users will not see it.</p>
    </div>
    <div class="results-block">
      <div class="dev-audit-grid">
        ${fullAuditSteps.map((step, index) => `<article class="dev-audit-card">
          <div class="dev-audit-card-head">
            <span class="dev-audit-index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h4>${step.title}</h4>
              <p>${step.questions.length} questions</p>
            </div>
          </div>
          <div class="dev-audit-actions">
            <button class="button button-secondary" type="button" data-action="dev-jump-intro" data-category-id="${step.id}">Open intro</button>
            <button class="button button-primary" type="button" data-action="dev-jump-question" data-question-id="${step.questions[0]?.id || ""}">First question</button>
          </div>
          <div class="dev-audit-question-list">
            ${step.questions.map((question, questionIndex) => `<button class="dev-audit-question" type="button" data-action="dev-jump-question" data-question-id="${question.id}"><span>${questionIndex + 1}</span><strong>${question.text}</strong></button>`).join("")}
          </div>
        </article>`).join("")}
      </div>
    </div>
    <div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="close-dev-map">Back to audit</button></div>
  </div>`;
}
function renderDisclaimer() { return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-disclaimer"><div class="full-audit-meta"><span>Full Life Audit</span><span>Before you begin</span></div><div class="full-audit-copy-block full-audit-copy-block-disclaimer"><p class="section-kicker" style="margin-top: 0;">Disclaimer</p><p class="full-audit-disclaimer-text">The Full Life Audit is a guided self-assessment. It is not therapy, crisis support, or medical advice.</p><p class="full-audit-disclaimer-text">If something feels heavy, pause when needed and come back with a clearer head.</p><p class="full-audit-disclaimer-text">Simple, direct answers are enough. The point is honest perspective, not pressure.</p><p class="audit-legal-copy">Before continuing, you can review the <a href="./privacy.html" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="./terms.html" target="_blank" rel="noreferrer">Terms &amp; Disclaimer</a>.</p></div><label class="audit-check"><input type="checkbox" data-disclaimer-checkbox="true" ${fullAuditState.disclaimerChecked ? "checked" : ""} /><span>I understand and agree</span></label><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="exit-audit">Back</button><button class="button button-primary" type="button" data-action="accept-disclaimer" ${fullAuditState.disclaimerChecked ? "" : "disabled"}>Continue</button></div></div>`; }
function renderIntro() {
  return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-welcome">
    <div class="full-audit-copy-block full-audit-copy-block-intro full-audit-intro-panel is-visible" data-intro-panel>
      <div class="intro-typed-stack" data-intro-sequence>
        <div class="intro-type-row intro-type-row-headline"><h2 class="full-audit-title full-audit-title-intro" data-intro-target="headline">Life Audit</h2><span class="intro-cursor" aria-hidden="true"></span></div>
      </div>
      <div class="full-audit-prep-copy">
        <p class="full-audit-lead">This works best when you're focused and uninterrupted.</p>
        <p class="full-audit-note">Take a moment.<br />Find a comfortable spot.<br />Remove distractions.<br />Give yourself the time to think properly.</p>
        <p class="full-audit-note">You don't need perfect answers.<br />Just honest ones.</p>
      </div>
    </div>
    <div class="full-audit-footer full-audit-footer-intro" data-intro-cta hidden>
      <button class="button button-primary" type="button" data-action="start">Begin</button>
    </div>
  </div>`;
}
function startIntroTyping() {
  const introPanel = fullAuditRoot?.querySelector("[data-intro-panel]");
  const root = fullAuditRoot?.querySelector("[data-intro-sequence]");
  const cta = fullAuditRoot?.querySelector("[data-intro-cta]");
  if (!introPanel || !root) return;
  const runId = ++introTypingRun;
  const rows = [...root.querySelectorAll(".intro-type-row")];
  rows.forEach((row) => {
    row.classList.remove("is-active", "is-complete");
    const target = row.querySelector("[data-intro-target]");
    if (!target) return;
    target.dataset.fullText = target.textContent || "";
    target.textContent = "";
  });
  introPanel.hidden = false;
  introPanel.classList.add("is-visible");
  if (cta) {
    cta.hidden = true;
    cta.classList.remove("is-visible");
  }
  let rowIndex = 0;
  const typeIntro = () => {
    if (runId !== introTypingRun || rowIndex >= rows.length) {
      if (cta && runId === introTypingRun) {
        cta.hidden = false;
        requestAnimationFrame(() => cta.classList.add("is-visible"));
      }
      return;
    }
    const row = rows[rowIndex];
    const target = row.querySelector("[data-intro-target]");
    const fullText = target?.dataset.fullText || "";
    if (!target) {
      rowIndex += 1;
      typeIntro();
      return;
    }
    row.classList.add("is-active");
    let charIndex = 0;
    const tick = () => {
      if (runId !== introTypingRun) return;
      if (charIndex < fullText.length) {
        const nextChar = fullText.charAt(charIndex);
        target.textContent += nextChar;
        charIndex += 1;
        const baseDelay = 72;
        const punctuationDelay = /[.,]/.test(nextChar) ? 180 : /[!?]/.test(nextChar) ? 240 : 0;
        const lineOpeningDelay = charIndex === 1 ? 260 : 0;
        window.setTimeout(tick, baseDelay + punctuationDelay + lineOpeningDelay);
        return;
      }
      row.classList.remove("is-active");
      row.classList.add("is-complete");
      rowIndex += 1;
      window.setTimeout(typeIntro, 720);
    };
    tick();
  };
  window.setTimeout(typeIntro, 180);
}
function renderSection(item) { const progress = journeyProgress(item); return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-intro">${renderProgressHeader(item)}<div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Section transition</p><h2 class="full-audit-title">${item.title}</h2><p class="full-audit-lead">${item.description}</p><p class="full-audit-note">This next section explores a different layer. Keep the answers direct. First instinct is often enough to begin.</p></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back" ${progress.sectionCurrent === 1 ? "disabled" : ""}>Back</button><button class="button button-primary" type="button" data-action="next">Enter section</button></div></div>`; }
function renderQuestion(item) { const sectionInfo = sectionProgress(item); const value = answer(item.categoryId, item.id); const open = fullAuditState.supportOpen === item.id; const voiceActive = voiceState.activeQuestionId === item.id; const focusMode = Boolean(fullAuditState.focusMode); const skippedBefore = Boolean(fullAuditState.skippedQuestionIds?.[item.id]); return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-question ${focusMode ? "is-focus-mode" : ""}">${focusMode ? "" : renderProgressHeader(item)}<div class="full-audit-copy-block">${skippedBefore ? `<p class="full-audit-return-note">You skipped this earlier. Add anything you can, then continue.</p>` : ""}<h2 class="full-audit-title">${item.text}</h2>${focusMode ? "" : `<p class="full-audit-lead">${questionLead(item, sectionInfo)}</p>`}</div><div class="full-audit-input-wrap">${renderQuestionInput(item, value)}${item.inputType === "scale" ? "" : `<div class="voice-tools"><button class="voice-button ${voiceActive ? "is-listening" : ""}" type="button" data-action="voice" data-category-id="${item.categoryId}" data-question-id="${item.id}">${voiceActive ? "Listening..." : "Use voice input"}</button><span class="voice-copy">${voiceState.message ? h(voiceState.message) : voiceState.supported ? "Optional. Speak if you want a faster first draft." : "Voice input may not be available in this browser."}</span></div>`}${renderDepthPrompt(item)}${renderSkipPrompt(item)}</div>${focusMode ? "" : `<div class="auditor-inline"><button class="auditor-toggle" type="button" data-action="support" data-id="${item.id}">${open ? "Hide support" : "Need help thinking?"}</button>${open ? `<div class="auditor-drawer"><div class="auditor-drawer-block"><strong>Thinking prompts</strong><ul>${item.prompts.map((prompt) => `<li>${prompt}</li>`).join("")}</ul></div><div class="auditor-drawer-block"><strong>Why this matters</strong><p>${item.why}</p></div><div class="auditor-drawer-block"><strong>Example answer</strong><p>${item.example}</p></div><div class="auditor-drawer-block"><strong>Pacing note</strong><p>${pacingLine(item)}</p></div></div>` : ""}</div>`}<div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="next">Next</button></div></div>`; }
function renderReflection(item) { return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-reflection">${renderProgressHeader(item)}<div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Reflection moment</p><h2 class="full-audit-title">${item.prompt}</h2><p class="full-audit-lead">${item.body}</p><p class="full-audit-note">Honesty matters more than perfection. A short, direct answer is enough.</p></div><div class="full-audit-input-wrap"><textarea class="full-audit-textarea full-audit-textarea-reflection" data-kind="reflection" data-reflection-id="${item.id}" placeholder="Optional. Write a few lines if something clear comes up.">${h(reflectionAnswer(item.id))}</textarea></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="next">Continue</button></div></div>`; }
function renderMilestone(item) { return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-milestone">${renderProgressHeader(item)}<div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Section complete</p><h2 class="full-audit-title">${item.title} is complete.</h2><p class="full-audit-lead">Keep moving. The point is not to answer perfectly. The point is to keep making the pattern more visible.</p><p class="full-audit-note">Next section: ${item.nextTitle}</p></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="next">${item.nextTitle === "Results" ? "See results" : "Continue"}</button></div></div>`; }
function renderResults() {
  const data = summary();
  return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-results">
    <div class="full-audit-meta"><span>Full Results</span><span>${data.completion}% complete</span></div>
    <div class="full-audit-copy-block">
      <p class="section-kicker" style="margin-top: 0;">Opening diagnosis</p>
      <h2 class="full-audit-title">${h(data.diagnosis.headline)}</h2>
      <p class="full-audit-lead">${h(data.diagnosis.summary)}</p>
      <p class="full-audit-note">${data.overallScore === null ? "Complete more answers to strengthen the diagnostic confidence." : `Current overall read: ${data.overallScore}/100. This is a directional diagnostic, not a fixed verdict.`}</p>
    </div>
    <div class="results-block">
      <h4>What your answers suggest</h4>
      <div class="result-focus">${data.mirrored ? `One of the clearest lines in your own words was: "${h(data.mirrored)}"` : "The answers point to a recognisable pattern beneath the surface, even where the wording was brief."}</div>
    </div>
    <div class="results-block">
      <h4>What is actually holding up</h4>
      <div class="result-focus">${h(data.strongestRead)}</div>
    </div>
    <div class="results-block">
      <h4>Category scores</h4>
      <div class="results-grid">${data.categoryScores.map((item) => `<div class="result-tile"><span>${item.title}</span><strong>${item.score === null ? "Not yet assessed" : `${item.score}/10`}</strong></div>`).join("")}</div>
    </div>
    <div class="results-block">
      <h4>Strongest areas</h4>
      <div class="results-list">${data.strongest.length ? data.strongest.map((item) => `<div class="result-line">${item.title} <strong>${item.score}/10</strong></div><div class="result-line result-line-detail">${item.insight}</div>`).join("") : `<div class="result-line">Complete more questions to surface strongest areas.</div>`}</div>
    </div>
    <div class="results-block">
      <h4>Weakest areas</h4>
      <div class="results-list">${data.weakest.length ? data.weakest.map((item) => `<div class="result-line">${item.title} <strong>${item.score}/10</strong></div><div class="result-line result-line-detail">${item.insight}</div>`).join("") : `<div class="result-line">Complete more questions to surface weakest areas.</div>`}</div>
    </div>
    <div class="results-block">
      <h4>Pattern read</h4>
      <div class="results-list">${data.patterns.length ? data.patterns.map((item) => `<div class="result-line">${item}</div>`).join("") : `<div class="result-line">A clearer pattern read appears once more of the audit is completed.</div>`}</div>
    </div>
    <div class="results-block">
      <h4>What this is likely doing to your life right now</h4>
      <div class="results-list">${data.consequences.length ? data.consequences.map((item) => `<div class="result-line">${item}</div>`).join("") : `<div class="result-line">The main effects usually show up in clarity, self-trust, energy, and the quality of your relationships with yourself and others.</div>`}</div>
    </div>
    <div class="results-block">
      <h4>Friction points</h4>
      <div class="results-list">${data.frictions.length ? data.frictions.map((item) => `<div class="result-line">${item}</div>`).join("") : `<div class="result-line">Friction points will appear once categories have enough material.</div>`}</div>
    </div>
    <div class="results-block">
      <h4>Contradictions worth noticing</h4>
      <div class="results-list">${data.contradictions.length ? data.contradictions.map((item) => `<div class="result-line">${item}</div>`).join("") : `<div class="result-line">No major contradiction pattern stood out more strongly than the others.</div>`}</div>
    </div>
    <div class="results-block">
      <h4>Likely root issue</h4>
      <div class="result-focus">${data.rootIssue}</div>
    </div>
    ${renderResultReflection("diagnosis", "Core diagnosis", data.diagnosis.headline, "Let the first reaction come through before you try to sound measured.")}
    ${renderResultReflection("rootIssue", "Root issue", data.rootIssue, "What you resist here may be as informative as what you agree with.")}
    <div class="results-block">
      <h4>The pattern you may be tempted to protect</h4>
      <div class="result-focus">${h(data.protectivePattern)}</div>
    </div>
    <div class="results-block">
      <h4>What to fix first</h4>
      <div class="result-focus">${h(data.firstFix)}</div>
    </div>
    ${renderResultReflection("firstFix", "First fix", data.firstFix, "If this does not feel like the right first move, name the one that does.")}
    <div class="results-block">
      <h4>What to do next</h4>
      <div class="results-list">${data.actionPlan.map((item) => `<div class="result-line">${item}</div>`).join("")}</div>
    </div>
    <div class="results-block">
      <h4>30-day reset</h4>
      <div class="results-subblock">
        <strong>Start</strong>
        <div class="results-list">${data.reset.start.map((item) => `<div class="result-line">${item}</div>`).join("")}</div>
      </div>
      <div class="results-subblock">
        <strong>Stop</strong>
        <div class="results-list">${data.reset.stop.map((item) => `<div class="result-line">${item}</div>`).join("")}</div>
      </div>
      <div class="results-subblock">
        <strong>Reduce</strong>
        <div class="results-list">${data.reset.reduce.map((item) => `<div class="result-line">${item}</div>`).join("")}</div>
      </div>
      <div class="results-subblock">
        <strong>Rebuild</strong>
        <div class="results-list">${data.reset.rebuild.map((item) => `<div class="result-line">${item}</div>`).join("")}</div>
      </div>
      <div class="results-subblock">
        <strong>Non-negotiables</strong>
        <div class="results-list">${data.reset.nonNegotiables.map((item) => `<div class="result-line">${item}</div>`).join("")}</div>
      </div>
    </div>
    <div class="results-block">
      <h4>Next chapter</h4>
      <div class="result-focus">${h(data.nextChapter)}</div>
    </div>
    <div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="portal">Back to portal</button><button class="button button-primary" type="button" data-action="review">Review session</button></div>
  </div>`;
}
function renderSkippedReview() { const pending = pendingSkippedQuestions(); return `<div class="full-audit-view ${fullAuditRenderMode === "step" ? "is-animated" : ""} full-audit-card full-audit-card-milestone"><div class="full-audit-meta"><span>Full Life Audit</span><span>Skipped questions</span></div><div class="full-audit-copy-block"><p class="section-kicker" style="margin-top: 0;">Before results</p><h2 class="full-audit-title">A few questions still need an answer.</h2><p class="full-audit-lead">${pending.length === 1 ? "You skipped 1 question earlier." : `You skipped ${pending.length} questions earlier.`} We can come back to them now before the audit completes.</p><p class="full-audit-note">You do not need perfect answers. Just give each one something real.</p></div><div class="full-audit-footer"><button class="button button-secondary" type="button" data-action="back">Back</button><button class="button button-primary" type="button" data-action="review-skipped">Return to skipped questions</button></div></div>`; }
function renderFullAudit() {
  syncAuditChrome();
  if (auditDeveloperMode && auditDeveloperPanelOpen) {
    fullAuditRoot.innerHTML = renderDeveloperAuditMap();
    syncAuditChrome();
    return;
  }
  if (!fullAuditState.disclaimerAccepted) {
    fullAuditRoot.innerHTML = renderDisclaimer();
    syncAuditChrome();
    return;
  }
  if (!fullAuditState.started) {
    fullAuditRoot.innerHTML = renderIntro();
    startIntroTyping();
    syncAuditChrome();
    return;
  }
  if (fullAuditState.currentIndex >= flow.length) {
    if (pendingSkippedQuestions().length) {
      fullAuditRoot.innerHTML = renderSkippedReview();
      syncAuditChrome();
      return;
    }
    if (!fullAuditState.completedAt) {
      fullAuditState.completedAt = new Date().toISOString();
      saveState();
    }
    fullAuditRoot.innerHTML = renderResults();
    syncAuditChrome();
    return;
  }
  const item = flow[fullAuditState.currentIndex];
  fullAuditRoot.innerHTML = item.type === "section" ? renderSection(item) : item.type === "question" ? renderQuestion(item) : item.type === "milestone" ? renderMilestone(item) : renderReflection(item);
  syncAuditChrome();
}
function resetState() { const preservedUser = { ...fullAuditState.user }; const preservedRestartCount = fullAuditState.restartCount || 0; fullAuditState.started = false; fullAuditState.currentIndex = 0; fullAuditState.restartCount = preservedRestartCount; fullAuditState.completedAt = null; fullAuditState.answers = {}; fullAuditState.reflections = {}; fullAuditState.supportOpen = null; fullAuditState.depthPromptQuestionId = null; fullAuditState.depthPromptBypass = {}; fullAuditState.skipPromptQuestionId = null; fullAuditState.skippedQuestionIds = {}; fullAuditState.focusMode = false; fullAuditState.disclaimerChecked = false; fullAuditState.disclaimerAccepted = false; fullAuditState.user = preservedUser; clearVoiceState(); saveState(); renderAudit("step"); }

if (fullAuditRoot) {
  fullAuditRoot.addEventListener("change", (event) => {
    const target = event.target;
    if (target.dataset.disclaimerCheckbox === "true") {
      fullAuditState.disclaimerChecked = Boolean(target.checked);
      saveState();
      const continueButton = fullAuditRoot.querySelector("[data-action='accept-disclaimer']");
      if (continueButton) {
        continueButton.disabled = !fullAuditState.disclaimerChecked;
      }
    }
  });

  fullAuditRoot.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.kind === "question") {
      dismissDepthPrompt(target.dataset.questionId);
      if (fullAuditState.skipPromptQuestionId === target.dataset.questionId && String(target.value || "").trim()) {
        fullAuditState.skipPromptQuestionId = null;
      }
      setAnswer(target.dataset.categoryId, target.dataset.questionId, target.value);
    }
    if (target.dataset.kind === "reflection") setReflectionAnswer(target.dataset.reflectionId, target.value);
    if (target.dataset.kind === "result-reflection") setResultReflection(target.dataset.resultSection, { response: target.value });
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
    if (action === "toggle-dev-map") {
      auditDeveloperPanelOpen = !auditDeveloperPanelOpen;
      renderAudit("static");
      return;
    }
    if (action === "close-dev-map") {
      auditDeveloperPanelOpen = false;
      renderAudit("static");
      return;
    }
    if (action === "dev-jump-intro") {
      const index = flowIndexForSectionIntro(target.dataset.categoryId);
      if (index >= 0) {
        auditDeveloperPanelOpen = false;
        fullAuditState.started = true;
        fullAuditState.currentIndex = index;
        fullAuditState.supportOpen = null;
        fullAuditState.depthPromptQuestionId = null;
        fullAuditState.skipPromptQuestionId = null;
        saveState();
        renderAudit("step");
      }
      return;
    }
    if (action === "dev-jump-question") {
      const index = flowIndexForQuestion(target.dataset.questionId);
      if (index >= 0) {
        auditDeveloperPanelOpen = false;
        fullAuditState.started = true;
        fullAuditState.currentIndex = index;
        fullAuditState.supportOpen = null;
        fullAuditState.depthPromptQuestionId = null;
        fullAuditState.skipPromptQuestionId = null;
        saveState();
        renderAudit("step");
      }
      return;
    }
    if (action === "portal") {
      window.location.href = "./portal.html";
      return;
    }
    if (action === "start") {
      startAuditFlow();
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
    if (action === "result-voice") {
      startVoiceCapture({ id: `result:${target.dataset.resultSection}`, resultSection: target.dataset.resultSection });
      return;
    }
    if (action === "set-result-reaction") {
      setResultReflection(target.dataset.resultSection, {
        reaction: target.dataset.value,
      });
      renderAudit("static");
      return;
    }
    if (action === "toggle-focus-mode") {
      fullAuditState.focusMode = !fullAuditState.focusMode;
      fullAuditState.supportOpen = null;
      saveState();
      renderAudit("static");
      if (fullAuditState.focusMode) {
        focusCurrentAuditField();
      }
      return;
    }
    if (action === "set-scale") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question") {
        dismissDepthPrompt(item.id);
        setAnswer(item.categoryId, item.id, target.dataset.value);
        renderAudit("static");
      }
      return;
    }
    if (action === "depth-add-more") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question") {
        dismissDepthPrompt(item.id);
        saveState();
        renderAudit("static");
        focusCurrentAuditField();
      }
      return;
    }
    if (action === "depth-continue") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question") {
        if (!fullAuditState.depthPromptBypass) fullAuditState.depthPromptBypass = {};
        fullAuditState.depthPromptBypass[item.id] = true;
        advanceAudit();
      }
      return;
    }
    if (action === "skip-add-answer") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question") {
        fullAuditState.skipPromptQuestionId = null;
        saveState();
        renderAudit("static");
        focusCurrentAuditField();
      }
      return;
    }
    if (action === "skip-for-now") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question") {
        if (!fullAuditState.skippedQuestionIds) fullAuditState.skippedQuestionIds = {};
        fullAuditState.skippedQuestionIds[item.id] = true;
        fullAuditState.skipPromptQuestionId = null;
        saveState();
        advanceAudit();
      }
      return;
    }
    if (action === "next") {
      const item = flow[fullAuditState.currentIndex];
      if (item?.type === "question" && !isQuestionAnswered(item)) {
        fullAuditState.skipPromptQuestionId = item.id;
        saveState();
        renderAudit("static");
        return;
      }
      if (item?.type === "question" && shouldOfferDepthPrompt(item)) {
        fullAuditState.depthPromptQuestionId = item.id;
        saveState();
        renderAudit("static");
        return;
      }
      advanceAudit();
      return;
    }
    if (action === "back") {
      clearVoiceState();
      fullAuditState.currentIndex = Math.max(0, fullAuditState.currentIndex - 1);
      fullAuditState.supportOpen = null;
      fullAuditState.depthPromptQuestionId = null;
      fullAuditState.skipPromptQuestionId = null;
      saveState();
      renderAudit("step");
      return;
    }
    if (action === "support") {
      fullAuditState.supportOpen = fullAuditState.supportOpen === target.dataset.id ? null : target.dataset.id;
      saveState();
      renderAudit("static");
      return;
    }
    if (action === "review") {
      clearVoiceState();
      fullAuditState.currentIndex = 0;
      fullAuditState.supportOpen = null;
      fullAuditState.skipPromptQuestionId = null;
      saveState();
      renderAudit("step");
      return;
    }
    if (action === "review-skipped") {
      const pending = pendingSkippedQuestions();
      if (pending.length) {
        clearVoiceState();
        fullAuditState.currentIndex = flowIndexForQuestion(pending[0].id);
        fullAuditState.supportOpen = null;
        fullAuditState.depthPromptQuestionId = null;
        fullAuditState.skipPromptQuestionId = null;
        saveState();
        renderAudit("step");
        focusCurrentAuditField();
      }
    }
  });
}

if (resumeOverlay) {
  resumeOverlay.addEventListener("click", (event) => {
    const target = event.target.closest("[data-resume-action]");
    if (!target) return;
    if (target.dataset.resumeAction === "resume") {
      hideResumePrompt();
      resumeFullAudit();
      return;
    }
    if (target.dataset.resumeAction === "cancel") {
      hideResumePrompt();
      fullAuditEntryRequested = false;
      return;
    }
    if (target.dataset.resumeAction === "portal") {
      hideResumePrompt();
      window.location.href = "./portal.html";
    }
  });
}

renderFullAudit();
setAuditMode(false);
hideResumePrompt();
bootstrapCloudFullAuditState();

document.querySelectorAll('a[data-start-full-audit="true"]').forEach((node) => {
  node.addEventListener("click", (event) => {
    event.preventDefault();
    void enterFullAudit();
  });
});
