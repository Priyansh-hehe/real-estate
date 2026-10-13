/**
 * ==============================================================================
 * GLOBAL FOOTER COMPONENT (src/components/Footer.tsx)
 * ==============================================================================
 * Site-wide bottom footer:
 * - Call to Action banner with 1-click WhatsApp and Direct Call to 9414177565.
 * - Legal copyright notice for Paliwal Properties, Kota, Rajasthan.
 * - Automatically hidden on /dashboard management pages.
 * ==============================================================================
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Sparkles } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const phoneNumber = "9414177565";
  const whatsappUrl = `https://wa.me/919414177565?text=${encodeURIComponent(
    "Hello Paliwal Properties, I would like to consult about verified properties in Kota."
  )}`;

  // Do not render consumer footer on management dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="w-full max-w-full overflow-hidden bg-zinc-900 text-zinc-300 border-t border-zinc-800 mt-auto">
      {/* Top Banner / Call to Action */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-zinc-900 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs sm:text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>25+ Years of Real Estate Trust in Kota</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to find your ideal plot, home, or commercial space?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Speak directly with our senior property consultants today. 100% verified registry guidance.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:+91${phoneNumber}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-950/40"
            >
              <Phone className="w-4 h-4" />
              <span>Call {phoneNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-zinc-800/80 py-4 px-4 sm:px-8 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Paliwal Properties. All rights reserved. Kota, Rajasthan.</p>
      </div>
    </footer>
  );
}
