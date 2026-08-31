export default class AppStorage {
  constructor () {
    this.initLocalStorage()
  }
  initLocalStorage () {
    this.localStorage = {
      getItem: async (name) => {
        return localStorage.getItem(name)
      },
      setItem: async (name, body) => {
        return localStorage.setItem(name, body)
      },
      removeItem: async (name) => {
        return localStorage.removeItem(name)
      }
    }
  }
  initSteam (steamAPI) {
    this.steam = steamAPI
    this.steamStorage = {
      getItem: async (name) => {
        return steamAPI.loadFromCloud(name).then(value => {
          return value ?? this.localStorage.getItem(name)
        }).catch(() => {
          return this.localStorage.getItem(name)
        })
      },
      setItem: (name, body) => {
        return steamAPI.saveToCloud(name, body).then(saved => {
          return saved || this.localStorage.setItem(name, body)
        }).catch(() => {
          return this.localStorage.setItem(name, body)
        })
      },
      removeItem: (name) => {
        return steamAPI.deleteFromCloud(name).then(deleted => {
          return deleted || this.localStorage.removeItem(name)
        }).catch(() => {
          return this.localStorage.removeItem(name)
        })
      }
    }
  }
  getAvailableStorage () {
    if (this.steam) {
      return this.steamStorage
    }
    return this.localStorage
  }
  async getItem (name) {
    const storage = this.getAvailableStorage()
    return storage.getItem(name)
  }
  async setItem (name, body) {
    const storage = this.getAvailableStorage()
    return storage.setItem(name, body)
  }
  async removeItem (name) {
    const storage = this.getAvailableStorage()
    return storage.removeItem(name)
  }
}
