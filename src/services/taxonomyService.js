import { supabase } from "../lib/supabase";

const REFERENCE_TABLES = ["categories", "utilisations", "finitions"];

export const countRows = async (table) => {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
};

export const listTaxonomy = async (table) => {
  if (!REFERENCE_TABLES.includes(table)) throw new Error("Table inconnue");
  const { data, error } = await supabase
    .from(table)
    .select("id, nom")
    .order("nom");
  if (error) throw error;
  return data;
};

export const addTaxonomy = async (table, nom) => {
  const { data, error } = await supabase
    .from(table)
    .insert({ nom })
    .select("id, nom")
    .single();
  if (error) throw error;
  return data;
};

export const renameTaxonomy = async (table, id, nom) => {
  const { error } = await supabase.from(table).update({ nom }).eq("id", id);
  if (error) throw error;
};

export const deleteTaxonomy = async (table, id) => {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
};
