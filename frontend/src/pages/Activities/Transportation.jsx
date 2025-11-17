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

    // road transportation
    if (fuel && distance) {
      total += distance * emissionRates[fuel];
    }

    // flights
    const flightEmission = flights * 150; // approx kg/trip
    total += flightEmission;

    const formatted = total.toFixed(2);
    setResult(formatted);

    // send to backend
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("${import.meta.env.VITE_API_URL}/footprint/transportation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        vehicle,
        fuel,
        distance: Number(distance),
        flights: Number(flights),
        emissions: Number(formatted),
        }),
      });

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-black text-green-200">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Transportation Footprint</h1>

      <div className="bg-gray-800/50 p-6 rounded-xl border border-green-600/40">
        
        <div className="space-y-3">
          <select
            className="w-full p-3 bg-gray-900/60 rounded-lg"
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

          <select
            className="w-full p-3 bg-gray-900/60 rounded-lg"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
          >
            <option value="">Select Fuel Type</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>CNG</option>
            <option>Electric</option>
          </select>

          <input
            type="number"
            placeholder="Distance travelled (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <input
            type="number"
            placeholder="Number of flights (per month)"
            value={flights}
            onChange={(e) => setFlights(e.target.value)}
            className="w-full p-3 bg-gray-900/60 rounded-lg"
          />

          <button
            onClick={calculateFootprint}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-6 text-xl font-bold text-green-300">
            🌍 Total CO₂: {result} kg/month
          </div>
        )}
      </div>
    </div>
  );
};

export default Transportation;
