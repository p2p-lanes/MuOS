'use client'

import { TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Ticket } from "lucide-react"
import { useTranslations } from "next-intl"

const Header = () => {
  const t = useTranslations('attendees')

  return (
    <TableHeader>
      <TableRow className="border-b border-gray-200 bg-white">
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap min-w-[200px]">{t('columnAttendee')}</TableHead>
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap min-w-[200px]">{t('columnEmail')}</TableHead>
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap min-w-[150px]">{t('columnTelegram')}</TableHead>
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2 min-w-[150px]">
          <Ticket className="h-5 w-5" />
          {t('columnWeeksJoining')}
        </TableHead>
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap min-w-[100px]">{t('columnBringsKids')}</TableHead>
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap min-w-[150px]">{t('columnRole')}</TableHead>
        <TableHead className="text-md font-semibold text-gray-900 whitespace-nowrap min-w-[200px]">{t('columnOrganization')}</TableHead>
      </TableRow>
    </TableHeader>
  )
}

export default Header
