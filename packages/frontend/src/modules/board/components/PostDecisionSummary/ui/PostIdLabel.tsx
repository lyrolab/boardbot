import { Typography } from "@mui/material"

type Props = {
  externalId: string
}

export function PostIdLabel({ externalId }: Props) {
  return (
    <Typography variant="subtitle2" color="primary" fontWeight={600}>
      #{externalId}
    </Typography>
  )
}
