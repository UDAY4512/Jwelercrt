// src/components/Topbar.jsx
const Topbar = () => {
  return (
    <header className="bg-white border-b px-4 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      <div className="text-sm text-gray-600">Welcome, Admin</div>
    </header>
  );
};

export default Topbar;
