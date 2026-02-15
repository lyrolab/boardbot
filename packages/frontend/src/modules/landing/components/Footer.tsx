import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import GradientText from "@/modules/landing/components/GradientText"
import { landing } from "@/modules/landing/theme/landingTheme"

const footerLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
]

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: landing.bg.navy,
        py: 6,
        px: 3,
        textAlign: "center",
      }}
    >
      <GradientText
        variant="h6"
        sx={{ fontWeight: 700, mb: 2, display: "block" }}
      >
        BoardBot
      </GradientText>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        {footerLinks.map((link) => (
          <Button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            sx={{
              color: landing.text.light,
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": { color: "#fff" },
            }}
          >
            {link.label}
          </Button>
        ))}
      </Box>

      <Typography sx={{ color: "rgba(240,230,214,0.5)", fontSize: "0.85rem" }}>
        &copy; {new Date().getFullYear()} BoardBot. All rights reserved.
      </Typography>
    </Box>
  )
}
