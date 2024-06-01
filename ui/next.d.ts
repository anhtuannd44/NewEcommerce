import type { ReactElement, ReactNode } from 'react'
import type { DocumentContext, NextComponentType, NextPageContext } from 'next/dist/shared/lib/utils'

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

declare module 'http' {
  export interface IncomingMessage {
    cookie: Partial<{
      [key: string]: string
    }>
  }
}