import React from "react";
import { LucideIcon } from "lucide-react";

interface ProductValueCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ProductValueCard = ({ title, description, icon: Icon }: ProductValueCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-75 h-36 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="absolute -top-2 -right-2">
          <Icon className="w-24 h-24 text-white opacity-40 rotate-12" />
        </div>
        <div className="flex flex-col justify-center items-start p-6 text-center h-full">
          <h3 className="text-xl font-bold text-white mb-3 w-full">
            {title}
          </h3>
          <p className="text-white/90 text-sm w-full">{description}</p>
        </div>
      </div>
    </div>
  );
};
