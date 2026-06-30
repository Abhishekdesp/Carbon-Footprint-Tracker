import React, { useEffect, useState } from "react";

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchInsights();
    fetchTips();
  }, []);

  // -------- Fetch insights data --------
  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/insights`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.error("Insights fetch error:", err);
    }
  };

  // -------- Fetch reduction tips --------
  const fetchTips = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/tips`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setTips(data.tips);
    } catch (err) {
      console.error("Tips fetch error:", err);
    }
  };

  if (!insights) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-850 mb-3">
          Quick Insights 🌍
        </h2>
        <p className="text-gray-500">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Quick Insights 🌍
      </h2>

      {/* ---------- REAL INSIGHTS FROM BACKEND ---------- */}
      <ul className="space-y-3 text-gray-700">
        <li className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center gap-3">
          <span className="text-xl">🚗</span>
          <div>
            You emitted <b className="text-green-700 font-semibold">{insights.weeklyTransport.toFixed(1)} kg CO₂</b> from transportation this week.
          </div>
        </li>

        <li className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center gap-3">
          <span className="text-xl">💡</span>
          <div>
            Electricity changed by <b className="text-green-700 font-semibold">{insights.electricityChange}%</b> compared to last month.
          </div>
        </li>

        <li className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center gap-3">
          <span className="text-xl">🍽️</span>
          <div>
            Food emissions this week: <b className="text-green-700 font-semibold">{insights.foodEmissions.toFixed(1)} kg</b>.
          </div>
        </li>

        <li className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center gap-3">
          <span className="text-xl">🌿</span>
          <div>
            Recycling score this week: <b className="text-green-700 font-semibold">{insights.lifestyleRecycling}</b>.
          </div>
        </li>
      </ul>

      {/* ---------- EDUCATIONAL SECTION ---------- */}
      <div className="mt-6 p-4 bg-emerald-50/70 rounded-xl border border-emerald-100">
        <h3 className="text-emerald-800 text-md font-bold mb-2 flex items-center gap-2">
          🌱 Did You Know?
        </h3>

        <ul className="space-y-2 text-emerald-850 text-sm list-inside list-disc">
          <li>Driving 1 km produces around <b className="text-emerald-900">0.19 kg of CO₂</b>.</li>
          <li>A non-veg meal emits <b className="text-emerald-900">3× more CO₂</b> than a vegetarian meal.</li>
          <li>Running an AC for 1 hour emits as much CO₂ as <b className="text-emerald-900">driving 1 km</b>.</li>
          <li>Recycling 1 kg plastic saves up to <b className="text-emerald-900">1.5 kg CO₂</b>.</li>
        </ul>
      </div>

      {/* ---------- REDUCTION TIPS SECTION ---------- */}
      <div className="mt-6 p-4 bg-amber-50/70 rounded-xl border border-amber-105">
        <h3 className="text-amber-800 text-md font-bold mb-2 flex items-center gap-2">
          🎯 Reduction Tips
        </h3>

        {tips.length === 0 ? (
          <p className="text-amber-800 text-sm">
            You’re doing great! Keep maintaining low emissions 🌿
          </p>
        ) : (
          <ul className="space-y-2 text-amber-850 text-sm list-inside list-disc">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default Insights;
