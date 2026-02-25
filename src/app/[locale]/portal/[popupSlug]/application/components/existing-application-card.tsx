'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCityProvider } from '@/providers/cityProvider';
import { PopupsProps } from '@/types/Popup';
import { ApplicationProps } from '@/types/Application';
import { useTranslations } from 'next-intl';

interface ExistingApplicationCardProps {
  onImport: () => void;
  onCancel: () => void;
  data: ApplicationProps;
}

export function ExistingApplicationCard({ onImport, onCancel, data }: ExistingApplicationCardProps) {
  const t = useTranslations('applicationForm')
  const [isOpen, setIsOpen] = useState(true)
  const { getPopups } = useCityProvider()
  const popups = getPopups()

  const handleImport = () => {
    onImport()
    setIsOpen(false)
  }

  const handleCancel = () => {
    onCancel()
    setIsOpen(false)
  }

  const popup = popups.find((popup: PopupsProps) => popup.id === data.popup_city_id)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('existingCardTitle')}</DialogTitle>
          <DialogDescription>{t('existingCardDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>{t('existingCardApplicant')}:</strong> {data.first_name} {data.last_name}</p>
          <p><strong>{t('existingCardEmail')}:</strong> {data.email}</p>
          <p><strong>{t('existingCardPopupCity')}:</strong> {popup?.name}</p>
        </div>
        <p className="mt-4">{t('existingCardImportQuestion')}</p>
        <DialogFooter className="flex flex-col gap-4 md:flex-row">
          <Button variant="outline" onClick={handleCancel}>{t('existingCardCancel')}</Button>
          <Button onClick={handleImport}>{t('existingCardImport')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

