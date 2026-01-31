### This is a desktop app

Where you can specify your screen size and then build a menu by dragging in sprite images, resizing them, placing them, getting a JSON output to render the menu.

It is a desktop app in order to write to your file system.

You will be asked what type of display you have and the resolution before you can start making menu scenes and placing icons to the snap grid.

### electron.js

Is the Electron part and the `app` folder is the react-app that is built as static files/rendered by the Electron desktop wrapper.

### Development

You can develop the react-app in the browser by going into the `app` folder and using `npm start`.

You can run the Electron desktop app through `npm start` in the `menu-builder` folder.

Note that you have to build the react app first before running the electron portion (needs static files to show).

Compiled sources will be provided for windows, mac and linux but you can also compile it yourself.

### Disclaimer

Be aware this desktop app is going to take whatever image you drag-drop into it and write it to your filesystem (in this repo).
