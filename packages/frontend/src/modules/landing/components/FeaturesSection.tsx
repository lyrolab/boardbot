import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ShieldIcon from "@mui/icons-material/Shield"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import LabelIcon from "@mui/icons-material/Label"
import AnimatedSection from "@/modules/landing/components/AnimatedSection"
import GradientText from "@/modules/landing/components/GradientText"
import { landing } from "@/modules/landing/theme/landingTheme"

const features = [
  {
    icon: <ShieldIcon sx={{ fontSize: 32, color: landing.accent.coral }} />,
    gradient: landing.gradient.coralBar,
    title: "Content Moderation",
    description:
      "Automatically filters out spam, bug reports, and incomplete suggestions so your board stays clean and actionable.",
  },
  {
    icon: <ContentCopyIcon sx={{ fontSize: 32, color: landing.accent.teal }} />,
    gradient: landing.gradient.tealBar,
    title: "Duplicate Detection",
    description:
      "AI identifies and merges duplicate suggestions, giving you a clear picture of what users actually want.",
  },
  {
    icon: <LabelIcon sx={{ fontSize: 32, color: "#e6a817" }} />,
    gradient: landing.gradient.amberBar,
    title: "Smart Tags",
    description:
      "Every suggestion is automatically categorized with your predefined tags — no manual sorting required.",
  },
]

export default function FeaturesSection() {
  return (
    <Box
      id="features"
      sx={{
        bgcolor: landing.bg.coolWhite,
        py: { xs: 8, md: 12 },
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", textAlign: "center" }}>
        <AnimatedSection>
          <Typography
            variant="h3"
            sx={{
              color: landing.text.primary,
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Powerful{" "}
            <GradientText
              variant="h3"
              sx={{ fontWeight: 700, fontSize: "inherit" }}
            >
              features
            </GradientText>
          </Typography>
          <Typography
            sx={{
              color: landing.text.secondary,
              mb: 6,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Everything you need to manage feedback at scale
          </Typography>
        </AnimatedSection>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 150}>
              <Box
                sx={{
                  bgcolor: landing.bg.card,
                  borderRadius: 3,
                  p: 4,
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: feature.gradient,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{ color: landing.text.primary, fontWeight: 700, mb: 1 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{ color: landing.text.secondary, lineHeight: 1.7 }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </AnimatedSection>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
