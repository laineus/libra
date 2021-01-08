const getReplaceText = values => text => {
  if (['string', 'number'].includes(typeof values)) {
    return text.replace(/#\{\w+\}/g, values)
  } else if (typeof values === 'object') {
    return Object.entries(values).reduce((text, [key, value]) => {
      return text.replace(new RegExp(`#\\{${key}\\}`, 'g'), value)
    }, text)
  } else {
    return text
  }
}

export default textData => (lang, key, values) => {
  const data = textData[lang]
  const text = key.split('.').reduce((obj, k) => obj && obj[k], data)
  if (text === undefined) {
    console.error(`Translation missing: "${key}" of "${lang}"`)
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
