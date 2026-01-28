# Playground
This opens a window on your PC using OpenCV to serve up a GUI in a window. The rendered content in the window is the menu. The menu will be rendered through a nested-tree structure that a walker will loop over.

Eventually your camera does the same thing but it uses Openbox to serve the OpenCV window.

## Installation
This whole project uses Python so you definitely need that.

In this folder run:

- `$python -m venv .pelicam`
- `$source .pelicam/bin/activate` (check [here](https://docs.python.org/3/library/venv.html) for windows vs. linux)

You should see `(.pelicam)` show up in your terminal.

Use `$pip install opencv-python` to get OpenCV

Then run `$pip install -r requirements.txt` for the rest

## Run the menu
`$python run.py`

navigation - use d-pad to navigate
select - use enter
back - use backspace
shutter - use spacebar
