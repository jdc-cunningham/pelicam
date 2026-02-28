# http://github.com/raspberrypi/picamera2/blob/main/examples/mjpeg_server.py

import cv2
import io
import time
import sys
from libcamera import controls
from picamera2 import Picamera2
from picamera2.encoders import MJPEGEncoder, H264Encoder
from picamera2.outputs import FileOutput, CircularOutput
from threading import Condition

base_path = "/home/pi/pelicam/src/camera/captured_media/"

class StreamingOutput(io.BufferedIOBase):
  def __init__(self):
    self.frame = None
    self.condition = Condition()

  def write(self, buf):
    with self.condition: 
      self.frame = buf
      self.condition.notify_all()

class Camera:
  def __init__(self):
    self.picam2 = Picamera2()
    self.output = None
    self.zoom_level = 1
    self.pan_offset_x = 0
    self.pan_offset_y = 0
    self.shutter_delay_on = False
    self.analogue_gain = 6
    self.exposure_time = 16666 # micro seconds
    self.aperture = 0
    self.digital_aperture = False
    self.wb_mode = "Auto"
    self.video_mode = False
    self.recording_video = False
    self.encoder = None
    self.video_frame = None
    self.video_start_time = 0

    self.shutter_speed_map = {
      125: "1/8000",
      250: "1/4000",
      500: "1/2000",
      1000: "1/1000",
      2000: "1/500",
      4000: "1/250",
      8000: "1/125",
      16666: "1/60",
      33333: "1/30",
      66666: "1/15",
      125000: "1/8",
      250000: "1/4",
      500000: "1/2",
      1000000: "1",
      2000000: "2",
      4000000: "4",
      8000000: "8",
      15000000: "15",
      30000000: "30"
    }

    self.iso_map = {
      1: 100,
      2: 200,
      4: 400,
      6: 800,
      12: 1600,
      16: 3000
    }

    self.wb_modes = {
      "Auto": controls.AwbModeEnum.Auto,
      "Dayl": controls.AwbModeEnum.Daylight,
      "Clou": controls.AwbModeEnum.Cloudy,
      "Indo": controls.AwbModeEnum.Indoor,
      "Fluo": controls.AwbModeEnum.Fluorescent,
      "Tung": controls.AwbModeEnum.Tungsten
      # Custom
    }

    self.photo_config = self.picam2.create_still_configuration(
      main={"size": self.picam2.sensor_resolution, "format":"RGB888"}
    )

    # full res 4056x3040
    self.video_config_1x = self.picam2.create_video_configuration(
      main={
        "size": (640, 480)
      },
      sensor={
        "output_size": (2028, 1520)  
      }
    )

    self.video_recording_config = self.picam2.create_video_configuration(
      main={
        "size": (1920, 1080),
        "format":"RGB888"
      },
      lores={
        "size": (640, 480),
        "format": "YUV420"
      },
      controls={
        "FrameRate": 30 
      },
      sensor={
        "output_size": (2028, 1520)
      }
    )

    self.setup_iso()
    self.setup_init_settings()

  def update_white_balance(self, button):
    key_map = list(self.wb_modes)
    wb_pos = key_map.index(self.wb_mode)

    if button == "UP":
      if wb_pos < len(key_map) - 1:
        wb_pos += 1

    if button == "DOWN":
      if wb_pos > 0:
        wb_pos -= 1

    self.wb_mode = key_map[wb_pos]

    # have to leave AwbEnable on if using specific settings or auto
    # not using custom colour gains yet
    self.picam2.set_controls({
      "AwbMode": self.wb_modes[key_map[wb_pos]]
    })

  # this is not real
  def get_iso_display(self, analogue_gain):
    return self.iso_map[analogue_gain]
  
  def update_iso(self, button):
    key_map = list(self.iso_map)
    gain_pos = key_map.index(self.analogue_gain)

    if button == "UP":
      if gain_pos < len(key_map) - 1:
        gain_pos += 1

    if button == "DOWN":
      if gain_pos > 0:
        gain_pos -= 1

    self.analogue_gain = key_map[gain_pos]

    self.picam2.set_controls({
      "AnalogueGain": self.analogue_gain  
    })

  # this is JavaScript code but how to get these values
  # eval is dangerous if you're not controlling the input
  # const getMicroseconds = (fractionalSecond) => {
  #   const float = eval(fractionalSecond);
  #   console.log(float * 1000000);
  # };
  # getMicroseconds("1/8000");
  def get_shutter_speed_display(self, exposure_time):
    return self.shutter_speed_map[exposure_time]
  
  def update_shutter_speed(self, button):
    key_map = list(self.shutter_speed_map)
    iso_pos = key_map.index(self.exposure_time)

    if button == "UP":
      if iso_pos < len(key_map) - 1:
        iso_pos += 1

    if button == "DOWN":
      if iso_pos > 0:
        iso_pos -= 1

    self.exposure_time = key_map[iso_pos]

    self.picam2.set_controls({
      "ExposureTime": self.exposure_time
    })

  def get_aperture_display(self):
    if self.aperture == 0:
      return "Manual"

    return self.aperture # electronic

  def setup_init_settings(self):
    self.picam2.set_controls({
      "ExposureTime": self.exposure_time,
      "AnalogueGain": self.analogue_gain,
      "AeEnable": False,
      "AwbMode": controls.AwbModeEnum.Auto,
    })

  # ISO isn't really a thing picamera2 it's referred to as gain
  def setup_iso(self):
    min_ag, max_ag, _ = self.picam2.camera_controls['AnalogueGain']
    self.analogue_gain = int(min_ag)

  def update_pan(self, direction):
    width = 0
    height = 0
    max_pan = 4 if self.zoom_level == 5 else 2

    if self.zoom_level == 3:
      width = 1352
      height = 1014

    if self.zoom_level == 5:
      width = 811
      height = 608

    if direction == "LEFT":
      if self.pan_offset_x > 0:
        self.pan_offset_x -= 1

    if direction == "RIGHT":
      if self.pan_offset_x < max_pan:
        self.pan_offset_x += 1

    if direction == "UP":
      if self.pan_offset_y > 0:
        self.pan_offset_y -= 1

    if direction == "DOWN":
      if self.pan_offset_y < max_pan:
        self.pan_offset_y += 1

    self.picam2.controls.ScalerCrop = (self.pan_offset_x * width, self.pan_offset_y * height, width, height)

  def zoom_in(self):
    if self.zoom_level == 1:
      self.zoom_level = 3
      self.pan_offset_x = 1
      self.pan_offset_y = 1
      self.picam2.controls.ScalerCrop = (1352, 1013, 1352, 1014)
    else:
      self.zoom_level = 5
      self.pan_offset_x = 2
      self.pan_offset_y = 2
      # need to set offset based on current position vs. going to center
      self.picam2.controls.ScalerCrop = (1353, 1013, 811, 608)

  def zoom_out(self):
    if self.zoom_level == 5:
      self.zoom_level = 3
      self.pan_offset_x = 1
      self.pan_offset_y = 1
      self.picam2.controls.ScalerCrop = (1352, 1013, 1352, 1014)
    else:
      self.zoom_level = 1
      self.pan_offset_x = 0
      self.pan_offset_y = 0
      self.picam2.controls.ScalerCrop = (0, 0, 4056, 3040)

  # https://forums.raspberrypi.com/viewtopic.php?t=366084#p2197540
  # https://github.com/raspberrypi/picamera2/blob/main/examples/yuv_to_rgb.py
  def sample_video(self, np_arr):
    rgb_img = cv2.cvtColor(np_arr, cv2.COLOR_YUV420p2RGB)
    return rgb_img

  def start_video_recording(self):
    self.video_start_time = time.time()
    video_file_path = base_path + str(time.time()).split(".")[0] + ".h264"
    self.encoder = H264Encoder(30000000, repeat=True)
    self.picam2.start_recording(self.encoder, video_file_path)
    self.recording_video = True

    while self.recording_video:
      self.video_frame = self.sample_video(self.picam2.capture_array("lores"))

  def stop_video_recording(self):
    self.recording_video = False
    self.encoder.output.stop()
    self.picam2.stop_encoder()
    self.picam2.stop_recording()
    self.picam2.stop()
    self.start_streaming()
    self.setup_init_settings()

  def change_mode(self, mode):
    if mode == "full":
      self.picam2.switch_mode(self.photo_config)
    elif mode == "video_recording":
      self.picam2.stop_recording()
      self.picam2.configure(self.video_recording_config)
    else:
      self.picam2.switch_mode(self.video_config_1x)

  def take_picture(self):
    try:
      if self.shutter_delay_on:
        time.sleep(5)

      img_path = base_path + str(time.time()).split(".")[0] + ".jpg"
      array = self.picam2.switch_mode_and_capture_array(self.photo_config, "main")
      cv2.imwrite(img_path, array)
    except OSError as e:
      # sometimes taking a picture crashes says "bad address"
      sys.exit(1)

  def start_streaming(self):
    self.picam2.configure(self.video_config_1x)
    self.output = StreamingOutput()
    self.picam2.start_recording(MJPEGEncoder(), FileOutput(self.output))
