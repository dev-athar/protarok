// src/components/Navbar.js
import { Link } from "react-router-dom";
import "./Navbar.css"; // We'll add styles in the next step

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="navbar-link">
        PROTAROK
      </Link>
    </div>
  );
};

export default Navbar;
