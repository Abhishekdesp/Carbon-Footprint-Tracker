import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPhoto from "../../components/UploadPhoto";
import Recommendations from "../../components/Recommendations";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            credentials: "include"
          }
        );

        if (!res.ok) return navigate("/");

        const data = await res.json();
        setUser(data.user);
      } catch {
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );

  // Open edit modal
  const openEdit = () => {
    setForm({ name: user.name, email: user.email });
    setEditOpen(true);
  };

  // Handle saving
  const saveProfile = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form),
          credentials: "include"
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // update UI
        setEditOpen(false);
        alert("Profile updated!");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-2xl max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">
          👤 User Profile
        </h1>

        {/* Avatar */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-600 text-white text-4xl font-semibold rounded-full flex items-center justify-center shadow-lg shadow-green-600/10">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 text-lg text-gray-700 bg-gray-50 border border-gray-100 p-5 rounded-xl">
          <p>
            <span className="font-semibold text-gray-500 mr-2">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold text-gray-500 mr-2">Email:</span> {user.email}
          </p>
        </div>

        {/* Edit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={openEdit}
            className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/10 transition-all hover:scale-[1.02]"
          >
            Edit Profile
          </button>
        </div>

        {/* Upload & Tips */}
        <UploadPhoto />
        <Recommendations />
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-gray-250 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-gray-250 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-medium rounded-lg transition-all"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md shadow-green-600/10 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
