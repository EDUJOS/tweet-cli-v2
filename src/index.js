import { intro, outro, text, select, isCancel, spinner, confirm } from '@clack/prompts'
import { setTimeout as sleep } from 'node:timers/promises'
import colors from 'picocolors'
import { mainSymbols } from 'figures'
import { exitProgram, Tweet, info, login, getToken } from '../utils/utils.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

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
    await login()
    const publishTweet = await text({
      message: colors.blue('Ingresa el cuerpo del Tweet a publicar'),
      placeholder: 'A chucho le gusta el pene, según los expertos...',
      initialValue: 'A chucho le gusta el pene, según los expertos...',
      validate (value) {
        if (value.length > 200) return `${colors.red(`${mainSymbols.cross} Asegúrate de no ingresar más de 100 caracteres`)}`
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
      const ruta = path.join(__dirname, '.././utils/User-Credentials')
      const filePath = path.join(ruta, 'user.json')
      const file = require(filePath)
      const token = file.token
      const data = await Tweet(publishTweet, token)
      if (data.error === 'Token expired') {
        sp.stop(`${colors.red('Vaya, parece que tu sesión ha caducado')}😭`)
        const user = await text({
          message: 'Vuelve a iniciar sesión 😴',
          placeholder: 'Ingresa tu nombre de usuario aquí 👀',
          validate (value) {
            if (value === 0) return `${colors.yellow(`${mainSymbols.cross} Lo siento, no puedes enviar un string vacío!`)}`
          }
        })
        const pass = await text({
          message: 'Vuelve a iniciar sesión 😴',
          placeholder: 'Ingresa tu contraseña aquí 👀',
          validate (value) {
            if (value === 0) return `${colors.yellow(`${mainSymbols.cross} Lo siento, no puedes enviar un string vacío!`)}`
          }
        })
        sp.start(colors.yellow('Actualizando tus datos'))
        const userBody = {
          username: user,
          password: pass
        }
        const tokenData = await getToken(userBody)
        const UserCredentials = {
          username: file.username,
          password: file.password,
          token: tokenData.token
        }
        fs.writeFileSync(filePath, JSON.stringify(UserCredentials))
        sp.stop(`${colors.green(mainSymbols.tick)}`)
        outro(`${colors.magenta('Tus credenciales han sido actualizadas con éxito')}🔐`)
      } else {
        sp.stop(`${colors.green('Tu Tweet se ha publicado con éxito, puedes verlo en la cuenta de:')} ${colors.yellow('@SoylaPerradeEd')}`)
        outro(`${colors.bold(colors.magenta('Tweet Body:'))} ${colors.italic(colors.blue(data.tweetBody))}\n   ${colors.bold(colors.magenta('Tweet Url:'))} ${colors.blue(data.url)}`)
      }
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
