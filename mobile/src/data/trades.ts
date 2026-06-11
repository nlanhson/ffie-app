import type { ImageSourcePropType } from "react-native";
import type { RichSegment } from "@/data/news";

// Content for the Trades tab — "Discover the professions" (WBS Epic 4).
//
// Structured to mirror the CLIENT careers page
// (ffie.fr/les-metiers-de-lelectricite/metiers-et-formations): hero + intro,
// the 5 specialization domains (accordion), a hero illustration, two feature
// cards (7 reasons / the kit), and a "professions of tomorrow" training
// section (card grid).
//
// P6 — No login wall: everything here is public, readable, shareable.
//
// IMAGERY: all `seed`/illustration visuals are PLACEHOLDERS (random
// picsum.photos). Production MUST replace them with real FFIE assets — the
// branded hero illustration, real training photography, and partner logos.
// The `alt` text is the contract those real images have to meet (P7:
// representation — women, people of colour, a range of ages). Each item also
// takes an optional `imageUrl`, so dropping in a real asset is one line.

// The hero intro paragraph — the client page's own wording (translated), used
// verbatim so the screen matches their copy as well as their layout.
export const TRADE_INTRO =
  "Trades, career progression, teamwork, a modern and innovative sector full of opportunities to meet new people, ever more advanced skills — the electrical sector is booming today!";

// The branded hero illustration that sits under the accordion on the client
// page (an isometric connected-building scene). Placeholder until FFIE supplies
// the real artwork.
export const ILLUSTRATION = {
  seed: "ffie-trades-illustration",
  imageUrl: undefined as string | undefined,
  alt: "Isometric illustration of a connected, electrified building — solar panels, electric vehicle charging, lighting and network links",
};

// The rich content shown in the full-screen DETAIL MODAL when a domain row is
// tapped (mirrors the client page's expanded view: hero photo, a definition,
// an accent call-to-action heading, body copy, and a key-terms box). Filled in
// per-domain as FFIE supplies the real copy; a domain without `detail` falls
// back to its blurb + tags in the modal.
export type DomainDetail = {
  // Hero photo at the top of the sheet. Prefer a bundled `source`
  // (`require("../../assets/x.jpg")`) for a real shipped asset; `imageUrl` for
  // a CMS URL; otherwise the seeded picsum PLACEHOLDER (see IMAGERY note above)
  // shows. `alt` is the contract the real image must meet.
  image: { source?: ImageSourcePropType; seed: string; imageUrl?: string; alt: string };
  // Lead paragraph — the plain-language definition that opens the sheet.
  intro: string;
  // The accent sub-heading ("Become a player…") under the intro.
  heading: string;
  // Body paragraphs. `**term**` spans render bold for key vocabulary.
  body: string[];
  // The "Keywords" box at the foot of the sheet.
  keywords: { title: string; terms: string[] };
};

// The 5 specialization DOMAINS, named exactly as the client page lists them.
// Each row opens a detail modal (title + the `detail` content below); domains
// keep a short `blurb` + `tags` as the modal's fallback summary.
export type Domain = {
  id: string;
  title: string;
  blurb: string;
  /** A few concrete sub-areas, shown as small tags. */
  tags: string[];
  /** Rich modal content. Added per-domain as FFIE supplies the real copy. */
  detail?: DomainDetail;
};

export const DOMAINS: Domain[] = [
  {
    id: "energy",
    title: "Energy transition",
    blurb:
      "Solar panels, charging stations for electric vehicles, batteries and smart energy management — everything that electrifies heating, transport and housing.",
    tags: ["Solar", "EV charging", "Storage"],
    detail: {
      image: {
        source: require("../../assets/domain-energy.jpg"),
        seed: "ffie-domain-energy",
        imageUrl: undefined,
        alt: "A hand holding a leafy sphere surrounded by renewable energy icons: solar, wind, electric charging, recycling",
      },
      intro:
        "Energy renovation covers all the work on a building that aims to reduce the energy consumption of its occupants or users (commercial premises).",
      heading: "Become a player in the energy transition",
      body: [
        "In the field of renewable energy and the energy transition, the integrator electrician installs **photovoltaic solar panels** and offers **self-consumption solutions** thanks to **energy storage batteries**.",
        "They advise and support their clients in **managing their consumption**, deploying **control and management systems** for **lighting, heating and air conditioning**.",
        "They also install **charging stations for electric vehicles**, for private individuals and in all dedicated spaces.",
      ],
      keywords: {
        title: "Keywords",
        terms: [
          "Photovoltaic",
          "Energy storage",
          "Self-consumption",
          "Charging of electric and plug-in hybrid vehicles",
          "Wind turbines",
          "Hydroelectricity",
          "Hydrogen",
        ],
      },
    },
  },
  {
    id: "buildings",
    title: "Connected buildings",
    blurb:
      "Smart buildings: lighting, heating, access and comfort that respond on their own. Home automation and building technical management.",
    tags: ["Home automation", "BMS", "IoT"],
    detail: {
      image: {
        source: require("../../assets/domain-buildings.jpg"),
        seed: "ffie-domain-buildings",
        imageUrl: undefined,
        alt: "Aerial view of a modern city at dusk, criss-crossed by glowing lines connecting the buildings — a symbol of the connected building",
      },
      intro: "Thanks to electricity, the building becomes smart.",
      heading: "Electricity at the heart of the smart building",
      body: [
        "This is also referred to as **building management systems (BMS)**: a computer system that controls and supervises the various electrical and mechanical equipment of a building — temperature (heating and cooling), lighting, electrical supply, security or fire protection systems.",
        "The electrician is involved in integrating this equipment: they become the **driving force behind the so-called smart, connected and controlled building**.",
        "Thanks to their training, the electrician can become a true BMS specialist.",
      ],
      keywords: {
        title: "Keywords",
        terms: [
          "Smart Building",
          "Home automation",
          "Sensors",
          "Connected home",
          "BMS",
          "IoT",
          "Positive-energy building",
          "Building management",
          "Artificial intelligence",
          "Data",
          "Comfort and security",
          "Smart building",
          "Energy performance",
          "Predictive maintenance",
        ],
      },
    },
  },
  {
    id: "networks",
    title: "Communication networks",
    blurb:
      "Fibre, Wi-Fi and 5G — the cabling that moves data around a building. The backbone of everything connected.",
    tags: ["Fibre", "5G", "Wi-Fi"],
    detail: {
      image: {
        source: require("../../assets/domain-networks.jpg"),
        seed: "ffie-domain-networks",
        imageUrl: undefined,
        alt: "A hand holding a smartphone displaying a connected-home app, in a kitchen surrounded by connected devices",
      },
      intro:
        "In the years to come, the internet, digital television, networks of connected objects, as well as the new needs and uses linked to the evolution of society and housing, will continue to grow considerably, both at home and in the office.",
      heading: "Electricity and communication networks",
      body: [
        "The electrician can specialize in **communication networks** and place themselves at the heart of **communication**.",
        "Remote control of objects, social networks, maintaining social ties, e-commerce, access to video, to cable… All these services circulate inside buildings thanks to **communication networks**, whose performance has kept improving in recent years.",
        "Some electrician training courses lead directly to these new skills.",
      ],
      keywords: {
        title: "Keywords",
        terms: [
          "Optical fibre",
          "5G",
          "Connection",
          "Cabling",
          "Information and communication technologies (ICT)",
          "Radio and television",
          "Computing",
          "Telecommunications",
          "Communication panel",
          "Home network",
          "Radio frequencies",
        ],
      },
    },
  },
  {
    id: "cyber",
    title: "Cybersecurity",
    blurb:
      "Protecting connected buildings and networks against intrusions — a fast-growing and highly sought-after area of the trade.",
    tags: ["Networks", "Security"],
    detail: {
      image: {
        source: require("../../assets/domain-cyber.jpg"),
        seed: "ffie-domain-cyber",
        imageUrl: undefined,
        alt: "Hands typing on a computer keyboard, surrounded by cybersecurity icons: padlocks, data and protection",
      },
      intro:
        "The digital evolution of electronic security systems — and in particular the deployment of digital and IT solutions enhanced by artificial intelligence — opens up new uses and new missions for integrator electricians.",
      heading: "Cybersecurity",
      body: [
        "Thanks to digital innovations, it is now possible to **anticipate**, to **rethink** prevention and alert scenarios, and to **rapidly redeploy** the necessary security measures.",
        "These security technologies transform the urban space into a **smart territory**. This is one of the **paths to the future for electricians**: specializing in this field to integrate, maintain, operate and secure the risks linked to **cyber threats** and the protection of **personal data**.",
      ],
      keywords: {
        title: "Keywords",
        terms: [
          "Cyber threats",
          "IT security",
          "Network security",
          "Application security",
          "Data storage",
          "Data protection",
          "Cyberattacks",
        ],
      },
    },
  },
  {
    id: "automation",
    title: "Automation",
    blurb:
      "Industrial automation and robotics — the systems that drive machines, production lines and processes.",
    tags: ["Robotics", "Control systems"],
    detail: {
      image: {
        source: require("../../assets/domain-automation.jpg"),
        seed: "ffie-domain-automation",
        imageUrl: undefined,
        alt: "A technician holding a laptop in a server room with blue lighting",
      },
      intro:
        "Industrial automation is a modern and innovative sector, where electronic, electrotechnical, mechanical or communication technologies are designed to operate machines or automated processes — mechanisms capable of running without human intervention.",
      heading: "Electricity and automation",
      body: [
        "The electrician can specialize in this promising field and become its operator: the one who **gives the instructions** and **programs the system**, and who knows how to interpret the **signals** that the controls send back.",
      ],
      keywords: {
        title: "Keywords",
        terms: [
          "Robotics",
          "Motorization",
          "Automatic electrical systems",
          "Electronics",
          "Electrotechnics",
          "Telecommunication",
          "Access control",
          "Video surveillance",
          "Video protection",
          "Safety and security",
          "Industrial automation",
          "Decarbonization",
          "Energy transition",
        ],
      },
    },
  },
];

// The federation's "métiers et formations" index. The "See more training"
// button under the training grid opens it (the page lists every diploma).
export const METIERS_PAGE = "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations";

// The two feature cards under the illustration (client: "7 Reasons…" and the
// "professions kit"). Each opens its source externally (P6 — no gate).
export type Feature = {
  id: string;
  title: string;
  blurb: string;
  url: string;
  /** Optional override for the "Learn more" affordance label, e.g. the kit
   *  card reads "Open the kit (PDF)" so users know the link is a download. */
  linkLabel?: string;
};

export const FEATURES: Feature[] = [
  {
    id: "reasons",
    title: "7 reasons to become an electrician",
    blurb:
      "Interested in the trade of integrator electrician, or simply intrigued? Here are 7 good reasons to train or apply.",
    url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/7-bonnes-raisons-de-devenir-electricien",
  },
  {
    id: "kit",
    title: "Discover the electrical trades",
    blurb:
      "An \"electrical trades kit\" to discover the trades, the training courses and the testimonials of young apprentices and company directors.",
    // The kit is a downloadable PDF (opens in the in-app browser, which renders
    // it inline). The label is set accordingly so users know what to expect.
    url: "https://www.ffie.fr/fileadmin/user_upload/KIT_METIERS_-_VERSION_WEB.pdf",
    linkLabel: "Open the kit (PDF)",
  },
];

// The training section heading + intro, then the training cards.
export const TRAINING_HEADING = "Discover the training for the trades of tomorrow!";
export const TRAINING_INTRO =
  "The electrician is today a true integrator — a multi-technician whose work is diverse and varied. They deploy solutions for connected buildings, new forms of mobility, renewable energy and energy performance, combining electricity and digital technology. These trades are modern, forward-looking and accessible at all qualification levels, with real prospects for advancement.";

// Rich content shown in the training DETAIL reader (pushed when a training
// card is tapped). Mirrors the News article reader's structure: a small accent
// chip, the title (the card's `title`), a muted meta line, then the body —
// paragraphs or rich lines where bold / link spans render (link spans open in
// the in-app browser). Filled in per-training as FFIE supplies the copy; a
// training without `detail` shows a "Details coming" placeholder in the reader.
// A training body block. Extends the News article's paragraph / rich-line
// model with two structural blocks the FFIE training pages use — section
// sub-headings and bulleted lists. Local to Trades, so the News reader is
// untouched. The first block renders as a larger "lead" line (like News).
export type TrainingBlock =
  | string // a plain paragraph
  | RichSegment[] // a rich line — bold / link spans, like a News article line
  | { heading: string } // an accent section sub-heading
  | { list: string[] }; // a bulleted list

export type TrainingDetail = {
  /** Small accent pill above the title (e.g. "Training", "Bac +2"). */
  chip?: string;
  /** Muted line under the title, where the News reader shows the date
   *  (e.g. "CAP level · 2 years"). */
  meta?: string;
  /** Body blocks — paragraphs, rich lines, sub-headings, and lists. */
  body: TrainingBlock[];
  /** Optional "Learn more →" external link at the foot of the reader. */
  link?: { label: string; url: string };
};

export type Training = {
  id: string;
  title: string;
  blurb: string;
  seed: string;
  imageUrl?: string;
  alt: string;
  /** Rich reader content. Added per-training as FFIE supplies the copy. */
  detail?: TrainingDetail;
};

export const TRAININGS: Training[] = [
  {
    id: "cap",
    title: "CAP Electrician",
    blurb: "This diploma leads directly to working life — with a job at the end of it.",
    seed: "ffie-train-cap",
    alt: "An apprentice electrician wiring a panel on a workbench, focused",
    detail: {
      meta: "CAP level · 2 years · after Year 10",
      body: [
        "The CAP is a vocational diploma prepared over 2 years after Year 10, full-time or through an apprenticeship. It leads to working life with a job at the end of it!",
        { heading: "My mission" },
        "With the CAP, the electrician integrates cable runs to which they connect the various electrical equipment to distribute electricity throughout buildings.",
        "The integrator electrician works on construction or renovation sites; they coordinate their work with that of the other workers. After studying the plans and diagrams concerning the laying of cables, they identify the future location of circuit breakers, panels or electrical cabinets. They then install the conduits and supports, lay the cable network, position the various equipment (switches, power outlets, heating appliances) and carry out the necessary connections.",
        "Once this work is complete, they carry out a series of tests to verify that the installation complies with the plans and diagrams provided from the outset. They take part in commissioning in the presence of the client and the site manager.",
        "Depending on the site, the electrician may also handle:",
        {
          list: [
            "the cabling of IT or telephony links,",
            "the integration and configuration of video surveillance,",
            "alarm systems,",
            "the management of heating and air conditioning.",
          ],
        },
        "The work is carried out under the responsibility of the site manager.",
        { heading: "Once I have my CAP, what do I do?" },
        [
          { text: "My areas of work. ", bold: true },
          {
            text: "The areas of the electrician's work are varied: building, industry, agriculture, services and infrastructure.",
          },
        ],
        [
          { text: "My strengths to succeed and progress. ", bold: true },
          {
            text: "Team spirit, rigour and a sense of responsibility are your main strengths. Opportunities are plentiful, and the chances of progressing to a team leader or site manager role are real.",
          },
        ],
        { heading: "And after my CAP, can I continue my studies?" },
        "After the CAP, it is possible to continue your training, under certain conditions: in 1 year with a complementary qualification (MC), or in 2 years with the vocational baccalaureate or a vocational certificate (BP).",
        { heading: "Testimonial — Gaspard, 18 years old" },
        "\"After Year 10, I wanted to leave the traditional school path to learn a trade. Very quickly, I wanted to do a CAP in electricity: I was meticulous and rigorous, and I knew I would find work quickly.",
        "Once I had obtained my CAP, I did indeed find a job right away with a tradesperson, who always supported me and taught me to develop my skills in the field.",
        "After a year, my boss asked me if I wanted to resume my studies through an apprenticeship. I said yes straight away: I am now doing a vocational baccalaureate as an apprentice. I alternate periods at school and, most of the time, I am out in the field. It's completely different from secondary school studies… I can put my knowledge into practice.\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/cap-electricien",
      },
    },
  },
  {
    id: "bacpro",
    title: "Vocational Baccalaureate MELEC",
    blurb: "With the MELEC vocational baccalaureate, you get a job as soon as you graduate.",
    seed: "ffie-train-melec",
    alt: "A young female student working on an electrical training board",
    detail: {
      meta: "Baccalaureate level · 3 years · after Year 10 or a CAP",
      body: [
        "The vocational baccalaureate is prepared over 3 years after Year 10 (vocational Year 11, Year 12 and Year 13), in a vocational secondary school. It can also be prepared after a CAP in the same specialty (CAP electrician), under certain conditions, or after a general and technological Year 11.",
        { heading: "I have a MELEC vocational baccalaureate — what will my job be?" },
        "This diploma can be prepared through an apprenticeship or at school. The vocational baccalaureate prepares students to enter working life, but also allows them to continue their studies, notably with a BTS.",
        "With the MELEC vocational baccalaureate, in any case it means a job as soon as you graduate!",
        { heading: "My mission" },
        "With this diploma, you will contribute to the energy performance of buildings and installations.",
        "Your mission will be closely linked to the evolution of techniques, technologies, methods and equipment. You will take part in the analysis of occupational risks and in implementation, acting as the guarantor of compliance with health and safety requirements at work.",
        "You will implement environmental regulations and propose technical solutions that minimize the impact on the environment.",
        "You will actively take part in the company's quality approach and play a role in the economic management of the work carried out.",
        "Your role will be decisive at every stage: before the work, for commissioning and for maintenance.",
        { heading: "My areas of work" },
        "The MELEC vocational baccalaureate is a versatile training course that allows you to work in many sectors of activity and a wide variety of organizations, and that leads to a multitude of trades:",
        {
          list: [
            "Sectors of activity: networks (production, transmission, distribution and management of electrical energy), building, industry, services, infrastructure, neighbourhoods and business zones, autonomous and embedded energy systems…",
            "Employers: artisanal and industrial companies, local authorities and government bodies.",
            "Trades: artisan electrician, electrotechnician, installation, maintenance or repair technician (home automation, alarms, optical fibre, cable, IT or telecommunications networks).",
          ],
        },
        { heading: "My strengths to succeed in my work" },
        "Good interpersonal skills to communicate with your professional environment (client, management, team, other contributors…), rigour and a sense of listening, with a strong taste for new technologies.",
        "Team spirit and a willingness to help others, to fit in well on a site.",
        { heading: "And after my vocational baccalaureate, what are the prospects?" },
        "After a few years of experience, you will be able to coordinate a team activity.",
        "Even though the vocational baccalaureate's primary aim is professional integration, continuing studies is possible with a BTS if you have a good record or a distinction in the exam. Specialization is also possible with a complementary qualification.",
        "Note: it is in maintenance and technical advice that jobs are growing the fastest.",
        "Some possible further studies:",
        {
          list: [
            "MC Technician in electrical networks",
            "BTS Engineering technical assistance",
            "BTS Design and implementation of automated systems",
            "BTS Industrial control and automatic regulation",
            "BTS Fluids, energy, home automation — option A climate and fluid engineering",
            "BTS Fluids, energy, home automation — option B refrigeration and air conditioning",
            "BTS Fluids, energy, home automation — option C home automation and communicating buildings",
            "BTS Systems maintenance — option A production systems",
            "BTS Systems maintenance — option C wind systems",
          ],
        },
        { heading: "Testimonial — Paul, 21 years old" },
        "\"After obtaining the MELEC vocational baccalaureate, I quickly found a position in a company in my region. In fact, I had several offers and I chose the company closest to my home.",
        "For almost a year now, I have been an electrotechnician in an electrical company specializing in fitting out new homes.",
        "My work is varied, teamwork is motivating, you learn a lot from others! And then you move around: our activity takes us to change location quite often, there's no routine!",
        "Maybe I'll go back to studying to improve my skills… I think about it more and more!\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/bac-pro-melec",
      },
    },
  },
  {
    // Position 3 mirrors the FFIE site's "BEP" entry, which has no detail page
    // on ffie.fr. With no `detail`, the card renders NON-interactive (muted,
    // not tappable) — an honest placeholder until/if FFIE publishes a fiche.
    id: "bep",
    title: "BEP Electrical trades",
    blurb: "Fact sheet coming.",
    seed: "ffie-train-bep",
    alt: "An apprentice working on an electrical installation in a workshop",
  },
  {
    id: "bp",
    title: "BP Electrician",
    blurb: "Be immediately operational.",
    seed: "ffie-train-bp",
    alt: "An electrician installing an electrical panel in a home",
    detail: {
      meta: "Baccalaureate level · 2 years · after a CAP, work-study",
      body: [
        "A work-study programme, for a trade that's directly operational.",
        { heading: "How do I get onto a BP electrician course?" },
        "The BP is prepared over 2 years, after a CAP, and allows you to acquire a higher level of qualification (baccalaureate level). This diploma focuses on mastering and refining the electrician's trade. It is most often prepared through an apprenticeship, within a training centre (CFA).",
        { heading: "What will my work be with this diploma?" },
        "With this diploma, the electrician has the skills to work throughout the duration of a project: from building the structural shell (ducts, recesses and inserts…) to finishing work, commissioning and testing before handover. They will be able to open a site and ensure its execution, monitoring, control and handover.",
        "With the BP, the electrician will be autonomous and able, on a small site, to have one or two people under their responsibility. This training provides the ability to work throughout the lifecycle of the building and the networks (maintenance, repair). The electrician holding the BP will know how to comply with energy and environmental requirements and work with the other trades.",
        "They will also have basic economic and commercial knowledge to be able to manage a site and/or a company (costs, deadlines, solutions, communication).",
        { heading: "What will my areas of work be?" },
        "With the BP, the electrician implements and works on electrical installations and communication networks. The sectors of activity are numerous: networks (electrical energy, optical fibre, etc.), buildings in the residential, commercial and industrial sectors, charging stations for electric vehicles, photovoltaics… The areas of work are varied, at the heart of environmental and societal challenges.",
        { heading: "My strengths to succeed and progress" },
        "Team spirit, rigour and a sense of responsibility are your main strengths.",
        { heading: "Testimonial — Slimane, 19 years old" },
        "\"After taking a CAP in electricity, I continued by taking a BP. This diploma gave me complementary skills to gain autonomy and expertise. The electrician's trade has changed a lot: today, it's about making electrical energy smart so that users consume less and better. And then, I'm sure I'll always have a job, because electricity is everywhere!\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/bp-electricien",
      },
    },
  },
  {
    id: "sti2d",
    title: "STI2D Baccalaureate, EE option",
    blurb: "Passionate about technological innovation? This baccalaureate is made for you.",
    seed: "ffie-train-sti2d",
    alt: "Students working together on electronics in class",
    detail: {
      meta: "Technological baccalaureate · 2 years · Energy & Environment option",
      body: [
        "This technological baccalaureate gives a hands-on approach to the teaching of science, with many career opportunities at the end.",
        { heading: "Is the STI2D baccalaureate made for me?" },
        "Passionate about technological innovation and respect for the environment? The STI2D baccalaureate is made for you! It is the Sciences and Technologies of Industry and Sustainable Development baccalaureate.",
        "To move towards this stream, it is preferable to have chosen SI (engineering sciences) or CIT (technological creation and innovation) as an exploratory subject in Year 11.",
        "Note: the STI2D technological baccalaureate cannot be prepared through work-study.",
        { heading: "Teaching and subjects" },
        "The STI2D stream allows you to acquire extensive technological skills, transversal to all industrial fields, as well as in-depth skills in a field of specialty.",
        "The teaching is designed in an interdisciplinary way and closely linked to the sciences, which opens up possibilities for further studies. It is based on knowledge in three areas: energy, information and matter.",
        "Prepared over 2 years after a general or technological Year 11, the STI2D baccalaureate offers two specialties in the final year:",
        {
          list: [
            "Physics-chemistry and mathematics.",
            "Engineering, innovation and sustainable development — with a choice of one of the specific subjects: technological innovation and eco-design; information systems and digital; energy and environment; architecture and construction.",
          ],
        },
        "The programme combines observation, experimentation and theoretical reasoning. You will work on a project to build a prototype or a model.",
        { heading: "Career prospects" },
        "These courses lead to the trades of technician or engineer in electrotechnics, electronics, computing, mechanics, civil engineering or logistics.",
        "With the STI2D baccalaureate, a diverse and hands-on path awaits you, and the opportunity to enter forward-looking fields.",
        { heading: "My strengths to succeed" },
        "Good interpersonal skills, curiosity, a taste for new technologies and the desire to create and innovate…",
        { heading: "And after my STI2D baccalaureate, what are the prospects?" },
        "Top of the list for further studies after the STI2D baccalaureate: a BTS (over 2 years) or a BUT (a 3-year diploma that replaced the DUT). You can also apply, based on your record, to certain engineering schools (5 years) or to a few specialized schools.",
        { heading: "Other possible paths" },
        "A preparatory class for the grandes écoles (2 years), reserved for STI2D graduates, which allows you to enter an engineering school.",
        "Entry into a bachelor's degree (3 years) is possible. Note: university requires a good level in general subjects, autonomy and good writing skills.",
        "With the STI2D baccalaureate, a wide choice of short or long studies is available to you, particularly in the construction sector and the management of electricity and energy in general:",
        {
          list: [
            "BTS or DUT then a vocational bachelor's degree in construction, energy and the environment, paramedical fields, commerce, audiovisual, electronics and computing, telecommunications and digital, various constructions, maintenance, materials or mechanics.",
            "Bachelor's degree (science and technology, engineering sciences, mechanics, civil engineering), then a master's degree.",
            "TSI preparatory class (technology and industrial sciences) to enter engineering schools recruiting through joint competitive exams: Concours commun INP, CentraleSupélec, Epita-Ipsa-Esme.",
          ],
        },
        { heading: "Testimonial — Lucie, 21 years old" },
        "\"With my STI2D baccalaureate in hand, I chose to specialize in network and telecommunications management, and I applied through Parcoursup for the BUT (former DUT) in Networks and Telecommunications (R&T).",
        "This course offers a technological and professional mix. It allows you to develop knowledge and skills in computing for networks and telecommunications, in network administration (internet architecture, operation of virtualized systems, cloud…) and in telecommunications (mobile, Wi-Fi), as well as in cybersecurity. These subjects are complemented by courses in mathematics, electronics, physics, economics-management, communication and English.",
        "From the 3rd semester, four specialization tracks are offered to choose from, and we have to specialize.",
        "I chose cybersecurity: I am convinced that this field is going to grow enormously. After my BUT, I don't know yet — I might continue at university and do a master's degree.\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/bac-sti2d",
      },
    },
  },
  {
    id: "bts",
    title: "BTS Electrotechnics",
    blurb: "Put your scientific and technical skills to good use.",
    seed: "ffie-train-bts",
    alt: "A technician of African descent testing a circuit with a multimeter",
    detail: {
      meta: "BTS · 2 years · after a baccalaureate (vocational or STI2D)",
      body: [
        "Do you want to put your scientific and technological skills to good use to interpret and make use of the information obtained from trials, tests, simulations and implementations, and to carry out diagnostic and maintenance activities?",
        { heading: "Is the BTS Electrotechnics made for me?" },
        "You are interested in energy efficiency, the development of renewable energy and the digital environment.",
        "You have technical communication skills to describe an idea, a principle, a solution (product, process, system)…",
        "Don't hesitate: this diploma is made for you!",
        { heading: "Teaching and subjects" },
        "The BTS Electrotechnics is prepared over 2 years and is accessible to any holder of a baccalaureate: industrial vocational baccalaureate in electrotechnics, STI2D baccalaureate… Admission is based on your record, and possibly tests and/or an interview.",
        "The BTS is a diploma designed for direct professional integration; it is prepared at school or through an apprenticeship.",
        "With a good record or a distinction in the exam, it is possible to continue with a vocational bachelor's degree (electronics, energy, automation…), an LMD bachelor's degree (electronics, electricity…) or to enter an engineering school, possibly via an ATS preparatory class (post-bac+2). The subjects taught are mainly oriented towards electrical equipment.",
        "The training will allow you to acquire good knowledge in the field of electrical equipment. You will study, use, install and repair electrical equipment that is constantly evolving under the effect of advances in computing and electronics. Adapted to today's world, you will be able to work on highly specialized equipment (hydraulics, optics, pneumatics…).",
        { heading: "Career prospects" },
        "With this diploma in hand, you can become a site manager for electrical installations and direct the carrying out of electrical work, particularly in buildings.",
        "You will be the intermediary between the design office and the electrical fitters. At once technician, manager and team leader, you prepare, coordinate and oversee the work of the fitters on site, according to the required electrical authorizations.",
        "Your teams carry out the electrical installations of homes, government buildings, companies or industries. You will be the guarantor of compliance with the planned costs and deadlines.",
        { heading: "My strengths to succeed" },
        {
          list: [
            "Knowing how to work in a team as part of a project or site management approach.",
            "Being organized and autonomous.",
            "Having written and oral communication skills, including in English, to communicate and make a case.",
          ],
        },
        { heading: "And to go further after the BTS" },
        "Although it is not its primary purpose, it is possible to continue your studies after a BTS — you should then have a good record or a distinction in the exam.",
        "The most common progressions:",
        {
          list: [
            "Bachelor's degree in electronics, electrical energy, automation",
            "Vocational bachelor's degree in home automation",
            "Vocational bachelor's degree in energy and propulsion",
            "Vocational bachelor's degree in maintenance of industrial, production and energy systems",
            "Vocational bachelor's degree in energy management, electricity, sustainable development",
            "Vocational bachelor's degree in electrical and energy trades",
            "ATS preparatory class in industrial engineering",
            "Engineering degree (ESIEE Amiens, ESIEE Paris…)",
          ],
        },
        { heading: "Testimonial — Lucas, 24 years old" },
        "\"After obtaining my BTS Electrotechnics, I immediately found a job in an electrical company. I followed and learned a lot from my site manager, who is retiring in a few months: I hope I can replace him!",
        "It's a job I enjoy for its different missions and the new technologies that evolve site after site! I keep learning every day, and it's a real team effort.",
        "My pride? Walking past a finished building that I helped build!\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/bts-electrotechnique",
      },
    },
  },
  {
    id: "but",
    title: "BUT Electrical Engineering",
    blurb: "Drawn to the digital world? Get straight to the point.",
    seed: "ffie-train-but",
    alt: "A student of South Asian descent programming a control system",
    detail: {
      meta: "BUT · 3 years · after the baccalaureate (Bac+3)",
      body: [
        "Are you interested in the production of electrical energy (power plants, renewable energy), its distribution and its use (motors, actuators), but also in the digital processing of information and the systems (wired, programmed) that carry it out?",
        { heading: "Is the BUT GEII made for me?" },
        "With this diploma, you will be at the heart of the technologies and industrial computing that govern daily life. From household equipment to means of transport, you will be a higher technician who is immediately operational, able to analyse a system or take part in its design.",
        "With a command of computer-aided design and measuring instruments, you will be able to design a data acquisition and processing system, or a signal detection and transmission system — on both the hardware and software side.",
        { heading: "Modern and innovative worlds" },
        "In automation, you will be able to model, define the architecture and implement data transmission solutions between systems. You will assemble and operate power electrical equipment and their control systems, to produce energy or run automated processes.",
        "Since electronics, electrotechnics and industrial computing have penetrated most sectors, you can be recruited in aeronautics as well as in manufacturing and processing industries, microelectronics or healthcare… You will be able to work in research and development, production, maintenance, quality assurance or services, or even as a technical sales representative.",
        "You can also hold positions as a test engineer, manufacturing team leader, process specialist or industrial IT specialist. In microelectronics, you will most often be attached to a design-production activity.",
        { heading: "Teaching and subjects" },
        "The BUT (which replaced the DUT) prepares directly for professional integration; many BUT GEII graduates nevertheless continue their studies.",
        "The course includes general and scientific subjects and spans 1,800 hours of training. Vocationally focused, it includes a minimum of 10 weeks of placement. It can also be followed through work-study.",
        "In the second year, students choose a specialization:",
        {
          list: [
            "production and management of electrical and renewable energy,",
            "computing and electronics,",
            "automation, industrial systems and networks.",
          ],
        },
        "This includes notably: software tools, automation, networks, electronics, information systems, energy, business knowledge, English, mathematics and communication.",
        { heading: "Career prospects" },
        "The BUT GEII allows entry into working life as a higher technician (Bac+2) in traditional fields — electricity, electronics, telecommunications… — but also in sectors with major challenges: aeronautics, healthcare, transport, agri-food, ICT (information and communication technologies)…",
        "Holders can work as a team leader, developer in a design office, production manager, engineer's assistant, supervisory and management staff or technical sales representative.",
        { heading: "My strengths to succeed" },
        {
          list: [
            "Knowing how to work in a team as part of a project or site management approach.",
            "Being organized and autonomous.",
            "Having written and oral communication skills, including in English, to communicate and make a case.",
          ],
        },
        { heading: "And to go further after the BUT GEII" },
        {
          list: [
            "Bachelor's degree in electronics, electrical energy, automation",
            "Bachelor's degree in engineering sciences",
            "Vocational bachelor's degree in maintenance and technology: industrial control",
            "Vocational bachelor's degree in maintenance and technology: multi-technical systems",
            "Vocational bachelor's degree in electrical and energy trades",
            "Vocational bachelor's degree in industry trades: design and improvement of industrial processes and procedures",
          ],
        },
        { heading: "Testimonial — Émilie, 23 years old" },
        "\"After my STI2D baccalaureate, I chose to head towards a BUT GEII. For me, it was ideal, because I didn't yet know what I really wanted to do after the baccalaureate.",
        "This technological teaching allowed me to carry out real projects: it was from there that I became passionate about the technical side!",
        "The quality of the teaching made me want to continue towards a vocational bachelor's degree to specialize in programming and telecommunications. My goal: earn a distinction, get a place in an electronics and automation degree, and maybe enter an engineering school…",
        "This sector is fascinating, and the people I spend time with are too: I have no regrets!\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/but-bachelor-universitaire-technologique-genie-electrique-et-informatique-industrielle",
      },
    },
  },
  {
    id: "domotique",
    title: "Vocational Bachelor's — Home Automation",
    blurb: "Do you like controlling objects remotely? Click here.",
    seed: "ffie-train-domotique",
    alt: "A woman using a connected-home app to control a building",
    detail: {
      meta: "Vocational bachelor's · Bac+3 · after a BTS or a BUT",
      body: [
        "The national vocational bachelor's degree is at Bac+3 level; it is prepared at a secondary school, an IUT or a university.",
        { heading: "Is the home automation vocational bachelor's degree made for me?" },
        "Reformed at the end of 2019, its duration varies according to the entry level: baccalaureate, BTS or BUT.",
        "This bachelor's degree is made for you if you like controlling objects remotely and if you are passionate about \"smart\" energy, the kind that makes our environment more ecological and more comfortable.",
        "With this diploma, you will learn how to operate a heat pump remotely via the internet (by programming when it turns on and off), to control lighting by voice, or to trigger alarms in response to unwanted events…",
        "The home automation specialist installs smart systems: they control and program the connected objects of the home automatically and remotely.",
        { heading: "Modern and innovative worlds" },
        "Specialists are few in number, and therefore highly sought after: opportunities should grow massively in the years to come.",
        "From home automation for housing to building automation for offices, this specialty is found everywhere connected objects are present. You will have plenty of choice when it comes to where to work.",
        { heading: "Career prospects" },
        "With this vocational bachelor's degree, over 90% of graduates are quickly in work; 10% choose to continue their training.",
        "If you choose to work after obtaining the diploma, you will have a stable job and can quickly reach the level of higher technician, or even manager.",
        "You can also continue your studies, doing another vocational bachelor's degree or heading towards a master's degree.",
        { heading: "My strengths to succeed" },
        "Being organized and autonomous: the testimonials agree on a demanding work rhythm, with a lot of personal study.",
        "Having written and oral communication skills, including in English (to read the manuals), as well as sales and team-leading qualities.",
        { heading: "And to go further after the vocational bachelor's degree" },
        {
          list: [
            "Master's degree in electronics, electrical energy, automation",
            "Master's degree in energy and thermal engineering",
          ],
        },
        { heading: "Testimonial — Agathe, 22 years old" },
        "\"After my BTS Fluids, energy, home automation — option C \"home automation and communicating buildings\" —, I wanted to refine my skills in home automation by preparing a vocational bachelor's degree in this specialty.",
        "In one year, I worked hard and I obtained my diploma. I quickly found a job in the Paris region, in a design office, as a home automation specialist.",
        "I'm discovering that the smart building is limitless, and it fascinates me. Improving the quality of life of residents while taking care of the planet: few trades today offer these two aspects!",
        "And tomorrow, even more fields are going to develop, such as the maintenance and repair of connected objects.\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/licence-pro-mention-domotique",
      },
    },
  },
  {
    id: "energy-licence",
    title: "Vocational Bachelor's — Electricity & Energy",
    blurb: "Do you have an innovative vision of electricity? This diploma awaits you.",
    seed: "ffie-train-energy",
    alt: "A female engineer inspecting a rooftop solar installation",
    detail: {
      meta: "Vocational bachelor's · Bac+3 · after a BTS or a BUT",
      body: [
        "The national vocational bachelor's degree is at Bac+3 level; it is prepared at a secondary school, an IUT or a university.",
        { heading: "Is this vocational bachelor's degree made for me?" },
        "Entry is with a BTS (electronics, home automation, etc.) or a BUT in electrical engineering. It can be prepared through work-study.",
        "This bachelor's degree is made for you if you are interested in the management of power systems (energy distribution) as well as low-voltage systems (data distribution), if you have an innovative vision of electricity and if the combination of electricity and digital technology fascinates you.",
        "With this diploma, you will be qualified to present the technical and regulatory data on power and low-voltage systems (fire safety, telecoms, IT networks, building automation, centralized technical management…) and to organize and manage an operation economically.",
        "You will be able to propose and respond to tenders according to the needs of the project owner, and you will be the guarantor of the technical studies and their follow-up with the client.",
        { heading: "A promising diploma in a design office" },
        "Specialists are few in number, and therefore highly sought after: opportunities should grow massively in the years to come. You will quickly be managing several people.",
        { heading: "Career prospects" },
        "With this vocational bachelor's degree, 100% of graduates are quickly in work (within 3 months).",
        "Some choose to continue their studies to earn an engineering degree.",
        { heading: "My strengths to succeed" },
        {
          list: [
            "Being able to design or read diagrams.",
            "Knowing how to produce a calculation note.",
            "Inspecting electrical installations during the design and execution phases of the work.",
            "Carrying out electrical diagnostics of structures and equipment.",
            "Bringing a sense of customer service and developing your interpersonal skills.",
            "Keeping up with regulatory developments.",
            "Knowing how to manage a team of 3 to 5 people.",
          ],
        },
        { heading: "Testimonial — Antoine, 24 years old" },
        "\"After my BTS in electronics, I wanted to refine and specialize my skills, while combining power systems and low-voltage systems.",
        "The vocational bachelor's degree in electrical and energy trades met my expectations: it made me an electrotechnician.",
        "I have become a specialist in the applications of electricity: I design, analyse, install and handle the maintenance of electrical equipment.",
        "Today, I work in the automation of industrial equipment; tomorrow, I may be in the commercial or residential sector — there's no shortage of projects!\"",
      ],
      link: {
        label: "See the fact sheet on ffie.fr",
        url: "https://www.ffie.fr/les-metiers-de-lelectricite/metiers-et-formations/licence-pro-metiers-de-lelectricite-et-de-lenergie",
      },
    },
  },
];
