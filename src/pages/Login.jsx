import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/Logo.png";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setError("Email ou mot de passe incorrect.");
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-sand/40">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="ABBACI Ceramic"
            className="w-20 h-20 object-contain mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-olive">ABBACI Admin</h1>
          <p className="text-sm text-stone mt-1">
            Connectez-vous pour gérer vos produits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-sand/60 bg-ivory/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay"
              placeholder="admin@exemple.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-sand/60 bg-ivory/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-clay bg-clay/10 border border-clay/30 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-olive text-white py-3 rounded-lg text-sm font-medium hover:bg-olive/90 transition disabled:opacity-50"
          >
            {busy ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-xs text-stone text-center mt-6 leading-relaxed">
          Pas encore de compte ? Créez un utilisateur dans
          <br />
          Supabase Dashboard → Authentication → Users.
        </p>
        <p className="text-xs text-center mt-3">
          <Link to="/" className="text-clay hover:underline">
            Retour au site vitrine →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
