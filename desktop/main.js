const { app, BrowserWindow, Menu } = require('electron');
let win = null;

const createWindow = () => {
  const option = { width: 800, height: 638, webPreferences: { nodeIntegration: true } };
  win = new BrowserWindow(option);
  win.loadFile('src/index.html');
  // win.webContents.openDevTools();
  Menu.setApplicationMenu(null)
  win.on('closed', () => { win = null });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => app.quit());