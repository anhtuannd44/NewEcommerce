// Third-party Imports
import 'server-only'

// Next import
import { cookies } from 'next/headers'

// Type Imports
import type { Locale } from '@configs/i18n'

//Const import
import { DEFAULT_LOCALE, LOCALE_KEY } from '@/consts/localeConsts'

// Data Imports
import { dictionaries } from './dictionaryModules'

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export const getLangFromCookie = (): Locale => {
  const cookieStore = cookies()

  return (cookieStore.get(LOCALE_KEY)?.value || DEFAULT_LOCALE) as Locale
}
