// Lista de nomes de ícones disponíveis (apenas para referência no modal)
export const CATEGORY_ICON_NAMES = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
] as const

export const CATEGORY_COLORS = [
  {
    name: 'green',
    value: 'green-base',
    bgClass: 'bg-green-base',
    textClass: 'text-green-base',
    lightBgClass: 'bg-green-light',
    darkTextClass: 'text-green-dark',
  },
  {
    name: 'blue',
    value: 'blue-base',
    bgClass: 'bg-blue-base',
    textClass: 'text-blue-base',
    lightBgClass: 'bg-blue-light',
    darkTextClass: 'text-blue-dark',
  },
  {
    name: 'purple',
    value: 'purple-base',
    bgClass: 'bg-purple-base',
    textClass: 'text-purple-base',
    lightBgClass: 'bg-purple-light',
    darkTextClass: 'text-purple-dark',
  },
  {
    name: 'pink',
    value: 'pink-base',
    bgClass: 'bg-pink-base',
    textClass: 'text-pink-base',
    lightBgClass: 'bg-pink-light',
    darkTextClass: 'text-pink-dark',
  },
  {
    name: 'red',
    value: 'red-base',
    bgClass: 'bg-red-base',
    textClass: 'text-red-base',
    lightBgClass: 'bg-red-light',
    darkTextClass: 'text-red-dark',
  },
  {
    name: 'orange',
    value: 'orange-base',
    bgClass: 'bg-orange-base',
    textClass: 'text-orange-base',
    lightBgClass: 'bg-orange-light',
    darkTextClass: 'text-orange-dark',
  },
  {
    name: 'yellow',
    value: 'yellow-base',
    bgClass: 'bg-yellow-base',
    textClass: 'text-yellow-base',
    lightBgClass: 'bg-yellow-light',
    darkTextClass: 'text-yellow-dark',
  },
] as const

/**
 * Busca a configuração de cor pelo nome
 * @param colorName Nome da cor salvo no banco
 * @returns Objeto com as classes de cor
 */
export function getCategoryColor(colorName: string) {
  const color = CATEGORY_COLORS.find(item => item.name === colorName)
  return color || CATEGORY_COLORS[0] // fallback para green
}
