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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/lifestyle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clothes: Number(clothes),
            gadgets: Number(gadgets),
            plastic: Number(plastic),
            recycle: Number(recycle),
            water: Number(water),
            emissions: Number(formatted),
          }),
          credentials: "include"
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
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lifestyle Impact</h1>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Clothes Purchased (per month)</label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={clothes}
                onChange={(e) => setClothes(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Gadgets Bought (per year)</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={gadgets}
                onChange={(e) => setGadgets(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Plastic Waste (kg/month)</label>
              <input
                type="number"
                placeholder="e.g. 4"
                value={plastic}
                onChange={(e) => setPlastic(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Recycling (kg/month)</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={recycle}
                onChange={(e) => setRecycle(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Water Usage (L/day)</label>
              <input
                type="number"
                placeholder="e.g. 150"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <button
              onClick={calculateLifestyle}
              className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-lg shadow-green-600/10 transition-all hover:scale-[1.01]"
            >
              Calculate Emissions
            </button>
          </div>

          {result && (
            <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 font-bold text-center">
              🌿 Sustainability Index: <span className="text-2xl ml-1">{result}</span> pts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;
