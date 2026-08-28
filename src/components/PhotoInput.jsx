import { useRef, useState } from "react";
import { FaUpload, FaTrash, FaSpinner, FaImage } from "react-icons/fa";
import { uploadImage, validateImage } from "../services/storageService";

const PhotoInput = ({ value, onChange, withDescription = false, folder = "misc" }) => {
  const fileRefs = useRef({});
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");

  const rows = value;

  const updateRow = (index, patch) =>
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const removeRow = (index) => {
    if (rows.length === 1) {
      onChange(withDescription ? [{ url: "", description: "" }] : [{ url: "" }]);
    } else {
      onChange(rows.filter((_, i) => i !== index));
    }
  };

  const handleFile = async (index, file) => {
    if (!file) return;
    setError("");
    const invalid = validateImage(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setUploadingIndex(index);
    try {
      const url = await uploadImage(file, folder);
      updateRow(index, { url });
    } catch (e) {
      setError(`Échec de l'upload : ${e.message}`);
    }
    setUploadingIndex(null);
  };

  return (
    <div className="space-y-3">
      {rows.map((photo, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2 items-stretch">
          <div className="w-full sm:w-16 h-12 rounded-lg border border-sand/60 bg-ivory/60 flex items-center justify-center overflow-hidden shrink-0 order-1">
            {uploadingIndex === i ? (
              <FaSpinner className="animate-spin text-clay" />
            ) : photo.url ? (
              <img src={photo.url} alt="aperçu" className="w-full h-full object-cover" />
            ) : (
              <FaImage className="text-stone/50" />
            )}
          </div>

          <button
            type="button"
            onClick={() => fileRefs.current[i]?.click()}
            disabled={uploadingIndex === i}
            className="order-2 inline-flex items-center justify-center gap-2 text-xs bg-olive text-white px-4 py-2 rounded-lg hover:bg-clay transition shrink-0 h-12 disabled:opacity-50"
          >
            <FaUpload /> Fichier
          </button>
          <input
            ref={(el) => (fileRefs.current[i] = el)}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFile(i, e.target.files[0])}
          />

          <input
            className="flex-1 min-w-0 rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay order-3"
            value={photo.url}
            onChange={(e) => updateRow(i, { url: e.target.value })}
            placeholder="...ou collez une URL https"
          />

          {withDescription && (
            <input
              className="flex-1 min-w-0 rounded-lg border border-sand/60 bg-ivory/40 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay focus:border-clay order-4"
              value={photo.description || ""}
              onChange={(e) => updateRow(i, { description: e.target.value })}
              placeholder="Description (ex : Vue unité)"
            />
          )}

          <button
            type="button"
            onClick={() => removeRow(i)}
            className="order-5 text-clay hover:text-white hover:bg-clay px-3 rounded-lg transition shrink-0 self-center sm:self-auto"
          >
            <FaTrash />
          </button>
        </div>
      ))}

      {error && <p className="text-xs text-clay">{error}</p>}

      <button
        type="button"
        onClick={() => onChange([...rows, withDescription ? { url: "", description: "" } : { url: "" }])}
        className="inline-flex items-center gap-2 text-xs text-olive hover:text-clay transition"
      >
        + Ajouter une photo
      </button>
    </div>
  );
};

export default PhotoInput;
