import { useState } from 'react';
import './Display.scss';

const Display = (props) => {
  const [sprites, setSprites] = useState([]);

  const imgDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const spriteDataPlainText = e.dataTransfer.getData('text/plain');

    if (!spriteDataPlainText.includes('{')) {
      return; // local dragging
    }

    const spriteData = JSON.parse(spriteDataPlainText);

    setSprites(prevSprites => ([
      ...prevSprites,
      spriteData
    ]));
  };

  const renderSprites = () => (
    sprites.map((sprite, index) => (
      <img
        key={index}
        alt="sprite"
        className="App__left-display-sprite"
        src={sprite.data}
        title={sprite.name}
        draggable="true"
        width={sprite.width}
        height={sprite.height}
      />
    )) 
  );

  return (
    <div
      className="App__left-display"
      onDragOver={(e) => {e.preventDefault()}}
      onDrop={imgDrop}
    >
      {sprites.length > 0 && renderSprites()}
    </div>
  );
};

export default Display;