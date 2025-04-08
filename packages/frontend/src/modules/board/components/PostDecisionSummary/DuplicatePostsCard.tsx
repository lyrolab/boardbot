import { DuplicatePostsDecision, PostGet } from "@/clients/backend-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DuplicatePostCard } from "@/modules/board/components/PostDecisionSummary/DuplicatePostCard"
import { DecisionHeader } from "@/modules/board/components/PostDecisionSummary/ui/DecisionHeader"
import { ChevronDown, Copy, FileText } from "lucide-react"

interface DuplicatePostsCardProps {
  decision: DuplicatePostsDecision
  relatedPosts: PostGet[]
}

type StatusConfig = {
  variant: "destructive" | "default" | "secondary"
  text: string
  color?: string
}

const getStatusConfig = (
  decision: "duplicate" | "not_duplicate" | "unknown",
): StatusConfig => {
  const config = {
    duplicate: {
      variant: "destructive" as const,
      text: "Duplicate found",
    },
    not_duplicate: {
      variant: "default" as const,
      text: "No duplicates",
    },
    unknown: {
      variant: "secondary" as const,
      text: "Unknown",
    },
  }
  return config[decision] || config.unknown
}

export function DuplicatePostsCard({
  decision,
  relatedPosts,
}: DuplicatePostsCardProps) {
  const statusConfig = getStatusConfig(decision.decision)

  return (
    <Card>
      <CardHeader>
        <DecisionHeader
          icon={<Copy size={20} color={statusConfig.color} />}
          title="Duplicate Detection"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
        </div>

        {decision.duplicatePosts.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium">Duplicate posts:</div>
            <div className="space-y-2">
              {decision.duplicatePosts.map((duplicatePost) => (
                <DuplicatePostCard
                  key={duplicatePost.externalId}
                  post={relatedPosts.find(
                    (post) => post.externalId === duplicatePost.externalId,
                  )}
                  duplicatePost={duplicatePost}
                />
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
