"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormSkeleton } from "@/components/ui/Skeletons";

import { useToast } from "@/context/ToastContext";
import { Save } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_DISPLAY_PHONE } from "@/utils/constants";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  // Settings State
  const [shopName, setShopName] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [address, setAddress] = useState("");

  const fetchSettings = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      showToast(error.message, "error");
    } else if (data) {
      setShopName(data.shop_name);
      setAnnouncementEnabled(Boolean(data.announcement_enabled));
      setAnnouncementText(data.announcement_text || "✨ Free Insured Shipping Across India on Orders Above ₹999 | Order via WhatsApp ✨");

      setEmail(data.email || "");
      setPhone(data.phone || DEFAULT_WHATSAPP_DISPLAY_PHONE);
      setWhatsapp(data.whatsapp || DEFAULT_WHATSAPP_NUMBER);
      setInstagram(data.instagram || "https://instagram.com/nethieljewelry");
      setFacebook(data.facebook || "");
      setAddress(data.address || "Nethiel Luxury Studio, Kochi, Kerala, 682020");
    }
    setLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSettings();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName) {
      showToast("Shop name is required.", "error");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("settings").upsert({
      id: true,
      shop_name: shopName,
      announcement_enabled: announcementEnabled,
      announcement_text: announcementText || null,

      email: email || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      instagram: instagram || null,
      facebook: facebook || null,
      address: address || null,
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Settings saved successfully.", "success");
    }
    setSaving(false);
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div className="border-b border-neutral-200 dark:border-neutral-850 pb-6">
        <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
          Global Config
        </span>
        <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
          Website Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        {/* Announcement Bar Settings Block */}
        <div className="rounded-sm border border-[#A8D3F5] dark:border-neutral-800 bg-[#D0E6F7]/60 dark:bg-neutral-900/50 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#0284C7] uppercase">
                Header Banner
              </span>
              <h2 className="text-xs font-bold tracking-widest text-[#1E3A5F] dark:text-white uppercase mt-0.5">
                Top Announcement Bar
              </h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-neutral-600 peer-checked:bg-[#0284C7]" />
              <span className="ml-3 text-xs font-bold uppercase tracking-wider text-[#1E3A5F] dark:text-white">
                {announcementEnabled ? "ACTIVE" : "OFF"}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[#1E3A5F] dark:text-neutral-300 uppercase mb-1">
              Announcement Message
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. ✨ Free Insured Shipping Across India on Orders Above ₹999 | Order via WhatsApp ✨"
              className="block w-full rounded-sm border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-[#0284C7] focus:outline-none font-medium"
            />
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <span className="block text-[9px] font-bold tracking-widest text-neutral-500 uppercase mb-1.5">
              Live Preview Header Banner
            </span>
            {announcementEnabled ? (
              <div className="bg-[#0284C7] text-white py-2 px-4 rounded-xs text-center text-xs font-semibold tracking-wide flex items-center justify-center space-x-2 shadow-xs">
                <span>{announcementText || "✨ Special Announcement Here ✨"}</span>
              </div>
            ) : (
              <div className="bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-2 px-4 rounded-xs text-center text-xs italic">
                Announcement bar is currently DISABLED and hidden from storefront.
              </div>
            )}
          </div>
        </div>
        <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Brand Identity
          </h2>



          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Shop Name
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. NETHIEL JEWELRY"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Public Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@teex.com"
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Public Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555 123 4567"
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              WhatsApp Number (For Purchasing Redirects)
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="e.g. 15551234567 (Digits only, include country code)"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 font-mono text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Physical Shop Address
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Fashion Ave, Suite 456, New York, NY"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Social Media Channels
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/teex"
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/teex"
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 rounded-sm select-none"
        >
          <Save size={14} />
          <span>{saving ? "Saving Changes..." : "Save Config"}</span>
        </button>
      </form>
    </div>
  );
}
