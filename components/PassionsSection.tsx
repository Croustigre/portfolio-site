"use client";

import RevealOnScroll from "@/components/RevealOnScroll";

const passions = [
  {
    icon: "⚙️",
    title: "Engineering & Innovation",
    description:
      "A deep passion for understanding how things work, from mechanical systems to the forces that drive technological progress.",
  },
  {
    icon: "🌏",
    title: "Multilingual & Multicultural",
    description:
      "Growing up speaking French and Mandarin has given me a unique cultural bridge and a global perspective on collaboration.",
  },
  {
    icon: "📚",
    title: "Lifelong Learning",
    description:
      "Whether it's a new programming language, a mathematical concept, or history: intellectual curiosity is the foundation of great engineering.",
  },
  {
    icon: "🏃",
    title: "Sports & Physical Challenge",
    description:
      "Sport teaches discipline, resilience, and teamwork, skills that translate directly into engineering and leadership.",
  },
];

const extracurriculars = [
  {
    period: "2024 to Present",
    role: "Student at Arts et Métiers ParisTech",
    org: "Programme Grande École",
    desc: "Rigorous engineering curriculum combining theory, practice, and professional development.",
    active: true,
  },
  {
    period: "Ongoing",
    role: "Personal Projects",
    org: "Self-directed",
    desc: "Building web applications and exploring computational tools to complement my engineering education.",
    active: false,
  },
  {
    period: "Ongoing",
    role: "Language Practice",
    org: "French · Mandarin · English",
    desc: "Maintaining fluency across three languages through reading, media, and international connections.",
    active: false,
  },
];

export default function PassionsSection() {
  return (
    <section id="passions" className="py-32 px-8" style={{ background: "#1C3340" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: "#E74F44", fontFamily: "var(--font-dm-sans)" }}>
            Beyond the classroom
          </p>
          <h2
            className="text-5xl lg:text-6xl font-bold mb-20"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
          >
            Passions &<br />Extracurriculars
          </h2>
        </RevealOnScroll>

        {/* Passions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-28">
          {passions.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.1}>
              <div
                className="p-6 h-full flex flex-col"
                style={{ background: "rgba(255,255,255,0.04)", borderRadius: "2px" }}
              >
                <span className="text-3xl mb-4">{p.icon}</span>
                <h3
                  className="text-base font-semibold mb-3"
                  style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(235,227,209,0.5)", fontWeight: 300 }}>
                  {p.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Timeline */}
        <RevealOnScroll>
          <h3
            className="text-3xl font-semibold mb-14"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
          >
            Experience & Activities
          </h3>
        </RevealOnScroll>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute top-2 bottom-2"
            style={{ left: "7px", width: "1px", background: "rgba(255,255,255,0.1)" }}
          />

          <div className="space-y-10 pl-10">
            {extracurriculars.map((e, i) => (
              <RevealOnScroll key={e.role} delay={i * 0.12} direction="left">
                <div className="relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute top-1.5 w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      left: "-2.6rem",
                      background: "#1C3340",
                      borderColor: e.active ? "#E74F44" : "rgba(143,170,182,0.4)",
                    }}
                  />
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#E74F44" }}>
                    {e.period}
                  </p>
                  <h4
                    className="text-lg font-semibold mb-0.5"
                    style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
                  >
                    {e.role}
                  </h4>
                  <p className="text-sm font-medium mb-2" style={{ color: "rgba(143,170,182,0.7)" }}>
                    {e.org}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(235,227,209,0.45)", fontWeight: 300 }}>
                    {e.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
