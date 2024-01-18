import { outro, text, isCancel, spinner } from '@clack/prompts'
import colors from 'picocolors'
import { mainSymbols } from 'figures'
import fetch from 'node-fetch'
import boxen from 'boxen'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { createRequire } from 'module'
import { API_URL } from './constants.js'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)
const pkg = require('../package.json')
import { i18n, language } from '../src/index.js'

const infoMsg = `${colors.magenta(mainSymbols.pointer)} ${colors.yellow('Tweet CLI V2 Version:')} ${colors.blue(pkg.version)}\n\n${colors.magenta(mainSymbols.pointer)} ${colors.yellow('Click here for additional information:')} ${colors.blue('https://github.com/EDUJOS/tweet-cli-v2')}`
const sp = spinner()

export const info = boxen(infoMsg, {
  title: 'Developed with love by @EdTkiere <3',
  titleAlignment: 'center',
  padding: 2,
  borderColor: 'yellow',
  borderStyle: 'round',
  width: 60,
  textAlignment: 'center'
})

export function exitProgram ({ code = 0, message = `${mainSymbols.cross} ${i18n.__({ phrase: 'utilities.isCancel', locale: language })}` } = {}) {
  outro(colors.red(message))
  process.exit(code)
}

export const Tweet = async (body, token) => {
  try {
    const TweetBody = {
      TweetBody: body
    }
    // Api status: Off
    const results = await fetch(`${API_URL}/api/singletweet`, {
      method: 'POST',
      body: JSON.stringify(TweetBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await results.json()
    return data
  } catch (err) {
    console.error(err)
    return err
  }
}

export const tweetInfo = async (url) => {
  sp.start(i18n.__({ phrase: 'utilities.loading', locale: language }))
  const id = getTweetId(url)
  if (id === false) {
    sp.stop(`${colors.yellow('Ups...')}`)
    exitProgram({ message: i18n.__({ phrase: 'tweetInfo.invalid', locale: language }) })
  } else {
    const results = await fetch(`${API_URL}/api/tweetinfo/${id}`)
    const {
      username,
      name,
      tweet_text,
      created_at,
      like_count,
      retweet_count,
      reply_count,
      quote_count,
      impression_count,
      error
    } = await results.json()
    if (error === 'Not Found') {
      sp.stop(i18n.__({ phrase: 'tweetInfo.failed', locale: language }))
      exitProgram({ message: 'Chauuu' })
    } else {
      sp.stop(`${colors.green(mainSymbols.tick)}`)
      console.clear()
      const newDate = new Date(created_at)
      const date = newDate.toLocaleString('en-US')
      const message = `${colors.blue('User:')} ${name}\n${colors.blue('Tweet:')} ${tweet_text}\n${colors.blue('Likes:')} ${like_count} 💖\n${colors.blue('Retweets:')} ${retweet_count}\n${colors.blue('Replys:')} ${reply_count}\n${colors.blue('Quotes:')} ${quote_count}\n${colors.blue('Views:')} ${impression_count}\n${colors.blue('Date:')} ${date}`
      const TWEET_INFO = boxen(message, {
        title: i18n.__({ phrase: 'tweetInfo.infoTitle', locale: language }, { username: colors.magenta(username) }),
        titleAlignment: 'center',
        padding: 2,
        borderColor: 'magenta',
        borderStyle: 'round',
        width: 80,
        textAlignment: 'left'
      })
      outro(`\n${TWEET_INFO}`)
    }
  }
}

export const login = async () => {
  try {
    const folderPath = path.join(__dirname, '.././cli-config/credentials')
    const filePath = path.join(folderPath, 'user.json')
    if (!fs.existsSync(folderPath)) {
      const usernameCmd = await text({
        message: i18n.__({ phrase: 'login.title', locale: language }),
        placeholder: i18n.__({ phrase: 'login.username', locale: language }),
        validate (value) {
          if (value === 0) return `${colors.yellow(`${mainSymbols.cross} ${i18n.__({ phrase: 'login.stringErr', locale: language })}`)}`
        }
      })
      if (isCancel(usernameCmd)) exitProgram()
      const passwordCmd = await text({
        message: i18n.__({ phrase: 'login.passTitle', locale: language }),
        placeholder: i18n.__({ phrase: 'login.password', locale: language }),
        validate (value) {
          if (value === 0) return `${colors.yellow(`${mainSymbols.cross} ${i18n.__({ phrase: 'login.stringErr', locale: language })}`)}`
        }
      })
      if (isCancel(passwordCmd)) exitProgram()
      const userBody = {
        username: usernameCmd,
        password: passwordCmd
      }
      sp.start(`${colors.yellow(i18n.__({ phrase: 'login.loading', locale: language }))}`)
      const data = await getToken(userBody)
      if (data.error === 'Invalid user or password') {
        sp.stop(`${colors.red(`${mainSymbols.cross}`)} ${colors.yellow(i18n.__({ phrase: 'login.invalid', locale: language }, { command: `${colors.magenta(`edtba ${mainSymbols.arrowRight} npx edtba`)}` }))} 😅`)
        exitProgram()
      } else {
        sp.stop(`${colors.green(mainSymbols.tick + i18n.__({ phrase: 'login.success', locale: language }))} ${colors.magenta(usernameCmd)}✨`)
        const UserCredentials = {
          username: data.username,
          password: passwordCmd,
          token: data.token
        }
        sp.start(`${colors.yellow(i18n.__({ phrase: 'credentials.loading', locale: language }))}`)
        fs.mkdirSync(folderPath)
        fs.writeFileSync(filePath, JSON.stringify(UserCredentials, null, '\t'))
        sp.stop(`${colors.green(`${mainSymbols.tick}`)} ${colors.magenta(i18n.__({ phrase: 'credentials.success', locale: language }))}🔐`)
      }
    }
  } catch (err) {
    console.log(err)
    sp.stop(`${colors.red(i18n.__({ phrase: 'credentials.failed', locale: language }))}😅`)
    exitProgram()
  }
}

export const getToken = async (userBody) => {
  // Api status: Off
  const results = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    body: JSON.stringify(userBody),
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await results.json()
  return data
}

const getTweetId = (tweetUrl) => {
  let tweetId
  if (tweetUrl.includes('https://twitter.com/') && tweetUrl.includes('status')) {
    let separada = tweetUrl.split('/')[5]
    if (tweetUrl.includes('?')) {
      tweetId = separada.split('?')[0]
      console.log(tweetId)
      return tweetId
    } else {
      tweetId = separada
      return tweetId
    }
  } else {
    return false
  }
}

export async function apiHealthCheck () {
  try {
    sp.start()
    await fetch(`${API_URL}/api/health`)
      .then(res => res.json())
    sp.stop()
  } catch (err) {
    sp.stop()
    exitProgram({ message: i18n.__({ phrase: 'api.fall', locale: language }) })
  }
}
