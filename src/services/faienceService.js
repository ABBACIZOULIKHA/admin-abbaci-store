import { supabase } from "../lib/supabase";

export const listFaience = async () => {
  const { data: rows, error } = await supabase
    .from("faience")
    .select("*")
    .order("id");
  if (error) throw error;

  const { data: photos } = await supabase
    .from("photos_grand_faience")
    .select("id_faience, url");

  return rows.map((row) => ({
    ...row,
    image: photos?.find((p) => p.id_faience === row.id)?.url || null,
  }));
};

export const getFaience = async (id) => {
  const { data: row, error } = await supabase
    .from("faience")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  const [cats, utils, fins, grandPhotos, unitPhotos] = await Promise.all([
    supabase.from("faience_categories").select("id_categorie").eq("id_faience", id),
    supabase.from("faience_utilisations").select("id_utilisation").eq("id_faience", id),
    supabase.from("faience_finitions").select("id_finition").eq("id_faience", id),
    supabase.from("photos_grand_faience").select("id, url").eq("id_faience", id),
    supabase.from("photos_unite_faience").select("id, url, description").eq("id_faience", id),
  ]);

  return {
    ...row,
    categorieIds: (cats.data || []).map((c) => c.id_categorie),
    utilisationIds: (utils.data || []).map((u) => u.id_utilisation),
    finitionIds: (fins.data || []).map((f) => f.id_finition),
    grandPhotos: grandPhotos.data || [],
    unitPhotos: unitPhotos.data || [],
  };
};

export const saveFaience = async (id, payload, extras) => {
  const { categorieIds = [], utilisationIds = [], finitionIds = [], grandPhotos = [], unitPhotos = [] } = extras;

  let productId = id;
  if (productId) {
    const { error } = await supabase
      .from("faience")
      .update(payload)
      .eq("id", productId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("faience")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    productId = data.id;
  }

  await Promise.all([
    supabase.from("faience_categories").delete().eq("id_faience", productId),
    supabase.from("faience_utilisations").delete().eq("id_faience", productId),
    supabase.from("faience_finitions").delete().eq("id_faience", productId),
    supabase.from("photos_grand_faience").delete().eq("id_faience", productId),
    supabase.from("photos_unite_faience").delete().eq("id_faience", productId),
  ]);

  const inserts = [];
  if (categorieIds.length)
    inserts.push(
      supabase.from("faience_categories").insert(
        categorieIds.map((idc) => ({ id_faience: productId, id_categorie: idc }))
      )
    );
  if (utilisationIds.length)
    inserts.push(
      supabase.from("faience_utilisations").insert(
        utilisationIds.map((idu) => ({ id_faience: productId, id_utilisation: idu }))
      )
    );
  if (finitionIds.length)
    inserts.push(
      supabase.from("faience_finitions").insert(
        finitionIds.map((idf) => ({ id_faience: productId, id_finition: idf }))
      )
    );
  if (grandPhotos.length)
    inserts.push(
      supabase.from("photos_grand_faience").insert(
        grandPhotos.filter((p) => p.url).map((p) => ({ id_faience: productId, url: p.url }))
      )
    );
  if (unitPhotos.length)
    inserts.push(
      supabase.from("photos_unite_faience").insert(
        unitPhotos
          .filter((p) => p.url)
          .map((p) => ({ id_faience: productId, url: p.url, description: p.description || null }))
      )
    );

  await Promise.all(inserts);
  return productId;
};

export const deleteFaience = async (id) => {
  const { error } = await supabase.from("faience").delete().eq("id", id);
  if (error) throw error;
};
