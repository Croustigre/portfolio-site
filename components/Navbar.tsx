"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "passions", label: "Passions & Extracurriculars" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPastHero(window.scrollY > window.innerHeight - 80);
      const sectionEls = sections.map((s) => document.getElementById(s.id));
      let current = "";
      sectionEls.forEach((el) => {
        if (el && window.scrollY >= el.offsetTop - 120) current = el.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!pastHero) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: "rgba(28, 51, 64, 0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Left: name */}
        <span
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(235,227,209,0.85)", letterSpacing: "0.14em" }}
        >
          Estéban Loubère
        </span>

        {/* Right: section links */}
        <div className="flex items-center gap-7">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
              className="relative text-sm tracking-wide transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: active === s.id ? "#E74F44" : "rgba(235,227,209,0.7)",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              {s.label}
              {active === s.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-px" style={{ background: "#E74F44" }} />
              )}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
