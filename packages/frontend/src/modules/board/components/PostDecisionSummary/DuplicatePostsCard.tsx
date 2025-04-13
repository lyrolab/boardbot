import { DuplicatePostsDecision, PostGet } from "@/clients/backend-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DuplicatePostCard } from "@/modules/board/components/PostDecisionSummary/DuplicatePostCard"
import { DecisionHeader } from "@/modules/board/components/PostDecisionSummary/ui/DecisionHeader"
import { ChevronDown, Copy } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FormField } from "@/components/ui/form"
import { FormItem } from "@/components/ui/form"
import { FormLabel } from "@/components/ui/form"
import { FormControl } from "@/components/ui/form"

interface DuplicatePostsCardProps {
  decision: DuplicatePostsDecision
  relatedPosts: PostGet[]
}

export function DuplicatePostsCard({
  decision,
  relatedPosts,
}: DuplicatePostsCardProps) {
  const form = useFormContext()
  const isDisabled = form.formState.disabled

  return (
    <Card>
      <CardHeader>
        <DecisionHeader icon={<Copy size={20} />} title="Duplicate Detection" />
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="duplicatePosts.selectedDuplicateId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Duplicate Post</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-4"
                  disabled={isDisabled}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_duplicate" id="not_duplicate" />
                    <Label htmlFor="not_duplicate">No duplicates found</Label>
                  </div>

                  {decision.duplicatePosts.map((duplicatePost) => {
                    const post = relatedPosts.find(
                      (p) => p.id === duplicatePost.id,
                    )
                    if (!post) return null

                    return (
                      <div
                        key={duplicatePost.id}
                        className="flex items-start space-x-2"
                      >
                        <RadioGroupItem
                          value={duplicatePost.id}
                          id={duplicatePost.id}
                        />
                        <Label
                          htmlFor={duplicatePost.id}
                          className="font-normal"
                        >
                          <DuplicatePostCard
                            post={post}
                            duplicatePost={duplicatePost}
                          />
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

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
