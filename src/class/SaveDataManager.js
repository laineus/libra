import dayjs from 'dayjs'
import defaultState from '@/data/defaultState'
import AppStorage from '@/class/AppStorage'
import { reactive } from 'vue'
const STORAGE_KEY = 'libra_data'
export default class SaveDataManager {
  constructor () {
    this.appStorage = new AppStorage()
    this.lastNumber = null
    this.init()
  }
  init () {
    this.lastSnapshot = null
    this.setState(this.getDefaultState())
  }
  initSteam (greenworks) {
    this.appStorage.initSteam(greenworks)
  }
  getDefaultState () {
    return Object.assign({}, defaultState)
  }
  loadSetting () {
    this.appStorage.getItem(`${STORAGE_KEY}_last_saved_number`).then(savedNumber => {
      if (savedNumber) this.lastNumber = Number(savedNumber)
    })
  }
  setState (state) {
    this.state = reactive(state)
  }
  async getList () {
    const promises = (7).toArray().map(this.getRow.bind(this))
    return Promise.all(promises)
  }
  async getRow (number) {
    const state = await this.getSavedState(number)
    const snapshot = await this.getSnapshot(number)
    return {
      number,
      name: number === 0 ? 'Auto Save' : `Data ${number}`,
      state,
      snapshot,
      exists: Boolean(state)
    }
  }
  async getSavedState (number) {
    const json = await this.appStorage.getItem(`${STORAGE_KEY}_${number}`)
    if (!json) return null
    try {
      const state = JSON.parse(json)
      this.fixState(state)
      return state
    } catch (e) {
      this.delete(number)
      alert('Save data is broken')
      return false
    }
  }
  async getSnapshot (number) {
    return this.appStorage.getItem(`${STORAGE_KEY}_${number}_ss`)
  }
  async save (number) {
    const promises = []
    this.state.saved = dayjs().unix()
    const str = JSON.stringify(this.state)
    promises.push(this.appStorage.setItem(`${STORAGE_KEY}_${number}`, str))
    if (this.lastSnapshot) promises.push(this.appStorage.setItem(`${STORAGE_KEY}_${number}_ss`, this.lastSnapshot))
    if (number > 0) this.lastNumber = number
    promises.push(this.appStorage.setItem(`${STORAGE_KEY}_last_saved_number`, String(number)))
    return Promise.all(promises)
  }
  async load (number) {
    const savedData = await this.getSavedState(number)
    if (!savedData) return false
    this.setState(savedData)
    this.lastNumber = number
    return true
  }
  delete (number) {
    this.appStorage.removeItem(`${STORAGE_KEY}_${number}`)
    this.appStorage.removeItem(`${STORAGE_KEY}_${number}_ss`)
    return true
  }
  fixState (data) {
    const row = (origin, data) => {
      const originKeys = Object.keys(origin)
      const dataKeys = Object.keys(data)
      const shouldBeAdded = originKeys.filter(k => !dataKeys.includes(k))
      const shouldBeDeleted = dataKeys.filter(k => !originKeys.includes(k))
      const shouldContinueToFix = dataKeys.filter(k => originKeys.includes(k) && data[k] && Object.isObject(data[k]))
      if (shouldBeAdded.length) console.log('add: ', shouldBeAdded.join(', '))
      if (shouldBeDeleted.length) console.log('delete: ', shouldBeDeleted.join(', '))
      shouldBeAdded.forEach(k => data[k] = JSON.parse(JSON.stringify(origin[k])))
      shouldBeDeleted.forEach(k => delete data[k])
      shouldContinueToFix.forEach(k => row(origin[k], data[k]))
    }
    row(this.getDefaultState(), data)
    return data
  }
}
