import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getBathroom, saveBathroom } from "../services/bathroomService";
import { listProducers } from "../services/producerService";
import PhotoInput from "../components/PhotoInput";
import CreatableSelect from "../components/CreatableSelect";

const DISPONIBILITES = ["En stock", "Sur commande", "Rupture"];

const inputCls =
  "w-full rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-stone mb-1.5";

const BathroomForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    disponibilite: "En stock",
    dimensions: "",
    poids: "",
    absorption: "",
    retrait: "",
    prix: "",
    prix_promo: "",
    est_nouveau: false,
  });
  const [producerId, setProducerId] = useState("");
  const [producers, setProducers] = useState([]);
  const [grandPhotos, setGrandPhotos] = useState([{ url: "" }]);
  const [unitPhotos, setUnitPhotos] = useState([{ url: "", description: "" }]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listProducers()
      .then(setProducers)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getBathroom(id)
      .then((p) => {
        const { nom, disponibilite, dimensions, poids, absorption, retrait, prix, prix_promo, est_nouveau, producer_id } = p;
        setForm({
          nom: nom || "",
          disponibilite: disponibilite || "En stock",
          dimensions: dimensions || "",
          poids: poids || "",
          absorption: absorption || "",
          retrait: retrait || "",
          prix: prix ?? "",
          prix_promo: prix_promo ?? "",
          est_nouveau: !!est_nouveau,
        });
        setProducerId(producer_id ?? "");
        setGrandPhotos(p.grandPhotos.length ? p.grandPhotos.map((x) => ({ url: x.url })) : [{ url: "" }]);
        setUnitPhotos(p.unitPhotos.length ? p.unitPhotos.map((x) => ({ url: x.url, description: x.description || "" })) : [{ url: "", description: "" }]);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nom.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    setSaving(true);
    try {
      await saveBathroom(isEdit ? id : null, {
        ...form,
        producer_id: producerId ? Number(producerId) : null,
        prix: form.prix === "" ? null : Number(form.prix),
        prix_promo: form.prix_promo === "" ? null : Number(form.prix_promo),
        est_nouveau: !!form.est_nouveau,
      }, { grandPhotos, unitPhotos });
      navigate("/bathroom");
    } catch (e2) {
      setError(e2.message);
      setSaving(false);
    }
  };

  if (loading) return <p className="text-stone animate-pulse">Chargement...</p>;

  return (
    <div className="max-w-3xl">
      <Link to="/bathroom" className="inline-flex items-center gap-2 text-sm text-stone hover:text-olive mb-6">
        <FaArrowLeft /> Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold mb-8">
        {isEdit ? "Modifier le produit" : "Nouveau produit sanitaires"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-4 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Informations</h2>

          <div>
            <label className={labelCls}>Nom du produit *</label>
            <input className={inputCls} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Lavabo sur pied Classique" />
          </div>

          <CreatableSelect
            label="Disponibilité"
            options={DISPONIBILITES}
            value={form.disponibilite}
            onChange={(v) => setForm({ ...form, disponibilite: v })}
            placeholder="En stock"
          />

          <div>
            <label className={labelCls}>Producteur (marque)</label>
            <select
              className={inputCls}
              value={producerId}
              onChange={(e) => setProducerId(e.target.value)}
            >
              <option value="">— Sélectionner un producteur —</option>
              {producers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {producers.length === 0 && (
              <p className="text-xs text-stone mt-1.5">
                Aucun producteur. Ajoutez-en depuis la page «&nbsp;Producteurs&nbsp;».
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className={labelCls}>Dimensions</label>
              <input className={inputCls} value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="60 × 45 × 85 cm" />
            </div>
            <div>
              <label className={labelCls}>Poids</label>
              <input className={inputCls} value={form.poids} onChange={(e) => setForm({ ...form, poids: e.target.value })} placeholder="18 kg" />
            </div>
            <div>
              <label className={labelCls}>Absorption</label>
              <input className={inputCls} value={form.absorption} onChange={(e) => setForm({ ...form, absorption: e.target.value })} placeholder="< 0.5%" />
            </div>
            <div>
              <label className={labelCls}>Retrait</label>
              <input className={inputCls} value={form.retrait} onChange={(e) => setForm({ ...form, retrait: e.target.value })} placeholder="1.2%" />
            </div>
            <div>
              <label className={labelCls}>Prix (DA)</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} placeholder="24500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Prix promo (DA)</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.prix_promo} onChange={(e) => setForm({ ...form, prix_promo: e.target.value })} placeholder="22000" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-stone">
                <input
                  type="checkbox"
                  checked={!!form.est_nouveau}
                  onChange={(e) => setForm({ ...form, est_nouveau: e.target.checked })}
                  className="w-4 h-4 accent-clay"
                />
                Marquer comme <span className="font-semibold text-olive">Nouveau</span>
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-4 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Photos principales</h2>
          <PhotoInput value={grandPhotos} onChange={setGrandPhotos} folder="bathroom/grand" />
        </section>

        <section className="bg-white rounded-xl border border-sand/40 shadow-sm p-4 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-sage">Photos unité</h2>
          <PhotoInput value={unitPhotos} onChange={setUnitPhotos} withDescription folder="bathroom/unite" />
        </section>

        {error && (
          <p className="text-sm text-clay bg-clay/10 border border-clay/30 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-8">
          <button type="submit" disabled={saving} className="bg-olive text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-clay transition disabled:opacity-50">
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le produit"}
          </button>
          <Link to="/bathroom" className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm bg-white border border-sand/60 hover:bg-ivory transition">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BathroomForm;
