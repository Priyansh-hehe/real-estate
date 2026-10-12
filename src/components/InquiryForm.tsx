/**
 * ==============================================================================
 * PROPERTY DIRECT CONTACT CARD COMPONENT (InquiryForm.tsx)
 * ==============================================================================
 * Renders the primary direct-contact call-to-action on property detail pages.
 * Connects interested buyers directly to senior property consultants via:
 * 1. Instant WhatsApp chat (pre-filled with property title and price in Lakhs/Crores)
 * 2. 1-Tap direct phone dialing to 9414177565.
 *
 * Eliminates unnecessary database forms so all customer leads reach your phone instantly.
 * ==============================================================================
 */

"use client";

import { 
  PhoneCall, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin 
} from "lucide-react";
import { formatPrice } from "@/lib/format";

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
}

export default function InquiryForm({
  propertyId,
  propertyTitle,
  propertyPrice,
}: InquiryFormProps) {
  const contactNumber = "9414177565";
  const formattedPhone = "+91 94141 77565";
  const whatsappUrl = `https://wa.me/919414177565?text=${encodeURIComponent(
    `Hello Paliwal Properties, I am interested in "${propertyTitle}" listed for ${formatPrice(
      propertyPrice
    )}. Please share more details or arrange a site visit.`
  )}`;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Direct Property Advisory
          </span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Interested in this Property?
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          Talk directly with our senior consultant for clear title registry check, price negotiation & site visits.
        </p>
      </div>

      {/* 1-Click Instant Contact Actions */}
      <div className="space-y-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Chat on WhatsApp</span>
        </a>

        {/* Direct Call Button */}
        <a
          href={`tel:+91${contactNumber}`}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          <span>Direct Call ({formattedPhone})</span>
        </a>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11px] font-medium">100% Verified Registry & Freehold Titles</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-[11px]">Available Mon - Sat (9:00 AM - 8:00 PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-[11px]">Local Office: Kota, Rajasthan</span>
        </div>
      </div>
    </div>
  );
}
