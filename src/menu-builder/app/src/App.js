import { useState } from 'react';
import './App.scss';
import Display from './components/Display/Display';
import SpritesDragDrop from './components/SpritesDragDrop/SpritesDragDrop';
import MenuTree from './components/MenuTree/MenuTree';
import ButtonBindings from './components/ButtonBindings/ButtonBindings';

function App() {
  const [sprites, setSprites] = useState({}); // {filename: fileInfo}

  return (
    <div className="App">
      <div className="App__left">
        <Display sprites={sprites} setSprites={setSprites}/>
      </div>
      <div className="App__right">
        <MenuTree sprites={sprites}/>
        <ButtonBindings/>
        <SpritesDragDrop/>
      </div>
    </div>
  );
}

export default App;
