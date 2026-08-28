import { useState, useEffect } from "react";

const inputCls =
  "w-full rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-stone mb-1.5";

const CreatableSelect = ({ label, options, value, onChange, placeholder = "—" }) => {
  const isCustom = value && !options.includes(value);
  const [mode, setMode] = useState(isCustom ? "input" : "select");
  const [customValue, setCustomValue] = useState(isCustom ? value : "");

  useEffect(() => {
    if (value && !options.includes(value)) {
      setMode("input");
      setCustomValue(value);
    } else {
      setMode("select");
      setCustomValue("");
    }
  }, [value, options]);

  const handleSelect = (e) => {
    const v = e.target.value;
    if (v === "__custom__") {
      setMode("input");
      setCustomValue("");
      onChange("");
    } else {
      onChange(v);
    }
  };

  const handleInput = (e) => {
    const v = e.target.value;
    setCustomValue(v);
    onChange(v);
  };

  const handleBackToSelect = () => {
    setMode("select");
    setCustomValue("");
    onChange("");
  };

  if (mode === "input") {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={customValue}
            onChange={handleInput}
            placeholder="Saisir la valeur..."
            autoFocus
          />
          {options.length > 0 && (
            <button
              type="button"
              onClick={handleBackToSelect}
              className="shrink-0 px-3 rounded-lg border border-sand/60 bg-white text-stone text-sm hover:bg-ivory transition"
              title="Revenir à la liste"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select className={inputCls} value={value} onChange={handleSelect}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
        <option value="__custom__">Autre…</option>
      </select>
    </div>
  );
};

export default CreatableSelect;
