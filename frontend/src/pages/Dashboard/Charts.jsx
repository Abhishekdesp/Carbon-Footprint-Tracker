import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Charts = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchWeeklyChart();
    fetchCategoryBreakdown();
  }, []);

  // Fetch last 7-day footprint
  const fetchWeeklyChart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/footprint/weekly-chart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Backend error:", await res.text());
        return;
      }
      const data = await res.json();
      setWeeklyData(data);
    } catch (err) {
      console.error("Chart Error:", err);
    }
  };

  // Fetch monthly totals per category
  const fetchCategoryBreakdown = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8000/footprint/category-breakdown",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setCategoryData([
        { category: "Transport", value: data.transport },
        { category: "Electricity", value: data.electricity },
        { category: "Food", value: data.food },
        { category: "Lifestyle", value: data.lifestyle },
      ]);
    } catch (err) {
      console.error("Category Error:", err);
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-purple-600 shadow-md">
      <h2 className="text-xl font-semibold text-purple-300 mb-4">
        Weekly Carbon Footprint Chart 📈
      </h2>

      <div className="min-h-[260px] h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <Line
              type="monotone"
              dataKey="carbon"
              stroke="#4ade80"
              strokeWidth={3}
            />
            <CartesianGrid stroke="#555" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-semibold text-orange-300 mt-8 mb-3">
        Category Breakdown (Monthly) 📊
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid stroke="#555" />
            <XAxis dataKey="category" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
