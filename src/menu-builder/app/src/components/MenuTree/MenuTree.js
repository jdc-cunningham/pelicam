import { useState } from 'react';
import './MenuTree.scss';

const MenuTree = (props) => {
  const { sprites } = props;

  const [menuScenes, setMenuScenes] = useState({
    "boot_splash_screen": {
      "background_type": "color",
      // "background_color": "white", // optional, takes global bg color
      "items": [
        {
          "name": "logo",
          "type": "sprite",
          "path": "sprites/logo.png",
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

  const renderMenuSceneTabs = () => (
    Object.keys(menuScenes).map(menuSceneName => (
      <div className="App__right-menu-tree-scene">
        <p>{menuSceneName}</p>
      </div>
    ))
  );

  return (
    <div className="App__right-menu-tree">
      <h2>Menu tree</h2>
      <div className="App__right-menu-tree-add-menu">
        <button>add scene +</button>
      </div>
      <div className="App__right-menu-tree-scenes">
        {Object.keys(menuScenes).length > 0 && renderMenuSceneTabs()}
      </div>
    </div>
  );
};

export default MenuTree;
