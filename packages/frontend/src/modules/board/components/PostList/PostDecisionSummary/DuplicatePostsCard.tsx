import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DuplicatePostsDecision } from "@/clients/backend-client"
import { Badge } from "@/components/ui/badge"
import { Copy, FileText } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface DuplicatePostsCardProps {
  decision: DuplicatePostsDecision
}

const getStatusConfig = (
  decision: "duplicate" | "not_duplicate" | "unknown",
) => {
  const config = {
    duplicate: {
      variant: "destructive" as const,
      text: "Duplicate Found",
    },
    not_duplicate: {
      variant: "default" as const,
      text: "No Duplicates",
    },
    unknown: {
      variant: "secondary" as const,
      text: "Unknown",
    },
  }
  return config[decision]
}

export function DuplicatePostsCard({ decision }: DuplicatePostsCardProps) {
  const statusConfig = getStatusConfig(decision.decision)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-5 w-5" />
          Duplicate Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
        </div>

        {decision.duplicatePostExternalIds.length > 0 && (
          <div className="space-y-2">
            <span className="font-medium">Duplicate Posts:</span>
            <div className="space-y-2">
              {decision.duplicatePostExternalIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{id}</span>
                </div>
              ))}
            </div>
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
