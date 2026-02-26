#!/usr/bin/env -S python

import cv2
import io
import logging
import numpy as np
import time
import os
import sys
from buttons.buttons import Buttons
from camera.camera import Camera
from PIL import Image
from oled.OLED_Module_Code.RaspberryPi.python.example.OLED_0in91_test import small_OLED
from imu.imu import IMU

edit_shutter_speed_mode = False
edit_iso_mode = False
edit_awb_mode = False

scared_face_path = '/home/pi/pelicam/src/camera/scared-face.JPG'
show_scared_face = False

# create anime girl page for IMU
scared_face_img = cv2.imread(scared_face_path)

def toggle_scared_face(value):
  global show_scared_face
  show_scared_face = value

imu = IMU(toggle_scared_face)
imu.start()

oled = small_OLED()
oled.draw_text("JDC34 camera")
time.sleep(2)
oled.draw_text("Pelicam")

logging.basicConfig(
  filename='/home/pi/pelicam/src/camera/pelicam.log',
  level=logging.INFO
)

camera = Camera()
camera.start_streaming()
img_path = "/home/pi/pelicam/src/camera/logo.png"
boot_scene = cv2.imread(img_path)
show_previous_photo = False
previous_photo = None
list_coordinates = []

def get_previous_photo(photo_path):
  if not photo_path:
    return

  img = cv2.imread(photo_path)
  return cv2.resize(img, (640, 480))

def get_filename_from_click(x, y):
  for coord in list_coordinates:
    coords = coord["coords"]

    if x > 0 and x < 640:
      if y > coords[1]- 60 and y < coords[1]:
        return coord["file"]
      
def reset_editable_values(editing_value):
  global edit_iso_mode, edit_shutter_speed_mode, edit_awb_mode

  if editing_value != "iso":
    edit_iso_mode = False

  if editing_value != "shutter speed":
    edit_shutter_speed_mode = False

  if editing_value != "awb":
    edit_awb_mode = False

# capture mouse-click coordinate
def on_mouse(event, x, y, flags, param):
  global previous_photo, show_previous_photo, files_img, edit_iso_mode, edit_shutter_speed_mode, edit_awb_mode, camera_active

  if event == cv2.EVENT_LBUTTONDOWN:
    # overlays
    if camera_active:
      if x > 30 and x < 160 and y > 430:
        reset_editable_values("shutter speed")
        edit_shutter_speed_mode = not edit_shutter_speed_mode
        return
      
      if x > 490 and y > 430:
        reset_editable_values("iso")
        edit_iso_mode = not edit_iso_mode
        return
      
      if x > 490 and y < 100:
        reset_editable_values("awb")
        edit_awb_mode = not edit_awb_mode
        return

      camera.zoom_in()

    if not camera_active and has_pictures and not show_previous_photo:
      if x < 400:
        filepath = get_filename_from_click(x, y)

        if filepath:
          show_previous_photo = True
          previous_photo = get_previous_photo(filepath)
          return

      if x > 340 and y < 100:
        camera.shutter_delay_on = not camera.shutter_delay_on
        files_img = get_pictures_img()
        return

      if x > 340 and y > 120 and y < 170:
        print(">>> video mode clicked")
        camera.video_mode = True
        files_img = get_pictures_img()
        camera_active = True
        return


# setup GUI
# black bg
img = np.zeros((480, 640, 3), dtype=np.uint8)
window_name = "Pelicam"
window_width = 640
window_height = 480
cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
cv2.setMouseCallback(window_name, on_mouse)
cv2.imshow(window_name, boot_scene)

taking_picture_img = np.ones((480, 640, 3), dtype=np.uint8) * 255
font = cv2.FONT_HERSHEY_SIMPLEX
cv2.putText(taking_picture_img, 'Taking picture...', (220, 280), font, 1, (0, 0, 0), 2, cv2.LINE_AA)

def crop_img(img):
  if camera.zoom_level > 1:
    crop = [640, 480]
    tlx_offset = camera.pan_offset_x * crop[0]
    tly_offset = camera.pan_offset_y * crop[1]
    brx_offset = tlx_offset + crop[0]
    bry_offset = tly_offset + crop[1]
    return img[tly_offset:bry_offset, tlx_offset:brx_offset,]

  return img

def get_ss_max_width(exposure_time):
  if exposure_time < 2000:
    return 220
  
  if exposure_time >= 16666 and exposure_time <= 66666:
    return 180
  
  if exposure_time >= 125000 and exposure_time <= 500000:
    return 160
  
  if exposure_time >= 1000000 and exposure_time <= 8000000:
    return 120
  
  if exposure_time >= 15000000 and exposure_time <= 30000000:
    return 140

  return 200

def passthrough_osd(img):
  # aperture
  cv2.putText(img, f'F {camera.digital_aperture or "--"}', (30, 55), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

  if edit_awb_mode:
    start_point = (460, 20)
    max_width = 625 if camera.wb_mode == "Auto" else 605
    end_point = (max_width, 70)
    cv2.rectangle(img, start_point, end_point, (250, 250, 250), 2)

  # white balance
  cv2.putText(img, f'{"AWB Auto" if camera.wb_mode == "Auto" else f'WB {camera.wb_mode}'}', (470, 55), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

  # shutter speed
  cv2.putText(img, f'SS {camera.get_shutter_speed_display(camera.exposure_time)}', (30, 450), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

  if edit_shutter_speed_mode:
    start_point = (20, 420)
    end_point = (get_ss_max_width(camera.exposure_time), 460)
    cv2.rectangle(img, start_point, end_point, (250, 250, 250), 2)

  # iso
  cv2.putText(img, f'ISO {camera.get_iso_display(camera.analogue_gain)}', (470, 450), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

  if edit_iso_mode:
    start_point = (460, 420)
    max_width = 625 if camera.analogue_gain > 6 else 605
    end_point = (max_width, 460)
    cv2.rectangle(img, start_point, end_point, (250, 250, 250), 2)

  return img

# https://stackoverflow.com/a/49517948/2710227
def buf_to_pil_img(buf):
  nparr = np.frombuffer(buf, np.uint8)
  img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  img = np.array(img)
  return passthrough_osd(img)

camera_active = False
taking_picture = False
has_pictures = False
files_img = None

def get_pictures_img():
  global list_coordinates

  list_coordinates = []
  file_names_img = np.ones((480, 640, 3), dtype=np.uint8) * 255
  font = cv2.FONT_HERSHEY_SIMPLEX
  cv2.putText(file_names_img, 'Photos', (40, 40), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
  shutter_delay_on = 'on' if camera.shutter_delay_on else 'off'
  cv2.putText(file_names_img, 'Shutter delay: ' + shutter_delay_on, (340, 40), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
  video_mode = 'on' if camera.video_mode else 'off'
  cv2.putText(file_names_img, 'Video mode: ' + video_mode, (340, 120), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
  base_dir = '/home/pi/pelicam/src/camera/captured_media/'
  pics = os.listdir(base_dir)
  sort = []

  for pic in pics:
    sort.append(pic.replace('.jpg', ''))

  sort.sort()
  sort.reverse()
  x_offset = 40
  y_offset = 100
  counter = 1

  for pic in sort:
    if pic == ".gitkeep" or '.h264' in pic:
      continue

    cv2.putText(file_names_img, pic + '.jpg', (x_offset, y_offset), font, 1, (0, 0, 0), 2, cv2.LINE_AA)

    list_coordinates.append({
      "coords": [x_offset, y_offset],
      "file": base_dir + pic + '.jpg'  
    })
  
    y_offset += 60
    counter += 1

    if counter > 7:
      break

  return file_names_img

def button_pressed(button):
  global camera_active, taking_picture, has_pictures, files_img, show_previous_photo, edit_shutter_speed_mode, edit_iso_mode, edit_awb_mode

  if button == "SHUTTER":
    if not camera_active:
      camera_active = True
      time.sleep(0.1) # add delay to prevent early photo
    else:
      if camera.video_mode:
        if camera.recording_video:
          camera.stop_video_recording()
        else:
          camera.start_video_recording()
      else:
        taking_picture = True
        camera.take_picture()
        taking_picture = False
        has_pictures = True
        files_img = get_pictures_img()

  if button == "BACK":
    if edit_shutter_speed_mode:
      edit_shutter_speed_mode = False

    if edit_iso_mode:
      edit_iso_mode = False

    if edit_awb_mode:
      edit_awb_mode = False

    if camera.zoom_level > 1:
      camera.zoom_out()
      time.sleep(0.1)
      return

    show_previous_photo = False
    camera_active = False

  if edit_iso_mode:
    camera.update_iso(button)
    time.sleep(0.1)
    return
  
  if edit_shutter_speed_mode:
    camera.update_shutter_speed(button)
    time.sleep(0.1)
    return
  
  if edit_awb_mode:
    camera.update_white_balance(button)
    time.sleep(0.1)
    return

  if camera.zoom_level > 1:
    camera.update_pan(button)
    time.sleep(0.1) # add delay to prevent fast panning

buttons = Buttons(button_pressed)
buttons.start()

# render menu
while True:
  try:
    if show_scared_face:
      cv2.imshow(window_name, scared_face_img)
    elif show_previous_photo:
      cv2.imshow(window_name, previous_photo)
    elif camera_active:
      if taking_picture:
        cv2.imshow(window_name, taking_picture_img)
      else:
        if camera.output.frame is not None:
          if camera.video_mode:
            if camera.video_frame is not None:
              cv2.imshow(window_name, camera.video_frame)
          else:
            cv2.imshow(window_name, buf_to_pil_img(camera.output.frame))
    elif has_pictures:
     cv2.imshow(window_name, files_img)
    else:
      cv2.imshow(window_name, boot_scene)

    cv2.waitKey(17)
  except KeyboardInterrupt:
    break

cv2.destroyAllWindows()
