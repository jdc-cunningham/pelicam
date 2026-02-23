#!/usr/bin/env -S python

import cv2
import numpy as np
import time
from pynput.keyboard import Key, Listener

img_path = "/home/pi/pelicam/src/playground/logo.png"
boot_scene = cv2.imread(img_path)

# setup keypress listener
def on_press(key):
  # print('{0} pressed'.format(key))

  if key == Key.up: # verify same for linux
    print("up")

  if key == Key.down:
    print("down")

  if key == Key.left:
    print("left")

  if key == Key.right:
    print("right")

  if key == Key.backspace:
    print("backspace")

  if key == Key.space:
    print("spacebar")

def on_release(key):
  # print('{0} release'.format(key))

  if key == Key.esc:
    return False

keyboard_listener = Listener(
  on_press=on_press,
  on_release=on_release
)

keyboard_listener.start()

# capture mouse-click coordinate
def on_mouse(event, x, y, flags, param):
  if event == cv2.EVENT_LBUTTONDOWN:
    print(f'click {x}, {y}')

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

# render menu
while True:
  try:
    cv2.imshow(window_name, boot_scene)
    cv2.waitKey(17)
  except KeyboardInterrupt:
    break

cv2.destroyAllWindows()
