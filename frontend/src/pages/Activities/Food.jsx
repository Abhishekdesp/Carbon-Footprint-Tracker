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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/food`,
        {
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
        }
      );

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
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Food & Diet Impact</h1>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Meal / Diet Type</label>
              <select
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
              >
                <option value="">Select Meal Type</option>
                <option>Veg</option>
                <option>Non-Veg</option>
                <option>Vegan</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Dairy Intake (cups/day)</label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={dairy}
                onChange={(e) => setDairy(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Snacks Consumption (per day)</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={snacks}
                onChange={(e) => setSnacks(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Food Waste (kg/month)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <button
              onClick={calculateFood}
              className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-lg shadow-green-600/10 transition-all hover:scale-[1.01]"
            >
              Calculate Emissions
            </button>
          </div>

          {result && (
            <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 font-bold text-center">
              🍽️ Monthly Food Footprint: <span className="text-2xl ml-1">{result}</span> kg CO₂
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Food;
