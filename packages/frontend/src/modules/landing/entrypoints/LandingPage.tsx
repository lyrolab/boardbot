import Box from "@mui/material/Box"
import Navbar from "@/modules/landing/components/Navbar"
import HeroSection from "@/modules/landing/components/HeroSection"
import ProblemSection from "@/modules/landing/components/ProblemSection"
import HowItWorksSection from "@/modules/landing/components/HowItWorksSection"
import FeaturesSection from "@/modules/landing/components/FeaturesSection"
import BenefitsSection from "@/modules/landing/components/BenefitsSection"
import CtaSection from "@/modules/landing/components/CtaSection"
import Footer from "@/modules/landing/components/Footer"
import { landing } from "@/modules/landing/theme/landingTheme"

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: landing.bg.cream, overflowX: "hidden" }}>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BenefitsSection />
      <CtaSection />
      <Footer />
    </Box>
  )
}
