import React, { useState } from "react";

const Lifestyle = () => {
  const [clothes, setClothes] = useState("");
  const [gadgets, setGadgets] = useState("");
  const [plastic, setPlastic] = useState("");
  const [recycle, setRecycle] = useState("");
  const [water, setWater] = useState("");
  const [result, setResult] = useState(null);

  const calculateLifestyle = async () => {
    const total =
      clothes * 5 +
      gadgets * 50 +
      plastic * 2 +
      water * 0.002 -
      recycle * 10;

    const formatted = total.toFixed(2);
    setResult(formatted);

    // 🔥 Send lifestyle data to backend
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/lifestyle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clothes: Number(clothes),
            gadgets: Number(gadgets),
            plastic: Number(plastic),
            recycle: Number(recycle),
            water: Number(water),
            emissions: Number(formatted),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Lifestyle footprint saved!");
      } else {
        alert(data.error || "Failed to save data");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-900 via-black to-blue-900 text-green-200">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Lifestyle Impact</h1>

      <div className="bg-gray-800/50 p-6 rounded-xl border border-green-600/40">
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Clothes Purchased (per month)"
            value={clothes}
            onChange={(e) => setClothes(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Gadgets Bought (per year)"
            value={gadgets}
            onChange={(e) => setGadgets(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Plastic Waste (kg/month)"
            value={plastic}
            onChange={(e) => setPlastic(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Recycling (kg/month)"
            value={recycle}
            onChange={(e) => setRecycle(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Water Usage (L/day)"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <button
            onClick={calculateLifestyle}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-6 text-xl text-green-300 font-bold">
            🌿 Sustainability Index: {result} pts
          </div>
        )}
      </div>
    </div>
  );
};

export default Lifestyle;
