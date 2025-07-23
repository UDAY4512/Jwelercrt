import { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Get admin profile
    axios
      .get("http://localhost:5000/api/admin/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAdmin(res.data.admin))
      .catch((err) => console.error("Profile fetch error", err));
  }, [token]);

  const handlePasswordUpdate = async () => {
    if (!newPassword.trim()) return alert("Password cannot be empty!");

    try {
      await axios.put(
        "http://localhost:5000/api/admin/auth/update-password",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      alert("Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold">Admin Settings</h2>

      <div className="bg-white p-4 rounded shadow">
        <p>
          <strong>Name:</strong> {admin.name}
        </p>
        <p>
          <strong>Email:</strong> {admin.email}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Change Password</h4>
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Logout</h4>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
