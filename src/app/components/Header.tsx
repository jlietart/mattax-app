import React from "react";
import GoogleLogin from "./GoogleLogin";

const Header: React.FC = () => {
  return (
    <header className="w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          MATTAX - Find your email invoices easily
        </h1>
        <GoogleLogin />
      </div>
    </header>
  );
};

export default Header;
