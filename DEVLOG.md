- [x] PC dev menu
  - this would be an OpenCV window
    - [x] keyboard interface (d-pad, enter, backspace, button for shutter like p I guess)
- [x] folder, file, config, structure
- [ ] make menu builder desktop app
- [ ] make all menu scenes from current menu
- [ ] walker
- [ ] functional-rendering
- [x] splash screen (logo)
- [x] battery charged
- [ ] home
  - [x] base scene
  - [ ] camera settings (need to figure out layout)
    - shutter
    - exposure
    - f-stop
      - detect electronic aperture if not manual (no value)
    - white balance
  - [ ] toggle mode
    - [ ] tap to record
  - [ ] files
    - [ ] file view (this one is interesting, where do the preview images come from)
    - [ ] no files
  - [ ] settings
    - [ ] settings page
      - [ ] raw telemetry (what is this for)
      - [ ] battery profiler
        - [ ] profiling battery
      - [ ] reset battery
      - [ ] timelapse
        - timelapse page
      - [ ] transfer to USB (hasn't worked lately even FAT32 format)
      - [ ] delete all files

- [ ] menu builder
  - [x] verify Electron can write to host
  - [ ] poc of drag-drop using react-dnd
  - [ ] save image from html
  - [ ] build out interface

### 02/03/2026

7:05 PM

Alright so right now I've been in the web space, not developing against electron

What I need to do is build out this menu

7:12 PM

Distracted, I'm going to add a localStorage way to save menus as I build em out

Although I first have to define the menus/nest it with the current nesting bit

I just went with letters before, time to add more properties to the objects

<img src="./devlog-images/menu-to-build.JPG"/>



---

### 02/02/2026

8:52 PM

Late to go on today, was doing some work for work

8:59 PM

<img src="./devlog-images/linear-group.png"/>

If you look at the image above, you can see that the menu scenes can be created in different orders

They're linked by whatever "+" I con you clicked eg. that is the parent

When the items are added, they're added to a flat object eg.

```
{
  "a": {
    "parent": ""
  },
  "b": {
    "parent": "a"
  },
  ...
}
```

or for the right side

```
{
  "a": {
    "parent": ""
  },
  "c": {
    "parent": "a"
  },
  ...
}
```

What I have to do is form a nested group from the linear group above like:

```
{
  "a": {
    "b": {
      "c": {}
    }
  }
}
```

Which follows the visual layout above and from that, you programmatically do the margin left indenting

9:38 PM

Alright I think I have a sorting algo here

Let me test that I didn't just fit my test case

10:04 PM

yes sir...

<img src="./devlog-images/sorted.JPG"/>

Probably the nastiest re-dundant algo but it works

So text interface is next

There is also the problem of duplicate checking with names for the menus and images

10:10 PM

I think an easy solution is to have a text input box show up under the menu display

You could do a floating div that's content-editable

10:20 PM

Alright here's a functional text sprite

<img src="./devlog-images/text-sprite.gif"/>

So now it's about making the JSON objects for the menus eg.

{
  "home": {...},
  "sub_page": {
    ...
  }
}

I have not considered saving yet, maybe while I develop I'll save to local storage until I bridge it to Electron

11:28 PM

I am starting to imagine using this camera, I'm looking forward to getting to a functional version

I really want to emphasize image quality and this higher resolution display and faster FPS will help with that, I can do focus peaking

Also video settings can be changed too, in the past I'd just been recording automatic video

Only becaue I was more interested in photography than video

---

### 02/01/2026

1:48 PM

Late start today, woke up around 12PM, had to run some errands

Distractions... but I'm on

- [x] menu nesting
- [x] text interface

I was thinking about it

I actually won't have the UI generate the menu images

The python side will do it, it's primarily due to not guaranteeing a match between fonts

Also there would be a challenge of keeping the file system synced with the memory web app regarding updating/re-rendering the menu scene every time the user makes a change

So it could just be, you prodcue the JSON setting and the web app shows you what it would look like

Also the dynamic text would have a dynamic label on them

That only mattered for the possibility of having permanent text on a menu scene vs. overwriting it depending on camera state

Focus mode till I get this menu nesting thing down

2:27 PM

Still distracted, on now

2:37 PM

Alright let's do this

3:35 PM

Had to eat

Ughhhhh wish I just woke up and started writing code right away

Today will be fun though I'm gonna clean up my closet IoT garden, repot my plants and try to grow mangoes again

3:41 PM

Ahh my cat man why does he sit in front of the screen

<img src="./devlog-images/cat.JPG"/>

3:54 PM

Alright I got it

<img src="./devlog-images/desired-output.JPG"/>

This is how the nesting/indenting will work

4:14 PM

Damn this is wrong... shiiiiiiiii

That circled part, d should be 1 still not 2

5:12 PM

I did take a brief like 20 min break but if you want to see why this is hard

https://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by

5:32 PM

Man I'm bad...

Another way I was thinking of doing it is nested arrays

But I think it would be the same as nested objects accessed by key:val pairs instead of numerical

5:42 PM

OMG I'm failing...

<img src="./devlog-images/failing.JPG"/>

REEEEEEE

<img src="./devlog-images/leetcode.JPG"/>

Here it is Jacob, base pay $500K a year, how do you solve this?

6:16 PM

I'm close here, the "moving reference"

https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object

<img src="./devlog-images/dynamic.JPG"/>

I almost have it, but I have the value not the reference so I can write at this depth

6:33 PM

Oh it is working, if you evaluate the reference then it shows the value but if you use it as a position to write then it works

7:56 PM

Sadly I'm already spent today

https://jsfiddle.net/jgqdbpwv/

Left off at that

---

### 01/31/2026

10:02 AM

Alright... got some decent sleep

No hangover

It will be a day of days

I try to tackle the hardest/unknown thing first in case it takes me longer than I expect to figure it out.

So what I'm going to work on next is the snap grid on the menu.

I will use a preloaded image like before.

10:07 AM

Alright I looked through DND and it does not have grid-snapping built in, it's just a drag-drop which I already have... so I'll skip the grid thing myself, what will happen is the user can drag it into place and dial it in with x,y coordinates for now

I will add a padding for the display config, oh yeah that could be json file pre-baked

- [x] drop an img element on the scene
- [x] padding hint
- [x] add way to dial it in perfectly
- [x] scale
- [ ] sprites should have unique names, append random 6 char alphanum string
- [ ] flatten/produce an image
- [ ] JSON nesting
- [x] sidebar update
- [x] include button binding
- [ ] menu nesting logic
- [ ] should be able to produce all menu pages
- [ ] extra/future - set color of display and font/icons(svg)
- [ ] out of bounds check for sprite dragging
- [ ] text placement should be editable regarding size and coordinates

Waiting for my coffee

I'm thinking today I'll get the menu stuff done, tomorrow I'll get the hardware service calls done and bridge the two together

10:15 AM

I need the sprite dimensions so I'll go back in and add that

11:14 AM

So we've got this right now

<img src="./devlog-images/drag-drop-to-display-reposition.gif"/>

You can see it's a little off and it goes out of bounds, but I'm going to add a menu on the bottom based on the last icon you selected, where you can reposition it.

12:30 PM

Okay need to do the hard things... next will be the Button binding and menu section on the right, I'll do the menu nesting thing first, involves writing to file system

The display info needs to be written/synced with file system as well

12:36 PM

It's funny my keyboard keeps feeling gross as I type so I will spray it with 91% alcohol to clean it, then wash my hand with Dove bar soap so it doesn't feel oily but grippy.

11:38 PM

So I thought at first that I would have the button bindings above menu tree but I think it makes sense for the button bindings to come after since the menu/icon has to exist before it can be bound to something.

This software when fully built will have the software that JDC34 camera is using... so that it means it will have a boot splash screen.

Other required menu scenes like battery reset (based on time not current shunt eg. DB)

12:45 PM

I need to do some drawing real quick to see how this would work

12:52 PM

<img src="./devlog-images/menu-tree.JPG"/>

You can see how this would work, you'd have sibling menus and one of them would be the "entry point" for the actual runtime of the menu.

There are other specific menu scenes like the boot splash screen or asking if the battery has been recharged to reset the counter.

This also does not factor in the 2nd OLED screen I think I'll use that to display statuses or do like a little creature emotion thing like the previous camera where it winks on boot

It will definitely be used though because it's so cool the blue display

The sibling position doesn't matter right now, what determines the menu linking is the entry point and the nesting of menus inside that set of menu scenes

12:57 AM

So in the past I manually rendered some menu scenes, this is the end goal of the state for these menu scenes

<img src="./devlog-images/json-render.JPG"/>

Also it's supposed to be 0.1.0 I found out, I know it's major.minor.fix but yeah or is it breaking...

Got a distraction

<img src="./devlog-images/gato.JPG"/>

Hehe he just woke up, sweepy boy

1:09 PM

Whoa this is cool

Sometimes you see something and it clicks in your mind

<img src="./devlog-images/logo-drag.JPG"/>

1:10 PM

Oh man... sucks... so static text is fine as you make that in the web, it's part of the scene, dynamic text is problematic

You have to match or in terms of scale/position get it close to what the real thing displays (font on display)

You could eyeball that until an elegant solution comes up

Ehh... I gotta move the shared state up to the parent.

1:33 PM

<img src="./devlog-images/taking-shape.JPG"/>

Hmm... not a huge fan of the design but focusing on functionality

Hmm... I guess there should be no limit on depth, it's up to the user to make sure the harrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr lol my keyboard fk'n up

To make sure the hardware maps to the menu and the states match

1:40 PM

My chair keeps sinking lmao the piston thing, cheap $20 Walmart chair

- [ ] add scene modal
- [ ] process to add sub-scene with modal

1:42 PM

I feel like this is a cliche pattern, like a website menu, or a linked-list maybe, the JSON has an inner JSON sort of deal and it's recursive

1:54 PM

Damn this song's good, don't drink don't smoke...

Time to lock in if I haven't already been

2:20 PM

Dang... I'm on the recursive bit now always a bit of a challenge, gotta thinky

2:29 PM

Lol I'm struggling oh no, I'm weak on algo stuff

I've written recursive things before but yeah always have to think about it

What's challenging is you're not only traversing a nested object but you have to build html which do you build that in JSX or a string...

If you can traverse the object then feeding the params into a function that outputs html should be straight forward

2:56 PM

I think I have it, the menu names or even letters have to be unique, if they're not unique can't group them correctly

Ehh... this way seems bad, I was thinking of using array of arrays

```
[
  ['a', 'b', 'c'],
  ['d', 'e', 'f']
]
```

That represnts

```
{
  "a": {
    "b": {
      "c": {}
    }
  }
}
```

The whole point right now is adding indents the deeper you go down a chain

3:05 PM

Once I figure this out I'm going to take a break, cook some food

3:17 PM

Still don't have it, taking a break

4:03 PM

Alright I'm back on

I literally had to write this same code a few months ago to make a nested menu system so I can do it, it's just not trivial

In recusrive functions there's usually two parts:

The outer function that does the calling and then the looping function that consumes itself until it runs out, the nested list

4:11 PM

Noooo I'm feeling spent already, must keep going

Times like these... good to get into jsfiddle do a focus sesh, isolated problem

4:23 PM

Come on Jacob this is leetcode lvl 1

<img src="./devlog-images/algo.JPG"/>

4:29 PM

I wonder if it's a sign I'm old if my brain gives out this easily lmao, 5 hrs of coding and I'm done? 

W E A K!

<img src="./devlog-images/traverse.JPG"/>

How do you traverse all these branches in order?

That's what I gotta figure out. Logging is easier than collecting...

4:39 PM

Okay here is this one which is easier since the object is already grouped

<img src="./devlog-images/traverse-objects.JPG"/>

That will output: "a, b, l" "c, d, e, f, m", etc... when ran

4:45 PM

Come on Jacob you can do it

<img src="./devlog-images/memes.png"/>

4:50 PM

Quick break

5:10 PM

Damn I'm spent, quitter!

6:02 PM

Actually I started at 10PM so yeah

My head literally hurts it's crazy

7:31 PM

One thing I'm wondering about is multi-touch on this display... can it be done...

At the very least I could tap an area, click the 5D joystick to zoom in or quickly double tap actually

7:41 PM

Ahh shit the icons should use a random string on the end so you can have multiple instances

---

### 01/30/2026

5:49 PM

Chilling today, did a little bit of development, will dive into this over the weekend and get a functioning menu on the camera

7:04 PM

Thought of a layout update

<img src="./devlog-images/layout.png"/>

11:34 AM

I decided I'm not going to do draggable-nested menus on the right sidebar, I'll just do click-add way. It'll still be visually indented/look like they're attached but there won't be drag-drop/snapping, that's extra nice to have.

Another thing to consider is dynamic text, the font is based on what will be used on the python/physical display side

It's a ttc font maybe I can use it in web.

Okay that does not seem doable from quick SO searches, so it'll just use the robot font and a note about it

11:39 AM

Damn I'll need a font-drag drop thing

11:48 AM

Funny I feel overwhelmed so much work to do, but it will be done

12:14 PM

This code is not the greatest, like the CSS class names in BEM are f'd but I'm just trying to get this done this weekend

End of the day what I care about is rendering nested menus and connecting it to the hardware binding code

12:22 PM

More progress

<img src="./devlog-images/dynamics.gif"/>

Oh yeah I need scaling next to make the icon smaller or larger

---

### 01/29/2026

7:52 PM

It's probably bad I'm already imagining a new camera

It's more for video though (shaped as a camcorder) and it's purple!

With a flip-out and rotating display... but the main thing it would have is a mecnahical IBIS

Which may make it too big... but yeah

Today I think I will get the icons to render in the drag-drop area.

- [ ] need folder/file watcher to make sure folder matches desktop app (like deleting in folder)
- [ ] add button bindings in the menu (by function name)

8:49 PM

Well, I'm distracted today, got a new lens in, made some content on that

Won't get anything big done today but I am committed, today I did not drink extra after the work happy hour

---

### 01/28/2026

6:36 PM

I am here, I am present

Hiaksimaru

Don't let your dreams be memes

I'm aiming to have a functional camera by end of this weekend, means this menu builder is at a "finished" point and I actually develop the 1:1 feature parity menu that the modular pi cam has and I will add that laplace variance focus peaking.

There will be the rough functional build of the menu then the nice features for example what I'm going to work on right now is the sprite part where you drag-drop the sprite into the box and it shows up there as an availabe sprite to use.

- [ ] drag-drop feature on sprites (non-positional)
  - [x] drag-drop image saves to filesystem
  - [ ] advanced feature show toggle to show icons vs. list
  - [ ] when the desktop app first starts up it has to scan existing files and send them to the client to render
- [ ] droppable menu with snap grid
  - [ ] manual input for x,y and scale
- [ ] save menu page with html2canvas

6:42 PM

I've built a drag-drop image to base64 thing before see [here](https://github.com/jdc-cunningham/freelancer-journal/blob/master/react-app/src/components/right-body/RightBody.js)

I just gotta remember how it works

7:19 PM

Referencing this for the React to Electron bridge

https://wykrhm.medium.com/creating-standalone-desktop-applications-with-react-electron-and-sqlite3-269dbb310aee

I remember doing this for something I've made before

7:44 PM

Damn that was good... works

Now I need to make sure the actual files sync with the react side but this is great.

One hard thing down

I do need that reply turns out

8:10 PM

This is a pretty cool demo, you see me drag the file from a folder into another folder lol

<img src="./devlog-images/here-there.gif"/>

But yeah this shows that I can genarate menus, assuming the html2canvas part works which it should, I did a lot of html to canvas/pdf stuff in 2021 damn... RIP that startup.

I'm feeling pretty drained already but I think I'll at least add that file name regex check tonight

It should use underscores in consideration of python although it would be a string so technically doesn't matter but looks neater.

8:36 PM

Yeah so next I'll have to render what comes back from Electron on the React side

These icons would have to be draggable/drop it onto the menu scene

The menu scene needs to have that snap interface at a specific grid size like 10px

Should also be able to manually set the pixel x,y coordinate and dimension (scaling)

8:54 PM

I have this lens I'm picking up tomorrow it's a Cannon TV Zoom J5x15 15-75mm f2.1 Cine Lens C Mount, sadly it has haze... I think normally it's like `$300` so this one was `$75`

But the haze kinda looks bad like damn oh well

If it actually focuses then that's already better than the other lens I bought this Computar 8-48mm which I could not get to focus, maybe it'd work on the Arducam IMX477 sensor which I believe has a lower flange than the RPi HQ cam.

---

### 01/27/2026

7:17 PM

Alright let me try and prototype this Electron app real quick, I need to make sure I can write to the file system. The plan is to output directly into the menu folder.

7:51 PM

My bad I got sidetracked but found a cool song Take Five by Filo the slow version with his kid

8:12 PM

So far it's looking good, I was able to save to the app directory and I just need to do screenshot to file which seems possible with html2canvas

8:24 PM

There are some things I'm instill unsure on, I mean I'm going to port all of the existing functionality from [modular-pi-cam's software](https://github.com/jdc-cunningham/modular-pi-cam/tree/master/cameras/pi-zero/large-display/software) but the menu icon binding to service/hardware calls kind of thing.

8:31 PM

I also don't know how to handle the hand off between OpenCV and raw image rendering for the SPI displays. I would think for the SPI case you're not going to use OpenCV in there at all... but maybe.

I came up with a new logo too, it shows the outline of a Pelican with the dot on the i being a lense... what's bad is it vaguely resembles the Golden Eagle and yeah... don't want to do that.

<img src="./devlog-images/alt-menu.JPG"/>

There's too much going on anyway so may just stick to the simple Pelicam with the dot of the i being a lens... this is dumb stuff need the working code first.

8:43 PM

So the sprites get drag-dropped into the app and they get written to the host. I could turn them into base64/hold em in memory but I think it makes sense to actually store them.

Then you can drag the sprite and drop it onto the page.

8:49 PM

I think today I can get the basic skeleton done of the desktop app.

Once I prove out the key parts, the rest is easy coding for me as I'm primarily web dev although lately I've been working in the cloud eg. writing Cloudformation templates but I have a heavy background in Python as well, as all of our AI-related source code is written in python.

It's mostly the planning that I gotta think about, like the nesting (referencing the menu design below, the + stair-step deal).

If it conceptually makes sense to a non-developer.

10:17 PM

Let me do this real quick screenshot for the gram

This is not much but shows clear progress

<img src="./devlog-images/start-of-menu-builder.JPG"/>

I'll add the top-bottom part of the right panel, with the snippets portion having drag-drop on it to add sprites.

Have to make the left side have fixed/dynamic sizing where you enter the display dimensions and then it's snappable with react-dnd

I'd probably put the title of the menu scene above the menu display as you click through the items on the right.

10:30 PM

I really want to get good, sharp pictures in the future

This high resolution display and extra compute (during passthrough) will come in handy

At the very least a crude implementation of focus peaking using the laplace variance and display a number that increases/decreases depending on how blurry or focused the scene is

I use my own photos for my ultrawide desktop display wallpaper, I hide all the icons so it's just a huge image and I do use the photos taken by the RPi HQ Cam, I used to Sony Alpha A7II and A7R3 and I have you know "perfect" pictures from those because of the full frame sensor, 42MP and big lenses...

If you see below, this is an RPi HQ cam image I took and I could have gotten this to be shaper if I had a higher resolution display or the focus checking algorithm running

<img src="./devlog-images/soft-example.JPG"/>

---

### 01/26/2026

5:07 PM

Yeah... I did waste my weekend but I'll get better with productivity

This is what I'm thinking, if I can prove out that Electron can write to file system then I will write this desktop app with ReactJS.

<img src="./devlog-images/menu-builder.JPG"/>

You would specifiy your menu size, it shows a window. Then you can start adding depth/sprites and positioning them. The end result is it generates JSON files that define each menu and the linked pages/functions.

The functions part I'd have to look into.

---

### 01/24/2026

3:32 PM

I am unfortunately recovering from a hangover but I'll get something done today

I'm gonna 3D print those small correction pieces for the camera like the OLED gap and the broken screw holder that joins the two body shell parts together

10:02 PM

Redemption, I am present

Let's do some work

I'm really tempted to write that menu builder... the issue is you're dealing with writing to file system which the web can't do

So I'd have to make a desktop app that can access the file system/write to it

I'm not actually gonna be able to do anything hard right now, I'm already lit (but moderately lit)

This camera body is really growing on me though, it's cool, it's green

10:55 AM

I am going to design another menu where it's cyberpunk looking just to show you that you can literally make any menu style you want, it's a screen and better than SPI in terms of refresh rate

---

### 01/23/2026

Alright so I had to use `sudo raspi-config` to connect to my wifi for some reason even though I had set it when writing the raspbian image to the SD card

Anyway got past that and it was straight forward to have systemd run the `xinit ./openbox` command so now that's running on boot, although it will be disabled until it's done

I literally had to plug in a keyboard to the camera to connect the wifi as mentioned above

<img src="./devlog-images/fxi-wifi.JPG"/>

6:51 PM

There's gonna be a big snow storm this weekend, I'm going nowhere!

I'm gonnna bust this menu out.

---

### 01/22/2026

12:16 AM

well... unfortunately that's it for today

I need to zip tie the charger down as the heat made the charger unglue itself and now I can't plug the micro usb in lmao... ugh

10:42 PM

Well I was gonna try and bust out the quick short where it boots into pelicam but for some reason.... MF fuck... it won't show an IP address so I can't ssh into it

So I'm gonna have to take it apart and plug a keyboard into it I guess

Why tf... I keep running into dumb ass problems

But today was a good day, hung out with some people played indoor golf

I did address the charging problem, I unfortunately just hot glued the f out of it, which it's funny, you have to wait for it to cool off for the hot glue to hold, because the charger gets hot enough to re-melt the hot glue

---

### 01/21/2026

7:08 PM

Alright so at this point I've got a fully assembled camera, pretty rad, but it needs a menu

<img src="./devlog-images/jdc34-camera.JPG"/>

I need to go and make some updates to the STL files real quick as they were broken.

Well what I want to get done real quick is have an auto-boot script that loads the GUI and it shows pelicam on the screen

7:14 PM

I also want to time how long it takes to boot

7:30 PM

I had to do a bunch of cleaning, kind of spacing out

- systemd boot script
- load image in opencv

7:54 PM

Getting mixed up, so oddly I have this problem of "Failed to open display from the DISPLAY environment variable"

I also was setting systemd wrong, forgetting it has to run openbox

8:07 PM

Help me step code I'm stuck

For some reason I can't open the display

8:24 PM

It looks like my boot is corrupted actually, it hangs on this "raspberry pi completed socket interaction for boot stage final" message

Lead me to this

https://forums.raspberrypi.com/viewtopic.php?t=134454

adding the empty `cloud-init.disabled` file to `/etc/cloud` and reboot

This seems to have worked, I now see a `raspberry login: _`

8:26 PM

Still unable to open display damn

I might just nuke it and start over so I can fully document the steps

8:33 PM

This is weird... I guess I have to run `startx` and then it opens a window... but then you can only use this window... odd

I don't remember doing this before... I would wipe this pi but I have to take the camera apart lmao

8:42 PM

ugh... damnnnnnnn this is brutal

I'm gonna wipe the pi, I have to take it apart lmao

8:51 PM

Ugh... so sad, I have to start over from scratch, reeeeeeeeeeeeeee

<img src="./devlog-images/reflash-raspbian-os-lite-64bit.JPG"/>

9:05 PM

I have to cook and eat food but it's reflashed...

First thing you have to do is do the DT overlay stuff to get the screen to work

Oh man.... I forgot about all those steps I did reeee

I'm gonna log this stuff in a dedicated file

10:02 PM

There is one thing I did not do which is to get a current draw for the system.

The Pi 4B is a hungry boy as it idles at 500mA apparently and that's without the camera running and not factoring in the display.

So it's possible it uses like 1A peak which means this 3400 mAh battery or whatever will only last say 2-3 hrs vs. 6-7 on the pi zero 2w

I thought of it because it just died and I wasn't sure if it was on or not (pi is inside lol and no display out yet)

10:29 PM

Nooooo the pi doesn't have enough power keeps rebooting mid command lol

10:43 PM

Alright I'm gonna have to let it charge for a while, it's not able to keep up while plugged into the 1A charger

11:09 PM

Booted it back up, got past last install command I was running

11:15 PM

wtf is this... complaining about evdev

11:21 PM

Damn... failed to open display message again lol

Ohhhh damn... I had to refer back to the openbox post

You use `xinit` to launch the script

https://forums.raspberrypi.com/viewtopic.php?t=152264

11:37 PM

This is so weird, I don't know why I can't reproduce this menu opening thing, it was the first thing I did

omg it's a bash script so have to use the `./openbox`

oof

It's actually a good thing I had to do this over from scratch, there are so many steps I figured out but didn't write down

11:48 PM

Yeah another one, have to put python in the top of the file

11:52 PM

Finally...

This display is so crisp holy shit...

<img src="./devlog-images/nice-display.JPG"/>

Now I gotta tie it to a startup mechanism

11:59 PM

Damn it just died... this display must use a lot of power damn

---

### 01/16/2026

5:44 PM

One thing I was thinking about is shooting in RAW. I really want to maximize the image I can get out of this thing. I'm a noob photographer so I primarily shoot in auto.

But I've seen RAW images other people have taken and corrected with this sensor and they're pretty good, granted they are large objects, not things like leaves which look bad so far on this sensor.

---

### 01/12/2026

7:38 PM

Gonna work on some menus, I feel spent

I got to take out the Vivitar 75-200mm which is super telephoto with this 5.5 crop, that was pretty fun though the vibration/no stabilization meant a lot of bad pictures and video

8:40 PM

One thing I have to figure out right away is loading this menu in OpenCV and then traversing through the menu state, that's a core functionality, the rest is just work

---

### 01/11/2026

3:33 PM

Alright... I think I have a hangover, feel like crap

I did workout, just ate a big meal (have to cook the potatoes before they go bad)

I am kind of losing momentum on this project but I will complete it

Just the waiting between the 9-5 job and the weekend

Going out and doing photography was fun, I went near the city and put a couple videos up on the Vanta Wing YouTube channel

Let's see... I have at least 16 scenes to make to replicate the current menu

3:56 PM

Starting now, the other thing I was thinking about, the camera pass through will have overlaid text on it, the video has it already for recording and elapsed time

Camera stream will be faked on desktop with a static image, it could do a loop if you really wanted to, set an array somewhere and count... that would make it more convincing

4:09 PM

I'm really tempted to make that menu maker, it would be web based and spits out the JSON

I think one of the hard things is the snapping/you'd need a grid thing but really it's not bad

It's just one of those things, the time to make it, takes as long to manually write these out... but I think it will be a necessity at some point because writing JSON files manually to describe each menu page is pretty brutal

4:24 PM

Yeah that menu designer thing will have to be made as it would account for things like outer padding (20px right now) and space between things

4:29 PM

Damn... 1 down

4:31 PM

This is what my screen looks like as I make these menu scenes

<img src="./devlog-images/screen.JPG"/>

It'll be great to see this rendered on the actual DSI display

4:43 PM

What will be interesting too is how to handle extra displays like the camera I'm currently designing has the main 2.8" DSI display and a 0.91" thin rectangle OLED

5:15 PM

It's crazy what you can make... I was thinking the top display could be a little animated thing... like the camera is alive

Idk I like the Skippy gun from the game Cyberpunk 2077.

Yeah thinking about a cyberpunk style menu would be neat too...

I'm already thinking of another to design/make, it's ESP32 based which I know not high megapixel count but the thing is it's designed to be like a card and the lens is on the top-right (facing you).

Today is unfortunately wasted, I feel tired/not into anything.

I'll keep plugging away at this though with the menu screens as I still have to port over the camera software itself

---

### 01/07/2026

6:26 PM
Alright just came back from the gym did my half hour of inclined walking
This little fatty trying to lose that gut, I've bulked up from the lifting but still a chubby

Going to setup a "playground" where you can run the OpenCV with specific bound buttons and it'll also traverse a menu/render it for testing

7:26 PM
Damn... struggle bus

But I've got an OpenCV GUI with keys listening and clicks
Now I can do a prototype of the menu tree rendering and traverse it (active box)

7:38 PM

I'm working on defining the config files to render a menu scene right now

Ugh... now I'm thinking you'd want a menu generator thing... arrange icons and what not on a scene, then spit out the JSON from it, future...

Right now I'm just trying to reproduce the existing menu to get a handle on how to do this

<img src="./devlog-images/menu-definition.JPG"/>

I'm using MS Paint to get a rough position, the menu was designed to be a square so it'll get moved around

The thing is I'll start adding things like shutter speed, exposure, AWB, etc... on the menu as well

I'll first render one page and then work on adding more/doing the walking then state management

7:52 PM

I'll source icons from UX Wing 64px looks like a good size for sprites

7:55 PM

The way I think the walker will work, when you first boot the camera, it pre-renders all of the menu pages as is. Then depending on the camera state, certain values are filled in on the fly like an updating battery hours left indicator for example.

First menu I'm working on is black text/icons on white

Unfortunately automatic dynamic menu scaling is not considered right now, where you specify the base menu system and scale it up or down, it's easy to do if it's a square but if you go to rectangle or circle then the coordinates don't match

It could be CSS-based lol

8:03 PM

The sprites folder will be flat I decided since some may be re-used

<img src="./devlog-images/nesting.JPG"/>

This is where it starts to get challenging.

So settings for example, it says `click_type` is navigation, and it specifies where it goes with `open_page`

I feel like they have to be chained right... like dot notation

So the folders in the menu folder are like keys to an object.

So accessing "settings" is just "settings" but if settings had a subpage then it would be `settings.sub_page`

8:10 PM
Oh... it can also just literally have "page_name"

8:29 PM

I feel like this makes sense?...

You preload the images, they're stored in memory and when you need to update them you just overwrite them while the camera is running.

Oh... the one problem is you would have to re-render the entire page because of left over text being stacked imagine going from long to short text... or you paste the area over the original image but probably easier to just re-render the entire page.

I need to see the passthrough but I'm still waiting for the HQ cam I ordered

I think this was decent progress, let me do the looper that renders the menu not the walker, the walker I need to look at more, referencing this:

https://stackoverflow.com/a/20199213

8:40 PM

<img src="./devlog-images/render-page.JPG"/>

Alright that's not quite right but working

8:53 PM

<img src="./devlog-images/resizing.gif"/>

Hey this is pretty cool, I'm reducing the sizes of the icons and regenerating the menu image

---

### 01/06/2026

7:30 PM
Damn I'm so tired, eyes hurt... funny too I left my clothes at the gym, I was like wtf did I forget

---

### 01/04/2026

9:08 PM

I'm mentally drained at this point but I did put out a video

I still gotta actually write the menu walker

I've had some thoughts come up already like how do I handle dynamic text with regard to menu state

It's one thing to produce the images but if you have dynamic text it's kind of pointless to make the image ahead of time

It might make more sense to just store it in memory and render it on the fly (taking into account "caching" where you don't repaint the screen unless something changed)

9:37 PM

one thing I was thinking about with the touch screen is a slider, that would be interesting to render, the PIL display process wouldn't work great, could be a standalone view but yeah... can just use arrow keys

For saving tuning/lens profiles I was thinking I'd need a split keyboard where you'd take a standard qwerty, cut it in half and just toggle to each side that you need the letter on

---

### 01/03/2026

12:04 AM

Yesterday I interfaced with the 2.8" DSI waveshare display which was new to me since it was not just showing an image straight up like with SPI displays

So after I figured out how to use a windowing system eg. x11 through openbox, that changed my idea of how this menu will work

This menu will just be a state machine pretty much where you specify a state and it outputs a menu

The top of the layer is the dimension/click coordinate and that feeds the state machine

---

### 01/02/2026

12:13 AM

You can see in this menu-map for the Pi Zero HQ Cam the number of screens

<img src="./devlog-images/pi-zero-hq-cam-menu-map.JPG"/>

Will reproduce that but through the nested folder/files instead of this [POS](https://github.com/jdc-cunningham/pi-zero-hq-cam/blob/master/camera/software/menu/menu.py) that I made

Will be interesting on first boot to check for changes, you'd have to remove the flattened menu image to generate a new one based on specified icon image files and location

That popup question about battery being charged though... which is based on an "on-ticker" eg. counting up as it's booted.

I'm not sure how to define that yet in the menu. Maybe same depth but you don't say "root/index" or something.

or a separate folder

---

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

---

### 12/23/2025

I've been thinking about this more

I had this thought of a nested folder/file system to declare menus

There would be a config file, a folder for images, then you'd have another folder to go deeper

The icons would have a coordinate map, it would be proportional so it could hopefully adapt to different screen sizes

Functions to call when the icon is clicked

---

### 12/16/2025

9:01 PM

I have some of my cameras on my desk at my job and I was looking at them.

Made me think of JSON you know, how nice it is to just nest things and have a structure.

I think that's how I want the menus to be defined, nested pages for the state management.

I'm going to work on this again probably near spring just so I can get out and explore, be with nature

I also want to source a better screen, like a touch screen-primaly camera with a 5D button and shutter, possibly dedicated back button
