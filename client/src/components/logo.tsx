import { Search } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "p-2 text-sm",
    md: "p-3 text-xl",
    lg: "p-4 text-2xl"
  };

  return (
    <div className={`flex items-center bg-orange-500 rounded-full ${sizeClasses[size]}`}>
      <div className="flex items-center space-x-1">
        <span className="text-black font-bold">P</span>
        <span className="text-black font-bold">C</span>
        <Search className="text-black ml-1" size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
      </div>
    </div>
  );
}
