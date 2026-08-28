import { useEffect, useState } from "react";
import { FaPlus, FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { listTaxonomy, addTaxonomy, renameTaxonomy, deleteTaxonomy } from "../services/taxonomyService";

const SECTIONS = [
  { key: "categories", title: "Catégories", hint: "Carreaux de Sol, Faïences Murales..." },
  { key: "utilisations", title: "Utilisations", hint: "Intérieur, Extérieur, Cuisine..." },
  { key: "finitions", title: "Finitions", hint: "Brillant, Matte, Relief..." },
];

const TaxonomySection = ({ table, title, hint }) => {
  const [items, setItems] = useState([]);
  const [newNom, setNewNom] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    listTaxonomy(table)
      .then(setItems)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [table]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNom.trim()) return;
    try {
      await addTaxonomy(table, newNom.trim());
      setNewNom("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRename = async (id) => {
    if (!editValue.trim()) return;
    try {
      await renameTaxonomy(table, id, editValue.trim());
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer « ${item.nom} » ?`)) return;
    try {
      await deleteTaxonomy(table, item.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-sand/40 shadow-sm p-6">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-stone mt-1 mb-5">{hint}</p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-5">
        <input
          value={newNom}
          onChange={(e) => setNewNom(e.target.value)}
          placeholder={`Nouvelle ${title.toLowerCase().replace(/s$/, "")}...`}
          className="flex-1 rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay"
        />
        <button type="submit" className="bg-olive text-white px-4 rounded-lg hover:bg-clay transition">
          <FaPlus />
        </button>
      </form>

      {error && <p className="text-xs text-clay mb-3">{error}</p>}

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 group">
            {editingId === item.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(item.id)}
                  className="flex-1 rounded-lg border border-clay px-3 py-1.5 text-sm focus:outline-none"
                />
                <button onClick={() => handleRename(item.id)} className="text-olive hover:text-clay p-1.5">
                  <FaCheck />
                </button>
                <button onClick={() => setEditingId(null)} className="text-stone hover:text-clay p-1.5">
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm py-1">{item.nom}</span>
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setEditValue(item.nom);
                  }}
                  className="text-stone opacity-0 group-hover:opacity-100 hover:text-olive transition p-1.5"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-stone opacity-0 group-hover:opacity-100 hover:text-clay transition p-1.5"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-stone italic">Vide</li>}
      </ul>
    </div>
  );
};

const Taxonomies = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Catégories & tags</h1>
        <p className="text-sm text-stone mt-1">
          Ces valeurs alimentent les filtres du site vitrine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SECTIONS.map(({ key, title, hint }) => (
          <TaxonomySection key={key} table={key} title={title} hint={hint} />
        ))}
      </div>
    </div>
  );
};

export default Taxonomies;
