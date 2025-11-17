import React, { useState } from "react";

const Food = () => {
  const [diet, setDiet] = useState("");
  const [dairy, setDairy] = useState("");
  const [snacks, setSnacks] = useState("");
  const [waste, setWaste] = useState("");
  const [result, setResult] = useState(null);

  const calculateFood = async () => {
    let total = 0;

    const dietValues = {
      Veg: 2,
      "Non-Veg": 6,
      Vegan: 1.5,
    };

    if (!diet) {
      alert("Please select a diet type");
      return;
    }

    total += dietValues[diet] * 30;
    total += dairy * 1.2;
    total += snacks * 0.5;
    total += waste * 2;

    const formatted = total.toFixed(2);
    setResult(formatted);

    // 🔥 Send to backend
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/footprint/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diet,
          dairy: Number(dairy),
          snacks: Number(snacks),
          waste: Number(waste),
          emissions: Number(formatted),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Food footprint saved!");
      } else {
        alert(data.error || "Error saving food data");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Cannot reach server!");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-gray-900 to-black text-green-200">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Food & Diet Impact</h1>

      <div className="bg-gray-800/50 p-6 rounded-xl border border-green-600/40">
        <div className="space-y-3">
          <select
            className="w-full p-3 bg-gray-900/60 rounded-lg"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          >
            <option value="">Select Meal Type</option>
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Vegan</option>
          </select>

          <input
            type="number"
            placeholder="Dairy (cups/day)"
            value={dairy}
            onChange={(e) => setDairy(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Snacks (per day)"
            value={snacks}
            onChange={(e) => setSnacks(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Food Waste (kg/month)"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <button
            onClick={calculateFood}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-6 text-xl text-green-300 font-bold">
            🍽️ Monthly Food Footprint: {result} kg CO₂
          </div>
        )}
      </div>
    </div>
  );
};

export default Food;
