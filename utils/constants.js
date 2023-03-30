const placeholders = [
  'A chucho le gusta el pene, según los expertos...',
  'Do u like big diks?',
  'I\'m feeling blue',
  'Quién pa\' peliculiar?🥵'
]

const random = Math.floor(Math.random()*(placeholders.length))

export const RANDOM_PLACEHOLDER = `${placeholders[random]}`

export const API_URL = 'https://web-start.up.railway.app'