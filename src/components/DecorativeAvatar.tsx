"use client";

import Image from "next/image";

export function DecorativeAvatar() {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <Image
        src="/avatar.png.png"
        alt="Avatar decorativo"
        width={80}
        height={80}
        className="rounded-full shadow-lg"
      />
    </div>
  );
} 