const getLocalStorageAchievements = () => {
  try {
    const json = localStorage.getItem('achievements')
    return json ? JSON.parse(json) : []
  } catch {
    return []
  }
}
const setLocalStorageAchievements = value => {
  localStorage.setItem('achievements', JSON.stringify(value))
}
export default class AchieveManager {
  initGtag (gtag) {
    this.gtag = gtag
  }
  initSteam (greenworks) {
    this.steam = greenworks
  }
  activate (name) {
    const achievements = getLocalStorageAchievements()
    if (!achievements.includes(name)) {
      achievements.push(name)
      setLocalStorageAchievements(achievements)
    }
    if (this.steam) {
      this.steam.activateAchievement(name, () => null)
    }
    if (this.gtag) {
      this.gtag('event', 'archive', {
        event_category: name
      })
    }
  }
}
