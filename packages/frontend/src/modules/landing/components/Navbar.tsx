import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import GradientText from "@/modules/landing/components/GradientText"
import { landing } from "@/modules/landing/theme/landingTheme"
import { LoginButton } from "@/modules/auth/components/LoginButton"

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        gap: 3,
        px: 3,
        py: 1.5,
        borderRadius: 50,
        bgcolor: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <GradientText
        variant="h6"
        sx={{ fontWeight: 700, mr: 2, cursor: "pointer" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        BoardBot
      </GradientText>

      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
        {navLinks.map((link) => (
          <Button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            sx={{
              color: landing.text.secondary,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { color: landing.text.primary },
            }}
          >
            {link.label}
          </Button>
        ))}
      </Box>

      <LoginButton
        variant="contained"
        sx={{
          bgcolor: landing.accent.coral,
          color: "#fff",
          textTransform: "none",
          borderRadius: 50,
          px: 3,
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            bgcolor: landing.accent.coralHover,
            boxShadow: "0 4px 16px rgba(255,107,107,0.3)",
          },
        }}
      />
    </Box>
  )
}
