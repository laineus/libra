import defaultSetting from '@/data/defaultSetting'
export default class CommonSetting {
  constructor () {
    this.state = this.getDefaultSetting()
    this.initializedLang = this.state.lang
    this.loadSetting()
  }
  loadSetting () {
    const settingString = localStorage.getItem('setting')
    if (!settingString) return
    try {
      const setting = JSON.parse(settingString)
      this.state = setting
      this.initializedLang = setting.lang
    } catch (error) {
    }
  }
  save () {
    const json = JSON.stringify(this.state)
    localStorage.setItem('setting', json)
  }
  getDefaultSetting () {
    return Object.assign({}, defaultSetting)
  }
}
