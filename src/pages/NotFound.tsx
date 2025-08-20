import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const NotFound = () => {
  const location = useLocation();
  useScrollToTop();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-8xl md:text-9xl font-extrabold bg-quiz-gradient bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-300">Oops! Page not found</p>
        <a
          href="/"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
