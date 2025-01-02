// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-16  bg-white flex justify-center items-center drop-shadow-lg transition-shadow duration-300">
      <Link
        to="/"
        className="text-gray-800 text-2xl font-semibold hover:text-gray-600"
      >
        ✦__প্রতারক__✦
      </Link>
    </div>
  );
};

export default Navbar;
