import Link from "next/link";
import { Phone, MessageCircle, MapPin, Mail, Sparkles, Clock, ShieldCheck, Heart, Building2, Layers } from "lucide-react";

export default function Footer() {
  const phoneNumber = "9414177565";
  const formattedPhone = "+91 94141 77565";
  const whatsappUrl = `https://wa.me/919414177565?text=${encodeURIComponent(
    "Hello Paliwal Properties, I would like to consult about verified properties in Kota."
  )}`;

  return (
    <footer className="w-full bg-zinc-900 text-zinc-300 border-t border-zinc-800 mt-auto">
      {/* Top Banner / Call to Action */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-zinc-900 border-b border-zinc-800 py-8 px-4 sm:px-8">
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

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="text-xl font-black tracking-tight text-white inline-block">
            Paliwal Properties
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Kota&apos;s leading property consultancy specializing in transparent deals, verified land titles, residential plots, and premium commercial spaces.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Verified Documents & Clear Titles</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Explore Properties
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <Link href="/properties" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>All Listings Catalog</span>
              </Link>
            </li>
            <li>
              <Link href="/properties?view=map" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>Interactive Map Explorer</span>
              </Link>
            </li>
            <li>
              <Link href="/saved" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Saved Properties / Wishlist</span>
              </Link>
            </li>
            <li>
              <Link href="/?q=LAND" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span>Residential Plots & Land</span>
              </Link>
            </li>
            <li>
              <Link href="/?q=BUILDING" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Homes, Villas & Commercial</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Prime Kota Locations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Kota Prime Localities
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            {["Talwandi", "Vigyan Nagar", "Kunhari", "Rajiv Gandhi Nagar", "Borkheda", "Gumanpura"].map((loc) => (
              <li key={loc}>
                <Link href={`/?q=${encodeURIComponent(loc)}`} className="hover:text-blue-400 transition-colors">
                  Plots & Houses in {loc}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Everywhere */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Contact & Advisory
          </h4>
          <div className="space-y-2.5 text-xs text-zinc-300">
            {/* Phone */}
            <a
              href={`tel:+91${phoneNumber}`}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-white transition-colors border border-zinc-700/60"
            >
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-400 font-medium">Direct Phone Call</p>
                <p className="font-bold tracking-wide">{formattedPhone}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 transition-colors border border-emerald-800/50"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-emerald-400/80 font-medium">Instant WhatsApp Chat</p>
                <p className="font-bold text-white tracking-wide">{formattedPhone}</p>
              </div>
            </a>

            <div className="flex items-start gap-2 pt-1 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
              <span>Kota, Rajasthan, India</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </div>
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
