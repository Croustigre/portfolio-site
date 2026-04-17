"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TextDisperse } from "@/components/ui/text-disperse";
import { GlassButton } from "@/components/ui/glass-button";

/* ─── SVG canvas ──────────────────────────────────────────────────── */
const SVG_W  = 300;
const SVG_H  = 2900;

const CREAM = "#EBE3D1";
const TEAL  = "#284351";
const CORAL = "#E74F44";

/* ─── Anchors ─────────────────────────────────────────────────────────
   dotY   → target y coordinate; 11 values equally spaced from y=20
             to y=2100 (step ≈173px) → equal vertical gaps between dots
   isLeft → text on LEFT (true) or RIGHT (false) of the thread
   offset → distance in px from the 50% centerline to the text inner edge
   Exact (x,y) is computed at runtime via binary search + getPointAtLength.
──────────────────────────────────────────────────────────────────── */
const STEP = (2820 - 20) / 12; // ≈ 233.3
const ANCHORS = [
  { dotY: Math.round(20 + STEP *  0.5), isLeft: true,  offset: 165 }, // 0
  { dotY: Math.round(20 + STEP *  1.5), isLeft: false, offset: 145 }, // 1
  { dotY: Math.round(20 + STEP *  2.5), isLeft: true,  offset: 165 }, // 2
  { dotY: Math.round(20 + STEP *  3.5), isLeft: false, offset: 145 }, // 3
  { dotY: Math.round(20 + STEP *  4.5), isLeft: true,  offset: 165 }, // 4
  { dotY: Math.round(20 + STEP *  5.5), isLeft: false, offset: 145 }, // 5
  { dotY: Math.round(20 + STEP *  6.5), isLeft: true,  offset: 165 }, // 6
  { dotY: Math.round(20 + STEP *  7.5), isLeft: false, offset: 145 }, // 7
  { dotY: Math.round(20 + STEP *  8.5), isLeft: true,  offset: 165 }, // 8
  { dotY: Math.round(20 + STEP *  9.5), isLeft: false, offset: 145 }, // 9
  { dotY: Math.round(20 + STEP * 10.5), isLeft: true,  offset: 165 }, // 10
];

/* ─── Path ──────────────────────────────────────────────────────────── */
const PATH = "M150 20 C140 101,200 155,160 235 C120 316,60 262,80 397 C100 532,260 424,240 639 C220 801,120 720,110 935 C100 1097,220 1151,180 1272 C140 1393,40 1339,60 1541 C80 1743,240 1609,200 1878 C170 2080,80 2012,120 2282 C160 2484,230 2282,180 2820";

/* ─── Highlighted phrases per item (index-matched to ITEMS) ──────── */
const HIGHLIGHTS: readonly (readonly string[])[] = [
  /* 01 */ ["engineering student at Arts et Métiers", "French and Mandarin as native languages", "Industrial Engineering and Operations Research"],
  /* 02 */ ["Programme Grande École", "Baccalauréat Général with Honours", "two years of Classes Préparatoires aux Grandes Écoles"],
  /* 03 */ ["optimise the preparation of a polyacrylamide hydrogel for atmospheric water harvesting"],
  /* 04 */ ["consolidating functional requirements, selecting and justifying technical solutions through comparative analysis, and pre-dimensioning the main components"],
  /* 05 */ ["redesign of metal cyclist miniatures at 1/43 scale for Fonderie Roger", "3D modeling of the cyclist body"],
  /* 06 */ ["full manufacturing cycle of an industrial mixer bearing, from raw casting to dimensional inspection", "define the process plans, workholding setups, and cutting parameters"],
  /* 07 */ ["70,000 spectators accumulated since 1995", "I played the role of Ajax I", "responsible for the installation and calibration of all stage lighting equipment", "member of the logistics team"],
  /* 08 */ ["I raced at departmental and national level in dinghy sailing", "1st place finish at a departmental event"],
  /* 09 */ ["I organised a temporary thrift shop", "promote more sustainable habits"],
  /* 10 */ ["student-run consulting firm of ENSAM, ranked #1 among French engineering school junior enterprises in 2024", "drive the visibility and brand presence of the firm"],
  /* 11 */ ["compete at the Monaco Energy Boat Challenge (MEBC) 2027, organised by the Yacht Club de Monaco", "3.5 million people across 70 countries", "zero-emission electric catamaran", "member of the sponsorship team"],
];

/* ─── Flippable items (0-indexed) ────────────────────────────────── */
const FLIPPABLE = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]);

const BACK_CONTENT: Record<number, React.ReactNode> = {
  2: (
    <iframe
      src="/api/docs/tipe"
      style={{ width: "100%", height: "420px", border: "none", borderRadius: "2px", display: "block" }}
      title="TIPE — Estéban Loubère"
    />
  ),
  3:  (
    <iframe
      src="/api/docs/reducteur"
      style={{ width: "100%", height: "420px", border: "none", borderRadius: "2px", display: "block" }}
      title="Rapport Réducteur"
    />
  ),
  4:  (
    <iframe
      src="/api/docs/figurines"
      style={{ width: "100%", height: "420px", border: "none", borderRadius: "2px", display: "block" }}
      title="Rapport Figurines"
    />
  ),
  5:  (
    <iframe
      src="/api/docs/fabrication"
      style={{ width: "100%", height: "420px", border: "none", borderRadius: "2px", display: "block" }}
      title="Rapport Fabrication"
    />
  ),
  6:  (
    <img
      src="/theater.jpg"
      alt="Theater — Compagnie du Graal"
      style={{ width: "100%", borderRadius: "2px", display: "block", objectFit: "cover" }}
    />
  ),
  7:  (
    <img
      src="/sailing.jpg"
      alt="Competitive Sailing"
      style={{ width: "100%", borderRadius: "2px", display: "block", objectFit: "cover" }}
    />
  ),
  8: (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <img
        src="/friperie-1.jpeg"
        alt="Friperie éphémère — 1"
        style={{ width: "50%", borderRadius: "2px", objectFit: "cover", display: "block" }}
      />
      <img
        src="/friperie-2.jpeg"
        alt="Friperie éphémère — 2"
        style={{ width: "50%", borderRadius: "2px", objectFit: "cover", display: "block" }}
      />
    </div>
  ),
  9: (
    <img
      src="/amje.jpeg"
      alt="Arts et Métiers Junior Études"
      style={{ width: "100%", borderRadius: "2px", display: "block", objectFit: "cover" }}
    />
  ),
  10: (
    <div style={{ display: "flex", gap: "0.6rem" }}>
      <img
        src="/mebc-boat-2.jpg"
        alt="Regatt'Arts — Monaco Energy Boat Challenge"
        style={{ width: "50%", borderRadius: "2px", display: "block", objectFit: "cover" }}
      />
      <iframe
        src="/api/docs/mebc"
        style={{ width: "50%", height: "340px", border: "none", borderRadius: "2px", display: "block" }}
        title="Brochure Sponsoring MEBC"
      />
    </div>
  ),
};

const FlipIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={CORAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "0.35rem" }}>
    <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

/* ─── Render body text with inline orange highlights ─────────────── */
function renderBody(text: string, phrases: readonly string[]) {
  if (!phrases.length) return <>{text}</>;
  const escaped = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        phrases.includes(part)
          ? <span key={i} style={{ color: CORAL, fontWeight: 400 }}>{part}</span>
          : part
      )}
    </>
  );
}

/* ─── Content ─────────────────────────────────────────────────────── */
const ITEMS = [
  {
    id: "about", label: "01", tag: "",
    title: "About me",
    body: "I am a 20-year-old first-year engineering student at Arts et Métiers, one of France's most prestigious engineering schools. Before that, I completed two years of intensive scientific preparatory classes (PT track) at Lycée Ferdinand Buisson in Voiron, Isère.\nI grew up between two cultures: my father is French, my mother is Taiwanese, and I have the privilege of speaking both French and Mandarin as native languages. This dual identity informs the way I think, the way I connect with people, and the way I approach complexity.\nI am particularly interested in Industrial Engineering and Operations Research — a field that combines mathematical optimisation, system design, and operational efficiency. I am drawn to its applications in semiconductor manufacturing and global supply chain management, where rigorous analytical thinking meets real industrial impact.",
  },
  {
    id: null, label: "02", tag: "",
    title: "Education",
    body: "I graduated in 2022 from Lycée Saint Joseph La Salle in Thonon-les-Bains with a Baccalauréat Général with Honours in mathematics, physics-chemistry, and life sciences. I then completed two years of Classes Préparatoires aux Grandes Écoles (PTSI–PT) at Lycée Ferdinand Buisson in Voiron, an intensive programme in mathematics, physics, engineering science, and computer science preparing for entrance exams to France's top engineering schools. In 2024, I was admitted to Arts et Métiers ParisTech, where I am currently pursuing the Programme Grande École, a three-year Master of Engineering covering solid mechanics, materials science, mechanical design, electronics, and computer science.",
  },
  {
    id: null, label: "03", tag: "Project",
    title: "Atmospheric water harvesting using hygroscopic hydrogels",
    body: "Motivated by growing global water scarcity, I investigated how to optimise the preparation of a polyacrylamide hydrogel for atmospheric water harvesting. Building on a MIT research publication, I designed experiments to determine the effect of NaCl concentration on water recovery and salt diffusion, processed results using Python, and developed numerical simulations of the hydrogel's swelling behaviour. The key finding was that a NaCl concentration of ~0.10 g/mL offers the best balance between water uptake, fabrication time, and cost. This project was conducted in direct collaboration with an external researcher from MIT, entirely in English.",
  },
  {
    id: null, label: "04", tag: "Project",
    title: "Preliminary design, dimensioning and 3D modeling of a 12.5 kW industrial gear reducer",
    body: "As part of a team project at ENSAM Châlons-en-Champagne, I contributed to the preliminary design of a 12.5 kW single-stage spur gear reducer with a 2.5 reduction ratio and a 16,000-hour service life requirement. My work involved consolidating functional requirements, selecting and justifying technical solutions through comparative analysis, and pre-dimensioning the main components — gear pair (ISO 6336), transmission shafts (beam model with Tresca criterion), rolling bearings (SKF catalogue), shaft seals, and keys. I also contributed to defining the housing architecture (cast aluminium, straddled bearing arrangement) and produced detailed assembly schematics and full-scale cross-sectional sketches of the complete system.",
  },
  {
    id: "projects", label: "05", tag: "Project",
    title: "Design and 3D modeling of a 1:43 scale cyclist figurine for casting manufacturing",
    body: "As part of a six-member engineering team, I contributed to the redesign of metal cyclist miniatures at 1/43 scale for Fonderie Roger, a Zamak die casting manufacturer. My responsibilities covered the 3D modeling of the cyclist body (Blender) and CAD research coordination, as well as material characterization planning through tensile and Charpy impact testing of the Zamak alloy. The project also involved identifying non-destructive testing methods — 3D scanning and X-ray tomography — for post-casting quality control. Deliverables included production-ready CAD files and a structured technical handover for casting trials.",
  },
  {
    id: null, label: "06", tag: "Project",
    title: "Manufacturing process analysis and industrialisation of a mixer bearing housing",
    body: "As part of a team project at ENSAM Châlons-en-Champagne, I went through the full manufacturing cycle of an industrial mixer bearing, from raw casting to dimensional inspection. This involved sand casting the blank (including mould study, core design, and metal pouring), followed by two machining phases — turning on a conventional lathe and milling on a 5-axis CNC machining centre — for which I helped define the process plans, workholding setups, and cutting parameters. The project concluded with dimensional quality control using a coordinate measuring machine (CMM), where we verified flatness, perpendicularity, and hole location tolerances, identifying casting-induced defects that caused several non-conformities on the final part.",
  },
  {
    id: null, label: "07", tag: "Passion",
    title: "Theater with the Compagnie du Graal",
    body: "As part of a three-week touring production of La Belle Hélène (after Offenbach) organised by the Compagnie du Graal — a well-established amateur theatre company based in Thonon-les-Bains with over 70,000 spectators accumulated since 1995 — I took on both artistic and technical responsibilities. On stage, I played the role of Ajax I, a comic and boastful Greek king paired with his inseparable counterpart Ajax II, appearing in several key scenes including the kings' contest and the deliberations over Menelaus' fate. Off stage, I was responsible for the installation and calibration of all stage lighting equipment, adapting the setup to a variety of historic outdoor venues including châteaux, abbeys and cloisters across the Haute-Savoie region. I also served as a member of the logistics team, contributing to set assembly, venue preparation and the overall coordination required to run a demanding itinerant production over nearly three weeks.",
  },
  {
    id: "passions", label: "08", tag: "Passion",
    title: "Competitive Sailing",
    body: "Competing for several years with the club of Sciez (Auvergne-Rhône-Alpes), I raced at departmental and national level in dinghy sailing, on Optimist and catamaran. I regularly took part in official regattas on the FFVoile calendar, competing against large fleets at both regional and national scale, including a 1st place finish at a departmental event. This experience sharpened my technical sailing skills, decision-making under pressure, and real-time strategic thinking — abilities that directly complement my engineering training through the applied understanding of physical parameters such as wind, currents, and trajectory optimisation.",
  },
  {
    id: null, label: "09", tag: "Extracurricular",
    title: "Sustainability representative in High School",
    body: "As Sustainability Representative at my high school, my role was to raise awareness and promote more sustainable habits within the school community. As part of this commitment, I organised a temporary thrift shop event on school grounds, inviting students to bring in second-hand clothes and give them a new life — encouraging a more conscious approach to consumption and reducing textile waste.",
  },
  {
    id: null, label: "10", tag: "Extracurricular",
    title: "Arts et Métiers Junior Étude",
    body: "As Marketing Officer at Arts et Métiers Junior Études — the student-run consulting firm of ENSAM, ranked #1 among French engineering school junior enterprises in 2024 — my role is to drive the visibility and brand presence of the firm. This involves producing LinkedIn posts, Instagram content, and written articles to communicate our projects, achievements, and values to both academic and professional audiences, and to attract new clients and talent.",
  },
  {
    id: null, label: "11", tag: "Extracurricular",
    title: "Monaco Energy Boat Challenge",
    body: "As part of the Regatt'Arts project — a student engineering team from Châlons-en-Champagne Arts et Métiers campus building a zero-emission electric catamaran to compete at the Monaco Energy Boat Challenge (MEBC) 2027, organised by the Yacht Club de Monaco — I serve as a member of the sponsorship team. My role consists of presenting the project to potential partners, both industrial and institutional, and securing support in the form of funding or products in exchange for visibility on the boat, social media, and at the event in Monaco. The MEBC is an internationally recognised sustainable propulsion competition, with the 2025 edition reaching over 3.5 million people across 70 countries, making it a compelling platform for partner brands.",
  },
] as const;

/* ─── Text block — outer div positioned by useEffect, inner motion.div animated ── */
function Block({ item, index }: { item: (typeof ITEMS)[number]; index: number }) {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { isLeft, offset } = ANCHORS[index];
  const canFlip  = FLIPPABLE.has(index);
  const [flipped, setFlipped] = useState(false);

  return (
    /* Outer wrapper: positioned absolutely; top is set by useEffect once the
       path length is known. Starts below the section so useInView doesn't fire early. */
    <div
      data-block={index}
      id={item.id ?? undefined}
      style={{
        position: "absolute",
        top: SVG_H + 100,
        ...(isLeft
          ? { right: `calc(50% + ${offset}px)` }
          : { left:  `calc(50% + ${offset}px)` }),
        width: "clamp(180px, calc(50vw - 185px), 480px)",
        zIndex: flipped ? 100 : 10,
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: isLeft ? -22 : 22 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* number + tag */}
        <div style={{
          marginBottom: "0.4rem",
          display: "flex", alignItems: "baseline", gap: "0.6rem",
          flexDirection: isLeft ? "row-reverse" : "row",
        }}>
          <span
            id={`num-${index}`}
            style={{
              fontFamily: "var(--font-dm-sans)", fontSize: "1.8rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: `${TEAL}60`, fontWeight: 300,
              transition: "color 0.4s ease",
            }}
          >{item.label}</span>
          {item.tag && <span
            id={`tag-${index}`}
            style={{
              fontFamily: "var(--font-dm-sans)", fontSize: "0.68rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: `${TEAL}55`, fontWeight: 500,
              transition: "color 0.4s ease",
            }}
          >{item.tag}</span>}
        </div>

        {/* title */}
        <div style={{ marginBottom: canFlip ? "0.25rem" : "0.55rem" }}>
          <h3 style={{
            fontFamily: "var(--font-playfair)", color: TEAL, fontWeight: 700,
            fontSize: "clamp(1rem, 1.7vw, 1.3rem)", lineHeight: 1.25,
            margin: 0, textAlign: "left",
          }}>{item.title}</h3>
        </div>

        {/* flip button — always below title */}
        {canFlip && (
          <div style={{ marginBottom: "0.55rem" }}>
            <GlassButton size="xs" onClick={() => setFlipped(f => !f)} contentClassName="p-0">
              <TextDisperse
                icon={FlipIcon}
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", letterSpacing: "0.06em", color: CORAL, padding: "0.2rem 0.65rem" }}
              >
                click to flip
              </TextDisperse>
            </GlassButton>
          </div>
        )}

        {/* body — flip card for flippable items */}
        {canFlip ? (
          <div style={{ perspective: "900px" }}>
            <div style={{
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}>
              {/* Front face */}
              <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                <p style={{
                  fontFamily: "var(--font-dm-sans)", color: `${TEAL}99`, fontWeight: 300,
                  fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)", lineHeight: 1.65,
                  whiteSpace: "pre-line", textAlign: "justify", margin: 0,
                }}>{renderBody(item.body, HIGHLIGHTS[index])}</p>
              </div>
              {/* Back face — only mounted once flipped to avoid PDF controls leaking through */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, minHeight: "100%",
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                ...(BACK_CONTENT[index] ? {
                  background: `${TEAL}0d`,
                  borderLeft: `2px solid ${CORAL}`,
                  padding: "0.6rem 0.7rem",
                  borderRadius: "2px",
                } : {}),
              }}>
                {flipped ? BACK_CONTENT[index] : null}
              </div>
            </div>
          </div>
        ) : (
          <p style={{
            fontFamily: "var(--font-dm-sans)", color: `${TEAL}99`, fontWeight: 300,
            fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)", lineHeight: 1.65,
            whiteSpace: "pre-line", textAlign: "justify",
          }}>{renderBody(item.body, HIGHLIGHTS[index])}</p>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Mobile row: left spacer (SVG overlay draws the line/dot) + right content ── */
const MobileRow = React.forwardRef<HTMLDivElement, { item: (typeof ITEMS)[number]; index: number; isLast: boolean }>(
  function MobileRow({ item, index }, ref) {
    const inViewRef = useRef<HTMLDivElement>(null);
    const isInView  = useInView(inViewRef, { once: true, margin: "-8% 0px" });
    const canFlip   = FLIPPABLE.has(index);
    const [flipped, setFlipped] = useState(false);

    return (
      <div ref={ref} style={{ display: "flex" }}>

        {/* ── Left: 28px spacer — SVG overlay replaces the dot/line ── */}
        <div style={{ width: "28px", flexShrink: 0 }} />

        {/* ── Right: content ── */}
        <motion.div
          ref={inViewRef}
          id={item.id ?? undefined}
          initial={{ opacity: 0, x: 10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ flex: 1, paddingLeft: "12px", paddingBottom: "2rem" }}
        >
          {/* number + tag */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span
              id={`m-num-${index}`}
              style={{
                fontFamily: "var(--font-dm-sans)", fontSize: "1.1rem", letterSpacing: "0.15em",
                color: `${TEAL}55`, fontWeight: 300,
                transition: "color 0.4s ease",
              }}
            >
              {item.label}
            </span>
            {item.tag && (
              <span
                id={`m-tag-${index}`}
                style={{
                  fontFamily: "var(--font-dm-sans)", fontSize: "0.68rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: `${TEAL}55`, fontWeight: 500,
                  transition: "color 0.4s ease",
                }}
              >
                {item.tag}
              </span>
            )}
          </div>

          {/* title */}
          <div style={{ marginBottom: canFlip ? "0.25rem" : "0.45rem" }}>
            <h3 style={{ fontFamily: "var(--font-playfair)", color: TEAL, fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.3, margin: 0 }}>
              {item.title}
            </h3>
          </div>

          {/* flip button */}
          {canFlip && (
            <div style={{ marginBottom: "0.45rem" }}>
              <GlassButton size="xs" onClick={() => setFlipped(f => !f)} contentClassName="p-0">
                <TextDisperse
                  icon={FlipIcon}
                  style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", letterSpacing: "0.06em", color: CORAL, padding: "0.2rem 0.65rem" }}
                >
                  click to flip
                </TextDisperse>
              </GlassButton>
            </div>
          )}

          {/* body / flip card */}
          {canFlip ? (
            <div style={{ perspective: "900px" }}>
              <div style={{
                position: "relative", transformStyle: "preserve-3d",
                transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}>
                <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <p style={{ fontFamily: "var(--font-dm-sans)", color: `${TEAL}99`, fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
                    {renderBody(item.body, HIGHLIGHTS[index])}
                  </p>
                </div>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, minHeight: "100%",
                  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  ...(BACK_CONTENT[index] ? { background: `${TEAL}0d`, borderLeft: `2px solid ${CORAL}`, padding: "0.6rem 0.7rem", borderRadius: "2px" } : {}),
                }}>
                  {flipped ? BACK_CONTENT[index] : null}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-dm-sans)", color: `${TEAL}99`, fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
              {renderBody(item.body, HIGHLIGHTS[index])}
            </p>
          )}
        </motion.div>
      </div>
    );
  }
);
MobileRow.displayName = "MobileRow";

/* ─── Inline grid layer (shared by both background layers) ─────── */
const GRID = 44;
function GridLayer({ id }: { id: string }) {
  return (
    <svg style={{ width: "100%", height: "100%" }}>
      <defs>
        <motion.pattern id={id} width={GRID} height={GRID} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke={TEAL} strokeWidth="1" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ─── Main section ───────────────────────────────────────────────── */
export default function TimelineSection() {
  /* ── Desktop refs ── */
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<SVGPathElement>(null);
  const markerRef  = useRef<SVGGElement>(null);

  /* ── Mobile refs ── */
  const mobileSectionRef   = useRef<HTMLElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileLineRef      = useRef<SVGPathElement>(null);
  const mobileTipRef       = useRef<SVGGElement>(null);
  const mobileRowRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileHeight, setMobileHeight] = useState(0);

  /* ── Desktop scroll animation ─────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const line    = lineRef.current;
    const marker  = markerRef.current;
    if (!line || !section) return;

    const TOTAL = line.getTotalLength();
    const EASE  = 0.09;

    line.style.strokeDasharray  = String(TOTAL);
    line.style.strokeDashoffset = String(TOTAL);
    if (marker) marker.style.opacity = "0";

    function findLen(targetY: number): number {
      let lo = 0, hi = TOTAL;
      for (let k = 0; k < 64; k++) {
        const mid = (lo + hi) / 2;
        if (line!.getPointAtLength(mid).y < targetY) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    }

    const lens: number[]        = [];
    const connEls: HTMLElement[] = [];

    ANCHORS.forEach((a, i) => {
      const len = findLen(a.dotY);
      const pt  = line!.getPointAtLength(len);
      lens.push(len);

      const dotEl = document.getElementById(`dot-${i}`);
      if (dotEl) {
        dotEl.setAttribute("cx", String(pt.x));
        dotEl.setAttribute("cy", String(pt.y));
      }

      const blockEl = section.querySelector(`[data-block="${i}"]`) as HTMLElement | null;
      if (blockEl) blockEl.style.top = `${pt.y - 8}px`;

      const isLeft   = a.isLeft;
      const off      = a.offset;
      const connLeft  = isLeft ? `calc(50% - ${off}px)`   : `calc(50% + ${pt.x - 150}px)`;
      const connWidth = isLeft ? `${pt.x - 150 + off}px`  : `${off + 150 - pt.x}px`;

      const connEl = document.createElement("div");
      connEl.id = `conn-${i}`;
      Object.assign(connEl.style, {
        position        : "absolute",
        zIndex          : "15",
        pointerEvents   : "none",
        top             : `${pt.y - 0.5}px`,
        left            : connLeft,
        width           : connWidth,
        height          : "1px",
        background      : `${TEAL}22`,
        transition      : "background 0.4s ease, transform 0.35s ease",
        transformOrigin : isLeft ? "right" : "left",
        transform       : "scaleX(0)",
      });
      section.appendChild(connEl);
      connEls.push(connEl);

      setTimeout(() => { connEl.style.transform = "scaleX(1)"; }, 300 + i * 60);
    });

    const thresholds = lens.map(len => len / TOTAL);

    let rendered = TOTAL;
    let target   = TOTAL;
    let rafId: number | null = null;

    function tick() {
      rendered += (target - rendered) * EASE;
      if (!line) return;
      line.style.strokeDashoffset = String(rendered);

      const drawn = TOTAL - rendered;
      if (marker) {
        if (drawn > 1) {
          const pt = line.getPointAtLength(drawn - 1);
          marker.setAttribute("transform", `translate(${pt.x},${pt.y})`);
          marker.style.opacity = "1";
        } else {
          marker.style.opacity = "0";
        }
      }

      if (Math.abs(rendered - target) > 0.1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rendered = target;
        line.style.strokeDashoffset = String(rendered);
        rafId = null;
      }
    }

    function onScroll() {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = maxScroll > 0 ? Math.min(scrolled / maxScroll, 1) : 0;

      target = TOTAL * (1 - progress);
      if (!rafId) rafId = requestAnimationFrame(tick);

      thresholds.forEach((threshold, i) => {
        const on   = progress >= threshold;
        const dot  = document.getElementById(`dot-${i}`);
        const conn = document.getElementById(`conn-${i}`);
        const num  = document.getElementById(`num-${i}`);
        const tag  = document.getElementById(`tag-${i}`);
        if (dot)  dot.style.fill        = on ? CORAL        : `${TEAL}60`;
        if (conn) conn.style.background  = on ? `${CORAL}55` : `${TEAL}22`;
        if (num)  num.style.color        = on ? CORAL        : `${TEAL}60`;
        if (tag)  tag.style.color        = on ? CORAL        : `${TEAL}55`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      connEls.forEach(el => el.remove());
    };
  }, []);

  /* ── Mobile scroll animation ──────────────────────────────────── */
  useEffect(() => {
    const section   = mobileSectionRef.current;
    const container = mobileContainerRef.current;
    if (!section || !container) return;

    const EASE = 0.09;
    let rendered    = 0;
    let targetDrawn = 0;
    let rafId: number | null = null;
    let total       = 0;
    const dotYs: number[] = [];

    function updatePositions() {
      total = container!.scrollHeight;
      setMobileHeight(total);

      dotYs.length = 0;
      mobileRowRefs.current.forEach(rowEl => {
        dotYs.push(rowEl ? rowEl.offsetTop + 5 : 0);
      });

      /* Update SVG dot positions directly on the DOM */
      dotYs.forEach((y, i) => {
        const el = document.getElementById(`m-dot-${i}`);
        if (el) el.setAttribute("cy", String(y));
      });

      /* Re-sync strokeDasharray after height change */
      const line = mobileLineRef.current;
      if (line && total > 0) {
        line.style.strokeDasharray  = String(total);
        line.style.strokeDashoffset = String(total - rendered);
      }
    }

    function tick() {
      rendered += (targetDrawn - rendered) * EASE;
      const line = mobileLineRef.current;
      const tip  = mobileTipRef.current;
      if (!line || total === 0) return;

      line.style.strokeDashoffset = String(total - rendered);

      if (tip) {
        if (rendered > 1) {
          tip.setAttribute("transform", `translate(14,${rendered})`);
          tip.style.opacity = "1";
        } else {
          tip.style.opacity = "0";
        }
      }

      dotYs.forEach((dotY, i) => {
        const on    = rendered >= dotY;
        const dotEl = document.getElementById(`m-dot-${i}`);
        const numEl = document.getElementById(`m-num-${i}`);
        const tagEl = document.getElementById(`m-tag-${i}`);
        if (dotEl) dotEl.style.fill  = on ? CORAL : `${TEAL}60`;
        if (numEl) numEl.style.color = on ? CORAL : `${TEAL}55`;
        if (tagEl) tagEl.style.color = on ? CORAL : `${TEAL}55`;
      });

      if (Math.abs(rendered - targetDrawn) > 0.1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rendered = targetDrawn;
        if (line) line.style.strokeDashoffset = String(total - rendered);
        rafId = null;
      }
    }

    function onScroll() {
      if (total === 0) return;
      const sectionTop    = section!.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section!.offsetHeight;
      const scrollable    = Math.max(sectionHeight - window.innerHeight, 1);
      const progress      = Math.min(Math.max((window.scrollY - sectionTop) / scrollable, 0), 1);

      targetDrawn = progress * total;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    /* Measure after first paint so layout is complete */
    requestAnimationFrame(updatePositions);

    const ro = new ResizeObserver(updatePositions);
    ro.observe(container);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <>
    {/* ── MOBILE LAYOUT ── */}
    <section
      id="timeline"
      ref={mobileSectionRef}
      className="lg:hidden"
      style={{ background: CREAM, paddingTop: "3.5rem", paddingBottom: "3rem" }}
    >
      <div
        ref={mobileContainerRef}
        style={{ position: "relative", maxWidth: "600px", margin: "0 auto", paddingLeft: "1rem", paddingRight: "1.25rem" }}
      >
        {/* SVG overlay — covers the 28px left spacer column of each row */}
        {mobileHeight > 0 && (
          <svg
            aria-hidden
            style={{
              position: "absolute",
              left: "1rem",
              top: 0,
              width: "28px",
              height: mobileHeight,
              pointerEvents: "none",
              zIndex: 10,
              overflow: "visible",
            }}
            viewBox={`0 0 28 ${mobileHeight}`}
          >
            {/* Ghost path */}
            <path
              d={`M 14 0 L 14 ${mobileHeight}`}
              fill="none"
              stroke={`${TEAL}18`}
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Animated drawn path */}
            <path
              ref={mobileLineRef}
              d={`M 14 0 L 14 ${mobileHeight}`}
              fill="none"
              stroke={TEAL}
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Anchor dots — cy set by updatePositions via DOM */}
            {ITEMS.map((_, i) => (
              <circle
                key={i}
                id={`m-dot-${i}`}
                cx="14"
                cy="0"
                r="4"
                style={{ fill: `${TEAL}60`, transition: "fill 0.4s ease" }}
              />
            ))}
            {/* Tip marker */}
            <g ref={mobileTipRef} style={{ opacity: 0 }}>
              <circle cx="0" cy="0" r="2.5" fill="none" stroke={TEAL} strokeWidth="0.7">
                <animate attributeName="r"              from="2.5" to="14" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" from="0.5" to="0"  dur="1.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="2.5" fill={TEAL} />
            </g>
          </svg>
        )}

        {ITEMS.map((item, i) => (
          <MobileRow
            key={i}
            item={item}
            index={i}
            isLast={i === ITEMS.length - 1}
            ref={el => { mobileRowRefs.current[i] = el; }}
          />
        ))}
      </div>
    </section>

    {/* ── DESKTOP LAYOUT ── */}
    <section
      id="timeline"
      ref={sectionRef}
      className="hidden lg:block"
      style={{ position: "relative", background: CREAM, height: SVG_H + 112, overflow: "hidden" }}
    >
      {/* Grid layer — always visible, subtle */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.05, pointerEvents: "none" }}>
        <GridLayer id="tl-grid-bg" />
      </div>

      {/* Thread SVG — centered strip */}
      <div style={{
        position: "absolute", left: "50%", top: 0,
        transform: "translateX(-50%)",
        width: SVG_W, height: SVG_H,
        pointerEvents: "none", zIndex: 5,
      }}>
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} overflow="visible">

          {/* Ghost path — always faintly visible */}
          <path d={PATH} fill="none"
            stroke={`${TEAL}18`} strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Drawing path — animated via strokeDashoffset */}
          <path ref={lineRef} d={PATH} fill="none"
            stroke={TEAL} strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Anchor dots */}
          {ANCHORS.map((_, i) => (
            <circle
              key={i}
              id={`dot-${i}`}
              cx="0" cy="0"
              r="4"
              style={{ fill: `${TEAL}60`, transition: "fill 0.4s ease" }}
            />
          ))}

          {/* Tip marker */}
          <g ref={markerRef} style={{ opacity: 0 }}>
            <circle cx="0" cy="0" r="2.5" fill="none" stroke={TEAL} strokeWidth="0.7">
              <animate attributeName="r"              from="2.5" to="14" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.5" to="0"  dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="2.5" fill={TEAL} />
          </g>

        </svg>
      </div>

      {/* Text blocks */}
      {ITEMS.map((item, i) => (
        <Block key={i} item={item} index={i} />
      ))}
    </section>
    </>
  );
}
