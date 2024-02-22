import React from "react";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-10 py-12">
      <div className="flex justify-center space-x-4">
        <a href="https://github.com/rishabhbizzle/react-rover">
          <Github />
        </a>
      </div>
      {/* <div className="text-center text -gray-400 mt-8">
        <p>Mabe by bizzxle</p>
      </div> */}
    </footer>
  );
};

export default Footer;
