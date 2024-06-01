// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/admin/dashboard'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/admin/account-settings'
    },
    {
      sectionTitle: 'Bài Viết'
    },
    {
      title: 'Tạo đơn hàng',
      icon: Login,
      path: '/admin/order/create',
      openInNewTab: true
    },
    {
      title: 'Danh mục',
      icon: Login,
      path: '/admin/blogcategory',
      openInNewTab: true
    },
    {
      title: 'Login',
      icon: Login,
      path: '/admin/pages/login',
      openInNewTab: true
    },
    {
      title: 'Register',
      icon: AccountPlusOutline,
      path: '/admin/pages/register',
      openInNewTab: true
    },
    {
      title: 'Error',
      icon: AlertCircleOutline,
      path: '/admin/pages/error',
      openInNewTab: true
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'Typography',
      icon: FormatLetterCase,
      path: '/admin/typography'
    },
    {
      title: 'Icons',
      path: '/admin/icons',
      icon: GoogleCirclesExtended
    },
    {
      title: 'Cards',
      icon: CreditCardOutline,
      path: '/admin/cards'
    },
    {
      title: 'Tables',
      icon: Table,
      path: '/admin/tables'
    },
    {
      icon: CubeOutline,
      title: 'Form Layouts',
      path: '/admin/form-layouts'
    }
  ]
}

export default navigation
