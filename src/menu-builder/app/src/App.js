import { useState } from 'react';
import './App.scss';
import Display from './components/Display/Display';
import SpritesDragDrop from './components/SpritesDragDrop/SpritesDragDrop';
import MenuTree from './components/MenuTree/MenuTree';
import ButtonBindings from './components/ButtonBindings/ButtonBindings';

function App() {
  const [sprites, setSprites] = useState({}); // {filename: fileInfo}
  const [lastActiveSprite, setLastActiveSprite] = useState(null);

  return (
    <div className="App">
      <div className="App__left">
        <Display
          sprites={sprites}
          setSprites={setSprites}
          lastActiveSprite={lastActiveSprite}
          setLastActiveSprite={setLastActiveSprite}/>
      </div>
      <div className="App__right">
        <MenuTree sprites={sprites} lastActiveSprite={lastActiveSprite}/>
        <ButtonBindings/>
        <SpritesDragDrop/>
      </div>
    </div>
  );
}

export default App;
