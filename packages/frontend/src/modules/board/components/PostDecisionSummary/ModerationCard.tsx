import { ModerationDecision } from "@/clients/backend-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MODERATION_REASONS } from "@/modules/board/components/PostDecisionSummary/postDecisionMapper"
import { useFormContext } from "react-hook-form"

type Props = {
  decision: ModerationDecision
}

export function ModerationCard({ decision }: Props) {
  const form = useFormContext()
  const moderationDecision = form.watch("moderation.decision")
  const isDisabled = form.formState.disabled

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation</CardTitle>
        <CardDescription>AI moderation decision and reasoning</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>AI Reasoning</Label>
          <p className="text-sm text-muted-foreground">{decision.reasoning}</p>
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="moderation.decision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decision</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a decision" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="accepted">Accept</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {moderationDecision === "rejected" && (
          <div className="space-y-2">
            {" "}
            <FormField
              control={form.control}
              name="moderation.reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isDisabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MODERATION_REASONS.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
