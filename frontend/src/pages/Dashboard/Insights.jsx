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
      <div className="p-4 bg-gray-900 rounded-xl border border-green-600 shadow-md">
        <h2 className="text-xl font-semibold text-green-300 mb-3">
          Quick Insights 🌍
        </h2>
        <p className="text-green-100">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-green-600 shadow-md">

      <h2 className="text-xl font-semibold text-green-300 mb-3">
        Quick Insights 🌍
      </h2>

      {/* ---------- REAL INSIGHTS FROM BACKEND ---------- */}
      <ul className="space-y-2 text-green-100">
        <li className="bg-gray-800 p-3 rounded-md">
          🚗 You emitted <b>{insights.weeklyTransport.toFixed(1)} kg CO₂</b> from transportation this week.
        </li>

        <li className="bg-gray-800 p-3 rounded-md">
          💡 Electricity changed by <b>{insights.electricityChange}%</b> compared to last month.
        </li>

        <li className="bg-gray-800 p-3 rounded-md">
          🍽️ Food emissions this week: <b>{insights.foodEmissions.toFixed(1)} kg</b>.
        </li>

        <li className="bg-gray-800 p-3 rounded-md">
          🌿 Recycling score this week: <b>{insights.lifestyleRecycling}</b>.
        </li>
      </ul>

      {/* ---------- EDUCATIONAL SECTION ---------- */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-green-500">
        <h3 className="text-green-300 text-lg font-semibold mb-2">
          🌱 Did You Know?
        </h3>

        <ul className="space-y-2 text-green-100 text-sm">
          <li>🚗 Driving 1 km produces around <b>0.19 kg of CO₂</b>.</li>
          <li>🍽️ A non-veg meal emits <b>3× more CO₂</b> than a vegetarian meal.</li>
          <li>⚡ Running an AC for 1 hour emits as much CO₂ as <b>driving 1 km</b>.</li>
          <li>🔄 Recycling 1 kg plastic saves up to <b>1.5 kg CO₂</b>.</li>
        </ul>
      </div>

      {/* ---------- REDUCTION TIPS SECTION ---------- */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-yellow-500">
        <h3 className="text-yellow-300 text-lg font-semibold mb-2">
          🎯 Reduction Tips
        </h3>

        {tips.length === 0 ? (
          <p className="text-yellow-100 text-sm">
            You’re doing great! Keep maintaining low emissions 🌿
          </p>
        ) : (
          <ul className="space-y-2 text-yellow-100 text-sm">
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
