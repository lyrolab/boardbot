import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ReactNode } from "react"

interface ResponsiveDrawerProps {
  children: ReactNode
  side?: "left" | "right" | "top" | "bottom"
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResponsiveDrawer({
  children,
  side = "right",
  className,
  ...props
}: ResponsiveDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Sheet {...props}>
      <SheetContent
        side={isDesktop ? "right" : side}
        className={className}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {children}
      </SheetContent>
    </Sheet>
  )
}
