import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getFaience, saveFaience } from "../services/faienceService";
import { listTaxonomy } from "../services/taxonomyService";
import PhotoInput from "../components/PhotoInput";
import CreatableSelect from "../components/CreatableSelect";

const FORMATS = ["30 × 30", "60 × 60", "120 × 60"];
const ASPECTS = ["Béton", "Bois", "Ciment", "Marbré", "Mauresque", "Pierre", "Uni"];
const EPAISSEURS = ["9mm", "12mm"];
const DISPONIBILITES = ["En stock", "Sur commande", "Rupture"];

const inputCls =
  "w-full rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-stone mb-1.5";

const CheckGroup = ({ title, items, selected, onToggle }) => (
  <div>
    <span className={labelCls}>{title}</span>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item.id);
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              active
                ? "bg-clay border-clay text-white"
                : "bg-white border-sand/60 text-stone hover:border-clay"
            }`}
          >
            {item.nom}
          </button>
        );
      })}
    </div>
  </div>
);

const FaienceForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    disponibilite: "En stock",
    format: "",
    aspect: "",
    epaisseur: "",
    marque: "",
  });
  const [categorieIds, setCategorieIds] = useState([]);
  const [utilisationIds, setUtilisationIds] = useState([]);
  const [finitionIds, setFinitionIds] = useState([]);
  const [grandPhotos, setGrandPhotos] = useState([{ url: "" }]);
  const [unitPhotos, setUnitPhotos] = useState([{ url: "", description: "" }]);

  const [categories, setCategories] = useState([]);
  const [utilisations, setUtilisations] = useState([]);
  const [finitions, setFinitions] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      listTaxonomy("categories"),
      listTaxonomy("utilisations"),
      listTaxonomy("finitions"),
    ])
      .then(([c, u, f]) => {
        setCategories(c);
        setUtilisations(u);
        setFinitions(f);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getFaience(id)
      .then((p) => {
        const { nom, disponibilite, format, aspect, epaisseur, marque } = p;
        setForm({ nom: nom || "", disponibilite: disponibilite || "En stock", format: format || "", aspect: aspect || "", epaisseur: epaisseur || "", marque: marque || "" });
        setCategorieIds(p.categorieIds);
        setUtilisationIds(p.utilisationIds);
        setFinitionIds(p.finitionIds);
        setGrandPhotos(p.grandPhotos.length ? p.grandPhotos.map((x) => ({ url: x.url })) : [{ url: "" }]);
        setUnitPhotos(p.unitPhotos.length ? p.unitPhotos.map((x) => ({ url: x.url, description: x.description || "" })) : [{ url: "", description: "" }]);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id, isEdit]);

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nom.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    setSaving(true);
    try {
      await saveFaience(isEdit ? id : null, form, {
        categorieIds,
        utilisationIds,
        finitionIds,
        grandPhotos,
        unitPhotos,
      });
      navigate("/faience");
    } catch (e2) {
      setError(e2.message);
      setSaving(false);
    }
  };

  if (loading) return <p className="text-stone animate-pulse">Chargement...</p>;

  return (
    <div className="max-w-3xl">
      <Link to="/faience" className="inline-flex items-center gap-2 text-sm text-stone hover:text-olive mb-6">
        <FaArrowLeft /> Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold mb-8">
        {isEdit ? "Modifier le produit" : "Nouveau produit faïence"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Informations</h2>

          <div>
            <label className={labelCls}>Nom du produit *</label>
            <input className={inputCls} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Carrelage Grège 60x60" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CreatableSelect
              label="Disponibilité"
              options={DISPONIBILITES}
              value={form.disponibilite}
              onChange={(v) => setForm({ ...form, disponibilite: v })}
              placeholder="En stock"
            />
            <CreatableSelect
              label="Format"
              options={FORMATS}
              value={form.format}
              onChange={(v) => setForm({ ...form, format: v })}
            />
            <CreatableSelect
              label="Aspect"
              options={ASPECTS}
              value={form.aspect}
              onChange={(v) => setForm({ ...form, aspect: v })}
            />
            <CreatableSelect
              label="Épaisseur"
              options={EPAISSEURS}
              value={form.epaisseur}
              onChange={(v) => setForm({ ...form, epaisseur: v })}
            />
          </div>

          <div>
            <label className={labelCls}>Marque</label>
            <input className={inputCls} value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} placeholder="Ex : Ceramica" />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Classification</h2>
          <CheckGroup title="Catégories" items={categories} selected={categorieIds} onToggle={toggle(setCategorieIds)} />
          <CheckGroup title="Utilisations" items={utilisations} selected={utilisationIds} onToggle={toggle(setUtilisationIds)} />
          <CheckGroup title="Finitions" items={finitions} selected={finitionIds} onToggle={toggle(setFinitionIds)} />
        </section>

        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Photos principales</h2>
          <PhotoInput value={grandPhotos} onChange={setGrandPhotos} folder="faience/grand" />
        </section>

        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Photos unité</h2>
          <PhotoInput value={unitPhotos} onChange={setUnitPhotos} withDescription folder="faience/unite" />
        </section>

        {error && (
          <p className="text-sm text-clay bg-clay/10 border border-clay/30 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex gap-4 pb-8">
          <button type="submit" disabled={saving} className="bg-olive text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-clay transition disabled:opacity-50">
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le produit"}
          </button>
          <Link to="/faience" className="px-6 py-3 rounded-lg text-sm bg-white border border-sand/60 hover:bg-ivory transition">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FaienceForm;
