### 01/02/2026

12:13 AM

You can see in this menu-map for the Pi Zero HQ Cam the number of screens

<img src="./devlog-images/pi-zero-hq-cam-menu-map.JPG"/>

Will reproduce that but through the nested folder/files instead of this [POS](https://github.com/jdc-cunningham/pi-zero-hq-cam/blob/master/camera/software/menu/menu.py) that I made

Will be interesting on first boot to check for changes, you'd have to remove the flattened menu image to generate a new one based on specified icon image files and location

That popup question about battery being charged though... which is based on an "on-ticker" eg. counting up as it's booted.

I'm not sure how to define that yet in the menu. Maybe same depth but you don't say "root/index" or something.

### 01/01/2026

10:04 PM

Tomorrow's gonna be brutal, I gotta be back at work 9-5 although I'm working from home but lately I've been getting up at 3-4 PM.

I'm gonna do some work on this since I'm starting to design/build the other camera. Shame on me for jumping projects!

But at least now I'm driven again and I started buying parts. I got a nice cash gift from a friend so I bought a lot of stuff.

Pull out the ol MS paint.

The nice thing is I can do the menu work outside of an RPi. Also with the full sized RPi you can mount it and work against it in VS Code.

We're just using python PIL to flatten images together eg. icons on top of a background.

The lens scaling is the other problem which I don't know if you can fully solve due to the icons themselves unless you scale it but yeah... then there's the square vs. rectangle problem

As you can see below I've been thinking of using nested folder routing like web app routing.

Also I think the state of the menu will be a 1D array where each value is a depth and position/coordinate.

The folders are recursively traversed to build the menu and bind all the functions to the hardware

10:23 PM

<img src="./devlog-images/menu-nesting.png"/>

I should be able to reproduce the current menu that [modular-pi-cam](https://github.com/jdc-cunningham/modular-pi-cam) and [pi-zero-hq-cam](https://github.com/jdc-cunningham/pi-zero-hq-cam) are using.

### 12/23/2025

I've been thinking about this more

I had this thought of a nested folder/file system to declare menus

There would be a config file, a folder for images, then you'd have another folder to go deeper

The icons would have a coordinate map, it would be proportional so it could hopefully adapt to different screen sizes

Functions to call when the icon is clicked

### 12/16/2025

9:01 PM

I have some of my cameras on my desk at my job and I was looking at them.

Made me think of JSON you know, how nice it is to just nest things and have a structure.

I think that's how I want the menus to be defined, nested pages for the state management.

I'm going to work on this again probably near spring just so I can get out and explore, be with nature

I also want to source a better screen, like a touch screen-primaly camera with a 5D button and shutter, possibly dedicated back button
