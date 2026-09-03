import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaThLarge,
  FaBath,
  FaTags,
  FaIndustry,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logo from "../images/Logo.png";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: FaTachometerAlt, end: true },
  { to: "/faience", label: "Faïence & Carrelage", icon: FaThLarge },
  { to: "/bathroom", label: "Sanitaires", icon: FaBath },
  { to: "/taxonomies", label: "Catégories & tags", icon: FaTags },
  { to: "/producers", label: "Producteurs", icon: FaIndustry },
];

const Layout = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex bg-ivory">
      <button
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
        className="fixed top-4 left-4 z-40 lg:hidden bg-olive text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center"
      >
        <FaBars />
      </button>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 bg-olive text-ivory flex flex-col shrink-0 transition-transform duration-200",
          "lg:static lg:translate-x-0",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-6 py-5 border-b border-ivory/20 flex items-center gap-3">
          <img
            src={logo}
            alt="ABBACI Ceramic"
            className="w-12 h-12 object-contain bg-white rounded-lg p-1"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold leading-tight">ABBACI</h1>
            <p className="text-xs uppercase tracking-widest text-sand">
              Administration
            </p>
          </div>
          <button
            onClick={closeMenu}
            aria-label="Fermer le menu"
            className="lg:hidden text-ivory/80 hover:text-white p-1 -mr-1"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-clay text-white font-medium"
                    : "text-ivory/80 hover:bg-olive/60 hover:text-white"
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-ivory/20 text-xs">
          <p className="text-sand mb-2 truncate">{session?.user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-ivory/80 hover:text-clay transition"
          >
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-16 lg:py-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
