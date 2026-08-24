import { useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { formatPhone, parsePhone } from '@/lib/phone'
import {
  DEFAULT_PHONE_ISO,
  findPrefixByIso,
  isoToFlag,
  PHONE_PREFIXES,
  resolvePrefixFromPhone,
  type PhonePrefix,
} from '@/lib/phonePrefixes'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function PhoneInput({
  value,
  onChange,
  disabled = false,
  placeholder = '7000-0000',
  className,
}: PhoneInputProps) {
  const parsed = useMemo(() => parsePhone(value), [value])
  const [open, setOpen] = useState(false)
  const [selectedIso, setSelectedIso] = useState(DEFAULT_PHONE_ISO)

  useEffect(() => {
    setSelectedIso(resolvePrefixFromPhone(value).iso)
  }, [value])

  const selectedPrefix = findPrefixByIso(selectedIso) ?? findPrefixByIso(DEFAULT_PHONE_ISO)!

  const applyPrefix = (prefix: PhonePrefix) => {
    setSelectedIso(prefix.iso)
    onChange(formatPhone(prefix.dial, parsed.local))
    setOpen(false)
  }

  const handleLocalChange = (local: string) => {
    onChange(formatPhone(selectedPrefix.dial, local))
  }

  const inputClass =
    'border-input bg-background h-10 w-full rounded-xl border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            title={selectedPrefix.dial}
            aria-label={`Prefijo ${selectedPrefix.name} ${selectedPrefix.dial}`}
            className={cn(
              inputClass,
              'flex w-11 shrink-0 items-center justify-center px-0'
            )}
          >
            <span className="text-xl leading-none">{isoToFlag(selectedPrefix.iso)}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-1" align="start">
          <div className="max-h-60 overflow-y-auto">
            {PHONE_PREFIXES.map((prefix) => (
              <button
                key={prefix.iso}
                type="button"
                onClick={() => applyPrefix(prefix)}
                className={cn(
                  'hover:bg-muted flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  selectedIso === prefix.iso && 'bg-muted font-medium'
                )}
              >
                <span className="text-lg leading-none">{isoToFlag(prefix.iso)}</span>
                <span className="min-w-0 flex-1 truncate">{prefix.name}</span>
                <span className="text-muted-foreground shrink-0 text-xs">{prefix.dial}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="tel"
        value={parsed.local}
        onChange={(e) => handleLocalChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
      />
    </div>
  )
}
