const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendImgData: (args) => ipcRenderer.send('sendImgData', args),
  imgAdded: (callback) => ipcRenderer.on('imgAdded', callback)
});
