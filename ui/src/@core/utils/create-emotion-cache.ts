import createCache from '@emotion/cache'

export const createEmotionCache = () => {
  let insertionPoint

  if (typeof window !== 'undefined') {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]')
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  const theCache = createCache({ key: 'mui-style', insertionPoint, prepend: true })

  // Add this <------------------------------------------------------------------------------------
  theCache.compat = true

  return theCache
}
