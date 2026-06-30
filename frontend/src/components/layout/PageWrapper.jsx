// src/components/layout/PageWrapper.jsx
// Wraps all routes with Navbar + Footer + page fade-in transition

import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PageWrapper = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark">
      <Navbar />
      <main
        className="flex-1 animate-fadeIn"
        id="main-content"
        role="main"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PageWrapper;
