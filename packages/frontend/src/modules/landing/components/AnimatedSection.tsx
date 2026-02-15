import Box from "@mui/material/Box"
import { useInView } from "@/modules/landing/hooks/useInView"
import type { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

const directionTransform = {
  up: "translateY(40px)",
  down: "translateY(-40px)",
  left: "translateX(40px)",
  right: "translateX(-40px)",
}

export default function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView()

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : directionTransform[direction],
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Box>
  )
}
