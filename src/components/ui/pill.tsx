import * as React from "react"
import { cn } from "@/lib/utils"

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  active?: boolean
}

const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, label, active, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-lg border transition-all font-medium text-[13px]",
          active
            ? "bg-[#fff0e0] border-[#fa8613] text-[#fa8613]"
            : "bg-white border-[#e8e8e8] text-[#2b2b2b] hover:border-[#fa8613]",
          className
        )}
        {...props}
      >
        {label}
      </button>
    )
  }
)
Pill.displayName = "Pill"

export { Pill }