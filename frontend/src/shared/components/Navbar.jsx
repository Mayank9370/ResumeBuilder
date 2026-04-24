// Navbar Component
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // Sourced from AuthContext

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
            >
              Resume Builder
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/resume"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname.startsWith("/resume")
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Create Resume
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  My Resumes
                </Link>
                <div className="flex items-center gap-3 ml-2">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
