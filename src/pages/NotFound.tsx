import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("Unknown route accessed:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 px-6">
      <div className="text-center max-w-lg">

        {/* Subtle icon */}
        <div className="text-5xl mb-4">🖥️</div>

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-2">
          Page not available
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Home
          </Link>

          <Link
            to="/contact"
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Contact Support
          </Link>
        </div>

        {/* Technical detail (subtle) */}
        <p className="mt-6 text-xs text-gray-400">
          Requested path: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
