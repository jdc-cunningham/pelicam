### Steps to be able to run this software

Written for Raspberry Pi 4B, later will cover Pi Zero 2W

This is on Debian Trixie

- if relevant, do DT overlay for non-raspberry pi display eg. waveshare

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

