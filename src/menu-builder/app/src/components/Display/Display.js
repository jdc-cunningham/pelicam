import { useState } from 'react';
import './Display.scss';

const Display = (props) => {
  const [sprites, setSprites] = useState([]);
  const [movingSprite, setMovingSprite] = useState('');

  const computePosition = (e, spriteName) => {
    console.log(e, spriteName);
  };

  const imgDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const spriteDataPlainText = e.dataTransfer.getData('text/plain');
    const spriteData = spriteDataPlainText.includes('{') ? JSON.parse(spriteDataPlainText) : {};

    if ('spriteName' in spriteData) {
      computePosition(e, spriteData.spriteName);
      return; // local dragging
    }

    if ('width' in spriteData) {
      const rect = e.target.getBoundingClientRect();

      setSprites(prevSprites => ([
        ...prevSprites,
        {
          ...spriteData,
          top: e.clientY - rect.y,
          left: e.clientX - rect.x
        }
      ]));
    }
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
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({
            spriteName: sprite.name
          }))
        }}
        style={{
          top: sprite.top,
          left: sprite.left
        }}
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