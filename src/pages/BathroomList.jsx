import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaPen, FaTrash, FaImage } from "react-icons/fa";
import { listBathroom, deleteBathroom } from "../services/bathroomService";

const Badge = ({ value }) => {
  const v = (value || "").toLowerCase();
  const style = v.includes("stock")
    ? "bg-olive/15 text-olive border-olive/30"
    : "bg-clay/15 text-clay border-clay/30";
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${style}`}>
      {value}
    </span>
  );
};

const BathroomList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await listBathroom());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (p) => {
    if (!window.confirm(`Supprimer « ${p.nom} » ?`)) return;
    await deleteBathroom(p.id);
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sanitaires</h1>
          <p className="text-sm text-stone mt-1">{products.length} produit(s)</p>
        </div>
        <Link
          to="/bathroom/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-clay text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-olive transition self-start sm:self-auto"
        >
          <FaPlus /> Ajouter
        </Link>
      </div>

      {error && (
        <p className="mb-6 text-sm text-clay bg-white border border-clay/30 rounded-lg px-4 py-3">
          Erreur : {error}
        </p>
      )}

      {loading ? (
        <p className="text-stone animate-pulse">Chargement...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone/50 p-8 sm:p-12 text-center text-stone">
          Aucun produit. Cliquez sur « Ajouter » pour commencer.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-sand/40 overflow-hidden hover:shadow-md transition flex flex-col"
            >
              <div className="h-40 bg-ivory flex items-center justify-center relative">
                {p.image ? (
                  <img src={p.image} alt={p.nom} className="w-full h-full object-cover" />
                ) : (
                  <FaImage className="text-3xl text-stone/50" />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold leading-snug">{p.nom}</h2>
                  <Badge value={p.disponibilite} />
                </div>
                <p className="text-xs text-stone mt-2">
                  {[p.dimensions, p.poids && `${p.poids}`, p.prix && `${p.prix} DA`]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </p>
                <div className="flex gap-2 mt-4 pt-4 border-t border-sand/40">
                  <Link
                    to={`/bathroom/${p.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-sm bg-ivory text-olive py-2 rounded-lg hover:bg-sand/50 transition"
                  >
                    <FaPen className="text-xs" /> Modifier
                  </Link>
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

export default BathroomList;
