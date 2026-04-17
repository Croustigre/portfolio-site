"use client";

export default function Footer() {
  return (
    <footer className="relative py-14 px-8 overflow-hidden" style={{ background: "#284351" }}>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <p className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "rgba(235,227,209,0.9)" }}>
            Estéban Loubère
          </p>
          <p className="text-sm tracking-wide" style={{ color: "rgba(235,227,209,0.4)", fontWeight: 300 }}>
            Engineering Student · Arts et Métiers ParisTech
          </p>
        </div>
<div className="text-center lg:text-right">
          <p className="text-sm uppercase tracking-widest" style={{ color: "rgba(235,227,209,0.25)" }}>© 2026 · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
