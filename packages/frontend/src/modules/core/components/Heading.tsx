import { Typography } from "@mui/material"

type Props = {
  children: React.ReactNode
  component?: React.ElementType
}

export default function Heading({ children, component = "h2" }: Props) {
  return (
    <Typography variant="h4" fontWeight="bold" component={component}>
      {children}
    </Typography>
  )
}
