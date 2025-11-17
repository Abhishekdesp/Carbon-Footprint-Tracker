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
    <div className="min-h-screen p-6 bg-gradient-to-bl from-black via-green-900 to-blue-900 text-green-200">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Home Energy Usage</h1>

      <div className="bg-gray-800/50 p-6 rounded-xl border border-green-600/40">
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Electricity Units (kWh)"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="LPG Cylinders"
            value={lpg}
            onChange={(e) => setLpg(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="AC Usage Hours/Day"
            value={acHours}
            onChange={(e) => setAcHours(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <button
            onClick={calculateEnergy}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-6 text-xl text-green-300 font-bold">
            ⚡ Monthly Footprint: {result} kg CO₂
          </div>
        )}
      </div>
    </div>
  );
};

export default Electricity;
