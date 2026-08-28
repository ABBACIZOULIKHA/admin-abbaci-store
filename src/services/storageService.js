import { supabase } from "../lib/supabase";

const BUCKET = "product-images";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const makePath = (folder, file) => {
  const ext = file.name.split(".").pop().toLowerCase();
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${folder}/${Date.now()}-${safeName || "image"}.${ext}`;
};

export const validateImage = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Format non supporté (JPG, PNG, WebP ou GIF uniquement).";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Fichier trop lourd (max ${MAX_SIZE_MB} Mo).`;
  }
  return null;
};

export const uploadImage = async (file, folder) => {
  const path = makePath(folder, file);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
