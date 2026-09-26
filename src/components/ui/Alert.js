// src/components/ui/Alert.jsx
import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function Alert({
  title,
  description,
  variant = "info",
  className = "",
}) {
  const styles = {
    info: {
      wrapper: "bg-blue-50 border-blue-100",
      icon: <Info className="w-5 h-5 text-blue-600" />,
      title: "text-blue-800",
      desc: "text-blue-600",
    },
    success: {
      wrapper: "bg-success-50 border-success-200",
      icon: <CheckCircle2 className="w-5 h-5 text-success-600" />,
      title: "text-success-800",
      desc: "text-success-700",
    },
    warning: {
      wrapper: "bg-amber-50 border-amber-200",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      title: "text-amber-800",
      desc: "text-amber-700",
    },
    error: {
      wrapper: "bg-red-50 border-red-200",
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      title: "text-red-800",
      desc: "text-red-600",
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`p-4 rounded-2xl border flex items-start gap-4 ${current.wrapper} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">{current.icon}</div>
      <div>
        {title && (
          <h4 className={`text-sm font-bold mb-1 ${current.title}`}>{title}</h4>
        )}
        {description && (
          <p className={`text-sm leading-relaxed ${current.desc}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
