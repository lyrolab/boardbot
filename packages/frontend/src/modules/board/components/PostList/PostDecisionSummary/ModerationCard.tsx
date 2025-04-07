import {
  ModerationDecision,
  ModerationReasonEnum,
} from "@/clients/backend-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { AlertCircle, CheckCircle, ChevronDown, HelpCircle } from "lucide-react"

interface ModerationCardProps {
  decision: ModerationDecision
}

const getStatusConfig = (decision: "accepted" | "rejected" | "unknown") => {
  const config = {
    accepted: {
      color: "bg-green-500",
      icon: CheckCircle,
      text: "Accepted",
    },
    rejected: {
      color: "bg-red-500",
      icon: AlertCircle,
      text: "Rejected",
    },
    unknown: {
      color: "bg-yellow-500",
      icon: HelpCircle,
      text: "Unknown",
    },
  }
  return config[decision] ?? config.unknown
}

const reasonLabels: Record<ModerationReasonEnum, string> = {
  [ModerationReasonEnum.MultipleSuggestions]: "Multiple Suggestions",
  [ModerationReasonEnum.IsAQuestion]: "Is a Question",
}

export function ModerationCard({ decision }: ModerationCardProps) {
  const statusConfig = getStatusConfig(decision.decision)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <statusConfig.icon className={`h-5 w-5 ${statusConfig.color}`} />
          Moderation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge
            variant={
              decision.decision === "rejected" ? "destructive" : "default"
            }
          >
            {statusConfig.text}
          </Badge>
        </div>

        {decision.reason && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Reason:</span>
            <Badge variant="outline">{reasonLabels[decision.reason]}</Badge>
          </div>
        )}

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              AI Reasoning
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
            {decision.reasoning}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
