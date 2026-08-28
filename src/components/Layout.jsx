import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaThLarge,
  FaBath,
  FaTags,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logo from "../images/Logo.png";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: FaTachometerAlt, end: true },
  { to: "/faience", label: "Faïence & Carrelage", icon: FaThLarge },
  { to: "/bathroom", label: "Sanitaires", icon: FaBath },
  { to: "/taxonomies", label: "Catégories & tags", icon: FaTags },
];

const Layout = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-olive text-ivory flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-ivory/20 flex items-center gap-3">
          <img
            src={logo}
            alt="ABBACI Ceramic"
            className="w-12 h-12 object-contain bg-white rounded-lg p-1"
          />
          <div>
            <h1 className="text-xl font-bold leading-tight">ABBACI</h1>
            <p className="text-xs uppercase tracking-widest text-sand">
              Administration
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

      <main className="flex-1 min-w-0 px-8 py-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
