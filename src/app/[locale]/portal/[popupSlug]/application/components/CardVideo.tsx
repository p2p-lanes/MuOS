'use client'

import { Card } from "@/components/ui/card"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCityProvider } from "@/providers/cityProvider"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

const CardVideo = ({ videoUrl, setVideoUrl }: { videoUrl: string, setVideoUrl: (url: string) => void }) => {
  const t = useTranslations('applicationForm')
  const { getCity } = useCityProvider()
  const city = getCity()

  const isBhutan = city?.slug?.includes('bhutan')

  return (
    <Card className="px-6 mt-6 bg-slate-50 border-dashed border-2 border-slate-400">
        <div className="grid gap-4 sm:grid-cols-1 my-4">
          <FormInputWrapper>
            <div className="flex flex-col h-full my-1 gap-2">
              <div>
                <p className="text-black flex items-center gap-2 font-medium text-sm">
                  <Star className="w-4 h-4" /> {t('videoOptional')}
                </p>
              </div>
              <Tooltip>
                <Label htmlFor="video_url" className="text-black">
                  {t('videoLabel')}{' '}
                  {
                    !isBhutan ? (
                      <TooltipTrigger asChild>
                        <span className="font-bold underline">{t('videoFollowingQuestions')}</span>
                      </TooltipTrigger>
                    ) : (
                      t('videoFollowingQuestions')
                    )
                  }
                  {' '}
                  {t('videoNoFillNote')}
                </Label>
                {
                  isBhutan && (
                    <Label className="text-black">
                      <p className="text-sm text-gray-700 mt-1">
                        {t('videoGoalsQuestion', { cityName: city?.name ?? '' })}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        {t('videoContributeQuestion')}
                      </p>
                    </Label>
                  )
                }
                <TooltipContent className="bg-white shadow-md border border-gray-200 max-w-sm">
                  <p className="text-sm text-gray-700 mt-1">
                    {t('videoGoalsQuestion', { cityName: city?.name ?? '' })}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    {t('videoContributeQuestion')}
                  </p>
                </TooltipContent>
              </Tooltip>
                <p className="text-sm text-gray-700 leading-4">
                  {t('videoUploadNote')}
                </p>
              <p className="text-sm text-black">{t('videoPasteLinkHere')}</p>
              <Input
                id="video_url" 
                value={videoUrl ?? ''}
                onChange={(e) => setVideoUrl(e.target.value)}
                className=" text-black border border-slate-400"
                placeholder={t('videoPlaceholder')}
                />
            </div>
          </FormInputWrapper>
        </div>
      </Card>
  )
}
export default CardVideo
