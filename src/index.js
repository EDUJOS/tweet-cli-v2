import { intro, outro, select, isCancel, cancel } from '@clack/prompts'
import colors from 'picocolors'
import { mainSymbols } from 'figures'

async function main () {
  intro(colors.inverse(`Tweet Bot API by: ${colors.magenta('EdTkiere')}`))
  const tweetCmd = await select({
    message: colors.cyan('¿Que quieres hacer?'),
    options: [
      { value: 'tweet', label: 'Publicar un Tweet' },
      { value: 'tweetInfo', label: 'Obtener información de un Tweet', hint: 'Url required' }
    ]
  })

  if (isCancel(tweetCmd)) {
    cancel(` ${mainSymbols.cross}  Oh no, eres un estúpido ;(`)
    return process.exit(0)
  }
  outro('Chau')
}

main().catch(console.error)
