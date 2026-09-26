// src/components/ui/Card.jsx
import React from "react";

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
