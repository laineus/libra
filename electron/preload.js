const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('steamAPI', {
  isAvailable: () => ipcRenderer.invoke('steam:isAvailable'),
  getPlayerName: () => ipcRenderer.invoke('steam:getPlayerName'),
  getSteamId: () => ipcRenderer.invoke('steam:getSteamId'),
  getAchievement: name => ipcRenderer.invoke('steam:getAchievement', name),
  activateAchievement: name => ipcRenderer.invoke('steam:activateAchievement', name),
  clearAchievement: name => ipcRenderer.invoke('steam:clearAchievement', name),
  activateOverlay: dialog => ipcRenderer.invoke('steam:activateOverlay', dialog),
  saveToCloud: (filename, content) => ipcRenderer.invoke('steam:saveToCloud', filename, content),
  loadFromCloud: filename => ipcRenderer.invoke('steam:loadFromCloud', filename),
  deleteFromCloud: filename => ipcRenderer.invoke('steam:deleteFromCloud', filename)
})

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.invoke('app:quit')
})
