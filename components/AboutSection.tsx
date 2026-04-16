"use client";

import RevealOnScroll from "@/components/RevealOnScroll";

const languages = [
  { lang: "French", level: "Native", pct: 100 },
  { lang: "Mandarin", level: "Native", pct: 100 },
  { lang: "English", level: "C1, Advanced", pct: 85 },
];

const facts = [
  { label: "Age", value: "20" },
  { label: "School", value: "Arts et Métiers ParisTech" },
  { label: "Campus", value: "Châlons-en-Champagne" },
  { label: "Program", value: "Grande École Engineering" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-8" style={{ background: "#1C3340" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: "#E74F44", fontFamily: "var(--font-dm-sans)" }}>
            Get to know me
          </p>
          <h2
            className="text-5xl lg:text-6xl font-bold mb-20"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
          >
            About Me
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* Left: Bio */}
          <div>
            <RevealOnScroll delay={0.1}>
              <div style={{ width: 48, height: 2, background: "#E74F44", marginBottom: "2rem" }} />
              <p className="text-lg leading-relaxed mb-6" style={{ color: "rgba(235,227,209,0.8)", fontWeight: 300 }}>
                I am{" "}
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>Estéban Loubère</span>,
                a 20-year-old engineering student at{" "}
                <span style={{ color: "#8FAAB6", fontWeight: 500 }}>Arts et Métiers ParisTech</span>,
                one of France&apos;s most prestigious Grande École institutions.
              </p>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "rgba(235,227,209,0.8)", fontWeight: 300 }}>
                Growing up speaking{" "}
                <span style={{ color: "#E74F44", fontWeight: 500 }}>French</span> and{" "}
                <span style={{ color: "#E74F44", fontWeight: 500 }}>Mandarin</span> as native languages
                has shaped my global perspective and drive for cross-cultural collaboration.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "rgba(235,227,209,0.8)", fontWeight: 300 }}>
                My ambition is to pursue advanced engineering studies in the{" "}
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>United States</span>,
                where I hope to combine the technical rigor of French engineering with
                the entrepreneurial spirit of American academia.
              </p>
            </RevealOnScroll>

            {/* Quick facts */}
            <RevealOnScroll delay={0.25}>
              <div className="mt-12 grid grid-cols-2 gap-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="p-4"
                    style={{ background: "rgba(255,255,255,0.04)", borderLeft: "2px solid #E74F44" }}
                  >
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(235,227,209,0.4)" }}>
                      {f.label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: "rgba(235,227,209,0.85)" }}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Languages + Values */}
          <RevealOnScroll delay={0.2} direction="right">
            <div style={{ width: 48, height: 2, background: "#E74F44", marginBottom: "2rem" }} />
            <h3
              className="text-2xl font-semibold mb-8"
              style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
            >
              Languages
            </h3>
            <div className="space-y-6 mb-14">
              {languages.map((l) => (
                <div key={l.lang}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-base font-medium" style={{ color: "rgba(235,227,209,0.9)" }}>{l.lang}</span>
                    <span className="text-sm" style={{ color: "rgba(235,227,209,0.4)" }}>{l.level}</span>
                  </div>
                  <div className="w-full h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${l.pct}%`,
                        background: l.pct === 100
                          ? "linear-gradient(to right, #8FAAB6, #E74F44)"
                          : "#E74F44",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}>
              Core Values
            </h3>
            <div className="flex flex-wrap gap-3">
              {["Innovation", "Rigor", "Cross-cultural collaboration", "Leadership", "Curiosity", "Excellence"].map((v) => (
                <span
                  key={v}
                  className="px-4 py-2 text-xs tracking-wide"
                  style={{
                    border: "1px solid rgba(143,170,182,0.35)",
                    color: "rgba(235,227,209,0.7)",
                    borderRadius: "2px",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
