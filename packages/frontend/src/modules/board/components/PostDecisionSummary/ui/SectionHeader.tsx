import { Box, IconButton, Popover, Typography } from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { type ReactNode, useRef, useState } from "react"

type Props = {
  icon: ReactNode
  title: string
  action?: ReactNode
  reasoning?: string
}

export function SectionHeader({ icon, title, action, reasoning }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const iconRef = useRef<HTMLButtonElement>(null)

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography
        variant="subtitle2"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {title}
      </Typography>
      {reasoning && (
        <>
          <IconButton
            ref={iconRef}
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0.25 }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Box sx={{ p: 2, maxWidth: 320 }}>
              <Typography variant="caption" fontWeight={600}>
                AI Reasoning
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {reasoning}
              </Typography>
            </Box>
          </Popover>
        </>
      )}
      {action && <Box sx={{ ml: "auto" }}>{action}</Box>}
    </Box>
  )
}
