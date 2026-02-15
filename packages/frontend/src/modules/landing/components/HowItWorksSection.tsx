import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LinkIcon from "@mui/icons-material/Link"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import FactCheckIcon from "@mui/icons-material/FactCheck"
import AnimatedSection from "@/modules/landing/components/AnimatedSection"
import GradientText from "@/modules/landing/components/GradientText"
import { landing } from "@/modules/landing/theme/landingTheme"

const steps = [
  {
    icon: <LinkIcon sx={{ fontSize: 32, color: "#fff" }} />,
    gradient: landing.gradient.sunset,
    number: "1",
    title: "Connect",
    description:
      "Link your feedback board and let BoardBot start ingesting user suggestions.",
  },
  {
    icon: <AutoFixHighIcon sx={{ fontSize: 32, color: "#fff" }} />,
    gradient: landing.gradient.ocean,
    number: "2",
    title: "Process",
    description:
      "AI automatically categorizes, deduplicates, and moderates every incoming post.",
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: 32, color: "#fff" }} />,
    gradient: landing.gradient.sunset,
    number: "3",
    title: "Review",
    description:
      "Approve, reject, or tweak AI decisions — or let automation handle everything.",
  },
]

export default function HowItWorksSection() {
  return (
    <Box
      id="how-it-works"
      sx={{
        bgcolor: landing.bg.cream,
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
            How it{" "}
            <GradientText
              variant="h3"
              sx={{ fontWeight: 700, fontSize: "inherit" }}
              gradient={landing.gradient.ocean}
            >
              works
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
            Three simple steps to transform your feedback workflow
          </Typography>
        </AnimatedSection>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 150}>
              <Box
                sx={{
                  bgcolor: landing.bg.card,
                  borderRadius: 3,
                  p: 4,
                  textAlign: "center",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: step.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {step.icon}
                </Box>
                <Typography
                  sx={{
                    color: landing.text.secondary,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Step {step.number}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: landing.text.primary, fontWeight: 700, mb: 1 }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{ color: landing.text.secondary, lineHeight: 1.7 }}
                >
                  {step.description}
                </Typography>
              </Box>
            </AnimatedSection>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
