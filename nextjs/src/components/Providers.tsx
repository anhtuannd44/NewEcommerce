// Type Imports
import type { ChildrenType, Direction } from '@core/types'
import type { getDictionary } from '@/utils/dictionary/getDictionaryServer'
import type { Locale } from '@configs/i18n'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import { DictionaryProvider } from '@/contexts/dictionaryContext'

type Props = ChildrenType & {
  direction: Direction
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  lang: Locale
}

const Providers = (props: Props) => {
  // Props
  const { children, direction, dictionary, lang } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <VerticalNavProvider>
      <DictionaryProvider dictionaryInit={dictionary} langDefault={lang}>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            {children}
            <AppReactToastify position={themeConfig.toastPosition} hideProgressBar rtl={direction === 'rtl'} />
          </ThemeProvider>
        </SettingsProvider>
      </DictionaryProvider>
    </VerticalNavProvider>
  )
}

export default Providers
