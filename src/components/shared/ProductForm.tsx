"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import MediaUpload from "@/components/ui/MediaUpload";
import CustomSelect from "@/components/ui/CustomSelect";
import { FormSkeleton } from "@/components/ui/Skeletons";
import { Save } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  productId?: string;
}



export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [productCode, setProductCode] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const isEditing = !!productId;

  const loadData = React.useCallback(async () => {
    setLoading(true);

    // Fetch active categories
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name")
      .eq("active", true);
    setCategories(catData || []);

    if (isEditing && productId) {
      // Fetch current product details
      const { data: prod, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        showToast(error.message, "error");
        router.push("/admin/products");
        return;
      }

      if (prod) {
        setTitle(prod.title);
        setSlug(prod.slug);
        setDescription(prod.description || "");
        setOriginalPrice(prod.original_price !== undefined && prod.original_price !== null ? prod.original_price.toString() : (prod as unknown as { price: number }).price?.toString() || "");
        setSellingPrice(prod.selling_price !== null && prod.selling_price !== undefined ? prod.selling_price.toString() : "");
        setIsOutOfStock(!!prod.is_out_of_stock);
        setCategoryId(prod.category_id);
        setProductCode(prod.product_code || "");
        setColors(prod.colors || []);
        setImages(prod.images || []);
        setFeatured(prod.featured);
        setActive(prod.active);
      }
    }
    setLoading(false);
  }, [productId, isEditing, router, showToast, supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleAddColor = () => {
    const trimmed = colorInput.trim();
    if (!trimmed) return;

    const exists = colors.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showToast(`Color "${trimmed}" is already added.`, "error");
      return;
    }

    setColors([...colors, trimmed]);
    setColorInput("");
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setColors(colors.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const origPriceNum = parseFloat(originalPrice);
    const sellingPriceNum = sellingPrice.trim() !== "" ? parseFloat(sellingPrice) : null;

    if (!title || !slug || isNaN(origPriceNum) || origPriceNum < 0 || !categoryId) {
      showToast("Please fill all required fields correctly.", "error");
      return;
    }

    if (!productCode.trim()) {
      showToast("Product code is required.", "error");
      return;
    }

    if (productCode.trim().length < 2) {
      showToast("Product code must be at least 2 characters.", "error");
      return;
    }

    if (sellingPriceNum !== null && (isNaN(sellingPriceNum) || sellingPriceNum < 0)) {
      showToast("Please enter a valid selling price.", "error");
      return;
    }

    if (sellingPriceNum !== null && sellingPriceNum >= origPriceNum) {
      showToast("Selling price should be strictly lower than original price.", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one product image.", "error");
      return;
    }

    setSaving(true);

    const productData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      original_price: origPriceNum,
      selling_price: sellingPriceNum,
      is_out_of_stock: isOutOfStock,
      category_id: categoryId,
      product_code: productCode.trim(),
      colors,
      images,
      featured,
      active,
    };

    if (isEditing && productId) {
      const { error } = await supabase.from("products").update(productData).eq("id", productId);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Product updated successfully.", "success");
        router.push("/admin/products");
      }
    } else {
      // Check duplicate slug
      const { data: check } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug.trim())
        .maybeSingle();

      if (check) {
        showToast("A product with this URL slug already exists.", "error");
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Product created successfully.", "success");
        router.push("/admin/products");
      }
    }

    setSaving(false);
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl select-none animate-fade-in pb-16">
      {/* Identity block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
          Product Details
        </h2>

        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Oversized Knit Sweater"
            className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            URL Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="e.g. oversized-knit-sweater"
            className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 font-mono text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe craftsmanship, metal specifications, gem details, size chart guidelines, and certifications..."
            className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Original Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 1299.00"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Selling Price (₹) <span className="text-neutral-500 font-normal">(Optional Offer)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="e.g. 899.00"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase mb-1">
              Category Placement <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={categoryId}
              onChange={(val) => setCategoryId(val)}
              placeholder="Select Category"
              className="w-full"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Product Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="e.g. NJ-NECK-001"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Colors Variant block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 space-y-4">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
          Product Color Variants (Optional)
        </h2>
        <p className="text-[10px] text-neutral-500 font-light">
          Add available color options for this product (e.g. Gold, Rose Gold, Ruby Red, Emerald Green, White Gold).
        </p>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddColor();
              }
            }}
            placeholder="Enter color name..."
            className="flex-1 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0"
          >
            Add Color
          </button>
        </div>

        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {colors.map((c, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-semibold px-2.5 py-1 rounded-sm border border-neutral-300 dark:border-neutral-700"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer font-bold ml-1"
                  aria-label={`Remove color ${c}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Upload block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
          Product Images (Upload at least one)
        </h2>

        <MediaUpload
          bucket="products"
          multiple
          value={images}
          onChange={(val) => setImages((val as string[]) || [])}
        />
      </div>

      {/* Visibility Flags block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-4">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-850 pb-2">
          Visibility & Inventory Status
        </h2>

        {/* Modern Toggle Switch for Out of Stock */}
        <div className="flex items-center justify-between py-1">
          <div className="space-y-0.5">
            <label
              htmlFor="prod-out-of-stock"
              className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer block"
            >
              Out of Stock Status
            </label>
            <p className="text-[10px] text-neutral-500 font-light">
              Toggle ON to mark product as Out of Stock (disables purchasing on storefront)
            </p>
          </div>
          <button
            id="prod-out-of-stock"
            type="button"
            role="switch"
            aria-checked={isOutOfStock}
            onClick={() => setIsOutOfStock(!isOutOfStock)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isOutOfStock ? "bg-red-600" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isOutOfStock ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center">
          <input
            id="prod-featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
          />
          <label
            htmlFor="prod-featured"
            className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
          >
            Mark product as Best Seller (displays BEST SELLER badge & filter option)
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="prod-active"
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
          />
          <label
            htmlFor="prod-active"
            className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
          >
            Product is active (visible to storefront catalogs)
          </label>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            if (confirm("Discard all unsaved changes?")) router.push("/admin/products");
          }}
          className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white hover:border-neutral-500 px-6 py-3 text-xs uppercase tracking-widest transition-all rounded-sm focus:outline-none cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-white text-black px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-700 dark:text-neutral-300 rounded-sm select-none"
        >
          <Save size={14} />
          <span>{saving ? "Saving Product..." : "Save Product"}</span>
        </button>
      </div>
    </form>
  );
}
