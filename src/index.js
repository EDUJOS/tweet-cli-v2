import { intro, outro, text, select, isCancel, spinner, confirm } from '@clack/prompts'
import { setTimeout as sleep } from 'node:timers/promises'
import colors from 'picocolors'
import { mainSymbols } from 'figures'
import { exitProgram, Tweet, info } from '../utils/utils.js'

async function main () {
  console.clear()

  intro(`\n${info}`)
  const tweetCmd = await select({
    message: colors.blue('¿Que quieres hacer?'),
    options: [
      { value: 'tweet', label: 'Publicar un Tweet' },
      { value: 'tweetInfo', label: 'Obtener información de un Tweet', hint: 'Url required' }
    ]
  })

  if (isCancel(tweetCmd)) exitProgram()

  if (tweetCmd === 'tweet') {
    const publishTweet = await text({
      message: colors.blue('Ingresa el cuerpo del Tweet a publicar'),
      placeholder: 'A chucho le gusta el pene, según los expertos...',
      initialValue: 'A chucho le gusta el pene, según los expertos...',
      validate (value) {
        if (value.length > 100) return `${colors.red(`${mainSymbols.cross} Asegúrate de no ingresar más de 100 caracteres`)}`
        if (value.length === 0) return `${colors.red(`${mainSymbols.cross} Uhmm, asegúrate de ingresar al menos más de 2 caracteres`)}`
      }
    })

    if (isCancel(publishTweet)) exitProgram()

    const tweetConf = await confirm({
      initialValue: true,
      message: `${colors.blue('Estás seguro del tweet:')} ${colors.yellow(publishTweet)}`
    })

    if (isCancel(tweetConf)) exitProgram()

    if (tweetConf === false) {
      exitProgram()
    } else {
      const sp = spinner()
      sp.start(`${colors.yellow('Estamos procesando tu solicitud')}`)
      const data = await Tweet(publishTweet)
      sp.stop(`${colors.green('Tu Tweet se ha publicado con éxito, puedes verlo en la cuenta de:')} ${colors.yellow('@SoylaPerradeEd')}`)
      outro(`${colors.bold(colors.magenta('Tweet Body:'))} ${colors.italic(colors.blue(data.TweetBody))}\n   ${colors.bold(colors.magenta('Tweet Url:'))} ${colors.blue(data.Url)}`)
    }
  } else {
    const sp = spinner()
    sp.start(colors.magenta('Procesando solicitud'))
    await sleep(2000)
    sp.stop(colors.red('Lo siento, esta función no está diponible por lo que el proyecto apenas empieza.'))
    outro(colors.magenta('Pero no te preocupes que pronto estará disponible!!'))
  }
}

main().catch(console.error)
