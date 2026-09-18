"use client";

import { useState } from "react";
import { 
  PhoneCall, 
  MessageCircle, 
  Send, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Loader2,
  Sparkles
} from "lucide-react";
import { submitInquiryAction } from "@/app/actions/inquiry";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactNumber = "9414177565";
  const formattedPhone = "+91 94141 77565";
  const whatsappUrl = `https://wa.me/919414177565?text=${encodeURIComponent(
    `Hello Paliwal Properties, I am interested in "${propertyTitle}" listed for ₹${propertyPrice.toLocaleString(
      "en-IN"
    )}. Please share more details or arrange a site visit.`
  )}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("propertyId", propertyId);

    try {
      await submitInquiryAction(formData);
      setIsSubmitted(true);
      form.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
          <Sparkles className="w-4 h-4" />
        </span>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Interested in this Property?
        </h3>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
        Connect directly with senior consultants for registry verification & site visits.
      </p>

      {/* 1-Click Direct Contact Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Us</span>
        </a>

        <a
          href={`tel:+91${contactNumber}`}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call {formattedPhone}</span>
        </a>
      </div>

      <div className="relative flex py-2 items-center mb-4">
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
        <span className="flex-shrink mx-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Or Request Call Back / Visit
        </span>
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
      </div>

      {isSubmitted ? (
        <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-in fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 mb-1">
            Inquiry Received!
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Our team will call you shortly at your registered number.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-3 text-xs text-emerald-800 dark:text-emerald-300 underline font-medium"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Your Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
              <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                required
                placeholder="10-digit mobile number"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
              <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
              <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Message or Specific Requirement
            </label>
            <textarea
              name="message"
              rows={2}
              placeholder="e.g. Interested in scheduling a site visit this Sunday..."
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
