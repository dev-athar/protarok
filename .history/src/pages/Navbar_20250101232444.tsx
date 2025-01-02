// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-gray-800 flex justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link
        to="/"
        className="text-white text-2xl font-bold hover:text-gray-300"
      >
        PROTAROK
      </Link>
    </div>
  );
};

export default Navbar;
