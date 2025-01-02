// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-4 p-4 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg">
      <div className="flex justify-center items-center">
        <Link
          to="/"
          className="text-gray-800 text-3xl font-semibold hover:text-gray-600"
        >
          PROTAROK
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
