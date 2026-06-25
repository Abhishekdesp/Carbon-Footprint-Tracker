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

    const token = localStorage.getItem("token");
    if (!token) return setStatus("Not authenticated");

    const form = new FormData();
    form.append("photo", file);

    setStatus("Uploading...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
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
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>

      <form onSubmit={handleUpload} className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className=""
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded shadow mt-2"
          />
        )}

        <div className="flex items-center space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Upload
          </button>
          <span className="text-sm text-gray-600">{status}</span>
        </div>
      </form>
    </div>
  );
}
