// main.js - Electron Main Process
const { app, BrowserWindow, ipcMain } = require('electron');

// Keep a global reference of the window objects
let mainWindow;
let verboseWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 440,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open DevTools during development (comment out for production)
  // mainWindow.webContents.openDevTools();

  // When window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Create a verbose details window
function createVerboseWindow() {
  // Close existing window if it exists
  if (verboseWindow) {
    verboseWindow.close();
  }

  verboseWindow = new BrowserWindow({
    width: 900,
    height: 700,
    title: 'Text Cleaning Details',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  verboseWindow.loadFile('verbose.html');

  // Open DevTools during development (comment out for production)
  // verboseWindow.webContents.openDevTools();

  verboseWindow.on('closed', function () {
    verboseWindow = null;
  });
}

// Create window when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Handle verbose window creation and data passing
ipcMain.handle('show-verbose-window', (event, verboseData) => {
  createVerboseWindow();

  // Wait for the verbose window to be ready before sending data
  verboseWindow.webContents.once('did-finish-load', () => {
    verboseWindow.webContents.send('verbose-data', verboseData);
  });

  return true;
});
