import {
  DuplicatePost,
  DuplicatePostsDecision,
  PostGet,
} from "@/clients/backend-client"
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { SectionHeader } from "../ui/SectionHeader"
import { DuplicatePostItem } from "./DuplicatePostItem"

type Props = {
  decision: DuplicatePostsDecision
  relatedPosts: PostGet[]
}

export function DuplicatesSection({ decision, relatedPosts }: Props) {
  const form = useFormContext()
  const isDisabled = form.formState.disabled

  const { exactDuplicates, relatedButDifferent } = useMemo(() => {
    const exact: DuplicatePost[] = []
    const related: DuplicatePost[] = []
    for (const dp of decision.duplicatePosts) {
      if (
        dp.classification === "exact_duplicate" ||
        dp.classification === undefined
      ) {
        exact.push(dp)
      } else {
        related.push(dp)
      }
    }
    return { exactDuplicates: exact, relatedButDifferent: related }
  }, [decision.duplicatePosts])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <SectionHeader
        icon={<ContentCopyIcon sx={{ fontSize: 18 }} />}
        title="Detected Duplicates"
        reasoning={decision.reasoning}
      />

      <Controller
        control={form.control}
        name="duplicatePosts.selectedDuplicateId"
        render={({ field }) => (
          <RadioGroup value={field.value ?? ""} onChange={field.onChange}>
            <FormControlLabel
              value="not_duplicate"
              control={<Radio size="small" />}
              label="No duplicates found"
              disabled={isDisabled}
            />

            {exactDuplicates.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Exact Matches
                </Typography>
                {exactDuplicates.map((dp) => {
                  const post = relatedPosts.find((p) => p.id === dp.id)
                  if (!post) return null
                  return (
                    <FormControlLabel
                      key={dp.id}
                      value={dp.id}
                      control={<Radio size="small" />}
                      disabled={isDisabled}
                      sx={{
                        alignItems: "flex-start",
                        my: 0.5,
                        width: "100%",
                        "& .MuiFormControlLabel-label": { minWidth: 0, flex: 1 },
                      }}
                      label={
                        <DuplicatePostItem post={post} duplicatePost={dp} />
                      }
                    />
                  )
                })}
              </Box>
            )}

            {relatedButDifferent.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Related Posts
                </Typography>
                {relatedButDifferent.map((dp) => {
                  const post = relatedPosts.find((p) => p.id === dp.id)
                  if (!post) return null
                  return (
                    <FormControlLabel
                      key={dp.id}
                      value={dp.id}
                      control={<Radio size="small" />}
                      disabled={isDisabled}
                      sx={{
                        alignItems: "flex-start",
                        my: 0.5,
                        width: "100%",
                        "& .MuiFormControlLabel-label": { minWidth: 0, flex: 1 },
                      }}
                      label={
                        <DuplicatePostItem post={post} duplicatePost={dp} />
                      }
                    />
                  )
                })}
              </Box>
            )}
          </RadioGroup>
        )}
      />
    </Box>
  )
}
