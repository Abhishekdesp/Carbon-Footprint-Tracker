import React, { useEffect, useState } from "react";

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
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
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Personalized Tips</h3>
      <ul className="list-disc list-inside space-y-1">
        {data.tips?.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <div className="text-sm text-gray-500 mt-2">
        <div>Transport: {data.transport} kg</div>
        <div>Electricity: {data.electricity} kg</div>
      </div>
    </div>
  );
}
