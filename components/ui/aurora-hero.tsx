"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuroraHeroProps {
  children: React.ReactNode;
  className?: string;
}

export const AuroraHero = ({ children, className }: AuroraHeroProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden",
        className
      )}
      style={{ background: "#EBE3D1" }}
    >
      {/* Aurora blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Blob 1 — teal */}
        <div
          className="absolute rounded-full blur-3xl opacity-25"
          style={{
            width: "600px",
            height: "600px",
            top: "-15%",
            left: "-10%",
            background: "#284351",
            animation: "aurora-1 22s ease-in-out infinite",
          }}
        />
        {/* Blob 2 — coral */}
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: "500px",
            height: "500px",
            bottom: "-10%",
            right: "-5%",
            background: "#E74F44",
            animation: "aurora-2 26s ease-in-out infinite",
          }}
        />
        {/* Blob 3 — bordeaux, subtle */}
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: "350px",
            height: "350px",
            top: "40%",
            left: "50%",
            background: "#5E2325",
            animation: "aurora-3 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
