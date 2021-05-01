const getDefaultLang = () => {
  const nav = window.navigator
  if (nav.languages) return nav.languages[0]
  return nav.language || nav.userLanguage || nav.browserLanguage
}
const lang = getDefaultLang().startsWith('ja') ? 'ja' : 'en'
export default {
  bgm: 100,
  se: 100,
  lang
}
