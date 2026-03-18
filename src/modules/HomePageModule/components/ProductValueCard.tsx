import { LucideIcon } from "lucide-react";

interface ProductValueCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ProductValueCard = ({ title, description, icon: Icon }: ProductValueCardProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full h-40 sm:h-44 md:h-48 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="absolute -top-2 -right-2">
          <Icon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white opacity-40 rotate-12" />
        </div>
        <div className="flex flex-col justify-center items-start p-4 sm:p-5 md:p-6 text-center h-full">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 w-full">
            {title}
          </h3>
          <p className="text-white/90 text-sm w-full">{description}</p>
        </div>
      </div>
    </div>
  );
};
