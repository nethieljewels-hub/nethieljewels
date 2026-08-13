"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Video,
  Upload,
  ExternalLink,
} from "lucide-react";

interface Reel {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  // Form
  const [formTitle, setFormTitle] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState<string | null>(null);
  const [formThumbnailUrl, setFormThumbnailUrl] = useState<string | null>(null);
  const [formActive, setFormActive] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState(0);

  const fetchReels = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reels")
      .select("*")
      .order("sort_order", { ascending: true });
    setReels(data || []);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("reels")
      .select("*")
      .order("sort_order", { ascending: true })
      .then((res: { data: Reel[] | null }) => {
        if (!cancelled) {
          setReels(res.data || []);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormTitle("");
    setFormVideoUrl(null);
    setFormThumbnailUrl(null);
    setFormActive(true);
    setFormSortOrder(0);
    setSelectedId(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (reel: Reel) => {
    setFormTitle(reel.title || "");
    setFormVideoUrl(reel.video_url);
    setFormThumbnailUrl(reel.thumbnail_url);
    setFormActive(reel.active);
    setFormSortOrder(reel.sort_order);
    setSelectedId(reel.id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `reels/${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("banners").upload(fileName, file, { upsert: true });
    if (error) {
      showToast("Failed to upload video: " + error.message, "error");
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(fileName);
    setFormVideoUrl(publicUrl);
    setUploading(false);
    showToast("Video uploaded successfully", "success");
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `reels/thumb_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("banners").upload(fileName, file, { upsert: true });
    if (error) {
      showToast("Failed to upload thumbnail: " + error.message, "error");
      setThumbnailUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(fileName);
    setFormThumbnailUrl(publicUrl);
    setThumbnailUploading(false);
    showToast("Thumbnail uploaded", "success");
  };

  const handleSave = async () => {
    if (!formVideoUrl) {
      showToast("Please upload a video or paste a video URL", "error");
      return;
    }
    setFormLoading(true);

    const payload = {
      title: formTitle || null,
      video_url: formVideoUrl,
      thumbnail_url: formThumbnailUrl || null,
      active: formActive,
      sort_order: formSortOrder,
      updated_at: new Date().toISOString(),
    };

    const { error } = isEditing && selectedId
      ? await supabase.from("reels").update(payload).eq("id", selectedId)
      : await supabase.from("reels").insert([payload]);

    if (error) {
      showToast("Save failed: " + error.message, "error");
    } else {
      showToast(isEditing ? "Reel updated" : "Reel added", "success");
      setModalOpen(false);
      resetForm();
      fetchReels();
    }
    setFormLoading(false);
  };

  const handleToggleActive = async (reel: Reel) => {
    const { error } = await supabase
      .from("reels")
      .update({ active: !reel.active, updated_at: new Date().toISOString() })
      .eq("id", reel.id);
    if (error) {
      showToast("Update failed", "error");
    } else {
      fetchReels();
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("reels").delete().eq("id", deleteId);
    if (error) {
      showToast("Delete failed: " + error.message, "error");
    } else {
      showToast("Reel deleted", "success");
      fetchReels();
    }
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">Video Reels</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage video reels shown on the homepage
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Reel</span>
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : reels.length === 0 ? (
        <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm p-16 text-center">
          <Video size={28} className="mx-auto text-neutral-400 mb-3" strokeWidth={1.2} />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No reels added yet.</p>
          <button type="button" onClick={openAddModal} className="mt-4 text-xs font-semibold text-black dark:text-white underline underline-offset-4 cursor-pointer">
            Add your first reel
          </button>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-850 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Preview</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
              {reels.map((reel) => (
                <tr key={reel.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-14 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      {reel.thumbnail_url ? (
                        <img src={reel.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <video src={reel.video_url} className="w-full h-full object-cover" muted playsInline />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                        {reel.title || <span className="text-neutral-400 italic">Untitled</span>}
                      </span>
                      <a href={reel.video_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-black dark:hover:text-white">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{reel.sort_order}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(reel)}
                      className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        reel.active
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {reel.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{reel.active ? "Active" : "Inactive"}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <button type="button" onClick={() => openEditModal(reel)} className="p-1.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
                        <Edit2 size={14} />
                      </button>
                      <button type="button" onClick={() => confirmDelete(reel.id)} className="p-1.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer">
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={isEditing ? "Edit Reel" : "Add Reel"}>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">Title (optional)</label>
            <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Bridal Collection Reel" className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">Video File *</label>
            {formVideoUrl ? (
              <div className="relative w-28 h-44 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
                <video src={formVideoUrl} className="w-full h-full object-cover" muted playsInline loop autoPlay />
                <button type="button" onClick={() => setFormVideoUrl(null)} className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full hover:bg-black transition-colors cursor-pointer">Remove</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 cursor-pointer hover:border-neutral-500 transition-colors text-center">
                <Upload size={24} className="text-neutral-400 mb-2" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{uploading ? "Uploading..." : "Click to upload video (MP4, MOV)"}</span>
                <input type="file" accept="video/mp4,video/quicktime,video/*" onChange={handleVideoUpload} className="hidden" />
              </label>
            )}
            <input type="text" value={formVideoUrl || ""} onChange={(e) => setFormVideoUrl(e.target.value || null)} placeholder="Or paste a direct video URL..." className="mt-2 w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">Cover Thumbnail (optional)</label>
            {formThumbnailUrl ? (
              <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img src={formThumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormThumbnailUrl(null)} className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full cursor-pointer">✕</button>
              </div>
            ) : (
              <label className="inline-flex items-center space-x-2 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-2.5 cursor-pointer hover:border-neutral-500 transition-colors text-xs text-neutral-500">
                <Upload size={14} />
                <span>{thumbnailUploading ? "Uploading..." : "Upload thumbnail image"}</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">Sort Order</label>
              <input type="number" value={formSortOrder} onChange={(e) => setFormSortOrder(Number(e.target.value))} className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" />
            </div>
            <div className="flex items-center space-x-2 mt-5">
              <input type="checkbox" id="reel-active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="cursor-pointer" />
              <label htmlFor="reel-active" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer uppercase tracking-wider">Active</label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer">Cancel</button>
            <button type="button" onClick={handleSave} disabled={formLoading} className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-wider rounded-sm hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer">
              {formLoading ? "Saving..." : isEditing ? "Save Changes" : "Add Reel"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Reel">
        <div className="space-y-5">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Are you sure you want to delete this reel? This cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">Cancel</button>
            <button type="button" onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors cursor-pointer">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
