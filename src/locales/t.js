import locales from '@/locales/index'
import setting from '@/data/setting'

const getReplaceText = values => text => {
  if (['string', 'number'].includes(typeof values)) {
    return text.replace(new RegExp('\\#\\{\\w+\\}', 'g'), values)
  } else if (typeof values === 'object') {
    return Object.keys(values).reduce((text, key) => {
      return text.replace(new RegExp(`\\#\\{${key}\\}`, 'g'), values[key])
    }, text)
  } else {
    return text
  }
}

export default (key, values) => {
  const locale = locales[setting.state.lang]
  const text = key.split('.').reduce((obj, k) => obj && obj[k], locale)
  if (text === undefined) {
    console.error(`Translation missing: "${key}" of "${setting.state.lang}"`)
    return 'Missing'
  }
  const replaceText = getReplaceText(values)
  if (Array.isArray(text)) {
    return text.map(replaceText)
  } else if (typeof text === 'string') {
    return replaceText(text)
  } else {
    return text
  }
}
