import React from "react";

const Summary = ({ today, week, month }) => {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-blue-600 shadow-md">
      <h2 className="text-xl font-semibold text-blue-300 mb-3">
        Activity Summary 📊
      </h2>

      <div className="grid grid-cols-2 gap-4 text-center">

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-green-300 font-bold text-2xl">{today} kg</h3>
          <p className="text-green-100 text-sm">Today's CO₂</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-blue-300 font-bold text-2xl">{week} kg</h3>
          <p className="text-blue-100 text-sm">Weekly CO₂</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-yellow-300 font-bold text-2xl">{month} kg</h3>
          <p className="text-yellow-100 text-sm">Monthly CO₂</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-purple-300 font-bold text-2xl">
            {week <= 50 ? "Good" : "Needs Improvement"}
          </h3>
          <p className="text-purple-100 text-sm">Lifestyle Score</p>
        </div>

      </div>
    </div>
  );
};

export default Summary;
