# this file loops over the menu structure and renders the menu pages
# while also returning an object that maps the names of the menu pages and the rendered page location

import json
import os
from PIL import Image, ImageDraw, ImageFont, ImageColor


display = [640, 480]


# render menu image in same path
def render_page(page_config_path):
  with open(page_config_path) as page_json:
    page_config = json.load(page_json)
    page = Image.new("RGB", (display[0], display[1]), "BLACK")
    draw = ImageDraw.Draw(page)
    save_path = page_config_path.split('page.json')[0]
    page.save(f"{save_path}page.png")

def walk_menu():
  pass

render_page('./menu/page.json')
