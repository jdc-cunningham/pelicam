import { useState } from 'react';
import './App.scss';
import Display from './components/Display/Display';
import SpritesDragDrop from './components/SpritesDragDrop/SpritesDragDrop';
import MenuTree from './components/MenuTree/MenuTree';
import ButtonBindings from './components/ButtonBindings/ButtonBindings';

function App() {
  const [sprites, setSprites] = useState({}); // {filename: fileInfo}
  const [lastActiveSprite, setLastActiveSprite] = useState(null);
  const [activeMenuName, setActiveMenuName] = useState('');

  const [menuScenes, setMenuScenes] = useState({
    // used by camera and video mode
    "camera_pass_through": {
      background_type: "image",
      background_color: "",
      background_img: null,
      parent: "",
      menu_items: []
    }
  });

  return (
    <div className="App">
      <div className="App__left">
        <Display
          sprites={sprites}
          setSprites={setSprites}
          lastActiveSprite={lastActiveSprite}
          setLastActiveSprite={setLastActiveSprite}
          menuScenes={menuScenes}
          setMenuScenes={setMenuScenes}
          activeMenuName={activeMenuName}
        />
      </div>
      <div className="App__right">
        <MenuTree
          sprites={sprites}
          lastActiveSprite={lastActiveSprite}
          menuScenes={menuScenes}
          setMenuScenes={setMenuScenes}
          activeMenuName={activeMenuName}
          setActiveMenuName={setActiveMenuName}
        />
        <ButtonBindings/>
        <SpritesDragDrop/>
      </div>
    </div>
  );
}

export default App;
