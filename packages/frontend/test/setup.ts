import "@testing-library/jest-dom"
import { expect, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

expect.extend(matchers)

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")
  return {
    ...actual,
    useRouter: vi.fn(),
  }
})

afterEach(() => {
  cleanup()
})
