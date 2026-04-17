"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const BG = "#8FAAB6";

function slowScrollTo(target: number) {
  const start = window.scrollY;
  const distance = target - start;
  const duration = 1400;
  const startTime = performance.now();
  function step(now: number) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    window.scrollTo(0, start + distance * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px", background: BG }}
    >
      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden flex flex-col h-full relative">
        {/* Name top */}
        <div className="pt-10 px-6 z-10 relative">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-bold leading-[1.05]"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF", fontSize: "clamp(2.6rem, 12vw, 4rem)" }}
          >
            Estéban<br />Loubère.
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="origin-left mt-3"
            style={{ width: "44px", height: "3px", background: "#E74F44" }}
          />
        </div>

        {/* Photo */}
        <div className="flex-1 relative flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
            style={{ width: "min(340px, 72vw)", height: "100%" }}
          >
            <Image
              src="/photo-cutout-7.png"
              alt="Estéban Loubère"
              fill
              priority
              className="object-contain object-bottom"
              style={{ transform: "translateY(-30px)" }}
            />
          </motion.div>
        </div>

        {/* Bio + social bottom */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="px-6 z-10 relative"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#EBE3D1", fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}>
            Arts et Métiers ParisTech. French and Mandarin native, fluent in English. Pursuing graduate engineering studies in the United States.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => slowScrollTo(window.innerHeight)}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#E74F44", fontFamily: "var(--font-dm-sans)", background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              My story →
            </button>
            <a href="mailto:esteban.loubere@ensam.eu" className="opacity-70 hover:opacity-100 transition-opacity flex items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E74F44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/esteban-loubere" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity flex items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E74F44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:block">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 flex items-end justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="relative" style={{ width: "min(520px, 68vw)", height: "100%", transform: "translateY(40px)" }}>
            <Image
              src="/photo-cutout-7.png"
              alt="Estéban Loubère"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </motion.div>

        {/* Left: name */}
        <div
          className="absolute left-8 flex flex-col justify-center"
          style={{ top: "50%", transform: "translateY(-55%)", zIndex: 10 }}
        >
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="font-bold leading-[1.05]"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF", fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            Estéban
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            className="font-bold leading-[1.05]"
            style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF", fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            Loubère.
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
            className="origin-left mt-4"
            style={{ width: "52px", height: "3px", background: "#E74F44" }}
          />
        </div>

        {/* Bottom left: social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="absolute bottom-8 left-8 flex items-center gap-5"
          style={{ zIndex: 10 }}
        >
          <a href="mailto:esteban.loubere@ensam.eu" aria-label="Email" className="opacity-70 hover:opacity-100 transition-opacity" style={{ display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E74F44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", marginTop: "2px" }}>
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/esteban-loubere" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="opacity-70 hover:opacity-100 transition-opacity" style={{ display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E74F44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </motion.div>

        {/* Right: intro text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="absolute right-8 flex flex-col justify-center"
          style={{ top: "50%", transform: "translateY(-50%)", maxWidth: "min(260px, 28vw)", zIndex: 10 }}
        >
          <h2 className="font-bold leading-snug mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#FFFFFF", fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)" }}>
            Engineering Student,<br />based in France.
          </h2>
          <p className="leading-relaxed mb-6" style={{ color: "#EBE3D1", fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}>
            Arts et Métiers ParisTech. French and Mandarin native, fluent in English. Pursuing graduate engineering studies in the United States.
          </p>
          <button
            onClick={() => slowScrollTo(window.innerHeight)}
            className="flex items-center gap-2 font-medium transition-opacity duration-200 hover:opacity-70 cursor-pointer w-fit"
            style={{ color: "#E74F44", fontFamily: "var(--font-dm-sans)", background: "none", border: "none", padding: 0, fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}
          >
            My story →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
