import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AnimatedSection from "@/modules/landing/components/AnimatedSection"
import BlobShape from "@/modules/landing/components/BlobShape"
import GradientText from "@/modules/landing/components/GradientText"
import { landing } from "@/modules/landing/theme/landingTheme"

const stats = [
  {
    value: "10×",
    label: "Faster processing",
    gradient: landing.gradient.sunset,
  },
  {
    value: "Zero",
    label: "Spam gets through",
    gradient: landing.gradient.ocean,
  },
  {
    value: "100%",
    label: "Posts auto-tagged",
    gradient: landing.gradient.text,
  },
  {
    value: "Auto",
    label: "Duplicates merged",
    gradient: landing.gradient.sunset,
  },
]

export default function BenefitsSection() {
  return (
    <Box
      id="benefits"
      sx={{
        position: "relative",
        bgcolor: landing.bg.cream,
        py: { xs: 8, md: 12 },
        px: 3,
        overflow: "hidden",
      }}
    >
      <BlobShape
        color={landing.blob.teal}
        size={500}
        top="-10%"
        right="-10%"
        duration={24}
      />

      <Box sx={{ maxWidth: 900, mx: "auto", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <Typography
            variant="h3"
            sx={{
              color: landing.text.primary,
              fontWeight: 700,
              mb: 2,
              textAlign: "center",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Results that{" "}
            <GradientText
              variant="h3"
              sx={{ fontWeight: 700, fontSize: "inherit" }}
            >
              speak for themselves
            </GradientText>
          </Typography>
          <Typography
            sx={{
              color: landing.text.secondary,
              mb: 6,
              textAlign: "center",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Let AI handle the busywork while you focus on strategy
          </Typography>
        </AnimatedSection>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 100}>
              <Box
                sx={{
                  background: stat.gradient,
                  borderRadius: 3,
                  p: "1px",
                }}
              >
                <Box
                  sx={{
                    bgcolor: landing.bg.card,
                    borderRadius: 3,
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  <GradientText
                    variant="h3"
                    gradient={stat.gradient}
                    sx={{ fontWeight: 800, mb: 1, display: "block" }}
                  >
                    {stat.value}
                  </GradientText>
                  <Typography
                    sx={{ color: landing.text.secondary, fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            </AnimatedSection>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
