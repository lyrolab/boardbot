import Box from "@mui/material/Box"

interface BlobShapeProps {
  color: string
  size: number | string
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  duration?: number
  delay?: number
}

export default function BlobShape({
  color,
  size,
  top,
  left,
  right,
  bottom,
  duration = 20,
  delay = 0,
}: BlobShapeProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        background: color,
        filter: "blur(40px)",
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        animation: `blobMorph ${duration}s ease-in-out infinite, blobFloat ${duration * 1.3}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none",
        "@keyframes blobMorph": {
          "0%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
          "25%": { borderRadius: "58% 42% 75% 25% / 76% 46% 54% 24%" },
          "50%": { borderRadius: "50% 50% 33% 67% / 55% 27% 73% 45%" },
          "75%": { borderRadius: "33% 67% 58% 42% / 63% 68% 32% 37%" },
          "100%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
        },
        "@keyframes blobFloat": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(15px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-10px, 10px) scale(0.95)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      }}
    />
  )
}
