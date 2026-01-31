import { useState } from 'react';
import './MenuTree.scss';

const MenuTree = (props) => {
  const [menuScenes, setMenuScenes] = useState({
    "boot_splash_screen": {
      "scene_name": "boot_splash_screen",
      "background_type": "color",
      // "background_color": "white", // optional, takes global bg color
      "items": [
        {
          "name": "logo",
          "type": "sprite",
          "path": "menu/sprites/logo.png",
          "transparent": false,
          "location": [60, 110],
          "dimensions": [512, 215]
        },
        {
          "name": "version",
          "type": "text",
          "font_size": "small",
          "text": "ver 0.0.1",
          "location": [260, 330],
          "dimensions": [93, 33]
        }
      ]
    }
  });

  return (
    <div className="App__right-menu-tree">
      <h2>Menu tree</h2>
    </div>
  );
};

export default MenuTree;
