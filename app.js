/* Jaiye Oluwatishe Daniel · portfolio
   Plain JS, no build step. Data first, then behaviour. */
(() => {
'use strict';

/* ---------------- Contact ---------------- */
const PHONE = '2348026364572';
const EMAIL = 'jaiyetishe@gmail.com';
const wa = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg || "Hi Jaiye, I saw your portfolio and I'd like to talk about a project.")}`;

/* ---------------- Work ---------------- */
const SECTIONS = [
  { id:'product', label:'Product design', intro:'Apps and dashboards built around one hard problem each.' },
  { id:'web', label:'Websites', intro:'Landing pages that make one idea impossible to miss.' },
  { id:'prd', label:'PRDs & decks', intro:'Product requirement docs and pitch decks that teams and investors act on.' },
  { id:'brand', label:'Brand identity', intro:'Marks, type and colour with a reason behind every choice.' },
  { id:'game', label:'Game UI', intro:'HUDs, menus and loops that keep players in the match.' },
  { id:'motion', label:'Motion', intro:'A reel of the work in motion, scored with an original track.' },
];

const P = (o) => o;
const PROJECTS = [
  // Product design
  P({ id:'staza', sec:'product', name:'Staza', img:'scov', more:['smob'], tag:'E-commerce', kicker:'Mobile app and seller dashboard',
      line:'Marketplace that holds your money until delivery.',
      problem:'Shoppers pay first and hope the order arrives as described. One bad delivery and they stop buying online.',
      did:['Interviewed shoppers and sellers about trust','Designed Protected Pay: money waits until the buyer confirms','Built the app, the seller dashboard and the design system'],
      facts:[['47 hrs','Auto-release window'],['₦500','Back on late delivery']],
      role:'Product designer', scope:'Research, UX, UI, design system', platform:'iOS, Android, web dashboard' }),
  P({ id:'haulr', sec:'product', name:'Haulr', img:'hcov', tag:'Logistics', kicker:'Freight operations, web',
      line:'See the delay before the customer does.',
      problem:'Dispatchers learned about late loads from angry customers. Exceptions sat in chat threads with no owner.',
      did:['Mapped the dispatch day with operations leads','Designed a live board that ranks loads by risk','Built the alert-to-resolution flow so every exception has an owner'],
      facts:[['1 board','Live map and queue'],['3 taps','Alert to owner']],
      role:'Product designer', scope:'UX, UI, prototype', platform:'Web' }),
  P({ id:'ledgerly', sec:'product', name:'Ledgerly', img:'lcov', tag:'Fintech', kicker:'Payouts for freelancers',
      line:'Get paid from abroad. Know every cost first.',
      problem:'Freelancers paid from abroad lose money to fees they only see after the transfer, and failed payouts leave them guessing.',
      did:['Showed every fee and the final amount before sending','Designed KYC that explains why each step is needed','Created a failed-payout recovery flow with clear next steps'],
      facts:[['0','Surprise fees'],['1 screen','Full cost breakdown']],
      role:'Product designer', scope:'UX, UI, flows', platform:'iOS, Android' }),
  P({ id:'stackwise', sec:'product', name:'Stackwise', img:'stcov', tag:'Edtech', kicker:'Learning platform',
      line:'Never learn alone. Always know the next step.',
      problem:'Self-taught learners quit when they lose the thread. Course platforms show content, not progress.',
      did:['Designed lessons that always end with the next step','Added streaks and cohorts so learners keep each other going','Built the design system the team now ships with'],
      facts:[['1 next step','On every screen'],['DS','Tokens and components']],
      role:'Product designer', scope:'UX, UI, design system', platform:'Web' }),
  P({ id:'kasuwa', sec:'product', name:'Kasuwa', img:'kcov', tag:'Marketplace', kicker:'Handmade goods from West Africa',
      line:'Many makers. One parcel.',
      problem:'Buyers want goods from several small studios but pay for several deliveries. Makers lose the sale at checkout.',
      did:['Designed one checkout across many sellers','Planned the one-parcel delivery so orders ship together','Built a seller dashboard for orders, stock and payouts'],
      facts:[['1 parcel','Per order'],['1 checkout','Many makers']],
      role:'Product designer', scope:'UX, UI, dashboard', platform:'Web, mobile web' }),
  P({ id:'fanfare', sec:'product', name:'Fanfare', img:'fan', tag:'SaaS', kicker:'Creator marketing analytics',
      line:'Creator marketing, measured to the last dollar.',
      problem:'Brands spend on creators but cannot tell which posts paid off. Reports arrive late and in screenshots.',
      did:['Designed a campaign overview that leads with return on spend','Built creator and post drill-downs from the same data','Designed the dashboard design system in light and dark'],
      facts:[['ROI','First number you see'],['Live','Campaign data']],
      role:'Product designer', scope:'UX, UI, data viz', platform:'Web' }),
  P({ id:'carewell', sec:'product', name:'Carewell', img:'care', tag:'Healthtech', kicker:'Telehealth app',
      line:'See a doctor in two minutes.',
      problem:'Getting seen means queues, repeated history and lost prescriptions. Patients delay care until it is urgent.',
      did:['Designed symptom intake that matches you to the right doctor','Designed video visits, e-prescriptions and follow-ups','Kept one record that follows the patient'],
      facts:[['~2 min','Intake to booking'],['1 record','Follows the patient']],
      role:'Product designer', scope:'UX, UI, prototype', platform:'iOS, Android, web' }),
  // Websites
  P({ id:'mira', sec:'web', name:'Mira', img:'mira', tag:'AI', kicker:'Landing page concept',
      line:'Answers with receipts.',
      problem:'People do not trust AI answers they cannot check.',
      did:['Built the page around a receipt: every answer lists its sources','Designed the hero, product tour and pricing','Motion notes for the receipt print-out'],
      facts:[['1 idea','Answers you can check']], role:'Designer', scope:'Concept, copy, UI, motion notes', platform:'Desktop and mobile' }),
  P({ id:'oro', sec:'web', name:'Oro', img:'oro', tag:'Banking', kicker:'Digital bank landing page',
      line:'A bank that fits on a card.',
      problem:'Bank sites bury the one thing people want to know: what it costs and how fast it moves.',
      did:['Led with the card and the promise: money that moves when you do','Put zero fees and instant transfers above the fold','Designed a bold, yellow-first system that stands out'],
      facts:[['Zero','Fees, up front']], role:'Designer', scope:'Concept, copy, UI', platform:'Desktop and mobile' }),
  P({ id:'axis', sec:'web', name:'Axis Works', img:'axis', tag:'Manufacturing', kicker:'Precision parts landing page',
      line:'Precision parts, made to drawing.',
      problem:'Engineers buying parts need tolerances and lead times, not slogans.',
      did:['Designed the site like a technical drawing','Put specs and quote requests one tap away','Built a strict grid with measured annotations'],
      facts:[['1 tap','To a quote']], role:'Designer', scope:'Concept, UI', platform:'Desktop and mobile' }),
  P({ id:'moko', sec:'web', name:'MOKO', img:'moko', tag:'Culture', kicker:'Museum landing page',
      line:'A museum you can walk into.',
      problem:'Museum sites read like brochures. Visitors want to know what is on and how to get in.',
      did:['Built the page around a ticket','Made the current show and visit plan the first things you see','Designed a loud, poster-led identity for the web'],
      facts:[['1 ticket','Organises the page']], role:'Designer', scope:'Concept, copy, UI', platform:'Desktop and mobile' }),
  // PRDs & decks
  P({ id:'imole', sec:'prd', name:'Imole', img:'icov', tag:'PRD', kicker:'PRD and app design',
      line:'Six flats. One meter. No more chasing.',
      problem:'Flats in Lagos compounds share one prepaid meter. One person buys units, then chases everyone else for money.',
      did:['Wrote the product requirements doc: problem, users, scope and success metrics','Designed the split: everyone pays their share before units are bought','Designed the app flows the PRD describes'],
      facts:[['1 meter','Shared fairly'],['PRD','Plus app design']], role:'Product manager and designer', scope:'PRD, flows, UI', platform:'iOS, Android' }),
  P({ id:'mudu', sec:'prd', name:'Mudu', img:'mcov', more:['mwat'], tag:'Pitch deck', kicker:'Investor pitch deck',
      line:'Buy food together. Pay wholesale.',
      problem:'Buying staples in small amounts adds ₦290 to every kilo. Families pay the most for the least.',
      did:['Shaped the story: problem, insight, model, traction, ask','Turned market prices into a clear waterfall chart','Designed a deck investors can read without a voiceover'],
      facts:[['−17%','On staples, bought by the bag'],['₦290','Added per kilo today']], role:'Product designer', scope:'Story, charts, deck design', platform:'Deck' }),
  // Brand
  P({ id:'aurum', sec:'brand', name:'Aurum', img:'aur', tag:'Wealth', kicker:'Brand identity',
      line:'Private wealth, quietly kept.',
      problem:'A private wealth firm needed to feel established without shouting.',
      did:['Designed a keyhole "A" mark','Set a restrained green and gold palette with classic serif type','Built guidelines for print and digital'],
      facts:[['Mark','Keyhole A']], role:'Brand designer', scope:'Logo, colour, type, guidelines', platform:'Brand' }),
  P({ id:'noctua', sec:'brand', name:'Noctua', img:'noc', tag:'Health', kicker:'Brand identity',
      line:'Sleep, properly studied.',
      problem:'A sleep clinic in Lagos needed to feel calm and credible, not clinical.',
      did:['Designed a friendly owl mark','Chose a night-sky palette and rounded type','Built app icon, signage and stationery'],
      facts:[['Mark','Owl']], role:'Brand designer', scope:'Logo, colour, type, icon', platform:'Brand' }),
  P({ id:'ember', sec:'brand', name:'Ember & Oak', img:'emb', tag:'Restaurant', kicker:'Brand identity',
      line:'Slow fire. Open table.',
      problem:'A charcoal grill restaurant needed warmth you can feel from the sign.',
      did:['Designed a leaf-and-flame mark','Set an ember orange on charred black','Built menus, signage and social templates'],
      facts:[['Mark','Leaf and flame']], role:'Brand designer', scope:'Logo, colour, type, menus', platform:'Brand' }),
  P({ id:'echoform', sec:'brand', name:'Echoform', img:'eco', tag:'Audio', kicker:'Brand identity',
      line:'Sound you can see.',
      problem:'An audio studio wanted a mark that moves the way sound does.',
      did:['Designed a ripple "e" that animates with sound','Built a deep violet system with sound-wave rings','Created motion rules for the logo'],
      facts:[['Mark','Ripple e']], role:'Brand designer', scope:'Logo, colour, motion', platform:'Brand' }),
  P({ id:'aaro', sec:'brand', name:'Aaro', img:'aaro', tag:'Coffee', kicker:'Brand and packaging',
      line:'Three roasts. One sunrise.',
      problem:'A coffee roaster needed packaging that tells you the roast at a glance.',
      did:['Named and coloured each roast by the time of day','Designed the sunrise mark and bag system','Built shelf-ready packaging'],
      facts:[['3','Roasts, colour-coded']], role:'Brand designer', scope:'Naming, logo, packaging', platform:'Brand' }),
  // Game
  P({ id:'nullorbit', sec:'game', name:'Null Orbit', img:'null', tag:'Game UI', kicker:'5v5 team shooter',
      line:'A dying planet. The last space station. Five versus five.',
      problem:'Team shooters throw a lot at players. The UI has to stay readable mid-fight.',
      did:['Designed the HUD, loadout, operator select and victory screens','Built a UI kit with sci-fi type and colour rules','Made a clickable prototype of the match loop'],
      facts:[['14','Screens'],['UI kit','Plus prototype']], role:'Game UI designer', scope:'HUD, menus, UI kit, prototype', platform:'PC, console' }),
  P({ id:'touchline', sec:'game', name:'Touchline', img:'tcov', tag:'Game UI', kicker:'Football manager, mobile',
      line:'Every decision is yours. Make the call at half-time.',
      problem:'Manager games bury the fun under spreadsheets.',
      did:['Designed tactics, match day and half-time screens','Made the big decisions one thumb away','Built a UI kit and a clickable prototype'],
      facts:[['14','Screens'],['iOS','and Android']], role:'Game UI designer', scope:'UX, UI kit, prototype', platform:'iOS, Android' }),
  // Motion
  P({ id:'reel', sec:'motion', name:'Showreel', img:'scov', tag:'Motion', kicker:'Original score, full HD',
      line:'The work in motion.', reel:true }),
];
const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
const img = (k, s) => `img/${k}${s ? '-s' : ''}.webp`;

/* ---------------- Skills ---------------- */
const IC = {
  product:'<path class="duo" d="M4 5h16v11H4z"/><path class="ln" d="M4 5h16v11H4zM9 20h6M12 16v4M8 10l2.5 2.5L16 8"/>',
  ia:'<path class="duo" d="M9 3h6v5H9z"/><path class="ln" d="M9 3h6v5H9zM3 16h6v5H3zM15 16h6v5h-6zM12 8v4M6 16v-4h12v4"/>',
  sys:'<circle class="duo" cx="12" cy="12" r="3.5"/><path class="ln" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 5l4.5 4.5M19 5l-4.5 4.5M5 19l4.5-4.5M19 19l-4.5-4.5"/><circle class="ln" cx="4" cy="4" r="1.6"/><circle class="ln" cx="20" cy="4" r="1.6"/><circle class="ln" cx="4" cy="20" r="1.6"/><circle class="ln" cx="20" cy="20" r="1.6"/>',
  motion:'<path class="duo" d="M3 19c6 0 6-14 12-14h6v14z"/><path class="ln" d="M3 19c6 0 6-14 12-14h6"/><circle class="ln" cx="15" cy="5" r="2"/><path class="ln" d="M3 22h18" stroke-dasharray="2 3"/>',
  game:'<path class="duo" d="M6 8h12a4 4 0 0 1 4 4.5l-.6 4A2.5 2.5 0 0 1 17 18l-2-2H9l-2 2a2.5 2.5 0 0 1-4.4-1.5l-.6-4A4 4 0 0 1 6 8z"/><path class="ln" d="M6 8h12a4 4 0 0 1 4 4.5l-.6 4A2.5 2.5 0 0 1 17 18l-2-2H9l-2 2a2.5 2.5 0 0 1-4.4-1.5l-.6-4A4 4 0 0 1 6 8zM7 11v3M5.5 12.5h3"/><circle class="ln" cx="16" cy="11.5" r=".6"/><circle class="ln" cx="18" cy="13.5" r=".6"/>',
  ds:'<path class="duo" d="M3 13h8v8H3z"/><path class="ln" d="M3 13h8v8H3zM13 13h8v8h-8zM3 3h8v8H3z"/><circle class="ln" cx="17" cy="7" r="4"/>',
  research:'<circle class="duo" cx="10.5" cy="10.5" r="6.5"/><circle class="ln" cx="10.5" cy="10.5" r="6.5"/><path class="ln" d="M15.5 15.5L21 21M8 13c.5-1.4 1.4-2 2.5-2s2 .6 2.5 2"/><circle class="ln" cx="10.5" cy="8.6" r="1.4"/>',
  brand:'<path class="duo" d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/><path class="ln" d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  deck:'<path class="duo" d="M3 4h18v12H3z"/><path class="ln" d="M3 4h18v12H3zM12 16v4M8 20h8M7 12v-2M11 12V8M15 12V9.5M19 12V7" />',
  proto:'<path class="duo" d="M3 3h13v13H3z"/><path class="ln" d="M3 3h13v13H3z"/><path class="ln" d="M12 12l9 3.5-4 1.5-1.5 4z"/>',
  writing:'<path class="duo" d="M4 5h16v10H9l-5 4z"/><path class="ln" d="M4 5h16v10H9l-5 4zM8 9h8M8 12h5"/>',
  a11y:'<circle class="duo" cx="12" cy="12" r="9"/><circle class="ln" cx="12" cy="12" r="9"/><circle class="ln" cx="12" cy="7.5" r="1.3"/><path class="ln" d="M7.5 10.5l4.5 1 4.5-1M12 11.5V15l-2 3.5M12 15l2 3.5"/>',
};
const svgIc = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const SKILLS = [
  { ic:'product', t:'Product design, end to end', d:'From the first interview to the developer handoff. I lead discovery, map the flows, design the UI and stay through QA.', big:true },
  { ic:'ia', t:'Information architecture', d:'Sitemaps and navigation that make sense.' },
  { ic:'sys', t:'System architecture', d:'How screens, data and services connect.' },
  { ic:'motion', t:'Interaction and motion', d:'Motion that explains what just changed.' },
  { ic:'game', t:'Game UI design', d:'HUDs, menus and loops that keep players in.' },
  { ic:'ds', t:'Design systems', d:'Tokens and components that scale with the team.' },
  { ic:'research', t:'UX research', d:'Interviews, surveys and usability testing.' },
  { ic:'proto', t:'Prototyping and tools', d:'Clickable prototypes that win approvals early.', wide:true, tools:['Figma','FigJam','Framer','Miro','Notion','Jira','Illustrator','Photoshop','Webflow','Claude'] },
  { ic:'brand', t:'Brand identity', d:'Marks, type and colour with a reason.' },
  { ic:'deck', t:'Pitch decks and PRDs', d:'Stories and specs teams can act on.' },
  { ic:'writing', t:'UX writing', d:'Plain words that tell people what to do.' },
  { ic:'a11y', t:'Accessibility', d:'Contrast, focus and sizes for everyone.' },
];

/* ---------------- Tools (hero) ---------------- */
// Generic glyphs, not the companies' logos.
const G = {
  pen:'<path d="M12 3l7 7-7 11L5 10z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="11" r="1.8" fill="#fff"/>',
  note:'<path d="M5 4h14v10l-6 6H5z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M13 20v-6h6" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>',
  bolt:'<path d="M13 2L5 13h6l-1 9 8-11h-6z" fill="#fff"/>',
  doc:'<path d="M6 3h9l4 4v14H6z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M9 12h6M9 16h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  board:'<rect x="3" y="4" width="18" height="14" rx="2" fill="none" stroke="#fff" stroke-width="2"/><path d="M7 9h4M7 13h7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  ticket:'<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v12" stroke="#fff" stroke-width="2" stroke-dasharray="2 2"/>',
  anchor:'<path d="M4 18C8 6 16 6 20 18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><rect x="10" y="6" width="4" height="4" fill="#fff"/><circle cx="4" cy="18" r="2" fill="#fff"/><circle cx="20" cy="18" r="2" fill="#fff"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M3 13l9 5 9-5" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>',
  spark:'<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
  globe:'<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="#fff" stroke-width="2"/>',
};
const TOOLS = [
  ['Figma','pen','#8B5CF6',6,22,-4],['FigJam','note','#F59E0B',14,44,3],['Framer','bolt','#2563EB',4,66,-3],['Notion','doc','#111827',15,86,4],['Miro','board','#EAB308',24,14,-2],
  ['Jira','ticket','#2563EB',84,20,3],['Illustrator','anchor','#F97316',91,42,-4],['Photoshop','layers','#0EA5E9',80,63,2],['Claude','spark','#D97757',89,84,-3],['Webflow','globe','#4F46E5',73,12,4],
];

/* ---------------- Experience ---------------- */
const EXP = [
  ['Dec 2025 – Jun 2026','Daticks','Product Manager and Product Designer','Data-skills validation platform. Research with 30+ analysts, the end-to-end product and a design system.'],
  ['Aug – Nov 2025','Vestpi','Product Designer','Websites, landing pages and products for fintech and Web3 startups.'],
  ['Apr – Jul 2025','Vestpad','Product Designer','Token launchpad: onboarding, staking, mining and investor dashboards.'],
  ['Jan – Mar 2025','ChainPay','UI/UX Designer','Crypto payroll with bulk payments and treasury dashboards.'],
  ['Oct – Dec 2024','EmitCrypto','UI/UX Designer','Analytics dashboards and admin tools.'],
  ['Jul – Sep 2024','OzoneChain','UI/UX Designer','Corporate website with clearer navigation.'],
  ['Apr – Jun 2024','LightSpeed','UI/UX Designer','Product pages and conversion-focused journeys.'],
];

/* ---------------- Pricing ---------------- */
const PRICES = [
  { t:'Landing page', usd:250, time:'5 to 7 days', gets:['One-page design for desktop and mobile','Copy polish so the page sells','Motion and interaction notes','Clickable prototype','Two rounds of changes','Source Figma file'] },
  { t:'Brand identity', usd:350, time:'About 2 weeks', gets:['Logo suite and app icon','Colour and type system','Brand guidelines PDF','Social media kit','Stationery and mockups','Source files'] },
  { t:'Pitch deck or PRD', usd:200, time:'About 1 week', gets:['Up to 15 slides or PRD pages','Charts and diagrams from your data','Story and structure review','Speaker notes','Editable Figma or PowerPoint file'] },
  { t:'Mobile app design', usd:900, time:'3 to 4 weeks', hot:true, gets:['Research summary and user flows','Sitemap and information architecture','Up to 25 screens, iOS and Android','Design system and components','Clickable prototype','Developer handoff and QA'] },
  { t:'Dashboard or SaaS', usd:1100, time:'4 to 5 weeks', gets:['Discovery workshop with your team','Data and permissions mapping','Up to 20 dashboard screens','Component library','Prototype of key flows','Handoff and design QA'] },
  { t:'Game UI', usd:600, time:'2 to 3 weeks', gets:['HUD, menus and key screens','UI kit with states','Icon set','Clickable prototype','Source files'] },
  { t:'Full website project', usd:700, time:'3 to 4 weeks', web:true, badge:'Design and build', gets:['Up to 6 pages, designed and built','Live, fast and responsive site','Scroll animations and interactions','Editable content (CMS)','Domain setup, SEO basics and analytics','30 days of support after launch'] },
];
const CURRENCIES = { USD:['US dollar',1], NGN:['Nigerian naira',1460], GBP:['British pound',.75], EUR:['Euro',.86], CAD:['Canadian dollar',1.38], AUD:['Australian dollar',1.52], GHS:['Ghanaian cedi',12.2], KES:['Kenyan shilling',129], ZAR:['South African rand',17.6], AED:['UAE dirham',3.67], INR:['Indian rupee',84] };

/* ---------------- Blog ---------------- */
const POSTS = [
  { slug:'checkout-trust', cat:'Product design', t:'Why checkout loses trust in three taps', d:'What I learned designing Protected Pay, and the small screens that make paying a stranger feel safe.', date:'Oct 2026', mins:6, art:'a' },
  { slug:'sitemap-saves-a-sprint', cat:'Information architecture', t:'A sitemap saves you a sprint', d:'How mapping pages and data first stops expensive redesigns later.', date:'Oct 2026', mins:5, art:'b' },
  { slug:'dashboards-people-read', cat:'SaaS', t:'Dashboards people read, not just look at', d:'Start every chart with the decision it should help someone make.', date:'Oct 2026', mins:7, art:'c' },
];
const ART = {
  a:'<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="var(--accent)"/><circle cx="260" cy="30" r="90" fill="#fff" opacity=".12"/><rect x="100" y="30" width="120" height="190" rx="18" fill="#fff"/><rect x="114" y="52" width="60" height="8" rx="4" fill="#08122E" opacity=".8"/><rect x="114" y="70" width="92" height="44" rx="10" fill="var(--accent)" opacity=".14"/><path d="M130 92l8 8 16-16" stroke="var(--accent)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="114" y="126" width="92" height="8" rx="4" fill="#08122E" opacity=".15"/><rect x="114" y="142" width="70" height="8" rx="4" fill="#08122E" opacity=".15"/><rect x="114" y="166" width="92" height="22" rx="11" fill="#08122E"/></svg>',
  b:'<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#08122E"/><g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"><path d="M160 58v26M80 84h160M80 84v26M160 84v26M240 84v26M80 136v20M60 156h40M240 136v20M220 156h40"/></g><rect x="128" y="30" width="64" height="28" rx="8" fill="var(--accent)"/><g fill="#fff"><rect x="52" y="110" width="56" height="26" rx="7"/><rect x="132" y="110" width="56" height="26" rx="7"/><rect x="212" y="110" width="56" height="26" rx="7"/><rect x="40" y="156" width="40" height="20" rx="6" opacity=".6"/><rect x="84" y="156" width="40" height="20" rx="6" opacity=".6"/><rect x="200" y="156" width="40" height="20" rx="6" opacity=".6"/><rect x="244" y="156" width="40" height="20" rx="6" opacity=".6"/></g></svg>',
  c:'<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#EEF2FF"/><rect x="24" y="24" width="272" height="152" rx="16" fill="#fff"/><text x="44" y="62" font-family="Hanken Grotesk,sans-serif" font-weight="800" font-size="26" fill="#08122E">+18%</text><text x="44" y="80" font-family="Hanken Grotesk,sans-serif" font-size="11" fill="#66708F">Renewals this month</text><path d="M44 150 L84 132 L124 140 L164 112 L204 118 L244 90 L276 96" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 150 L84 132 L124 140 L164 112 L204 118 L244 90 L276 96 V160 H44Z" fill="var(--accent)" opacity=".1"/><circle cx="244" cy="90" r="7" fill="var(--accent)"/><circle cx="244" cy="90" r="14" fill="var(--accent)" opacity=".18"/></svg>',
};

/* ---------------- FAQ ---------------- */
const FAQ = [
  ['How do we start?','Message me on WhatsApp with what you are building. I reply within a day with a few questions, then send a fixed quote and a timeline.'],
  ['How do payments work?','Half to start and half when I hand off the files. For longer projects we can split it into milestones. I accept bank transfer in Naira and international payments through Wise, Payoneer or USDT.'],
  ['Do you work with teams outside Nigeria?','Yes. I have worked with founders and teams across Africa, Europe and North America. We agree on overlap hours and I share progress every few days.'],
  ['How many changes can I ask for?','Every package includes two full rounds of changes. Small fixes along the way are free. If the scope changes, I tell you the cost before doing the work.'],
  ['Can you build the website too?','Yes. The full website project includes design and build: a fast, responsive site with animations, editable content, SEO basics and 30 days of support.'],
  ['What do I need to prepare?','A short note on what you are building, who it is for and what success looks like. Logos, content and examples you like help, but I can work from very little.'],
  ['Are you open to full-time roles?','Yes. I am open to product design roles, remote or hybrid. You can download my CV or message me directly.'],
];

/* ================= Helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const motionOn = () => root.dataset.motion !== 'off';
const isTouch = matchMedia('(hover:none),(pointer:coarse)').matches;
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const check = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------------- Settings ---------------- */
const ACCENTS = [['Blue','#1F3BD6'],['Violet','#6D3CF2'],['Teal','#0E9F86'],['Orange','#EA580C'],['Pink','#DB2777']];
let S = {};
try { S = JSON.parse(localStorage.getItem('jaiye-settings') || '{}'); } catch (e) {}
const save = () => { try { localStorage.setItem('jaiye-settings', JSON.stringify(S)); } catch (e) {} };

/* ---------------- Sound ---------------- */
let actx;
function tick(freq = 660, dur = .05) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(.06, actx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + dur);
  } catch (e) {}
}

/* ---------------- Toast ---------------- */
let toastT;
function toast(msg) { const t = $('.toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

/* ================= Render ================= */
function renderWA() { $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.waMsg); a.target = '_blank'; a.rel = 'noopener'; }); }

function renderTools() {
  const box = $('.tools');
  const chip = (t, dup) => `<span class="tool glass${dup ? ' dup' : ''}" ${dup ? 'aria-hidden="true"' : ''} style="left:${t[3]}%;top:${t[4]}%;--rot:${t[5]}deg;--c:${t[2]};--dur:${6 + (t[3] % 5)}s;--delay:-${(t[4] % 7)}s"><span class="g"><svg viewBox="0 0 24 24">${G[t[1]]}</svg></span>${t[0]}</span>`;
  box.innerHTML = `<div class="tool-track">${TOOLS.map(t => chip(t)).join('')}${TOOLS.map(t => chip(t, true)).join('')}</div>`;
}

const FAN = ['staza','haulr','ledgerly','stackwise','kasuwa'];
let fanIdx = 0;
function renderFan() {
  const f = $('.fan');
  f.innerHTML = FAN.map(id => `<div class="fan-card"><img src="${img(byId[id].img)}" alt="${esc(byId[id].name)} cover" ${id === 'staza' ? 'fetchpriority="high"' : 'loading="lazy"'} width="960" height="540"></div>`).join('');
  layoutFan();
}
function layoutFan() {
  const cards = $$('.fan-card');
  const POS = [
    'translate(0,0) rotate(0) scale(1)',
    'translate(-16%,4%) rotate(-7deg) scale(.92)',
    'translate(16%,4%) rotate(7deg) scale(.92)',
    'translate(-28%,10%) rotate(-13deg) scale(.84)',
    'translate(28%,10%) rotate(13deg) scale(.84)',
  ];
  cards.forEach((c, i) => {
    const pos = (i - fanIdx + cards.length) % cards.length;
    c.dataset.pos = pos; c.style.zIndex = 10 - pos;
    c.style.transform = POS[pos];
    c.style.filter = pos ? `brightness(${1 - pos * .06})` : '';
  });
  const p = byId[FAN[fanIdx]];
  $('.fan-name').textContent = p.name; $('.fan-line').textContent = p.line;
}
function nextFan() { fanIdx = (fanIdx + 1) % FAN.length; layoutFan(); tick(520); }

function cardHTML(p, i, n) {
  const facts = (p.facts || []).map(f => `<div class="fact"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div>`).join('');
  return `<article class="card" data-i="${i}" data-id="${p.id}">
    <button class="card-head" aria-expanded="false"><span class="no">${String(i + 1).padStart(2, '0')}</span><img class="th" src="${img(p.img, 1)}" alt="" loading="lazy"><span class="t">${esc(p.name)}</span><span class="d">${esc(p.line)}</span><span class="tag">${esc(p.tag)}</span></button>
    <div class="card-body"><div class="card-grid">
      <div class="card-media" data-case="${p.id}" data-cursor="View"><img src="${img(p.img)}" alt="${esc(p.name)}: ${esc(p.line)}" loading="lazy" width="960" height="540"></div>
      <div class="card-info">
        <span class="kicker">${esc(p.kicker)}</span>
        <div><h4>The problem</h4><p>${esc(p.problem)}</p></div>
        <div><h4>What I did</h4><ul>${p.did.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
        ${facts ? `<div class="facts">${facts}</div>` : ''}
        <div class="card-cta"><button class="btn btn-ink btn-sm" data-case="${p.id}">Read the case study</button><a class="btn btn-glass btn-sm" target="_blank" rel="noopener" href="${wa(`Hi Jaiye, I saw ${p.name} on your portfolio. I'd like something similar.`)}">I want one like this</a></div>
      </div>
    </div></div>
  </article>`;
}

function renderWork() {
  const tabs = $('.tabs'), panels = $('.panels');
  tabs.innerHTML = '<span class="tab-pill" aria-hidden="true"></span>' + SECTIONS.map((s, i) => {
    const n = PROJECTS.filter(p => p.sec === s.id).length;
    return `<button class="tab" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${s.label}<span class="n">${n}</span></button>`;
  }).join('');
  panels.innerHTML = SECTIONS.map((s, si) => {
    const list = PROJECTS.filter(p => p.sec === s.id);
    let inner;
    if (s.id === 'motion') {
      const shots = ['scov','hcov','fan','oro','null','tcov','aaro','moko'];
      inner = `<div class="reel glass">
        <a class="reel-screen" href="showreel.html" data-cursor="Play" aria-label="Play the showreel">
          <div class="slides">${shots.map((k, i) => `<img src="${img(k)}" alt="" loading="lazy" class="${i ? '' : 'on'}">`).join('')}</div>
          <span class="play"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg></span>
        </a>
        <div class="reel-copy"><span class="tag">Motion</span><h3 style="margin-top:12px">Showreel 2026</h3><p>A cut of product, brand and game work in motion, scored with an original track made in the browser. Plays in landscape or vertical, and downloads in full HD.</p><a class="btn btn-accent" href="showreel.html">Watch the reel</a></div>
      </div>`;
    } else {
      inner = `<div class="deck glass" data-deck>
        <div class="deck-scroll" tabindex="0" aria-label="${esc(s.label)} projects. Scroll to open the next card.">
          <div class="deck-stage">${list.map((p, i) => cardHTML(p, i, list.length)).join('')}</div>
          <div class="deck-spacer"></div>
        </div>
        <div class="deck-foot"><span class="df-txt">1 of ${list.length} open</span><span class="progress"><span></span></span></div>
      </div>`;
    }
    return `<div class="panel-sec${si === 0 ? ' on' : ''}" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}">
      <div class="panel-intro"><div><h3>${esc(s.label)}</h3><p>${esc(s.intro)}</p></div>${s.id !== 'motion' && list.length > 1 ? '<span class="hint"><span class="mouse"></span>Scroll the deck</span>' : ''}</div>
      ${inner}
    </div>`;
  }).join('');
}

function renderSkills() {
  $('.bento').innerHTML = SKILLS.map(s => {
    if (s.big) return `<div class="skill big glass" data-reveal><span class="ic">${svgIc(s.ic)}</span><h3>${s.t}</h3><p>${s.d}</p><div class="flow"><span><small>01</small>Discover</span><span><small>02</small>Map</span><span><small>03</small>Design</span><span><small>04</small>Ship</span></div></div>`;
    return `<div class="skill glass${s.wide ? ' wide' : ''}" data-reveal><span class="ic">${svgIc(s.ic)}</span><h3>${s.t}</h3><p>${s.d}</p>${s.tools ? `<div class="tool-row">${s.tools.map(t => `<span>${t}</span>`).join('')}</div>` : ''}</div>`;
  }).join('');
}

function renderExp() {
  $('.timeline').innerHTML = EXP.map(e => `<li data-reveal><span class="when">${e[0]}</span><h3>${e[1]}</h3><span class="role">${e[2]}</span><p>${e[3]}</p></li>`).join('');
}

let rates = Object.fromEntries(Object.entries(CURRENCIES).map(([k, v]) => [k, v[1]]));
function guessCurrency() {
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  const map = { 'Africa/Lagos':'NGN','Europe/London':'GBP','Africa/Accra':'GHS','Africa/Nairobi':'KES','Africa/Johannesburg':'ZAR','Asia/Dubai':'AED','Asia/Kolkata':'INR','Asia/Calcutta':'INR' };
  if (map[tz]) return map[tz];
  if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Montreal)/.test(tz)) return 'CAD';
  if (tz.startsWith('Australia/')) return 'AUD';
  if (tz.startsWith('Europe/')) return 'EUR';
  return 'USD';
}
function nice(v, cur) {
  if (cur === 'USD') return v;
  const step = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1));
  return Math.round(v / step) * step;
}
function fmt(v, cur) {
  try { return new Intl.NumberFormat(undefined, { style:'currency', currency:cur, maximumFractionDigits:0 }).format(v); }
  catch (e) { return cur + ' ' + Math.round(v).toLocaleString(); }
}
function renderPricing() {
  const sel = $('#cur');
  sel.innerHTML = Object.entries(CURRENCIES).map(([k, v]) => `<option value="${k}">${k} · ${v[0]}</option>`).join('');
  sel.value = S.currency || guessCurrency();
  const grid = $('.price-grid');
  grid.innerHTML = PRICES.map(p => {
    const list = `<ul>${p.gets.map(g => `<li>${check}<span>${g}</span></li>`).join('')}</ul>`;
    const head = `<div class="p-top"><h3>${p.t}</h3>${p.hot ? '<span class="badge">Most booked</span>' : ''}${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
      <div class="from">Starting from</div><div class="amt" data-usd="${p.usd}">$${p.usd}</div>
      <div class="time"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>${p.time}</div>`;
    const btn = `<a class="btn ${p.hot ? 'btn-accent' : 'btn-glass'}" target="_blank" rel="noopener" href="${wa(`Hi Jaiye, I'd like a quote for: ${p.t}.`)}">Start on WhatsApp</a>`;
    if (p.web) return `<div class="price web" data-reveal><div>${head}${btn}</div><div><div class="gets">What you get</div>${list}</div></div>`;
    return `<div class="price glass${p.hot ? ' hot' : ''}" data-reveal>${head}<div class="gets">What you get</div>${list}${btn}</div>`;
  }).join('');
  const apply = () => {
    const c = sel.value;
    $$('.amt', grid).forEach(a => { a.textContent = fmt(nice(+a.dataset.usd * (rates[c] || 1), c), c); });
  };
  sel.addEventListener('change', () => { S.currency = sel.value; save(); apply(); tick(); });
  apply();
  fetch('https://open.er-api.com/v6/latest/USD').then(r => r.ok ? r.json() : null).then(j => {
    if (j && j.rates) { Object.keys(rates).forEach(k => { if (j.rates[k]) rates[k] = j.rates[k]; }); apply(); }
  }).catch(() => {});
}

function renderBlog() {
  $('.posts').innerHTML = POSTS.map(p => `<a class="post glass" href="blog/${p.slug}.html" data-reveal data-cursor="Read">
    <div class="art">${ART[p.art]}</div>
    <div class="pb"><span class="cat">${p.cat}</span><h3>${p.t}</h3><p>${p.d}</p>
    <div class="byline"><img src="img/me.webp" alt=""><span><b>Jaiye Oluwatishe</b>${p.date} · ${p.mins} min read</span></div></div>
  </a>`).join('');
}

function renderFAQ() {
  $('.qa').innerHTML = FAQ.map((q, i) => `<details class="glass" data-reveal ${i === 0 ? 'open' : ''}><summary>${q[0]}<i aria-hidden="true"></i></summary><div class="ans">${q[1]}</div></details>`).join('');
}

/* ================= Behaviour ================= */

/* Split headings into words for the staggered reveal */
function splitText() {
  $$('[data-split]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
    el.setAttribute('aria-label', words.join(' '));
    $$('.w', el).forEach(w => w.setAttribute('aria-hidden', 'true'));
    if (el.classList.contains('headline')) { const last = $$('.w>span', el).slice(-1)[0]; if (last) last.classList.add('accent'); }
  });
}

function reveal() {
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin:'0px 0px -8% 0px', threshold:.08 });
  $$('[data-reveal],[data-split],.portrait').forEach(el => io.observe(el));
  // count up
  const cio = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count;
    if (!motionOn()) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold:.6 });
  $$('[data-count]').forEach(el => cio.observe(el));
}

/* Tabs with a sliding pill */
function initTabs() {
  const tabs = $$('.tab'), pill = $('.tab-pill');
  const move = (t) => { pill.style.width = t.offsetWidth + 'px'; pill.style.transform = `translateX(${t.offsetLeft}px)`; };
  const select = (t, focus) => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
    $$('.panel-sec').forEach(p => p.classList.toggle('on', p.id === t.getAttribute('aria-controls')));
    move(t); if (focus) t.focus();
    t.scrollIntoView({ block:'nearest', inline:'center', behavior: motionOn() ? 'smooth' : 'auto' });
    const panel = $('#' + t.getAttribute('aria-controls')); const d = $('[data-deck]', panel); if (d) d._layout();
    tick(740);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true); }
    });
  });
  requestAnimationFrame(() => move(tabs[0]));
  addEventListener('resize', () => move($('.tab[aria-selected="true"]')));
  document.fonts && document.fonts.ready.then(() => move($('.tab[aria-selected="true"]')));
  window.selectSection = (id) => { const t = $('#tab-' + id); if (t) select(t); };
}

/* Fold deck: one card open, the rest folded. Only the deck scrolls. */
function initDecks() {
  $$('[data-deck]').forEach(deck => {
    const sc = $('.deck-scroll', deck), stage = $('.deck-stage', deck), spacer = $('.deck-spacer', deck);
    const cards = $$('.card', deck), n = cards.length;
    const txt = $('.df-txt', deck), bar = $('.progress span', deck);
    let active = -1;
    const STEP = () => innerWidth < 640 ? 240 : 280;
    const HEAD = () => innerWidth < 640 ? 56 : 62;
    const layout = (force) => {
      const H = stage.clientHeight; if (!H) return;
      spacer.style.height = (H + (n - 1) * STEP()) + 'px';
      const idx = Math.max(0, Math.min(n - 1, Math.round(sc.scrollTop / STEP())));
      if (idx === active && !force) return;
      active = idx;
      const SL = 12, GAP = 6, head = HEAD();
      const pastShown = Math.min(idx, 3), after = n - 1 - idx, afterShown = Math.min(after, innerWidth < 640 ? 2 : 3);
      const openH = H - pastShown * (SL + GAP) - afterShown * (head + GAP);
      cards.forEach((c, i) => {
        const d = i - idx;
        c.classList.toggle('open', d === 0); c.classList.toggle('past', d < 0); c.classList.toggle('gone', d < -3);
        $('.card-head', c).setAttribute('aria-expanded', d === 0);
        let h, mb = GAP;
        if (d === 0) h = openH; else if (d < 0) { h = d >= -3 ? SL : 0; mb = d >= -3 ? GAP : 0; } else h = head;
        c.style.setProperty('--h', h + 'px'); c.style.setProperty('--mb', mb + 'px');
        $$('a,button', $('.card-body', c)).forEach(b => b.tabIndex = d === 0 ? 0 : -1);
      });
      txt.textContent = `${idx + 1} of ${n} open${idx < n - 1 ? ' · keep scrolling to unfold the next' : ''}`;
      bar.style.width = ((idx + 1) / n * 100) + '%';
      if (!force) tick(420 + idx * 30, .04);
    };
    deck._layout = () => layout(true);
    sc.addEventListener('scroll', () => requestAnimationFrame(() => layout()), { passive:true });
    addEventListener('resize', () => layout(true));
    cards.forEach((c, i) => $('.card-head', c).addEventListener('click', () => {
      sc.scrollTo({ top:i * STEP(), behavior: motionOn() ? 'smooth' : 'auto' });
    }));
    sc.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const i = Math.max(0, Math.min(n - 1, active + (e.key === 'ArrowDown' ? 1 : -1)));
        sc.scrollTo({ top:i * STEP(), behavior: motionOn() ? 'smooth' : 'auto' });
      }
    });
    layout(true);
  });
}

/* Showreel preview slides */
function initReel() {
  const imgs = $$('.reel-screen .slides img'); if (!imgs.length) return;
  let i = 0;
  setInterval(() => { if (!motionOn() || document.hidden) return; imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, 2200);
}

/* Case study overlay with a liquid circle reveal */
let lastFocus;
function openCase(id, x, y) {
  const p = byId[id]; if (!p) return;
  if (p.reel) { location.href = 'showreel.html'; return; }
  const box = $('#case'), list = PROJECTS.filter(q => q.sec === p.sec && !q.reel), idx = list.indexOf(p), next = list[(idx + 1) % list.length];
  const sec = SECTIONS.find(s => s.id === p.sec);
  $('.case-content', box).innerHTML = `
    <span class="eyebrow">${esc(sec.label)}${p.kicker !== sec.label ? " · " + esc(p.kicker) : ""}</span>
    <h2 id="case-title">${esc(p.name)}</h2>
    <p class="tagline">${esc(p.line)}</p>
    <div class="meta"><span class="tag">Role: ${esc(p.role)}</span><span class="tag">Scope: ${esc(p.scope)}</span><span class="tag">Platform: ${esc(p.platform)}</span></div>
    <div class="hero-img"><img src="${img(p.img)}" alt="${esc(p.name)} cover" width="960" height="540"></div>
    ${(p.more || []).map(k => `<div class="hero-img"><img src="${img(k)}" alt="${esc(p.name)} screens" loading="lazy"></div>`).join('')}
    <div class="case-cols">
      <div class="glass"><h3>The problem</h3><p>${esc(p.problem)}</p></div>
      <div class="glass"><h3>What I did</h3><ul>${p.did.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
      <div class="glass"><h3>Key details</h3><ul>${(p.facts || []).map(f => `<li><b>${esc(f[0])}</b> ${esc(f[1])}</li>`).join('')}</ul></div>
    </div>
    <div class="case-next">
      <a class="btn btn-accent" target="_blank" rel="noopener" href="${wa(`Hi Jaiye, I saw ${p.name} on your portfolio. I'd like something similar.`)}">I want one like this</a>
      ${next && next !== p ? `<button class="btn btn-glass" data-case="${next.id}">Next: ${esc(next.name)} →</button>` : ''}
    </div>`;
  box.style.setProperty('--cx', (x ?? innerWidth / 2) + 'px'); box.style.setProperty('--cy', (y ?? innerHeight / 2) + 'px');
  lastFocus = lastFocus || document.activeElement;
  box.hidden = false; document.body.style.overflow = 'hidden';
  $('.case-inner', box).scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('open')));
  setTimeout(() => $('.case-close', box).focus(), 50);
  history.replaceState(null, '', '#case-' + id);
  tick(880, .08);
}
function closeCase() {
  const box = $('#case'); if (box.hidden) return;
  box.classList.remove('open');
  setTimeout(() => { box.hidden = true; document.body.style.overflow = ''; }, motionOn() ? 700 : 0);
  history.replaceState(null, '', location.pathname);
  if (lastFocus) { lastFocus.focus({ preventScroll:true }); lastFocus = null; }
}

/* Sheets: settings, command menu, game */
function openSheet(id) {
  const el = $('#' + id); if (!el) return;
  lastFocus = document.activeElement; el.hidden = false; document.body.style.overflow = 'hidden';
  const f = $('input,button:not([data-close]),[tabindex]', $('.panel', el)) || $('.panel', el);
  setTimeout(() => f && f.focus(), 30);
  if (id === 'cmdk') { const i = $('#cmdk input'); i.value = ''; buildCmd(''); }
  if (id === 'game') resetGame();
  tick(600);
}
function closeSheets() {
  let any = false;
  $$('.sheet').forEach(s => { if (!s.hidden) { s.hidden = true; any = true; } });
  if (any) { document.body.style.overflow = ''; if (lastFocus) lastFocus.focus({ preventScroll:true }); lastFocus = null; }
  return any;
}

function initSettings() {
  const sw = $('.swatches');
  sw.innerHTML = ACCENTS.map(([n, c]) => `<button style="--c:${c}" data-c="${c}" aria-label="${n}"></button>`).join('');
  const sync = () => {
    $$('[data-setting="theme"] button').forEach(b => b.classList.toggle('on', b.dataset.v === root.dataset.theme));
    $('[data-setting="glass"]').setAttribute('aria-checked', root.dataset.glass !== 'off');
    $('[data-setting="motion"]').setAttribute('aria-checked', root.dataset.motion !== 'off');
    $('[data-setting="sound"]').setAttribute('aria-checked', !!S.sound);
    const cur = (getComputedStyle(root).getPropertyValue('--accent') || '').trim().toLowerCase();
    $$('button', sw).forEach(b => b.classList.toggle('on', b.dataset.c.toLowerCase() === cur));
    const meta = $$('meta[name="theme-color"]'); meta.forEach(m => m.content = root.dataset.theme === 'dark' ? '#040A1C' : '#F4F6FB');
  };
  $$('[data-setting="theme"] button').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.v)));
  $('[data-setting="glass"]').addEventListener('click', () => { root.dataset.glass = root.dataset.glass === 'off' ? 'on' : 'off'; S.glass = root.dataset.glass; save(); sync(); tick(); });
  $('[data-setting="motion"]').addEventListener('click', () => { root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off'; S.motion = root.dataset.motion; save(); sync(); tick(); });
  $('[data-setting="sound"]').addEventListener('click', () => { S.sound = !S.sound; save(); sync(); tick(880); });
  $$('button', sw).forEach(b => b.addEventListener('click', () => { root.style.setProperty('--accent', b.dataset.c); S.accent = b.dataset.c; save(); sync(); tick(); }));
  $('[data-reset]').addEventListener('click', () => { S = {}; save(); root.style.removeProperty('--accent'); root.dataset.glass = 'on'; root.dataset.motion = 'on'; root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; sync(); toast('Settings reset'); });
  window.setTheme = (v) => {
    const go = () => { root.dataset.theme = v; S.theme = v; save(); sync(); };
    if (document.startViewTransition && motionOn()) document.startViewTransition(go); else go();
    tick();
  };
  window.syncSettings = sync;
  sync();
}

/* Command menu */
let cmdItems = [], cmdSel = 0;
function cmdData() {
  const items = [];
  PROJECTS.forEach(p => items.push({ g:'Projects', t:p.name, s:`${SECTIONS.find(x => x.id === p.sec).label} · ${p.line}`, img:img(p.img, 1), prev:img(p.img), run:() => { closeSheets(); setTimeout(() => openCase(p.id), 60); } }));
  SECTIONS.forEach(s => items.push({ g:'Work sections', t:s.label, s:s.intro, ico:'▦', run:() => { closeSheets(); window.selectSection(s.id); $('#work').scrollIntoView({ behavior:'smooth' }); } }));
  [['About','#about'],['Skills','#skills'],['Experience','#experience'],['Pricing','#pricing'],['Blog','#blog'],['FAQ','#faq'],['Contact','#contact']].forEach(([t, h]) => items.push({ g:'Go to', t, s:'Jump to section', ico:'↘', run:() => { closeSheets(); $(h).scrollIntoView({ behavior:'smooth' }); } }));
  items.push(
    { g:'Actions', t:'Chat on WhatsApp', s:'+234 802 636 4572', ico:'💬', run:() => window.open(wa(), '_blank') },
    { g:'Actions', t:'Copy email', s:EMAIL, ico:'✉', run:() => { copy(EMAIL); closeSheets(); } },
    { g:'Actions', t:'Download CV', s:'Two-page PDF', ico:'⬇', run:() => { location.href = 'cv/Jaiye_Oluwatishe_Daniel_CV.pdf'; } },
    { g:'Actions', t:'Toggle dark mode', s:'Switch appearance', ico:'◐', run:() => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark') },
    { g:'Actions', t:'Watch the showreel', s:'Motion', ico:'▶', run:() => { location.href = 'showreel.html'; } },
    { g:'Actions', t:'Take a penalty', s:'A tiny Touchline game', ico:'⚽', run:() => { closeSheets(); setTimeout(() => openSheet('game'), 60); } },
  );
  POSTS.forEach(p => items.push({ g:'Blog', t:p.t, s:`${p.cat} · ${p.mins} min read`, ico:'✎', run:() => { location.href = `blog/${p.slug}.html`; } }));
  return items;
}
const ALL_CMD = cmdData();
function buildCmd(q) {
  q = q.trim().toLowerCase();
  cmdItems = ALL_CMD.filter(i => !q || (i.t + ' ' + i.s + ' ' + i.g).toLowerCase().includes(q));
  cmdSel = 0;
  const ul = $('.cmd-list');
  if (!cmdItems.length) { ul.innerHTML = `<li class="cmd-empty">Nothing for "${esc(q)}". Try "fintech" or "brand".</li>`; preview(); return; }
  let g = '', html = '';
  cmdItems.forEach((it, i) => {
    if (it.g !== g) { g = it.g; html += `<li class="grp" role="presentation">${g}</li>`; }
    html += `<li class="it" role="option" data-i="${i}">${it.img ? `<img src="${it.img}" alt="">` : `<span class="ico">${it.ico}</span>`}<span><b>${esc(it.t)}</b><small>${esc(it.s)}</small></span></li>`;
  });
  ul.innerHTML = html;
  $$('.it', ul).forEach(li => {
    li.addEventListener('mouseenter', () => selCmd(+li.dataset.i, false));
    li.addEventListener('click', () => cmdItems[+li.dataset.i].run());
  });
  selCmd(0, false);
}
function selCmd(i, scroll = true) {
  cmdSel = i;
  $$('.cmd-list .it').forEach(li => { const on = +li.dataset.i === i; li.classList.toggle('on', on); li.setAttribute('aria-selected', on); if (on && scroll) li.scrollIntoView({ block:'nearest' }); });
  preview(cmdItems[i]);
}
function preview(it) {
  const pv = $('.cmd-preview');
  if (it && it.prev) { $('img', pv).src = it.prev; $('img', pv).style.display = ''; }
  else { $('img', pv).removeAttribute('src'); $('img', pv).style.display = 'none'; }
  $('b', pv).textContent = it ? it.t : ''; $('small', pv).textContent = it ? it.s : '';
}
function initCmd() {
  const input = $('#cmdk input');
  input.addEventListener('input', () => buildCmd(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selCmd(Math.min(cmdItems.length - 1, cmdSel + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); selCmd(Math.max(0, cmdSel - 1)); }
    if (e.key === 'Enter' && cmdItems[cmdSel]) { e.preventDefault(); cmdItems[cmdSel].run(); }
  });
}

/* Penalty game */
let shots = 0, goals = 0, busy = false;
function resetGame() {
  shots = 0; goals = 0; busy = false;
  $('.dots').innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
  $('.g-goals').textContent = '0'; $('.g-msg').textContent = 'Five shots. Pick a corner.';
  $('.g-again').hidden = true; $('.keeper').style.transform = ''; $('.g-ball').style.transform = '';
}
function initGame() {
  const goal = $('.goal'), ball = $('.g-ball'), keeper = $('.keeper');
  $$('button', goal).forEach(b => b.addEventListener('click', () => {
    if (busy || shots >= 5) return; busy = true;
    const z = +b.dataset.z, col = z % 3, row = Math.floor(z / 3);
    const kz = Math.floor(Math.random() * 6), kc = kz % 3, kr = Math.floor(kz / 3);
    const gw = goal.offsetWidth, gh = goal.offsetHeight, pitch = $('.pitch').getBoundingClientRect(), gr = goal.getBoundingClientRect();
    const tx = (col - 1) * gw / 3, ty = -(pitch.bottom - 24 - 13 - (gr.top + (row + .5) * gh / 2)) ;
    ball.style.transform = `translate(${tx}px,${ty}px) scale(.6)`;
    keeper.style.transform = `translateX(${(kc - 1) * gw / 3.2}px) translateY(${kr === 0 ? -40 : 0}px) rotate(${(kc - 1) * 50}deg)`;
    tick(300, .12);
    setTimeout(() => {
      const saved = kc === col && (kr === row || col === 1);
      const dot = $$('.dots i')[shots]; shots++;
      if (saved) { dot.className = 'm'; $('.g-msg').textContent = ['Saved! He read it.','Denied. Try the other side.','The keeper guessed right.'][Math.floor(Math.random() * 3)]; tick(200, .2); }
      else { goals++; dot.className = 'g'; $('.g-msg').textContent = ['Goal! Top bins.','Goal! Keeper went the wrong way.','Back of the net.'][Math.floor(Math.random() * 3)]; tick(990, .15); }
      $('.g-goals').textContent = goals;
      setTimeout(() => {
        ball.style.transform = ''; keeper.style.transform = ''; busy = false;
        if (shots >= 5) {
          $('.g-msg').textContent = goals >= 4 ? `${goals} of 5. You'd make the squad.` : goals >= 2 ? `${goals} of 5. Not bad. Run it back?` : `${goals} of 5. The keeper wins this one.`;
          $('.g-again').hidden = false;
        }
      }, 900);
    }, 520);
  }));
  $('.g-again').addEventListener('click', resetGame);
}

/* Copy */
function copy(text) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast('Email copied')).catch(() => { prompt('Copy my email:', text); });
}

/* Cursor, magnetic buttons, parallax */
function initPointer() {
  if (isTouch) return;
  const cur = $('.cursor'), label = $('.cursor-label');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; cur.classList.add('on'); }, { passive:true });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  const loop = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); };
  loop();
  document.addEventListener('pointerover', (e) => {
    const big = e.target.closest('[data-cursor]');
    const link = e.target.closest('a,button,summary,select,[role="button"]');
    cur.classList.toggle('big', !!big); label.textContent = big ? big.dataset.cursor : '';
    cur.classList.toggle('link', !big && !!link);
  });
  // magnetic
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', (e) => { if (!motionOn()) return; const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
  // tools follow the mouse a little
  const tools = $$('.tool:not(.dup)');
  const hero = $('.hero');
  hero.addEventListener('pointermove', (e) => {
    if (!motionOn()) return;
    const r = hero.getBoundingClientRect(), dx = (e.clientX - r.width / 2) / r.width, dy = (e.clientY - r.height / 2) / r.height;
    tools.forEach((t, i) => { const k = 10 + (i % 4) * 8; t.style.translate = `${-dx * k}px ${-dy * k}px`; });
  });
  // spotlight on skills
  document.addEventListener('pointermove', (e) => {
    const s = e.target.closest && e.target.closest('.skill'); if (!s) return;
    const r = s.getBoundingClientRect(); s.style.setProperty('--mx', (e.clientX - r.left) + 'px'); s.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive:true });
}

function initScroll() {
  const island = $('.island'), dock = $('.dock'), blobs = $$('[data-parallax]'), fan = $('.fan-wrap');
  const steps = $$('.step'), line = $('.steps-line'), stepsBox = $('.steps');
  let lastY = scrollY, ticking = false;
  const on = () => {
    const y = scrollY;
    island.classList.toggle('shrink', y > 40);
    if (dock) dock.classList.toggle('hide', y > lastY + 4 && y > 400);
    if (y < lastY - 4) dock && dock.classList.remove('hide');
    lastY = y;
    if (motionOn()) {
      blobs.forEach(b => b.style.translate = `0 ${y * +b.dataset.parallax}px`);
      if (fan && y < innerHeight * 1.2) fan.style.translate = `0 ${y * .12}px`;
    }
    // process line
    const r = stepsBox.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh * .7 - r.top) / (r.height + vh * .2)));
    line.style.setProperty('--p', (p * 100) + '%');
    steps.forEach((s, i) => s.classList.toggle('lit', p > i / steps.length + .02 || innerWidth < 640));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(on); } }, { passive:true });
  on();
  // active nav link
  const links = $$('.nav-links a');
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin:'-45% 0px -50% 0px' });
  ['work','about','skills','pricing','blog','faq'].forEach(id => { const el = $('#' + id); el && io.observe(el); });
}

function initMenu() {
  const btn = $('[data-menu]'), menu = $('.mobile-menu');
  const set = (open) => { btn.setAttribute('aria-expanded', open); menu.hidden = !open; };
  btn.addEventListener('click', () => { set(menu.hidden); tick(); });
  $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  window.closeMenu = () => set(false);
}

function initGlobal() {
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-case]');
    if (c) { e.preventDefault(); openCase(c.dataset.case, e.clientX, e.clientY); return; }
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); window.closeMenu(); openSheet(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) { closeSheets(); closeCase(); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { copy(cp.dataset.copy); const l = $('.copy-label', cp); if (l) { l.textContent = 'Copied ✓'; setTimeout(() => l.textContent = 'Copy email', 1800); } }
    if (e.target.closest('.btn,.tab,.icon-btn')) tick(560, .03);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#cmdk').hidden ? openSheet('cmdk') : closeSheets(); }
    if (e.key === 'Escape') { if (!closeSheets()) closeCase(); window.closeMenu(); }
    // simple focus trap for open dialogs
    if (e.key === 'Tab') {
      const open = $$('.sheet').find(s => !s.hidden) || (!$('#case').hidden && $('#case'));
      if (!open) return;
      const f = $$('a[href],button:not([disabled]),input,select,[tabindex="0"]', open).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  const fan = $('.fan');
  fan.addEventListener('click', nextFan);
  fan.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextFan(); } });
  let fanT = setInterval(() => { if (motionOn() && !document.hidden && !fan.matches(':hover')) nextFan(); }, 3600);
  // swipe on the fan (mobile)
  let sx = null;
  fan.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive:true });
  fan.addEventListener('touchend', (e) => { if (sx !== null && Math.abs(e.changedTouches[0].clientX - sx) > 30) nextFan(); sx = null; });
  // deep link to a case
  const m = location.hash.match(/^#case-(.+)$/); if (m && byId[m[1]]) setTimeout(() => openCase(m[1]), 300);
  // easter egg: type "goal"
  let buf = '';
  document.addEventListener('keydown', (e) => { if (e.target.matches('input,select,textarea')) return; buf = (buf + e.key).slice(-4).toLowerCase(); if (buf === 'goal') openSheet('game'); });
  // follow system theme until the visitor picks one
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!S.theme) { root.dataset.theme = e.matches ? 'dark' : 'light'; window.syncSettings(); } });
}

/* ================= Boot ================= */
renderWA();
renderTools();
renderFan();
renderWork();
renderSkills();
renderExp();
renderPricing();
renderBlog();
renderFAQ();
renderWA();
splitText();
initSettings();
initTabs();
initDecks();
initReel();
initCmd();
initGame();
initMenu();
initGlobal();
initPointer();
initScroll();
reveal();
})();
