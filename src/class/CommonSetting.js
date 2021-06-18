import { reactive } from 'vue'
import getDefaultSetting from '@/data/getDefaultSetting'
const KEY = 'libra_setting'
export default class CommonSetting {
  constructor () {
    this.setSetting(getDefaultSetting())
    this.initializedLang = this.state.lang
    this.loadSetting()
  }
  setSetting (state) {
    this.state = reactive(state)
  }
  loadSetting () {
    const settingString = localStorage.getItem(KEY)
    if (!settingString) return
    try {
      const setting = JSON.parse(settingString)
      this.setSetting(setting)
      this.initializedLang = setting.lang
    } catch (error) {
    }
  }
  save () {
    const json = JSON.stringify(this.state)
    localStorage.setItem(KEY, json)
  }
}
