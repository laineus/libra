// - awaken リブラの見た夢 シナリオをクリアしたA
// - rest リブラの見た夢 シナリオをクリアしたB
// - quest コンプリート 全てのクエストを完了した
// - drink 一服 ジュースを買った break time
// - trash 清掃員 ゴミを捨てた garbage collector
// - tissue 積極的 ティッシュを使い切った passionate
// - raptor 考古学者 Archaeologist
// - cosmos 宇宙旅行 Space traveler
// - art 絵画収集家 art collector
// - pink ピンクペンギン pink penguin
// - murder 殺害 murder
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
      if (this.steam) {
        this.steam.activateAchievement(name, () => null)
      }
      console.log('Activate achievement', achievements)
    }
  }
}
