'use client'

// React Imports
import { createContext, useContext, useEffect, useState } from 'react'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Utils Imports
import { getDictionary } from '@/utils/dictionary/getDictionaryClient'

type Props = ChildrenType & {
  dictionaryInit: Awaited<ReturnType<typeof getDictionary>>
  langDefault: Locale
}

type DictionaryContextType = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  locale: Locale
  setLocale: (locale: Locale) => void
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined)

export const DictionaryProvider = (props: Props) => {
  const { children, dictionaryInit, langDefault } = props

  const [dictionary, setDictionary] = useState<Awaited<ReturnType<typeof getDictionary>>>(dictionaryInit)
  const [locale, setLocale] = useState<Locale>(langDefault || 'vi')

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(locale)

      setDictionary(dict)
    }

    loadDictionary()
  }, [locale])

  return <DictionaryContext.Provider value={{ dictionary, locale, setLocale }}>{children}</DictionaryContext.Provider>
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext)

  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider')
  }

  return context
}
