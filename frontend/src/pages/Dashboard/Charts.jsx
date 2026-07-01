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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/weekly-chart`,
        {
          credentials: "include"
        }
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/footprint/category-breakdown`,
        {
          credentials: "include"
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
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Weekly Carbon Footprint Chart 📈
      </h2>

      <div className="min-h-[260px] h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <Line
              type="monotone"
              dataKey="carbon"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
        Category Breakdown (Monthly) 📊
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
            <XAxis dataKey="category" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
