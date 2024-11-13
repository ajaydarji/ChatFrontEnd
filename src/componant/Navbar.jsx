import React from "react";
import { assets } from "../assets/assets";

function Navbar() {
  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" />
      <ul className="navbar-manu">
        <li>Home</li>
        <li>Menu</li>
        <li>Contact-Us</li>
      </ul>
    </div>
  );
}

export default Navbar;
