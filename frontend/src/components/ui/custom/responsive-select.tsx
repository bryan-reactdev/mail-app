import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

interface ResponsiveSelectProps extends React.ComponentProps<typeof Select> {
  children: React.ReactNode
}

const ResponsiveSelect = ({
  children,
  value,
  onValueChange,
  ...props
}: ResponsiveSelectProps) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  // Extract SelectTrigger, SelectValue, and SelectContent from children
  const trigger = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SelectTrigger
  ) as React.ReactElement<React.ComponentProps<typeof SelectTrigger>> | undefined

  const selectValue = React.Children.toArray(children)
    .flatMap((child) => {
      if (React.isValidElement(child) && child.type === SelectTrigger) {
        return React.Children.toArray(
          (child as React.ReactElement<{ children?: React.ReactNode }>).props.children
        ).filter(
          (c) => React.isValidElement(c) && c.type === SelectValue
        )
      }
      return []
    })[0] as React.ReactElement<React.ComponentProps<typeof SelectValue>> | undefined

  const content = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SelectContent
  ) as React.ReactElement<React.ComponentProps<typeof SelectContent>> | undefined

  // Extract SelectItems from SelectContent
  const items = React.useMemo(() => {
    if (!content) return []
    return React.Children.toArray(
      (content as React.ReactElement<{ children?: React.ReactNode }>).props.children
    ).filter(
      (child) => React.isValidElement(child) && child.type === SelectItem
    ) as React.ReactElement<React.ComponentProps<typeof SelectItem>>[]
  }, [content])

  // Get the display text for the selected value
  const selectedItem = items.find((item) => item.props.value === value)
  const displayText = selectedItem
    ? React.Children.toArray(selectedItem.props.children).join("")
    : selectValue?.props.placeholder || "Selecciona una opción"

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue)
    if (isMobile) {
      setOpen(false)
    }
  }

  const ariaInvalid = "aria-invalid" in props 
    ? (props["aria-invalid"] as boolean | "true" | "false" | "grammar" | "spelling" | undefined)
    : undefined

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm font-normal whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
              trigger?.props.className
            )}
            {...(ariaInvalid !== undefined && { "aria-invalid": ariaInvalid })}
          >
            <span className="line-clamp-1 flex items-center gap-2 font-normal">{displayText}</span>
            <ChevronDownIcon className="size-4 opacity-50 pointer-events-none shrink-0" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-normal">
              {selectValue?.props.placeholder || "Selecciona una opción"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4">
            {items.map((item) => {
              const itemValue = item.props.value
              const isSelected = value === itemValue
              const itemText = React.Children.toArray(item.props.children).join("")

              return (
                <Button
                  key={itemValue}
                  variant={isSelected ? "default" : "ghost"}
                  className="w-full justify-start font-normal"
                  onClick={() => handleValueChange(itemValue)}
                >
                  <span className="flex-1 text-left font-normal">{itemText}</span>
                  {isSelected && <CheckIcon className="size-4" />}
                </Button>
              )
            })}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange} {...props}>
      {children}
    </Select>
  )
}

ResponsiveSelect.displayName = "ResponsiveSelect"

export { ResponsiveSelect }



