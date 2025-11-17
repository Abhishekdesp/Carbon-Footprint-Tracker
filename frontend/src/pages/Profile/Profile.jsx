import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return navigate("/login");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user)
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;

  // Open edit modal
  const openEdit = () => {
    setForm({ name: user.name, email: user.email });
    setEditOpen(true);
  };

  // Handle saving
  const saveProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // update UI
        setEditOpen(false);
        alert("Profile updated!");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white shadow-md p-6 rounded-2xl max-w-xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">
          👤 User Profile
        </h1>

        {/* Avatar */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-600 text-white text-4xl rounded-full flex items-center justify-center shadow">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 text-lg text-gray-700">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
        </div>

        {/* Edit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={openEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">

            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Name"
              />

              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Email"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
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
