import { outro } from '@clack/prompts'
import colors from 'picocolors'
import { mainSymbols } from 'figures'
import fetch from 'node-fetch'
import boxen from 'boxen'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const infoMsg = `${colors.magenta(mainSymbols.pointer)} ${colors.yellow('Tweet Bot API Version:')} ${colors.blue(pkg.version)}\n\n${colors.magenta(mainSymbols.pointer)} ${colors.yellow('Click here for additional information:')} ${colors.blue('https://github.com/EDUJOS/tweet-cli-v2')}`

export const info = boxen(infoMsg, {
  title: 'Developed with love by @EdTkiere <3',
  titleAlignment: 'center',
  padding: 2,
  borderColor: 'yellow',
  borderStyle: 'round',
  width: 60,
  textAlignment: 'center'
})

export function exitProgram ({ code = 0, message = `${mainSymbols.cross} Vaya, parece que eres un completo estúpido` } = {}) {
  outro(colors.red(message))
  process.exit(code)
}

export const Tweet = async (body) => {
  try {
    console.log(body)
    const TweetBody = {
      TweetBody: body
    }
    const results = await fetch('https://web-start.up.railway.app/api/singletweet', {
      method: 'POST',
      body: JSON.stringify(TweetBody),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await results.json()
    return data
  } catch (err) {
    console.error(err)
    return err
  }
}
