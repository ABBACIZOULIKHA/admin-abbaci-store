import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaThLarge, FaBath, FaImage, FaTags, FaPlus, FaArrowRight } from "react-icons/fa";
import { countRows } from "../services/taxonomyService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [faience, bathroom, photosGrand, photosUnite, categories] =
          await Promise.all([
            countRows("faience"),
            countRows("bathroom"),
            countRows("photos_grand_faience"),
            countRows("photos_unite_faience"),
            countRows("categories"),
          ]);
        setStats({ faience, bathroom, photosGrand, photosUnite, categories });
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, []);

  const cards = stats
    ? [
        { label: "Faïence & carrelage", value: stats.faience, to: "/faience", icon: FaThLarge, bg: "bg-olive" },
        { label: "Sanitaires", value: stats.bathroom, to: "/bathroom", icon: FaBath, bg: "bg-clay" },
        {
          label: "Photos produits",
          value: stats.photosGrand + stats.photosUnite,
          to: "/faience",
          icon: FaImage,
          bg: "bg-sage",
        },
        { label: "Catégories", value: stats.categories, to: "/taxonomies", icon: FaTags, bg: "bg-stone" },
      ]
    : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-stone mt-1">
            Vue d'ensemble de votre catalogue
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-6 text-sm text-clay bg-white border border-clay/30 rounded-lg px-4 py-3">
          Erreur : {error}
        </p>
      )}

      {!stats && !error && <p className="text-stone animate-pulse">Chargement...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map(({ label, value, to, icon: Icon, bg }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-xl p-6 shadow-sm border border-sand/40 hover:shadow-md transition group"
          >
            <div className={`w-10 h-10 rounded-lg ${bg} text-white flex items-center justify-center mb-4`}>
              <Icon />
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-stone mt-1 flex items-center gap-2">
              {label}
              <FaArrowRight className="text-xs opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/faience/nouveau"
          className="inline-flex items-center gap-2 bg-clay text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-olive transition"
        >
          <FaPlus /> Nouveau produit faïence
        </Link>
        <Link
          to="/bathroom/nouveau"
          className="inline-flex items-center gap-2 bg-olive text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-clay transition"
        >
          <FaPlus /> Nouveau sanitaires
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
