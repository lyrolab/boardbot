import { createFileRoute } from "@tanstack/react-router"
import LandingPage from "@/modules/landing/entrypoints/LandingPage"

export const Route = createFileRoute("/")({
  component: LandingPage,
})
