import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useMemo,
} from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbContextValue {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(
  undefined,
)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([])

  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider")
  }
  return context
}

export function useBreadcrumbUpdate(items: BreadcrumbItem[]) {
  const { setItems } = useBreadcrumb()

  const memoizedItems = useMemo(
    () => items,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map((item) => item.label + (item.href || "")).join("|")],
  )

  useEffect(() => {
    setItems(memoizedItems)
    return () => setItems([])
  }, [setItems, memoizedItems])
}
