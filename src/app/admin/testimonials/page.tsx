"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Modal from "@/components/ui/Modal";
import MediaUpload from "@/components/ui/MediaUpload";
import { useToast } from "@/context/ToastContext";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquareQuote,
} from "lucide-react";
import type { Testimonial } from "@/types/database.types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formReviewText, setFormReviewText] = useState("");
  const [formAvatarUrl, setFormAvatarUrl] = useState<string | null>(null);
  const [formActive, setFormActive] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) {
      console.warn("Testimonials table query:", error.message);
    }
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormName("");
    setFormLocation("");
    setFormRating(5);
    setFormReviewText("");
    setFormAvatarUrl(null);
    setFormActive(true);
    setFormDisplayOrder(0);
    setSelectedId(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setFormName(t.customer_name);
    setFormLocation(t.location || "");
    setFormRating(t.rating || 5);
    setFormReviewText(t.review_text);
    setFormAvatarUrl(t.avatar_url);
    setFormActive(t.active);
    setFormDisplayOrder(t.display_order || 0);
    setSelectedId(t.id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formReviewText.trim()) {
      showToast("Customer Name and Review Text are required.", "error");
      return;
    }
    setFormLoading(true);

    const payload = {
      customer_name: formName.trim(),
      location: formLocation.trim() || null,
      rating: formRating,
      review_text: formReviewText.trim(),
      avatar_url: formAvatarUrl || null,
      active: formActive,
      display_order: formDisplayOrder,
      updated_at: new Date().toISOString(),
    };

    const { error } = isEditing && selectedId
      ? await supabase.from("testimonials").update(payload).eq("id", selectedId)
      : await supabase.from("testimonials").insert([payload]);

    if (error) {
      showToast("Save failed: " + error.message, "error");
    } else {
      showToast(isEditing ? "Testimonial updated" : "Testimonial created", "success");
      setModalOpen(false);
      resetForm();
      fetchTestimonials();
    }
    setFormLoading(false);
  };

  const handleToggleActive = async (t: Testimonial) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ active: !t.active, updated_at: new Date().toISOString() })
      .eq("id", t.id);
    if (error) {
      showToast("Update failed", "error");
    } else {
      fetchTestimonials();
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", deleteId);
    if (error) {
      showToast("Delete failed: " + error.message, "error");
    } else {
      showToast("Testimonial deleted", "success");
      fetchTestimonials();
    }
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Client Testimonials
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage customer reviews shown on the homepage
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : testimonials.length === 0 ? (
        <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm p-16 text-center">
          <MessageSquareQuote size={32} className="mx-auto text-neutral-400 mb-3" strokeWidth={1.2} />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No testimonials created yet.</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Add client reviews to display in the home page testimonials carousel.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-4 text-xs font-semibold text-black dark:text-white underline underline-offset-4 cursor-pointer"
          >
            Add your first testimonial
          </button>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-850 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Review</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      {t.avatar_url ? (
                        <img src={t.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-neutral-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center">
                          {t.customer_name[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase">{t.customer_name}</p>
                        {t.location && <p className="text-[10px] text-neutral-500">{t.location}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-0.5 text-[#DFCB7F]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} fill={i < t.rating ? "#DFCB7F" : "none"} className={i < t.rating ? "text-[#DFCB7F]" : "text-neutral-300"} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 italic">“{t.review_text}”</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{t.display_order}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(t)}
                      className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        t.active
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {t.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{t.active ? "Active" : "Inactive"}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <button type="button" onClick={() => openEditModal(t)} className="p-1.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
                        <Edit2 size={14} />
                      </button>
                      <button type="button" onClick={() => confirmDelete(t.id)} className="p-1.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={isEditing ? "Edit Testimonial" : "Add Testimonial"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">Customer Name *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Ananya Sharma" className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">Location (optional)</label>
              <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Mumbai, India" className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">Rating (1 to 5 Stars)</label>
            <div className="flex items-center space-x-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormRating(star)}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <Star size={20} fill={star <= formRating ? "#DFCB7F" : "none"} className={star <= formRating ? "text-[#DFCB7F]" : "text-neutral-300"} />
                </button>
              ))}
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 ml-2">{formRating} Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">Review Text *</label>
            <textarea rows={4} value={formReviewText} onChange={(e) => setFormReviewText(e.target.value)} placeholder="Write customer testimonial review text here..." className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">Customer Avatar Image (optional)</label>
            <MediaUpload
              bucket="settings"
              value={formAvatarUrl}
              onChange={(val) => setFormAvatarUrl(val as string | null)}
              accept="image/png, image/jpeg, image/webp"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">Display Order</label>
              <input type="number" value={formDisplayOrder} onChange={(e) => setFormDisplayOrder(Number(e.target.value))} className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
            </div>
            <div className="flex items-center space-x-2 mt-5">
              <input type="checkbox" id="testimonial-active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="cursor-pointer" />
              <label htmlFor="testimonial-active" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider cursor-pointer">Active</label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">Cancel</button>
            <button type="button" onClick={handleSave} disabled={formLoading} className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-wider rounded-sm hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer">
              {formLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Testimonial"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Testimonial">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">Cancel</button>
            <button type="button" onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors cursor-pointer">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
