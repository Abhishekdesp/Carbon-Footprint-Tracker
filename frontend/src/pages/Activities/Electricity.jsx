import React, { useState } from "react";

const Electricity = () => {
  const [units, setUnits] = useState("");
  const [lpg, setLpg] = useState("");
  const [acHours, setAcHours] = useState("");
  const [result, setResult] = useState(null);

  const calculateEnergy = async () => {
    const electricityEmission = units * 0.85; 
    const lpgEmission = lpg * 42;
    const acEmission = acHours * 1.5 * 30;

    const total = electricityEmission + lpgEmission + acEmission;
    const formatted = total.toFixed(2);
    setResult(formatted);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/electricity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            units: Number(units),
            lpg: Number(lpg),
            acHours: Number(acHours),
            emissions: Number(formatted),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Electricity footprint saved!");
      } else {
        alert(data.error || "Failed to save data");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Home Energy Usage</h1>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Electricity Units (kWh)</label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">LPG Cylinders Used</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={lpg}
                onChange={(e) => setLpg(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">AC Usage Hours/Day</label>
              <input
                type="number"
                placeholder="e.g. 4"
                value={acHours}
                onChange={(e) => setAcHours(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <button
              onClick={calculateEnergy}
              className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-lg shadow-green-600/10 transition-all hover:scale-[1.01]"
            >
              Calculate Emissions
            </button>
          </div>

          {result && (
            <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 font-bold text-center">
              ⚡ Monthly Footprint: <span className="text-2xl ml-1">{result}</span> kg CO₂
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Electricity;
