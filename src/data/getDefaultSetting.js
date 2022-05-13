const getBrowserLang = () => {
  const nav = window.navigator
  if (nav.languages) return nav.languages[0]
  return nav.language || nav.userLanguage || nav.browserLanguage
}
const getDefaultLangSetting = () => {
  const lang = getBrowserLang()
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('zh')) return 'cn'
  if (lang.startsWith('es')) return 'es'
  return 'en'
}
export default () => {
  return {
    bgm: 70,
    se: 100,
    lang: getDefaultLangSetting()
  }
}
