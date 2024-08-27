export const dictionaries = {
  vi: () => import('@/data/dictionaries/vi.json').then(module => module.default),
  en: () => import('@/data/dictionaries/en.json').then(module => module.default)
}
