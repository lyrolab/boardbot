import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Heading from "./Heading"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Heading>{title}</Heading>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  )
}
