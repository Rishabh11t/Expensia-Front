import { useEffect, useRef, useState } from "react";
import {
  Menu, X, Home, History, BadgeDollarSign, Goal, UserCircle, SlidersVertical
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import SkeletonLoader from "../components/SkeletonLoader";

export default function UserLayout() {
  const { setSearch, logout, navigate, user, loading } = useAppContext();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await logout();
    } catch (error) {
      return null;
    }
  }

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, href: "/" },
    { name: "Add Transactions", icon: <BadgeDollarSign size={20} />, href: "/add-transactions" },
    { name: "Budgets", icon: <Goal size={20} />, href: "/budgets" },
    { name: "Set Budgets", icon: <SlidersVertical size={20} />, href: "/set-budgets" },
    { name: "Transactions", icon: <History size={20} />, href: "/transactions" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMobile = window.innerWidth < 768;

      if (isMobile && isOpen &&
        !sidebarRef.current?.contains(e.target) &&
        !toggleRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }

      if (showUserDropdown && !userDropdownRef.current?.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showUserDropdown]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-300 rounded-r-3xl shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-8">
          <span
            onClick={() => navigate("/")}
            className="text-3xl text-green-600 font-extrabold flex items-center gap-3 cursor-pointer"
          >
            <img src="./logo.png" alt="" className="size-14" />
            <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-800 to-blue-400 bg-clip-text text-transparent">Expensia</span>
          </span>
          <button
            ref={toggleRef}
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="px-5 space-y-4">
          {menuItems.map(({ name, icon, href }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 py-3 px-2.5 font-semibold rounded-xl border transition-all duration-200
              ${location.pathname === href
                  ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200 shadow-md"
                  : "border-transparent text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:shadow-lg"
                }`}
            >
              {icon} <span>{name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-50 via-white to-blue-100 border-b border-gray-200 px-4 py-4 flex items-center justify-between gap-4 shadow-sm">
          <button
            ref={toggleRef}
            className="md:hidden text-gray-800"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center justify-between md:w-full gap-4">

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button onClick={() => setShowUserDropdown(prev => !prev)} className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-full hover:bg-gray-100 transition">
                <UserCircle size={32} className="text-blue-700" />
                <span className="hidden md:inline text-base font-semibold text-gray-700">{user.email}</span>
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-gray-200 shadow-lg p-3 z-50">
                  <button
                    className="text-red-500 cursor-pointer bg-red-50 border w-full px-3 py-2 rounded border-red-500 text-sm font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          {loading ? <SkeletonLoader /> : <Outlet />}
        </main>
        <footer className="w-full fixed bottom-0 left-0 z-50 py-4 text-center text-gray-500 bg-white border-t shadow-lg">
          © 2025 Rishabh. All rights reserved
        </footer>
      </div>
    </div>
  );
}
