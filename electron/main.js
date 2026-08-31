const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const steamworks = require('steamworks.js')

app.commandLine.appendSwitch('--in-process-gpu', '--disable-direct-composition')

const isDev = process.env.NODE_ENV === 'development'
const APP_ID = 1625720
const GAME_URL = 'https://libra.laineus.com/app.html'
const GAME_URL_LOCAL = 'http://localhost:5173/app.html'

const initSteamClient = () => {
  try {
    const client = steamworks.init(isDev ? APP_ID : undefined)
    console.log('Steam initialized successfully')
    return client
  } catch (error) {
    console.error('Failed to initialize Steam:', error)
    return undefined
  }
}

const steamClient = initSteamClient()
let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    useContentSize: true,
    autoHideMenuBar: true,
    icon: isDev
      ? path.join(__dirname, 'icon.png')
      : path.join(process.resourcesPath, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      cache: false
    }
  })

  Menu.setApplicationMenu(null)

  if (isDev) process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

  mainWindow.webContents.session.clearCache().then(() => {
    mainWindow.loadURL(isDev ? GAME_URL_LOCAL : GAME_URL)
  })

  if (isDev) mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

if (steamClient) steamworks.electronEnableSteamOverlay()

ipcMain.handle('steam:isAvailable', () => steamClient !== undefined)
ipcMain.handle('steam:getPlayerName', () => steamClient?.localplayer.getName())
ipcMain.handle('steam:getSteamId', () => steamClient?.localplayer.getSteamId())
ipcMain.handle('steam:getAchievement', (_event, name) => steamClient?.achievement.isActivated(name))
ipcMain.handle('steam:activateAchievement', (_event, name) => steamClient?.achievement.activate(name))
ipcMain.handle('steam:clearAchievement', (_event, name) => steamClient?.achievement.clear(name))
ipcMain.handle('steam:activateOverlay', (_event, dialog) => steamClient?.overlay.activateDialog(dialog))
ipcMain.handle('steam:saveToCloud', (_event, filename, content) => steamClient?.cloud.writeFile(filename, content))
ipcMain.handle('steam:loadFromCloud', (_event, filename) => {
  try {
    return steamClient?.cloud.readFile(filename)
  } catch {
    return null
  }
})
ipcMain.handle('steam:deleteFromCloud', (_event, filename) => steamClient?.cloud.deleteFile(filename))
ipcMain.handle('app:quit', () => app.quit())
