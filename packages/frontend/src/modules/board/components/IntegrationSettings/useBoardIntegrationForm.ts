import { FiderBoardCreateDto } from "@/clients/backend-client"
import { useBoard } from "@/modules/board/queries/boards"
import { useFiderBoard } from "@/modules/board/queries/fider-board"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { integrationFormSchema } from "@/modules/board/components/IntegrationSettings/schema"
import { z } from "zod"

export type IntegrationFormValues = z.infer<typeof integrationFormSchema>

export function useBoardIntegrationForm(boardId: string) {
  const { data: board } = useBoard(boardId)
  const { data: fiderBoard } = useFiderBoard(boardId)

  const defaultValues: IntegrationFormValues = (() => {
    if (board.data.vendor === "fider" && fiderBoard) {
      const settings = fiderBoard as FiderBoardCreateDto
      return {
        vendor: "fider" as const,
        settings: {
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
        },
      }
    }
    return {
      vendor: "fider" as const,
      settings: {
        baseUrl: "",
        apiKey: "",
      },
    }
  })()

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues,
  })

  return { form }
}
