import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        info:
          "border-transparent bg-info text-info-foreground [a&]:hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 dark:bg-info/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Property status variants with creative styling
        available:
          "border-2 border-green-400/50 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 [a&]:hover:shadow-green-500/50 [a&]:hover:from-green-600 [a&]:hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:border-green-300/40 dark:shadow-green-600/40 backdrop-blur-sm",
        sold:
          "border-2 border-gray-700/50 bg-gradient-to-r from-gray-800 to-black text-white shadow-lg shadow-gray-800/30 [a&]:hover:shadow-gray-800/50 [a&]:hover:from-gray-900 [a&]:hover:to-black dark:from-gray-900 dark:to-black dark:border-gray-600/40 dark:shadow-gray-900/40 backdrop-blur-sm",
        pending:
          "border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30 [a&]:hover:shadow-yellow-500/50 [a&]:hover:from-yellow-500 [a&]:hover:to-amber-600 dark:from-yellow-500 dark:to-amber-600 dark:border-yellow-300/40 dark:shadow-yellow-600/40 backdrop-blur-sm",
        reserved:
          "border-2 border-blue-400/50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 [a&]:hover:shadow-blue-500/50 [a&]:hover:from-blue-600 [a&]:hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:border-blue-300/40 dark:shadow-blue-600/40 backdrop-blur-sm",
        "off-market":
          "border-2 border-gray-400/50 bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/30 [a&]:hover:shadow-gray-500/50 [a&]:hover:from-gray-600 [a&]:hover:to-slate-700 dark:from-gray-600 dark:to-slate-700 dark:border-gray-300/40 dark:shadow-gray-600/40 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
