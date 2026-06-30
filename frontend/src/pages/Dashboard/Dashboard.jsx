import React, { useEffect, useState } from "react";
import Insights from "./Insights";
import Summary from "./Summary";
import Charts from "./Charts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reward, setReward] = useState(null);
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
  });

  // Check token + fetch user details
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);

      } catch (error) {
        console.error("Dashboard Error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    // Fetch Summary
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/footprint/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setSummary(data);

      } catch (error) {
        console.error("Summary Fetch Error:", error);
      }
    };

    // Fetch streak + badge
    const fetchReward = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/rewards`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setReward(data);
        }
      } catch (error) {
        console.error("Reward Fetch Error:", error);
      }
    };

    fetchUser();
    fetchSummary();
    fetchReward();
  }, [navigate]);

  if (!user || !reward)
    return <div className="p-6 text-xl">Loading Dashboard...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name} 🌱
          </h1>
          <p className="text-gray-500 mt-1">Here is your carbon footprint breakdown and sustainability score.</p>
        </div>

        {/* STREAK + BADGE SECTION */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100 px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            🔥 <b>Streak:</b> {reward.streak} days
          </span>
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-100 px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            🏆 <b>Badge:</b> {reward.badge}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <Summary
        today={summary.today}
        week={summary.week}
        month={summary.month}
      />

      {/* Insights & Charts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Insights />
        <Charts />
      </div>
    </div>
  );
}
