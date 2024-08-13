'use client'

import { createContext, useContext } from 'react'

import type { Locale } from '@configs/i18n'
import { DEFAULT_LOCALE } from '@/consts/localeConsts'

const Context = createContext<Locale>(DEFAULT_LOCALE)

export function LocaleProvider({ children, value }: { children: React.ReactNode; value: Locale }) {
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useLocale() {
  return useContext(Context)
}
