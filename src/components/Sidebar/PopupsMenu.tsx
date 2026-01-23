'use client'

import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./SidebarComponents"
import { useCityProvider } from "@/providers/cityProvider"
import { PopupsProps } from "@/types/Popup"
import { ChevronsUpDown } from 'lucide-react'
import { DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu"
import Image from "next/image"
import { motion } from "framer-motion"

const PopupsMenu = ({ handleClickCity }: { handleClickCity: (city: PopupsProps) => void }) => {
  const { getCity, getPopups } = useCityProvider()
  const city = getCity()
  const popups = getPopups()
  const cityDate = new Date(city?.start_date ?? '')?.toLocaleDateString('en-EN', {day: 'numeric', month: 'long', year: 'numeric'})

  return (
    <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full h-full justify-between">
                  {!popups.length || !city ? (
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200 animate-pulse shrink-0 group-data-[collapsible=icon]:size-6" />
                      <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, 0, 0] }}
                        transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeIn' }}
                        className="relative aspect-square shrink-0 mx-auto"
                      >
                        <Image
                          src="/logo.jpg"
                          alt="The Mu illustration"
                          width={40}
                          height={40}
                          className="group-data-[collapsible=icon]:size-8 mx-auto"
                        />
                      </motion.div>
                      <div className="flex flex-col gap-0.5 text-sm group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold">{city.name}</span>
                        <span className="text-xs text-muted-foreground">{city.location}</span>
                        <span className="text-xs text-muted-foreground">{cityDate}</span>
                      </div>
                    </div>
                  )}
                  <ChevronsUpDown className="size-4 opacity-50 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                {popups.map((popup: PopupsProps) => {
                  if(!popup.visible_in_portal) return null

                  return (
                    <DropdownMenuItem key={popup.name} selected={popup.slug === city?.slug} className="cursor-pointer" disabled={!popup.clickable_in_portal} onClick={() => handleClickCity(popup)}>
                      <span>{popup.name}</span>
                      {
                        !popup.clickable_in_portal && (
                          <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">Soon</span>
                        )
                      }
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
  )
}
export default PopupsMenu