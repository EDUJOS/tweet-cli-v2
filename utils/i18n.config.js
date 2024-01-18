import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const langFile = require('../cli-config/lang.json')
const language = langFile.cli_lang

const { I18n } = require('i18n')
const i18n = new I18n()

i18n.configure({
  locales: ['es', 'en'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,
  logWarnFn: function (msg) {
    console.log('ALERTA' + msg)
  },
  LogErrorFn: function (msg) {
    console.log('Error' + msg)
  },
  missingKeyFn: function (locate, value) {
    return value
  },
  mustacheConfig: {
    tags: ['{{', '}}'],
    disable: false
  }
})

export { i18n, language }