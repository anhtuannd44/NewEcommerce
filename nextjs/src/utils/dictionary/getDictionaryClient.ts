'use client'

// Third-party Imports
import Cookies from 'js-cookie'

// Type Imports
import type { Locale } from '@configs/i18n'

//Const import
import { DEFAULT_LOCALE, LOCALE_KEY } from '@/consts/localeConsts'
import { dictionaries } from './dictionaryModules'

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export const getLangFromCookie = (): Locale => {
  const cookieValue = Cookies.get(LOCALE_KEY)

  return (cookieValue || DEFAULT_LOCALE) as Locale
}
