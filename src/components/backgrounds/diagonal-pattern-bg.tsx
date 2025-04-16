import React from "react";

export default function DiagonalPatternBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden dark:bg-black">
      {/* Blurred purple circle */}
      <div
        className="absolute -top-[600px] left-1/2 translate-x-[-50%] w-[900px] h-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 35%, transparent 65%)",
          filter: "blur(100px)",
          opacity: 0.35,
        }}
      />
      {/* Blurred white circle */}
      <div
        className="absolute -top-[300px] left-1/2 translate-x-[-50%] w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--foreground) 35%, transparent 65%)",
          filter: "blur(220px)",
          opacity: 0.2,
        }}
      />

      {/* Diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(
            45deg,
            var(--primary) 12.5%,
            transparent 12.5%,
            transparent 50%,
            var(--primary) 50%,
            var(--primary) 62.5%,
            transparent 62.5%,
            transparent 100%
          )`,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
