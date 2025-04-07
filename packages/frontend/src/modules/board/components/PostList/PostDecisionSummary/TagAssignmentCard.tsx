import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TagAssignmentDecision } from "@/clients/backend-client"
import { Badge } from "@/components/ui/badge"
import { Tag, AlertCircle, CheckCircle } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface TagAssignmentCardProps {
  decision: TagAssignmentDecision
}

export function TagAssignmentCard({ decision }: TagAssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tag Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge
            variant={decision.status === "success" ? "default" : "destructive"}
          >
            {decision.status === "success" ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Success</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Failed</span>
              </div>
            )}
          </Badge>
        </div>

        {decision.tagIds.length > 0 && (
          <div className="space-y-2">
            <span className="font-medium">Assigned Tags:</span>
            <div className="flex flex-wrap gap-2">
              {decision.tagIds.map((tagId) => (
                <Badge key={tagId} variant="outline">
                  {tagId}
                </Badge>
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
