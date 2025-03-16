type Props = {
  children: React.ReactNode
  component?: React.ElementType
}

export default function Heading({ children, component = "h2" }: Props) {
  const Component = component

  return <Component className="text-3xl font-bold">{children}</Component>
}
