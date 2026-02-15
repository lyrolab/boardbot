import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import AnimatedSection from "@/modules/landing/components/AnimatedSection"
import BlobShape from "@/modules/landing/components/BlobShape"
import GradientText from "@/modules/landing/components/GradientText"
import { landing } from "@/modules/landing/theme/landingTheme"
import { LoginButton } from "@/modules/auth/components/LoginButton"

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: landing.bg.cream,
        overflow: "hidden",
        px: 3,
      }}
    >
      <BlobShape
        color={landing.blob.coral}
        size={400}
        top="-5%"
        left="-5%"
        duration={18}
      />
      <BlobShape
        color={landing.blob.teal}
        size={350}
        top="20%"
        right="-8%"
        duration={22}
        delay={3}
      />
      <BlobShape
        color={landing.blob.amber}
        size={300}
        bottom="10%"
        left="15%"
        duration={25}
        delay={5}
      />
      <BlobShape
        color={landing.blob.pink}
        size={250}
        bottom="-5%"
        right="20%"
        duration={20}
        delay={8}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 720,
        }}
      >
        <AnimatedSection delay={0}>
          <Typography
            variant="overline"
            sx={{
              color: landing.accent.coral,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
              display: "block",
            }}
          >
            AI-Powered Feedback Management
          </Typography>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <Typography
            variant="h2"
            sx={{
              color: landing.text.primary,
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 3,
              fontSize: { xs: "2.2rem", md: "3.5rem" },
            }}
          >
            Turn feedback noise into{" "}
            <GradientText
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              product clarity
            </GradientText>
          </Typography>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <Typography
            sx={{
              color: landing.text.secondary,
              fontSize: { xs: "1rem", md: "1.2rem" },
              lineHeight: 1.7,
              maxWidth: 600,
              mx: "auto",
              mb: 4,
            }}
          >
            BoardBot uses AI to automatically categorize, deduplicate, and
            moderate user suggestions — so you can focus on building what
            matters.
          </Typography>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <LoginButton
              variant="contained"
              size="large"
              sx={{
                bgcolor: landing.accent.coral,
                color: "#fff",
                textTransform: "none",
                borderRadius: 50,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 20px rgba(255,107,107,0.3)",
                "&:hover": {
                  bgcolor: landing.accent.coralHover,
                  boxShadow: "0 6px 28px rgba(255,107,107,0.4)",
                },
              }}
            />
            <Button
              variant="outlined"
              size="large"
              onClick={() =>
                document
                  .querySelector("#how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              sx={{
                color: landing.text.primary,
                borderColor: landing.text.primary,
                textTransform: "none",
                borderRadius: 50,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": {
                  borderColor: landing.accent.coral,
                  color: landing.accent.coral,
                  bgcolor: "transparent",
                },
              }}
            >
              See How It Works
            </Button>
          </Box>
        </AnimatedSection>
      </Box>
    </Box>
  )
}
