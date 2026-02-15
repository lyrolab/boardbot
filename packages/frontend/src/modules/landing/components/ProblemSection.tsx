import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AnimatedSection from "@/modules/landing/components/AnimatedSection"
import { landing } from "@/modules/landing/theme/landingTheme"

const messyCards = [
  { text: "Add dark mode please!", rotation: -6, top: 10, left: 20 },
  { text: "The app crashes on iOS", rotation: 3, top: 50, left: 40 },
  { text: "Can you integrate with Slack?", rotation: -2, top: 90, left: 10 },
  { text: "Dark mode would be nice", rotation: 5, top: 30, left: 60 },
  { text: "This is spam...", rotation: -4, top: 130, left: 35 },
  { text: "Please add notifications", rotation: 1, top: 70, left: 55 },
]

export default function ProblemSection() {
  return (
    <Box
      sx={{
        bgcolor: landing.bg.coolWhite,
        py: { xs: 8, md: 12 },
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 6,
          alignItems: "center",
        }}
      >
        <AnimatedSection direction="right">
          <Typography
            variant="h3"
            sx={{
              color: landing.text.primary,
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Drowning in unorganized feedback?
          </Typography>
          <Typography
            sx={{ color: landing.text.secondary, lineHeight: 1.8, mb: 2 }}
          >
            Product Owners spend hours sifting through user suggestions —
            duplicates pile up, spam sneaks in, and genuine insights get buried
            in the noise.
          </Typography>
          <Typography sx={{ color: landing.text.secondary, lineHeight: 1.8 }}>
            Without a system, valuable feedback slips through the cracks. Your
            roadmap ends up driven by whoever shouts loudest, not by what users
            actually need.
          </Typography>
        </AnimatedSection>

        <AnimatedSection direction="left" delay={200}>
          <Box
            sx={{
              position: "relative",
              height: 280,
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            {messyCards.map((card, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  top: card.top,
                  left: card.left,
                  transform: `rotate(${card.rotation}deg)`,
                  bgcolor: landing.bg.card,
                  border: "1px solid #e8e8ee",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  maxWidth: 220,
                  fontSize: "0.85rem",
                  color: landing.text.secondary,
                  whiteSpace: "nowrap",
                }}
              >
                {card.text}
              </Box>
            ))}
          </Box>
        </AnimatedSection>
      </Box>
    </Box>
  )
}
