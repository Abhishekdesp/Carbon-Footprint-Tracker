import React, { useState } from "react";

export default function UploadPhoto() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Select a file first");

    const form = new FormData();
    form.append("photo", file);

    setStatus("Uploading...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: form,
        credentials: "include"
      });

      // safely handle JSON or plain text responses
      let json = null;
      let text = null;
      try {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) json = await res.json();
        else text = await res.text();
      } catch {
        // fallback to text
        try { text = await res.text(); } catch { /* ignore */ }
      }

      if (!res.ok) {
        const errMsg = (json && (json.error || json.message)) || text || res.statusText;
        throw new Error(errMsg || `Upload failed (${res.status})`);
      }

      setStatus(`Uploaded (${res.status})`);
      // optionally show uploaded url
      if (json?.file?.url) setPreview(json.file.url);
      else if (text && text.startsWith("/uploads")) setPreview(text);
    } catch (err) {
      console.error("Upload error:", err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Upload Photo</h3>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-105 transition-all cursor-pointer"
          />
        </div>

        {preview && (
          <div className="relative inline-block mt-2">
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md shadow-green-600/10 transition-all hover:scale-[1.02]"
          >
            Upload Image
          </button>
          <span className="text-sm text-gray-500 font-medium">{status}</span>
        </div>
      </form>
    </div>
  );
}
