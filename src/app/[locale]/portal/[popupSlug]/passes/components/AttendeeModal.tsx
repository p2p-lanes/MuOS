"use client"

import { useState, useEffect } from "react"
import { ButtonAnimated } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AttendeeCategory, AttendeeProps } from "@/types/Attendee"
import Modal from "@/components/ui/modal"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface AttendeeModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AttendeeProps) => Promise<void>
  category: AttendeeCategory
  editingAttendee: AttendeeProps | null,
  isDelete?: boolean
}

const defaultFormData = {
  name: "",
  email: "",
  gender: "",
}

type FormDataProps = {
  name: string
  email: string
  category?: string
  gender?: string
}

export function AttendeeModal({ onSubmit, open, onClose, category, editingAttendee, isDelete }: AttendeeModalProps) {
  const t = useTranslations('passes')
  const kidsAgeOptions = [
    {label: t('attendeeModal.baby'), value: 'baby'},
    {label: t('attendeeModal.kid'), value: 'kid'},
    {label: t('attendeeModal.teen'), value: 'teen'},
  ]
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormDataProps>(defaultFormData)
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (editingAttendee) {
      const {name, email, category, gender} = editingAttendee
      setFormData({ name, email, category, gender })
    } else {
      setFormData(defaultFormData)
    }
    setErrors({})
  }, [editingAttendee, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors: {[key: string]: boolean} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = true
    }
    
    if (!formData.gender) {
      newErrors.gender = true
    }
    
    if (isChildCategory && !formData.category) {
      newErrors.category = true
    }
    
    if (category === 'spouse' && !formData.email.trim()) {
      newErrors.email = true
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setLoading(true)
    try {
      await onSubmit({...formData, category: formData.category ?? category, id: editingAttendee?.id, gender: formData.gender } as AttendeeProps)
    } finally {
      setLoading(false)
    }
  }

  const isChildCategory = category === 'kid' || (formData.category && ['baby', 'kid', 'teen'].includes(formData.category))
  const badgeNames: Record<AttendeeCategory, string> = {
    main: t('badgeNames.main'),
    spouse: t('badgeNames.spouse'),
    kid: t('badgeNames.kid'),
    baby: t('badgeNames.baby'),
    teen: t('badgeNames.teen'),
  }
  const categoryLabel = isChildCategory ? t('attendeeModal.addChild') : badgeNames[category]
  const title = editingAttendee
    ? t('attendeeModal.editTitle', { name: editingAttendee.name })
    : t('attendeeModal.addTitle', { category: categoryLabel })
  const description = t('attendeeModal.description', { category })

  if(isDelete) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={t('attendeeModal.deleteTitle', { name: editingAttendee?.name })}
        description={t('attendeeModal.deleteConfirm', { category })}
      >
        <DialogFooter>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? t('attendeeModal.deleting') : t('attendeeModal.delete')}
          </Button>
        </DialogFooter>
      </Modal>
    )
  }
  
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      {/* {isChildCategory && (
        <div className="-mt-4 text-sm text-gray-500">
          <Link href="https://edgeesmeralda2025.substack.com/p/kids-and-families-at-edge-esmeralda" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Learn more about children tickets
          </Link>.
        </div>
      )} */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t('attendeeModal.fullName')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
              required
            />
          </div>
          {
            isChildCategory && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  {t('attendeeModal.age')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  required
                  onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger className={`col-span-3 ${errors.category ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={t('attendeeModal.selectAge')} />
                  </SelectTrigger>
                  <SelectContent>
                    {kidsAgeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          }
          {
            category === 'spouse' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  {t('attendeeModal.email')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  className={`col-span-3 ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
              </div>
            )
          }
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              {t('attendeeModal.gender')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData(prev => ({...prev, gender: value}))}
              required
            >
              <SelectTrigger className={`col-span-3 ${errors.gender ? 'border-red-500' : ''}`}>
                <SelectValue placeholder={t('attendeeModal.selectGender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('attendeeModal.male')}</SelectItem>
                <SelectItem value="female">{t('attendeeModal.female')}</SelectItem>
                <SelectItem value="prefer not to say">{t('attendeeModal.preferNotToSay')}</SelectItem>
                <SelectItem value="other">{t('attendeeModal.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* {
            category !== 'spouse' && category !== 'main' && (
              <p className="text-sm text-gray-500">Please note: Parents are asked to contribute at least 4 hours/week, with those of kids under 7 volunteering one full day (or two half days). Scheduling is flexible.</p>
            ) 
          } */}
        </div>
        <DialogFooter>
          <ButtonAnimated loading={loading} type="submit">
            {editingAttendee ? t('attendeeModal.update') : t('attendeeModal.save')}
          </ButtonAnimated>
        </DialogFooter>
      </form>
    </Modal>
  )
}

