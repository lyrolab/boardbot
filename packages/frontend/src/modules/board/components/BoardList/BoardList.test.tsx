import { setupMsw } from "@/test/helpers/setupMsw"
import { render, screen } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import BoardList from "./BoardList"
import { Wrapper } from "@/test/helpers/wrapper"

setupMsw(
  http.get("*/boards", () => {
    return HttpResponse.json({
      data: [
        {
          id: "1",
          title: "Project Alpha",
          vendor: "github",
        },
        {
          id: "2",
          title: "Project Beta",
          vendor: "jira",
        },
      ],
    })
  }),
)

describe("BoardList", () => {
  it("displays board titles", async () => {
    render(<BoardList />, { wrapper: Wrapper })

    await screen.findByText("Project Alpha")

    expect(
      await screen.findByRole("cell", { name: "Project Alpha" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("cell", { name: "Project Beta" }),
    ).toBeInTheDocument()
  })
})
