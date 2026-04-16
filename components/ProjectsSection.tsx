"use client";

import RevealOnScroll from "@/components/RevealOnScroll";

const projects = [
  {
    number: "01",
    title: "Engineering Design Project",
    category: "Mechanical Engineering",
    description:
      "Design and development of a mechanical system as part of the Arts et Métiers engineering curriculum. Applied CAD modeling, finite element analysis, and manufacturing principles.",
    tags: ["CAD", "FEA", "Manufacturing", "Team Project"],
  },
  {
    number: "02",
    title: "Computational Fluid Dynamics Study",
    category: "Applied Physics",
    description:
      "Simulation and analysis of fluid flow patterns using numerical methods. Applied theoretical knowledge to real-world engineering challenges.",
    tags: ["CFD", "Python", "Simulation", "Research"],
  },
  {
    number: "03",
    title: "Portfolio Website",
    category: "Web Development",
    description:
      "This very portfolio, built with Next.js, Tailwind CSS, and Framer Motion to showcase my background and ambitions to US universities.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-8" style={{ background: "#284351" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: "#E74F44", fontFamily: "var(--font-dm-sans)" }}>
            What I&apos;ve built
          </p>
          <h2
            className="text-5xl lg:text-6xl font-bold mb-20"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
          >
            Projects
          </h2>
        </RevealOnScroll>

        <div className="space-y-4">
          {projects.map((p, i) => (
            <RevealOnScroll key={p.number} delay={i * 0.1}>
              <div
                className="group relative p-8 lg:p-10 cursor-default transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", borderRadius: "2px" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {/* Left coral bar on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "#E74F44" }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_40px] gap-6 items-start">
                  {/* Number */}
                  <span
                    className="text-3xl font-bold select-none"
                    style={{ fontFamily: "var(--font-playfair)", color: "rgba(231,79,68,0.25)", lineHeight: 1 }}
                  >
                    {p.number}
                  </span>

                  {/* Content */}
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(143,170,182,0.7)" }}>
                      {p.category}
                    </p>
                    <h3
                      className="text-xl font-semibold mb-3"
                      style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(235,227,209,0.55)", fontWeight: 300 }}>
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs"
                          style={{
                            background: "rgba(143,170,182,0.1)",
                            color: "rgba(143,170,182,0.8)",
                            borderRadius: "2px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1"
                    style={{ background: "#E74F44" }}
                  >
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
