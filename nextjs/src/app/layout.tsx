// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { getLangFromCookie } from '@/utils/getDictionary'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Materio - Material Design Next.js Admin Template',
  description:
    'Materio - Material Design Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const lang = getLangFromCookie()

  console.log(lang)
  const direction = i18n.langDirection[lang]

  return (
    <html id='__next' lang={lang} dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers direction={direction}>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
