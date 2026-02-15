import { useEffect, useRef, useState } from "react"

interface UseInViewOptions {
  triggerOnce?: boolean
  rootMargin?: string
  threshold?: number
}

export function useInView({
  triggerOnce = true,
  rootMargin = "0px 0px -60px 0px",
  threshold = 0,
}: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) observer.unobserve(element)
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [triggerOnce, rootMargin, threshold])

  return { ref, isInView }
}
