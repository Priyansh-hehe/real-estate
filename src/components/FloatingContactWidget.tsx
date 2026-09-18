"use client";

import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "9414177565";
  const formattedPhone = "+91 94141 77565";
  const whatsappUrl = `https://wa.me/919414177565?text=${encodeURIComponent(
    "Hello Paliwal Properties, I would like to inquire about properties in Kota."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5">
      {/* Expanded Quick Contact Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Quick Property Help</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Paliwal Properties • Kota</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <div>
                <p className="text-[10px] opacity-90">Instant WhatsApp</p>
                <p className="font-bold">{formattedPhone}</p>
              </div>
            </a>

            <a
              href={`tel:+91${phoneNumber}`}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <div>
                <p className="text-[10px] opacity-90">Direct Call</p>
                <p className="font-bold">{phoneNumber}</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button Bar */}
      <div className="flex items-center gap-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {/* Quick WhatsApp Pill */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp Us at 9414177565"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Quick Direct Call Pill */}
        <a
          href={`tel:+91${phoneNumber}`}
          aria-label="Call Us at 9414177565"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Call 9414177565</span>
        </a>
      </div>
    </div>
  );
}
