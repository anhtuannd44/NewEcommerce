// React Imports
import { useEffect, useState, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports
import UserLeftOverview from '@views/apps/user/view/user-left-overview'
import UserRight from '@views/apps/user/view/user-right'
import { getProduct } from '@/services/admin/product'
import { IProduct } from '@/interface/admin/product/IProduct'

const OverViewTab = dynamic(() => import('@views/apps/user/view/user-right/overview'))
const SecurityTab = dynamic(() => import('@views/apps/user/view/user-right/security'))
const BillingPlans = dynamic(() => import('@views/apps/user/view/user-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/user/view/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/user/view/user-right/connections'))

// Vars
const tabContentList = (data: PricingPlanType[]): { [key: string]: ReactElement } => ({
  overview: <OverViewTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlans data={data} />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const getPricingData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/pricing`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const AddOrEditProduct = async ({ params }: { params: { id: string } }) => {
  // Vars
  const data = await getPricingData()

  const getProductById = async (id: string) => {
    try {
      const response = await getProduct(id)

      if (response.data) {
        setProduct(response.data)
      } else {
        dispatch(showSnackbar({ message: response.error?.message || ERROR_MESSAGE_COMMON, severity: 'error' }))
      }
    } catch (error) {
      dispatch(showSnackbar({ message: ERROR_MESSAGE_COMMON, severity: 'error' }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight tabContentList={tabContentList(data)} />
      </Grid>
    </Grid>
  )
}

export default AddOrEditProduct
