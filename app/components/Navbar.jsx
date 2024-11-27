"use client";
import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#09090b] border-b border-[#fafafa]/10 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-[#fafafa]">Wipsy</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;