import { intro, outro, text, select, isCancel, spinner, confirm } from '@clack/prompts'
// import { setTimeout as sleep } from 'node:timers/promises'
import colors from 'picocolors'
import { mainSymbols } from 'figures'
import { exitProgram, Tweet, info, login, getToken, tweetInfo, apiHealthCheck } from '../utils/utils.js'
import { RANDOM_PLACEHOLDER } from '../utils/constants.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

import { i18n, language } from '../utils/i18n.config.js'

const sp = spinner()

async function main () {
  console.clear()

  intro(`\n${info}`)
  const tweetCmd = await select({
    message: colors.blue(i18n.__({ phrase: 'utilities.mainTitle', locale: language })),
    options: [
      { value: 'tweet', label: i18n.__({ phrase: 'utilities.tweet', locale: language }) },
      { value: 'tweetInfo', label: i18n.__({ phrase: 'utilities.tweetInfo', locale: language }), hint: i18n.__({ phrase: 'utilities.url', locale: language }) },
      { value: 'config', label: i18n.__({ phrase: 'utilities.config', locale: language }), hint: i18n.__({ phrase: 'utilities.configLabel', locale: language }) }
    ]
  })

  if (isCancel(tweetCmd)) exitProgram()

  if (tweetCmd === 'tweet') {
    await apiHealthCheck()
    await login()
    const publishTweet = await text({
      message: colors.blue(i18n.__({ phrase: 'tweet.title' , locale: language })),
      placeholder: RANDOM_PLACEHOLDER,
      validate (value) {
        if (value.length > 200) return `${colors.red(`${mainSymbols.cross} ` + i18n.__({ phrase: 'tweet.max' , locale: language }))}`
        if (value.length === 0) return `${colors.red(`${mainSymbols.cross} ` + i18n.__({ phrase: 'tweet.min' , locale: language }))}`
      }
    })

    if (isCancel(publishTweet)) exitProgram()

    const tweetConf = await confirm({
      initialValue: true,
      message: `${colors.blue(i18n.__({ phrase: 'tweet.confirm' , locale: language }))} ${colors.yellow(publishTweet)}`
    })

    if (isCancel(tweetConf)) exitProgram()

    if (tweetConf === false) {
      exitProgram()
    } else {
      sp.start(`${colors.yellow(i18n.__({ phrase: 'utilities.loading' , locale: language }))}`)
      const ruta = path.join(__dirname, '.././cli-config/credentials')
      const filePath = path.join(ruta, 'user.json')
      const file = require(filePath)
      const token = file.token
      const data = await Tweet(publishTweet, token)
      if (data) {
        if (data.error === 'Token expired' || data.error === 'Token missing or invalid') {
          // console.log(data)
          await tokenExpired()
        } else {
          sp.stop(colors.green(i18n.__({ phrase: 'tweet.success', locale: language }, { user: colors.yellow('@SoylaPerradeEd') })))
          outro(`${colors.bold(colors.magenta('Tweet Body:'))} ${colors.italic(colors.blue(data.tweetBody))}\n   ${colors.bold(colors.magenta('Tweet Url:'))} ${colors.blue(data.url)}`)
          process.exit(0)
        }
      }
      outro(colors.bgYellow(i18n.__({ phrase: 'globalErrors.unexpected', locale: language })))
      process.exit(1)
    }
  }
  if (tweetCmd === 'tweetInfo') {
    outro(colors.bgMagenta(i18n.__({ phrase: 'utilities.unavailable', locale: language })))
    process.exit(0)
    // await apiHealthCheck()
    // const tweetUrl = await text({
    //   message: colors.blue(i18n.__({ phrase: 'tweetInfo.title', locale: language })),
    //   placeholder: i18n.__({ phrase: 'tweetInfo.url', locale: language }),
    //   validate (value) {
    //     if (value.length > 200) return `${colors.red(`${mainSymbols.cross} ` + i18n.__({ phrase: 'tweet.max' , locale: language }))}`
    //     if (value.length === 0) return `${colors.red(`${mainSymbols.cross} ` + i18n.__({ phrase: 'tweet.min' , locale: language }))}`
    //   }
    // })
    // if (isCancel(tweetUrl)) exitProgram()
    // await tweetInfo(tweetUrl)
  }
  if (tweetCmd === 'config') {
    const configInput = await select({
      message: colors.blue(i18n.__({ phrase: 'utilities.configLabel', locale: language })),
      options: [
        { value: 'lang', label: i18n.__({ phrase: 'configOptions.lang', locale: language }) }
      ]
    })

    if (configInput === 'lang') {
      const langInput = await select({
        message: colors.blue(i18n.__({ phrase: 'langConfig.title', locale: language })),
        options: [
          { value: 'en', label: i18n.__({ phrase: 'langConfig.en', locale: language }) },
          { value: 'es', label: i18n.__({ phrase: 'langConfig.es', locale: language }) }
        ]
      })
      if (isCancel(langInput)) {
        exitProgram()
      }
      else if (langInput) {
        const langFileConfig = {
          cli_lang: langInput
        }
        try {
          fs.writeFileSync(path.join(__dirname, '../cli-config/lang.json'), JSON.stringify(langFileConfig, null, '\t'))
          outro(colors.green(i18n.__({ phrase: 'langConfig.save', locale: language })))
          process.exit(0)
        } catch (error) {
          outro(colors.red(i18n.__({ phrase: 'globalErrors.unexpected', locale: language })))
          process.exit(1)
        }
      }
    }
  }
}

const tokenExpired = async () => {
  const ruta = path.join(__dirname, '.././cli-config/credentials')
  const filePath = path.join(ruta, 'user.json')
  const file = require(filePath)
  sp.stop(`${colors.red(i18n.__({ phrase: 'session.timedOut', locale: language }))}😭`)
  const user = await text({
    message: i18n.__({ phrase: 'session.again', locale: language }),
    placeholder: i18n.__({ phrase: 'login.password', locale: language }),
    validate (value) {
      if (value === 0) return `${colors.yellow(`${mainSymbols.cross} ${i18n.__({ phrase: 'login.stringErr', locale: language })}`)}`
    }
  })
  const pass = await text({
    message: i18n.__({ phrase: 'session.again', locale: language }),
    placeholder: i18n.__({ phrase: 'login.password', locale: language }),
    validate (value) {
      if (value === 0) return `${colors.yellow(`${mainSymbols.cross} ${i18n.__({ phrase: 'login.stringErr', locale: language })}`)}`
    }
  })
  sp.start(colors.yellow(i18n.__({ phrase: 'credentials.update', locale: language })))
  const userBody = {
    username: user,
    password: pass
  }
  const tokenData = await getToken(userBody)
  if (tokenData.error === 'Invalid user or password') {
    sp.stop(`${colors.red(`${mainSymbols.cross}`)} ${colors.yellow(i18n.__({ phrase: 'login.invalid', locale: language }, { command: `${colors.magenta(`edtba ${mainSymbols.arrowRight} npx edtba`)}` }))} 😅`)
    exitProgram()
  } else {
    const UserCredentials = {
      username: file.username,
      password: file.password,
      token: tokenData.token
    }
    fs.writeFileSync(filePath, JSON.stringify(UserCredentials, null, '\t'))
    sp.stop(`${colors.green(mainSymbols.tick)}`)
    outro(`${colors.magenta(i18n.__({ phrase: 'credentials.updateSuccess', locale: language }))}🔐`)
  }
}

main().catch(console.error)
