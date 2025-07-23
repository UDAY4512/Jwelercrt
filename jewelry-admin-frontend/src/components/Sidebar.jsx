// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { FiBox, FiPlusCircle, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Add Product", icon: <FiPlusCircle />, path: "/dashboard/add" },
    { label: "All Products", icon: <FiBox />, path: "/dashboard/products" },
    { label: "Settings", icon: <FiSettings />, path: "/dashboard/settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-4 text-xl font-bold text-blue-600">Admin Panel</div>
      <nav className="px-2 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 ${
              location.pathname === item.path ? "bg-blue-100" : ""
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
