import { TagAssignmentDecision } from "@/clients/backend-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { AlertCircle, CheckCircle, ChevronDown, Tag } from "lucide-react"
import { DecisionHeader } from "./ui/DecisionHeader"
import { useTags } from "@/modules/board/queries/tags"
import { useFormContext } from "react-hook-form"
import {
  InputMultiSelect,
  InputMultiSelectTrigger,
} from "@/components/ui/input-multiselect"

interface TagAssignmentCardProps {
  boardId: string
  decision: TagAssignmentDecision
}

export function TagAssignmentCard({
  boardId,
  decision,
}: TagAssignmentCardProps) {
  const { data: tags, status } = useTags(boardId)
  const form = useFormContext()
  const selectedTagIds = form.watch("tagAssignment.tagIds") || []
  const isDisabled = form.formState.disabled

  if (status === "pending") return <div>Loading...</div>
  if (status === "error") return <div>Error</div>

  const tagOptions = tags.data.map((tag) => ({
    value: tag.externalId,
    label: tag.title,
  }))

  const handleTagChange = (values: string[]) => {
    form.setValue("tagAssignment.tagIds", values)
  }

  return (
    <Card>
      <CardHeader>
        <DecisionHeader icon={<Tag size={20} />} title="Tag Assignment" />
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

        <div className="space-y-2">
          <div className="font-medium">Assigned Tags:</div>
          <InputMultiSelect
            options={tagOptions}
            value={selectedTagIds}
            onValueChange={handleTagChange}
            placeholder="Select tags..."
            selectAllEnabled={false}
            disabled={isDisabled}
          >
            {(props) => <InputMultiSelectTrigger {...props} />}
          </InputMultiSelect>
        </div>

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
