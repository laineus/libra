const getDefaultLang = () => {
  const nav = window.navigator
  if (nav.languages) return nav.languages[0]
  return nav.language || nav.userLanguage || nav.browserLanguage
}
export default () => {
  const lang = getDefaultLang().startsWith('ja') ? 'ja' : 'en'
  return {
    bgm: 70,
    se: 100,
    lang
  }
}
