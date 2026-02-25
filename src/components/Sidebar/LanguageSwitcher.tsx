'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, Locale } from '@/i18n/routing'
import { Globe } from 'lucide-react'
import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  zh: '中文',
}

const LanguageSwitcher = () => {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleChangeLocale = (newLocale: Locale) => {
    startTransition(() => {
      router.replace({ pathname }, { locale: newLocale })
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="size-4 text-muted-foreground shrink-0" />
      <Select
        value={locale}
        onValueChange={handleChangeLocale}
        disabled={isPending}
      >
        <SelectTrigger
          aria-label="Switch language"
          className="h-8 w-[80px] text-xs border-none shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 px-1"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {routing.locales.map((loc) => (
            <SelectItem key={loc} value={loc} className="text-xs">
              {LOCALE_LABELS[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSwitcher
