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


follow up

`$sudo apt-get install build-essential libcap-dev`

for picamera2

you have to do this the system-site-packages for libcamera

`$python -m venv --system-site-packages .pelicam`

for venv, to pull in picamera2 deps

install opencv

```
ERROR: pip's dependency resolver does not currently take into account all the packages that are installed. This behaviour is the source of the following dependency conflicts.
types-seaborn 0.13.2 requires matplotlib>=3.8; python_version >= "3.9", which is not installed.
types-seaborn 0.13.2 requires pandas-stubs, which is not installed.
```

sudo apt install -y python3-picamera2

chmod +x on main.py

sudo apt install python3-smbus

OLED code had to change RST pin from 27 to 7
