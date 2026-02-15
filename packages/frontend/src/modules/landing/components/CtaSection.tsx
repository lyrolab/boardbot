import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AnimatedSection from "@/modules/landing/components/AnimatedSection"
import { landing } from "@/modules/landing/theme/landingTheme"
import { LoginButton } from "@/modules/auth/components/LoginButton"

export default function CtaSection() {
  return (
    <Box
      sx={{
        background: landing.gradient.cta,
        backgroundSize: "200% 200%",
        animation: "ctaShift 8s ease-in-out infinite",
        py: { xs: 8, md: 12 },
        px: 3,
        textAlign: "center",
        "@keyframes ctaShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <AnimatedSection>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Ready to tame your feedback?
          </Typography>
          <Typography
            sx={{ color: "rgba(255,255,255,0.9)", mb: 4, fontSize: "1.1rem" }}
          >
            Start organizing user suggestions with AI — it only takes a minute
            to set up.
          </Typography>
          <LoginButton
            unauthenticatedLabel="Get Started Free"
            authenticatedLabel="Open App"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#fff",
              color: landing.accent.coral,
              textTransform: "none",
              borderRadius: 50,
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#fff",
                boxShadow: "0 6px 28px rgba(0,0,0,0.2)",
              },
            }}
          />
        </AnimatedSection>
      </Box>
    </Box>
  )
}
