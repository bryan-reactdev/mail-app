export interface PhonePrefix {
  iso: string
  name: string
  dial: string
}

export const DEFAULT_PHONE_ISO = 'SV'
export const DEFAULT_PHONE_PREFIX = '+503'

const entries: PhonePrefix[] = [
  { iso: 'SV', name: 'El Salvador', dial: '+503' },
  { iso: 'GT', name: 'Guatemala', dial: '+502' },
  { iso: 'HN', name: 'Honduras', dial: '+504' },
  { iso: 'NI', name: 'Nicaragua', dial: '+505' },
  { iso: 'CR', name: 'Costa Rica', dial: '+506' },
  { iso: 'PA', name: 'Panamá', dial: '+507' },
  { iso: 'BZ', name: 'Belice', dial: '+501' },
  { iso: 'MX', name: 'México', dial: '+52' },
  { iso: 'US', name: 'Estados Unidos', dial: '+1' },
  { iso: 'CA', name: 'Canadá', dial: '+1' },
  { iso: 'CO', name: 'Colombia', dial: '+57' },
  { iso: 'VE', name: 'Venezuela', dial: '+58' },
  { iso: 'EC', name: 'Ecuador', dial: '+593' },
  { iso: 'PE', name: 'Perú', dial: '+51' },
  { iso: 'BO', name: 'Bolivia', dial: '+591' },
  { iso: 'CL', name: 'Chile', dial: '+56' },
  { iso: 'AR', name: 'Argentina', dial: '+54' },
  { iso: 'UY', name: 'Uruguay', dial: '+598' },
  { iso: 'PY', name: 'Paraguay', dial: '+595' },
  { iso: 'BR', name: 'Brasil', dial: '+55' },
  { iso: 'CU', name: 'Cuba', dial: '+53' },
  { iso: 'DO', name: 'Rep. Dominicana', dial: '+1' },
  { iso: 'PR', name: 'Puerto Rico', dial: '+1' },
  { iso: 'JM', name: 'Jamaica', dial: '+1' },
  { iso: 'HT', name: 'Haití', dial: '+509' },
  { iso: 'ES', name: 'España', dial: '+34' },
  { iso: 'PT', name: 'Portugal', dial: '+351' },
  { iso: 'FR', name: 'Francia', dial: '+33' },
  { iso: 'DE', name: 'Alemania', dial: '+49' },
  { iso: 'IT', name: 'Italia', dial: '+39' },
  { iso: 'GB', name: 'Reino Unido', dial: '+44' },
  { iso: 'NL', name: 'Países Bajos', dial: '+31' },
  { iso: 'BE', name: 'Bélgica', dial: '+32' },
  { iso: 'CH', name: 'Suiza', dial: '+41' },
  { iso: 'AT', name: 'Austria', dial: '+43' },
  { iso: 'SE', name: 'Suecia', dial: '+46' },
  { iso: 'NO', name: 'Noruega', dial: '+47' },
  { iso: 'DK', name: 'Dinamarca', dial: '+45' },
  { iso: 'IE', name: 'Irlanda', dial: '+353' },
  { iso: 'PL', name: 'Polonia', dial: '+48' },
  { iso: 'RU', name: 'Rusia', dial: '+7' },
  { iso: 'UA', name: 'Ucrania', dial: '+380' },
  { iso: 'TR', name: 'Turquía', dial: '+90' },
  { iso: 'GR', name: 'Grecia', dial: '+30' },
  { iso: 'RO', name: 'Rumania', dial: '+40' },
  { iso: 'CZ', name: 'Rep. Checa', dial: '+420' },
  { iso: 'HU', name: 'Hungría', dial: '+36' },
  { iso: 'CN', name: 'China', dial: '+86' },
  { iso: 'JP', name: 'Japón', dial: '+81' },
  { iso: 'KR', name: 'Corea del Sur', dial: '+82' },
  { iso: 'IN', name: 'India', dial: '+91' },
  { iso: 'AU', name: 'Australia', dial: '+61' },
  { iso: 'NZ', name: 'Nueva Zelanda', dial: '+64' },
  { iso: 'ZA', name: 'Sudáfrica', dial: '+27' },
  { iso: 'EG', name: 'Egipto', dial: '+20' },
  { iso: 'MA', name: 'Marruecos', dial: '+212' },
  { iso: 'NG', name: 'Nigeria', dial: '+234' },
  { iso: 'KE', name: 'Kenia', dial: '+254' },
  { iso: 'IL', name: 'Israel', dial: '+972' },
  { iso: 'AE', name: 'Emiratos Árabes', dial: '+971' },
  { iso: 'SA', name: 'Arabia Saudita', dial: '+966' },
  { iso: 'QA', name: 'Catar', dial: '+974' },
  { iso: 'PH', name: 'Filipinas', dial: '+63' },
  { iso: 'TH', name: 'Tailandia', dial: '+66' },
  { iso: 'VN', name: 'Vietnam', dial: '+84' },
  { iso: 'MY', name: 'Malasia', dial: '+60' },
  { iso: 'SG', name: 'Singapur', dial: '+65' },
  { iso: 'ID', name: 'Indonesia', dial: '+62' },
  { iso: 'TW', name: 'Taiwán', dial: '+886' },
  { iso: 'HK', name: 'Hong Kong', dial: '+852' },
]

export const PHONE_PREFIXES: PhonePrefix[] = entries

export const PHONE_PREFIXES_BY_DIAL_LENGTH = [...entries].sort(
  (a, b) => b.dial.length - a.dial.length
)

export function isoToFlag(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

export function findPrefixByIso(iso: string): PhonePrefix | undefined {
  return entries.find((p) => p.iso === iso)
}

export function findPrefixByDial(dial: string): PhonePrefix | undefined {
  const normalized = dial.startsWith('+') ? dial : `+${dial}`
  return entries.find((p) => p.dial === normalized)
}

export function resolvePrefixFromPhone(phone: string): PhonePrefix {
  const trimmed = phone.trim()
  if (!trimmed) return findPrefixByIso(DEFAULT_PHONE_ISO)!

  for (const prefix of PHONE_PREFIXES_BY_DIAL_LENGTH) {
    if (trimmed.startsWith(prefix.dial)) return prefix
  }

  return findPrefixByIso(DEFAULT_PHONE_ISO)!
}
