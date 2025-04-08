import { CardTitle } from "@/components/ui/card"

export function DecisionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode
  title: string
}) {
  return (
    <CardTitle className="flex items-center gap-2">
      {icon}
      {title}
    </CardTitle>
  )
}
