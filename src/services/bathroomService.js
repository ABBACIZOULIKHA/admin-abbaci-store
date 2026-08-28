import { supabase } from "../lib/supabase";

export const listBathroom = async () => {
  const { data: rows, error } = await supabase
    .from("bathroom")
    .select("*")
    .order("id");
  if (error) throw error;

  const { data: photos } = await supabase
    .from("photos_grand_bathroom")
    .select("id_bathroom, url");

  return rows.map((row) => ({
    ...row,
    image: photos?.find((p) => p.id_bathroom === row.id)?.url || null,
  }));
};

export const getBathroom = async (id) => {
  const { data: row, error } = await supabase
    .from("bathroom")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  const [grandPhotos, unitPhotos] = await Promise.all([
    supabase.from("photos_grand_bathroom").select("id, url").eq("id_bathroom", id),
    supabase.from("photos_unite_bathroom").select("id, url, description").eq("id_bathroom", id),
  ]);

  return {
    ...row,
    grandPhotos: grandPhotos.data || [],
    unitPhotos: unitPhotos.data || [],
  };
};

export const saveBathroom = async (id, payload, extras) => {
  const { grandPhotos = [], unitPhotos = [] } = extras;

  let productId = id;
  if (productId) {
    const { error } = await supabase
      .from("bathroom")
      .update(payload)
      .eq("id", productId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("bathroom")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    productId = data.id;
  }

  await Promise.all([
    supabase.from("photos_grand_bathroom").delete().eq("id_bathroom", productId),
    supabase.from("photos_unite_bathroom").delete().eq("id_bathroom", productId),
  ]);

  const inserts = [];
  if (grandPhotos.length)
    inserts.push(
      supabase.from("photos_grand_bathroom").insert(
        grandPhotos.filter((p) => p.url).map((p) => ({ id_bathroom: productId, url: p.url }))
      )
    );
  if (unitPhotos.length)
    inserts.push(
      supabase.from("photos_unite_bathroom").insert(
        unitPhotos
          .filter((p) => p.url)
          .map((p) => ({ id_bathroom: productId, url: p.url, description: p.description || null }))
      )
    );

  await Promise.all(inserts);
  return productId;
};

export const deleteBathroom = async (id) => {
  const { error } = await supabase.from("bathroom").delete().eq("id", id);
  if (error) throw error;
};
