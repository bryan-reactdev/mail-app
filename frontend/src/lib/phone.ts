import {
  DEFAULT_PHONE_PREFIX,
  findPrefixByDial,
  PHONE_PREFIXES_BY_DIAL_LENGTH,
  type PhonePrefix,
} from './phonePrefixes'

export function formatPhone(dial: string, local: string): string {
  const cleanLocal = local.replace(/\s+/g, ' ').trim()
  if (!cleanLocal) return ''
  return `${dial} ${cleanLocal}`
}

export function parsePhone(phone: string): { dial: string; local: string; prefix?: PhonePrefix } {
  const trimmed = phone.trim()
  if (!trimmed) {
    return { dial: DEFAULT_PHONE_PREFIX, local: '' }
  }

  for (const prefix of PHONE_PREFIXES_BY_DIAL_LENGTH) {
    if (trimmed.startsWith(prefix.dial)) {
      return {
        dial: prefix.dial,
        local: trimmed.slice(prefix.dial.length).trim(),
        prefix,
      }
    }
  }

  const digitsOnly = trimmed.replace(/\D/g, '')
  for (const prefix of PHONE_PREFIXES_BY_DIAL_LENGTH) {
    const dialDigits = prefix.dial.replace('+', '')
    if (digitsOnly.startsWith(dialDigits)) {
      const local = digitsOnly.slice(dialDigits.length)
      return {
        dial: prefix.dial,
        local: local.replace(/(\d{4})(?=\d)/g, '$1 ').trim(),
        prefix,
      }
    }
  }

  return { dial: DEFAULT_PHONE_PREFIX, local: trimmed }
}

export function getDefaultDial(): string {
  return DEFAULT_PHONE_PREFIX
}

export function resolveDial(dial: string): PhonePrefix | undefined {
  return findPrefixByDial(dial)
}
