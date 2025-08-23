import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-8xl md:text-9xl font-extrabold text-primary">
            404
          </h1>
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
          <a
            href="/"
            className="text-primary hover:text-accent underline"
          >
            Return to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
