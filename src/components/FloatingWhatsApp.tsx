'use client';

import React from 'react';

export default function FloatingWhatsApp() {
  // Replace with the actual WhatsApp number
  const phoneNumber = '923001234567'; 
  const message = 'Hello! I am interested in your dental instruments.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[999] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.146.564 4.232 1.637 6.071L.18 24l6.046-1.584A11.954 11.954 0 0012.031 24c6.645 0 12.03-5.386 12.03-12.031C24.062 5.386 18.677 0 12.031 0zm0 22.015c-1.815 0-3.585-.487-5.143-1.409l-.369-.219-3.821 1.002 1.018-3.725-.24-.383c-1.014-1.616-1.55-3.486-1.55-5.419 0-5.556 4.52-10.076 10.076-10.076 5.555 0 10.075 4.52 10.075 10.076s-4.52 10.075-10.075 10.075zm5.526-7.533c-.303-.151-1.792-.885-2.071-.986-.279-.101-.482-.151-.685.151-.202.303-.782.986-.96 1.188-.178.202-.355.227-.658.076-.303-.151-1.281-.473-2.441-1.51-1.017-.909-1.703-2.032-1.88-2.335-.178-.303-.019-.467.132-.618.136-.136.303-.353.454-.53.151-.176.202-.303.303-.505.101-.202.05-.38-.025-.531-.076-.151-.685-1.653-.938-2.264-.247-.594-.497-.514-.685-.523-.178-.009-.382-.009-.585-.009-.202 0-.531.076-.81.38-.279.303-1.066 1.041-1.066 2.537 0 1.496 1.092 2.943 1.244 3.146.151.202 2.146 3.275 5.197 4.593.726.314 1.293.501 1.736.642.729.231 1.393.198 1.916.12.585-.088 1.792-.732 2.045-1.439.252-.707.252-1.313.176-1.439-.075-.126-.278-.202-.581-.353z" />
      </svg>
    </a>
  );
}
