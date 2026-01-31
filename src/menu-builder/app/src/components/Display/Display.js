import { useState } from 'react';
import './Display.scss';

const Display = (props) => {
  const [sprites, setSprites] = useState({}); // {filename: fileInfo}

  const [displayInfo, setDisplayInfo] = useState({
    type: 'DSI',
    resolution: [640, 480] // jdc34 cam resolution
  });

  const computePosition = (e, spriteName) => {
    const rect = e.target.getBoundingClientRect();
    const spriteInfo = sprites[spriteName];
    const spriteWidth = spriteInfo.width;
    const spriteHeight = spriteInfo.height;

    setSprites(prevSprites => ({
      ...prevSprites,
      [spriteName]: {
        ...prevSprites[spriteName],
        top: Math.round(e.clientY - rect.y - (spriteHeight / 2)),
        left: Math.round(e.clientX - rect.x - (spriteWidth / 2))
      }
    }));
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
      const spriteWidth = spriteData.width;
      const spriteHeight = spriteData.height;

      setSprites(prevSprites => ({
        ...prevSprites,
        [spriteData.name]: {
          ...spriteData,
          top: Math.round(e.clientY - rect.y - (spriteHeight / 2)),
          left: Math.round(e.clientX - rect.x - (spriteWidth / 2))
        }
      }));
    }
  };

  const renderSprites = () => (
    Object.keys(sprites).map((spriteName, index) => {
      const sprite = sprites[spriteName];

      return (
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
      );
  }));

  return (
    <div className="App__left-display-container">
      <div className="App__left-display-info">
        <div className="App__left-display-info-type">
          <h3>What type of display does your camera use?</h3>
          <select>
            <option>DSI (flat ribbon cable)</option>
            <option>SPI (4 wire)</option>
          </select>
        </div>
        <div className="App__left-display-resolution">
          <h3>Your display resolution in px:</h3>
          <span>
            <p>width:</p>
            <input type="number" step="1" value={displayInfo.resolution[0]}/>
          </span>
          <span>
            <p>height:</p>
            <input type="number" step="1" value={displayInfo.resolution[1]}/>
          </span>
        </div>
      </div>
      <div
        className="App__left-display"
        onDragOver={(e) => {e.preventDefault()}}
        onDrop={imgDrop}
      >
        {Object.keys(sprites).length > 0 && renderSprites()}
      </div>
      <div className="App__left-display-sprite-info">

      </div>
    </div>
  );
};

export default Display;