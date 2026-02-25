import { Button, ButtonAnimated } from "@/components/ui/button"
import { useTotal } from "@/providers/totalProvider"
import usePurchaseProducts from "../../hooks/usePurchaseProducts";
import { usePassesProvider } from "@/providers/passesProvider";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const TotalFloatingBar = ({ setOpenCart, waiverAccepted }: { setOpenCart: (prev: boolean) => void, waiverAccepted: boolean }) => {
  const t = useTranslations('passes')
  const { originalTotal, total } = useTotal()
  const { purchaseProducts, loading } = usePurchaseProducts();
  const { attendeePasses: attendees } = usePassesProvider()
  const someSelected = attendees.some(attendee => attendee.products.some(product => 
    product.selected && (product.purchased ? product.category === 'day' && (product.quantity || 1) > (product.original_quantity || 1) : true)
  ))

  const handleOnClickReviewOrder = () => {
    setOpenCart(true)
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 210)
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm font-medium">{t('floatingBar.total')}</p>
        {
          originalTotal > 0 && originalTotal !== total && (
            <span className=" text-muted-foreground line-through">${originalTotal.toFixed(0)}</span>
          )
        }
        <span className="font-medium">{total > 0 ? `$${total.toFixed(2)}` : '$0'}</span>
      </div>

      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" className="p-5 whitespace-nowrap" onClick={handleOnClickReviewOrder}>
          {t('floatingBar.reviewOrder')}
        </Button>
        <Button variant="default" className="p-5 whitespace-nowrap" disabled={loading || !someSelected || !waiverAccepted} onClick={() => purchaseProducts(attendees)}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {total <= 0 ? t('floatingBar.confirm') : t('floatingBar.confirmAndPay')}
        </Button>
      </div>
    </div>
  )
}
export default TotalFloatingBar