// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode, getServerMode } from '@core/utils/serverHelpers'
import { getLangFromCookie } from '@/utils/getDictionary'

const NotFoundPage = () => {
  // Vars
  const lang = getLangFromCookie()
  const direction = i18n.langDirection[lang]
  const systemMode = getSystemMode()
  const mode = getServerMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
