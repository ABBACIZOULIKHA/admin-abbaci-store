import { useEffect, useRef, useState } from "react";
import { FaPlus, FaPen, FaTrash, FaSpinner, FaImage, FaUpload } from "react-icons/fa";
import {
  listProducers,
  addProducer,
  updateProducer,
  deleteProducer,
} from "../services/producerService";
import { uploadImage, validateImage } from "../services/storageService";

const inputCls =
  "w-full rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-stone mb-1.5";

const ProducerForm = ({ initial, onSave, onClose }) => {
  const [name, setName] = useState(initial?.name || "");
  const [logo, setLogo] = useState(initial?.logo_img || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    const invalid = validateImage(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, `producers/${Date.now()}`);
      setLogo(url);
    } catch (e) {
      setError(`Échec de l'upload : ${e.message}`);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom du producteur est obligatoire.");
      return;
    }
    onSave({ name: name.trim(), logo_img: logo || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>Nom du producteur</label>
        <input
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex : Ceramica"
          autoFocus
        />
      </div>

      <div>
        <label className={labelCls}>Logo</label>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg border border-sand/60 bg-ivory/60 flex items-center justify-center overflow-hidden shrink-0">
            {uploading ? (
              <FaSpinner className="animate-spin text-clay" />
            ) : logo ? (
              <img src={logo} alt="logo" className="w-full h-full object-contain" />
            ) : (
              <FaImage className="text-stone/50" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 text-xs bg-olive text-white px-4 py-2 rounded-lg hover:bg-clay transition disabled:opacity-50"
          >
            <FaUpload /> Fichier
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
        <input
          className={`${inputCls} mt-3`}
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="...ou collez une URL https du logo"
        />
      </div>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="bg-olive text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-clay transition">
          {initial ? "Enregistrer" : "Ajouter"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm bg-white border border-sand/60 hover:bg-ivory transition">
          Annuler
        </button>
      </div>
    </form>
  );
};

const Producers = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setProducers(await listProducers());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleSave = async (payload) => {
    setError("");
    try {
      if (editing) {
        await updateProducer(editing.id, payload.name, payload.logo_img);
      } else {
        await addProducer(payload.name, payload.logo_img);
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Supprimer le producteur « ${p.name} » ?`)) return;
    try {
      await deleteProducer(p.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Producteurs</h1>
          <p className="text-sm text-stone mt-1">
            Les fabricants / marques. Associez chaque produit à son producteur.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-clay text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-olive transition self-start sm:self-auto"
        >
          <FaPlus /> Ajouter
        </button>
      </div>

      {error && (
        <p className="mb-6 text-sm text-clay bg-white border border-clay/30 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-5">
              {editing ? "Modifier le producteur" : "Nouveau producteur"}
            </h2>
            <ProducerForm
              initial={editing || undefined}
              onSave={handleSave}
              onClose={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-stone animate-pulse">Chargement...</p>
      ) : producers.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone/50 p-8 sm:p-12 text-center text-stone">
          Aucun producteur. Cliquez sur « Ajouter » pour commencer.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {producers.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-sand/40 overflow-hidden hover:shadow-md transition flex flex-col"
            >
              <div className="h-32 bg-ivory flex items-center justify-center p-4">
                {p.logo_img ? (
                  <img src={p.logo_img} alt={p.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <FaImage className="text-4xl text-stone/40" />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="font-semibold leading-snug">{p.name}</h2>
                <div className="flex gap-2 mt-4 pt-4 border-t border-sand/40">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-sm bg-ivory text-olive py-2 rounded-lg hover:bg-sand/50 transition"
                  >
                    <FaPen className="text-xs" /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="inline-flex items-center justify-center gap-2 text-sm bg-clay/10 text-clay px-3 py-2 rounded-lg hover:bg-clay hover:text-white transition"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Producers;
