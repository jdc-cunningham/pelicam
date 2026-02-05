// this is based on a crash course I followed
// https://github.com/jdc-cunningham/cross-platform-app/blob/crash-courses/desktop/main.js
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain } = electron;
const macPlatform = process.platform == 'darwin';
let mainWindow;

// listen for app to be ready
app.on('ready', () => {
  // create new window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'menu-builder-icon.png'),
    webPreferences: {
      preload: path.join(app.getAppPath(), './app/public/preload.js'),
      worldSafeExecuteJavaScript:  true,
      contextIsolation: true
    }
  });

  // https://stackoverflow.com/a/43488020
  ipcMain.on('sendImgData', (e, args) => {
    if (args?.imgInfo) {
      const { name, data } = args.imgInfo;
      const imgData = data.replace(/^data:image\/\w+;base64,/, "");
      const buff = Buffer.from(imgData, 'base64');
      const imgPath = path.join(app.getAppPath(), `./menu-output/sprites/${name}`);

      try {
        fs.writeFileSync(imgPath, buff);
        e.reply("imgAdded", {
          ...args.imgInfo,
          name,
          data: imgData
        });
      } catch(e) {
        alert('Failed to save the file !');
      }
    }
  });

  // load html file into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './app/build/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // quit app when closed
  mainWindow.on('closed', () => {
    app.quit();
  });
});

// create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: macPlatform ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// if Mac add empty object to menu
if (macPlatform) {
  mainMenuTemplate.unshift({});
}

// add dev tools menu itme if not in prod
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: macPlatform ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) { // want devtools to show up on active window
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}