// Third-party Imports
import 'server-only'

// Next import
import { cookies } from 'next/headers'

// Type Imports
import type { Locale } from '@configs/i18n'

//Const import
import { DEFAULT_LOCALE, LOCALE_KEY } from '@/consts/localeConsts'

const dictionaries = {
  en: () => import('@/data/dictionaries/en.json').then(module => module.default),
  fr: () => import('@/data/dictionaries/fr.json').then(module => module.default),
  ar: () => import('@/data/dictionaries/ar.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export const getLangFromCookie = (): Locale => {
  const cookieStore = cookies()

  return (cookieStore.get(LOCALE_KEY)?.value || DEFAULT_LOCALE) as Locale
}
