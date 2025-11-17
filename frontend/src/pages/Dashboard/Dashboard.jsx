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
        const response = await fetch("${import.meta.env.VITE_API_URL}/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        const response = await fetch("${import.meta.env.VITE_API_URL}/footprint/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSummary(data);

      } catch (error) {
        console.error("Summary Fetch Error:", error);
      }
    };

    // Fetch streak + badge
    const fetchReward = async () => {
      try {
        const response = await fetch("http://localhost:8000/rewards", {
          headers: { Authorization: `Bearer ${token}` },
        });

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
  }, []);

  if (!user || !reward)
    return <div className="p-6 text-xl">Loading Dashboard...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">

      {/* Top Header */}
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {user.name} 🌱
        </h1>

        {/* STREAK + BADGE SECTION */}
        <p className="text-lg text-green-700 mt-2">
          🔥 <b>Streak:</b> {reward.streak} days
        </p>

        <p className="text-lg text-green-700 mt-2">
          🏆 <b>Badge:</b> {reward.badge}
        </p>
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
