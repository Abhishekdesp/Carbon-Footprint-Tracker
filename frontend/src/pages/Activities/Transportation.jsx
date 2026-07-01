import React, { useState } from "react";

const Transportation = () => {
  const [vehicle, setVehicle] = useState("");
  const [fuel, setFuel] = useState("");
  const [distance, setDistance] = useState("");
  const [flights, setFlights] = useState("");
  const [result, setResult] = useState(null);

  const calculateFootprint = async () => {
    let total = 0;

    const emissionRates = {
      Petrol: 0.192,
      Diesel: 0.171,
      CNG: 0.119,
      Electric: 0.05,
      Bus: 0.089,
      Train: 0.041,
    };

    // Road transportation emissions
    if (fuel && distance) {
      total += distance * emissionRates[fuel];
    }

    // Flights (approx kg/trip)
    const flightEmission = flights * 150;
    total += flightEmission;

    const formatted = total.toFixed(2);
    setResult(formatted);

    // Send to backend
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/transportation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehicle,
            fuel,
            distance: Number(distance),
            flights: Number(flights),
            emissions: Number(formatted),
          }),
          credentials: "include"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Transportation footprint saved!");
      } else {
        alert(data.error || "Error saving footprint");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Could not connect to server");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Transportation Footprint</h1>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Vehicle Type</label>
              <select
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
              >
                <option value="">Select Vehicle Type</option>
                <option>Car</option>
                <option>Bike</option>
                <option>EV</option>
                <option>Bus</option>
                <option>Train</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Fuel Type</label>
              <select
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              >
                <option value="">Select Fuel Type</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>Electric</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Distance Travelled (km)</label>
              <input
                type="number"
                placeholder="e.g. 150"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700">Number of Flights (per month)</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={flights}
                onChange={(e) => setFlights(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <button
              onClick={calculateFootprint}
              className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-lg shadow-green-600/10 transition-all hover:scale-[1.01]"
            >
              Calculate Emissions
            </button>
          </div>

          {result && (
            <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 font-bold text-center">
              🌍 Total CO₂: <span className="text-2xl ml-1">{result}</span> kg/month
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transportation;
