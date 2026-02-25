'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SectionWrapper from "./SectionWrapper"
import { SectionProps } from "@/types/Section"
import CheckboxForm from "@/components/ui/Form/Checkbox"
import InputForm from "@/components/ui/Form/Input"
import { SectionSeparator } from "./section-separator"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { LabelMuted } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

const fieldsChildrenPlusOnes = ["brings_spouse", "brings_kids"]

interface Kid {
  id: string;
  name: string;
  age: string;
}

export function ChildrenPlusOnesForm({ formData, errors, handleChange, fields }: SectionProps) {
  const t = useTranslations('applicationForm')
  const [hasSpouse, setHasSpouse] = useState(formData.brings_spouse || false);
  const [hasKids, setHasKids] = useState(formData.brings_kids || false);
  const [kids, setKids] = useState<Kid[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");

  const ageOptions = ["< 1", ...Array.from({ length: 18 }, (_, i) => (i + 1).toString())];

  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  useEffect(() => {
    if (formData.kids_info && kids.length === 0) {
      const parsedKids: Kid[] = [];
      const kidEntries = formData.kids_info.split('.').filter((entry: string) => entry.trim());
      
      kidEntries.forEach((entry: string, index: number) => {
        const trimmedEntry = entry.trim();
        if (trimmedEntry) {
          const lastCommaIndex = trimmedEntry.lastIndexOf(',');
          if (lastCommaIndex > 0) {
            const name = trimmedEntry.substring(0, lastCommaIndex).trim();
            const age = trimmedEntry.substring(lastCommaIndex + 1).trim();
            
            if (name && age) {
              parsedKids.push({
                id: `existing-${index}`,
                name,
                age
              });
            }
          }
        }
      });
      
      if (parsedKids.length > 0) {
        setKids(parsedKids);
      }
    }
  }, [formData.kids_info]);

  useEffect(() => {
    const formattedKids = kids.map(kid => `${kid.name}, ${kid.age}.`).join(' ');
    handleChange('kids_info', formattedKids);
  }, [kids]);

  const addKid = () => {
    if (kidName.trim() && kidAge) {
      const newKid: Kid = {
        id: Date.now().toString(),
        name: kidName.trim(),
        age: kidAge
      };
      setKids([...kids, newKid]);
      setKidName("");
      setKidAge("");
      setShowModal(false);
    }
  };

  const removeKid = (id: string) => {
    setKids(kids.filter(kid => kid.id !== id));
  };

  const resetModal = () => {
    setKidName("");
    setKidAge("");
    setShowModal(false);
  };

  if (!fields || !fields.size || !fieldsChildrenPlusOnes.some(field => fields.has(field))) return null;

  return (
    <>
    <SectionWrapper title={t('childrenTitle')}>
      <div className="flex flex-col gap-4">

        {
          fields.has('brings_spouse') && (
            <div>
              <CheckboxForm
                label={t('bringsSpouse')}
                id="brings_spouse"
                checked={hasSpouse}
                onCheckedChange={(checked) => {
                  setHasSpouse(checked === true);
                  handleChange('brings_spouse', checked === true);
                  if (checked === false) {
                    handleChange('spouse_info', '');
                    handleChange('spouse_email', '');
                  }
                }}
              />
              <AnimatePresence>
                {hasSpouse && (
                  <motion.div {...animationProps}>
                    <div className="flex flex-col gap-6 mt-6">
                      <InputForm
                        label={t('spouseInfo')}
                        id="spouse_info"
                        value={formData.spouse_info}
                        onChange={(value) => handleChange('spouse_info', value)}
                        error={errors.spouse_info}
                        isRequired={true}
                        subtitle={t('spouseInfoSubtitle')}
                      />
                      <InputForm
                        label={t('spouseEmail')}
                        id="spouse_email"
                        value={formData.spouse_email}
                        onChange={(value) => handleChange('spouse_email', value)}
                        error={errors.spouse_email}
                        isRequired={true}
                        subtitle={t('spouseEmailSubtitle')}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }
        
        {
          fields.has('brings_kids') && (
            <div>
              <CheckboxForm
                label={t('bringsKids')}
                id="brings_kids"
                checked={hasKids}
                onCheckedChange={(checked) => {
                  setHasKids(checked === true);
                  handleChange('brings_kids', checked === true);
                  if (checked === false) {
                    handleChange('kids_info', '');
                    setKids([]);
                  }
                }}
              />
              <AnimatePresence>
                {hasKids && (
                  <motion.div {...animationProps}>
                    <div className="mt-4">
                      <div className="mb-4 flex flex-col gap-2">
                        <LabelMuted className="text-sm text-muted-foreground">
                          {t('kidsApprovalNote')}
                        </LabelMuted>
                       
                      </div>

                      {kids.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {kids.map((kid) => (
                            <div key={kid.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm">
                                {kid.name},{' '}
                                {kid.age === "< 1" ? t('lessThanOneYear') : t('yearsOld', { age: kid.age })}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeKid(kid.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} />
                        {t('addKid')}
                      </Button>

                      {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
                            <h3 className="text-lg font-semibold mb-4">{t('addChild')}</h3>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('childName')}
                                </label>
                                <Input
                                  type="text"
                                  value={kidName}
                                  onChange={(e) => setKidName(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={t('enterChildName')}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('childAge')}
                                </label>
                                <Select value={kidAge} onValueChange={setKidAge}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('selectAge')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ageOptions.map((age) => (
                                      <SelectItem key={age} value={age}>
                                        {age === "< 1" ? t('lessThanOneYear') : t('yearsOld', { age })}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                              <Button
                                type="button"
                                onClick={addKid}
                                disabled={!kidName.trim() || !kidAge}
                                className="flex-1"
                              >
                                {t('addChild')}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={resetModal}
                                className="flex-1"
                              >
                                {t('cancelButton')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {errors.kids_info && (
                        <p className="text-red-500 text-sm mt-2">{errors.kids_info}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }
      </div>
    </SectionWrapper>
    <SectionSeparator />
    </>
  )
}
