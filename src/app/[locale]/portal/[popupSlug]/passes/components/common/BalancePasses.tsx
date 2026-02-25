import { usePassesProvider } from "@/providers/passesProvider"
import { useTotal } from "@/providers/totalProvider"
import { useTranslations } from "next-intl"

const BalancePasses = () => {
  const t = useTranslations('passes')
  const { total, balance } = useTotal()
  const { isEditing } = usePassesProvider()

  if(!isEditing) return null
  
  return (
    <div className="flex items-center gap-4 w-fit">
      <span className="text-2xl font-semibold">{t('balance.balance')} </span>
      <span className="text-2xl font-semibold text-neutral-500">{balance >= 0 ? `$0` : ` $${-balance.toFixed(2)}`}</span>
    </div>
  )
}
export default BalancePasses