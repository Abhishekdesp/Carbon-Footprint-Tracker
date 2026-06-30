import React from "react";

const Summary = ({ today, week, month }) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-850 mb-4">
        Activity Summary 📊
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">

        <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-xl transition-all hover:shadow-sm">
          <h3 className="text-emerald-700 font-extrabold text-2xl">{today} kg</h3>
          <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mt-1">Today's CO₂</p>
        </div>

        <div className="bg-sky-50/60 border border-sky-100 p-5 rounded-xl transition-all hover:shadow-sm">
          <h3 className="text-sky-700 font-extrabold text-2xl">{week} kg</h3>
          <p className="text-sky-600 text-xs font-semibold uppercase tracking-wider mt-1">Weekly CO₂</p>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-xl transition-all hover:shadow-sm">
          <h3 className="text-amber-700 font-extrabold text-2xl">{month} kg</h3>
          <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider mt-1">Monthly CO₂</p>
        </div>

        <div className="bg-purple-50/60 border border-purple-100 p-5 rounded-xl transition-all hover:shadow-sm">
          <h3 className="text-purple-700 font-extrabold text-2xl">
            {week <= 50 ? "Good" : "Needs Improvement"}
          </h3>
          <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider mt-1">Lifestyle Score</p>
        </div>

      </div>
    </div>
  );
};

export default Summary;
