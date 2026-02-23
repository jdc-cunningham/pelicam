#!/usr/bin/python
# -*- coding:utf-8 -*-

import sys
import os
picdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'pic')
libdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)

import logging    
import time
import traceback
from waveshare_OLED import OLED_0in91
from PIL import Image,ImageDraw,ImageFont
logging.basicConfig(level=logging.DEBUG)

class small_OLED():
    def __init__(self):
        self.disp = OLED_0in91.OLED_0in91()
        self.font1 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 12)
        self.font2 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 18)

        self.disp.Init()

    def draw_text(self, text):
        try:
            self.disp.clear()
            image1 = Image.new('1', (self.disp.width, self.disp.height), "WHITE")
            draw = ImageDraw.Draw(image1)

            # draw screen border
            draw.line([(0,0),(127,0)], fill = 0)
            draw.line([(0,0),(0,31)], fill = 0)
            draw.line([(0,31),(127,31)], fill = 0)
            draw.line([(127,0),(127,31)], fill = 0)

            draw.text((10,5), text, font = self.font2, fill = 0)
            image1 = image1.rotate(0) 
            self.disp.ShowImage(self.disp.getbuffer(image1))
        except IOError as e:
            logging.info(e)
