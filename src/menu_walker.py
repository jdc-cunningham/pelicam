# this file loops over the menu structure and renders the menu pages
# while also returning an object that maps the names of the menu pages and the rendered page location

import json
import os
from PIL import Image, ImageDraw, ImageFont, ImageColor

display = [640, 480]
smaller_font = ImageFont.truetype("./menu/font/alt-font.ttc", 24)
small_font = ImageFont.truetype("./menu/font/alt-font.ttc", 34)
large_font = ImageFont.truetype("./menu/font/alt-font.ttc", 48)

def get_font_size(font_size):
  if font_size == "smaller":
    return smaller_font

  if font_size == "small":
    return smaller_font

  if font_size == "large":
    return large_font
  
def draw_box(draw, loc_x, loc_y, dim_x, dim_y):
  padding = 8
  draw.line([(loc_x - padding, loc_y - padding), (loc_x + dim_x + padding, loc_y - padding)], fill = "ORANGE", width = 4)
  draw.line([(loc_x - padding, loc_y - padding), (loc_x - padding, loc_y + dim_y + padding)], fill = "ORANGE", width = 4)
  draw.line([(loc_x - padding, loc_y + dim_y + padding), (loc_x + dim_x + padding, loc_y + dim_y + padding)], fill = "ORANGE", width = 4)
  draw.line([(loc_x + dim_x + padding, loc_y + dim_y + padding), (loc_x + dim_x + padding, loc_y - padding)], fill = "ORANGE", width = 4)

# render menu image in same path
def render_page(page_config_path):
  with open(page_config_path) as page_json:
    page_config = json.load(page_json)
    page = Image.new("RGB", (display[0], display[1]), "WHITE")
    draw = ImageDraw.Draw(page)

    for item in page_config["items"]:
      loc_x = item["location"][0]
      loc_y = item["location"][1]
      dim_x = item["dimensions"][0]
      dim_y = item["dimensions"][1]

      if item["type"] == "text":
        draw.text(
          (loc_x, loc_y),
          item["text"],
          fill="BLACK",
          font=get_font_size(item["font_size"])
        )

        if "highlighted" in item:
          if item["highlighted"]:
            draw_box(
              draw,
              loc_x,
              loc_y,
              dim_x,
              dim_y
            )

      if item["type"] == "sprite":
        icon = Image.open(item["path"])
        resized_icon = icon.resize((dim_x, dim_y), Image.Resampling.LANCZOS)

        if "transparent" in item:
          if not item["transparent"]:
            page.paste(resized_icon, (loc_x, loc_y))
          else:
            page.paste(resized_icon, (loc_x, loc_y), mask=resized_icon)

    save_path = page_config_path.split('page.json')[0]
    page.save(f"{save_path}page.png")

def walk_menu():
  pass

render_page('./menu/battery_charged/page.json')
