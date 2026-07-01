import React, { useEffect, useState } from "react";

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
      credentials: "include"
    })
      .then((r) => r.json())
      .then((j) => {
        setData(j);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading tips...</div>;
  if (!data) return <div>No tips available</div>;

  return (
    <div className="mt-6 bg-emerald-50/60 border border-emerald-100 p-5 rounded-xl">
      <h3 className="text-lg font-bold text-emerald-800 mb-3">Personalized Tips</h3>
      <ul className="list-disc list-inside space-y-2 text-emerald-850 text-sm">
        {data.tips?.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <div className="text-xs text-emerald-700 mt-4 pt-3 border-t border-emerald-100 flex justify-between font-semibold">
        <div>🚗 Transport: {data.transport} kg</div>
        <div>💡 Electricity: {data.electricity} kg</div>
      </div>
    </div>
  );
}
