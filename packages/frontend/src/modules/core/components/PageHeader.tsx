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
    <div className="flex items-center justify-between space-y-2">
      <div className="space-y-2">
        <Heading>{title}</Heading>
        {subtitle && (
          <p className="text-md text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}
