# this file loops over the menu structure and renders the menu pages
# while also returning an object that maps the names of the menu pages and the rendered page location

import json
import os
from PIL import Image, ImageDraw, ImageFont, ImageColor


display = [640, 480]
small_font = ImageFont.truetype("./menu/font/alt-font.ttc", 34)
large_font = ImageFont.truetype("./menu/font/alt-font.ttc", 48)

# render menu image in same path
def render_page(page_config_path):
  with open(page_config_path) as page_json:
    page_config = json.load(page_json)
    page = Image.new("RGB", (display[0], display[1]), "WHITE")
    draw = ImageDraw.Draw(page)

    for item in page_config["items"]:
      if item["type"] == "text":
        draw.text(
          (item["location"][0], item["location"][1]),
          item["text"],
          fill="BLACK",
          font=small_font if item["font_size"] == "small" else large_font
        )

      if item["type"] == "sprite":
        icon = Image.open(item["path"])
        resized_icon = icon.resize((item["dimensions"][0], item["dimensions"][1]), Image.Resampling.LANCZOS)
        page.paste(resized_icon, (item["location"][0], item["location"][1]), mask=resized_icon)

    save_path = page_config_path.split('page.json')[0]
    page.save(f"{save_path}page.png")

def walk_menu():
  pass

render_page('./menu/page.json')
