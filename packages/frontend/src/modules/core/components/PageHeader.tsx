import Heading from "./Heading"

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <Heading>{title}</Heading>
      {subtitle && <p className="text-md text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
