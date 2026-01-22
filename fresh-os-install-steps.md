### Steps to be able to run this software

Written for Raspberry Pi 4B, later will cover Pi Zero 2W

This is on Debian Trixie

- if relevant, do DT overlay for non-raspberry pi display eg. waveshare

- $sudo apt install python3-dev
- $sudo apt update
- $sudo apt upgrade

development

- add github ssh key
- set global git config
- $sudo apt install git

verify python installed by default (yes python 3)

screen

- $sudo nano /boot/firmware/config.txt
- write the `dtoverlay` per display

peripherals

- enable i2c

reboot

GUI display

- $sudo apt install openbox obconf
- $sudo apt install xinit
- $sudo apt install x11-xserver-utils
- $sudo apt install xterm
- $sudo apt install menu
- $sudo apt install xorg
- $sudo apt install unclutter
- $sudo apt install xinput

Test GUI

- make openbox file, put in:

```
#!/bin/sh

# rotate screen
xrandr -o left

# rotate touch
xinput set-prop 6 "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1

# set python venv
. /home/pi/pelicam/bin/activate

# hide mouse cursor
unclutter -idle 0 -jitter 2 -root &

# start GUI
openbox --config-file ~/.config/openbox/rc.xml --startup /home/pi/menu-stream.py
```

need to have openbox set

run

- $sudo xinit ./openbox

