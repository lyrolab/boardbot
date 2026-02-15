import Typography, { type TypographyProps } from "@mui/material/Typography"
import { landing } from "@/modules/landing/theme/landingTheme"

interface GradientTextProps extends Omit<TypographyProps, "color"> {
  gradient?: string
}

export default function GradientText({
  gradient = landing.gradient.text,
  sx,
  ...props
}: GradientTextProps) {
  return (
    <Typography
      component="span"
      {...props}
      sx={{
        background: gradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...sx,
      }}
    />
  )
}
