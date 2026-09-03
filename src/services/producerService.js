import { supabase } from "../lib/supabase";

export const PRODUCER_TABLE = "producers";

export const listProducers = async () => {
  const { data, error } = await supabase
    .from(PRODUCER_TABLE)
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
};

export const getProducer = async (id) => {
  const { data, error } = await supabase
    .from(PRODUCER_TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const addProducer = async (name, logoImg) => {
  const { error } = await supabase
    .from(PRODUCER_TABLE)
    .insert({ name, logo_img: logoImg || null });
  if (error) throw error;
};

export const updateProducer = async (id, name, logoImg) => {
  const { error } = await supabase
    .from(PRODUCER_TABLE)
    .update({ name, logo_img: logoImg || null })
    .eq("id", id);
  if (error) throw error;
};

export const deleteProducer = async (id) => {
  const { error } = await supabase.from(PRODUCER_TABLE).delete().eq("id", id);
  if (error) throw error;
};
