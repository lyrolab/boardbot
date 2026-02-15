import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"

type Props = {
  headerHeight?: number
  bodyHeight?: number
}

export function DefaultLoadingSkeleton({
  headerHeight = 60,
  bodyHeight = 400,
}: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Skeleton variant="rounded" height={headerHeight} />
      <Skeleton variant="rounded" height={bodyHeight} />
    </Box>
  )
}
