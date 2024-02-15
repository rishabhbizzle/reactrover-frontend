import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import React from "react";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  return (
    <div>
      <nav className="flex justify-between items-center py-4 px-8 border-b border-gray-800">
        <div>RR</div>
        <div className="flex items-center space-x-4">
          {isSignedIn ? <UserButton /> : <SignInButton />}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
