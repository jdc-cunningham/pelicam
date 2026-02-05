import { useState, useRef, useEffect } from 'react';
import './Display.scss';

const Display = (props) => {
  const {
    sprites,
    setSprites,
    lastActiveSprite,
    setLastActiveSprite,
    menuScenes,
    setMenuScenes,
    activeMenuName
  } = props;

  const dispRef = useRef(null);

  const [displayInfo, setDisplayInfo] = useState({
    type: 'DSI',
    resolution: [640, 480], // jdc34 cam resolution
    padding: 20 // visual aid
  });

  const [textSpriteText, setTextSpriteText] = useState('');

  const computePosition = (e, spriteId) => {
    const rect = dispRef.current.getBoundingClientRect();
    const spriteInfo = sprites[spriteId];
    const spriteWidth = spriteInfo.width;
    const spriteHeight = spriteInfo.height;
    const spriteTop = Math.round(e.clientY - rect.y - ((spriteHeight * spriteInfo.scale) / 2));
    const spriteLeft = Math.round(e.clientX - rect.x - ((spriteWidth * spriteInfo.scale) / 2));

    setSprites(prevSprites => ({
      ...prevSprites,
      [spriteId]: {
        ...prevSprites[spriteId],
        top: spriteTop,
        left: spriteLeft
      }
    }));

    setLastActiveSprite({
      ...sprites[spriteId],
      top: spriteTop,
      left: spriteLeft,
      scale: 1
    });
  };

  // https://stackoverflow.com/a/12502559
  // this does not have to be super unique as it's appended to a name
  const getRandomStr = () => Math.random().toString(36).slice(2);

  const imgDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const spriteDataPlainText = e.dataTransfer.getData('text/plain');
    const spriteData = spriteDataPlainText.includes('{') ? JSON.parse(spriteDataPlainText) : {};

    if ('spriteName' in spriteData) {
      computePosition(e, spriteData.id);
      return; // local dragging
    }

    // initial sprite save
    if ('width' in spriteData) {
      // this is duplicated above but the sprite doesn't exist yet
      const rect = dispRef.current.getBoundingClientRect();
      const spriteWidth = spriteData.width;
      const spriteHeight = spriteData.height;
      const spriteTop = Math.round(e.clientY - rect.y - (spriteHeight / 2));
      const spriteLeft = Math.round(e.clientX - rect.x - (spriteWidth / 2));
      const id = `${spriteData.name}_${getRandomStr()}`;

      setSprites(prevSprites => ({
        ...prevSprites,
        [id]: {
          ...spriteData,
          id,
          name: spriteData.name,
          top: spriteTop,
          left: spriteLeft,
          scale: 1,
          path: `sprites/${spriteData.name}.png` // assumes png
        }
      }));

      setLastActiveSprite({
        ...spriteData,
        id,
        name: spriteData.name,
        top: spriteTop,
        left: spriteLeft,
        scale: 1
      });
    }
  };

  const renderSprites = () => (
    Object.keys(sprites).map((spriteId, index) => {
      const sprite = sprites[spriteId];
      const spriteName = sprite.name;

      if (sprite?.name === '_text_tool') {
        return (
          <div
            key={index}
            alt="sprite"
            className={`App__left-display-sprite text ${lastActiveSprite?.id === sprite.id ? 'active': ''}`}
            title={spriteName}
            draggable="true"
            width={sprite.width}
            height={sprite.height}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', JSON.stringify({
                spriteName
              }))
            }}
            onClick={(e) => {
              setLastActiveSprite(sprite);
            }}
            style={{
              top: sprite.top,
              left: sprite.left,
              minWidth: `${Math.round(sprite.width * sprite.scale)}px`,
              height: `${Math.round(sprite.height * sprite.scale)}px`
            }}
          >
            {sprite?.value || 'text'}
          </div>
        )
      }

      return (
        <img
          key={index}
          alt="sprite"
          className={`App__left-display-sprite ${lastActiveSprite?.id === sprite.id ? 'active': ''}`}
          src={sprite.data}
          title={spriteName}
          draggable="true"
          width={sprite.width}
          height={sprite.height}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
              spriteName
            }))
          }}
          onClick={(e) => {
            setLastActiveSprite(sprite);
          }}
          style={{
            top: sprite.top,
            left: sprite.left,
            width: `${Math.round(sprite.width * sprite.scale)}px`,
            height: `${Math.round(sprite.height * sprite.scale)}px`
          }}
        />
      );
  }));

  const updateDisplayInfo = (field, value) => {
    setDisplayInfo(prevDisplayInfo => ({
      ...displayInfo,
      [field]: value
    }))
  };

  useEffect(() => {
    if (Object.keys(sprites).length) {
      setMenuScenes(prevMenuScenes => ({
        ...prevMenuScenes,
        [activeMenuName]: {
          ...prevMenuScenes[activeMenuName],
          menu_items: sprites
        }
      }));
    }
    console.log(sprites);
  }, [sprites]);

  useEffect(() => {
    if (textSpriteText) {
      setSprites(prevSprites => ({
        ...prevSprites,
        [lastActiveSprite?.id]: {
          ...prevSprites[lastActiveSprite?.id],
          value: textSpriteText
        }
      }));
    }
  }, [textSpriteText]);

  useEffect(() => {
    if (activeMenuName) {
      setSprites(menuScenes[activeMenuName].menu_items);
    }
  }, [activeMenuName]);

  return (
    <div className="App__left-display-container">
      <div className="App__left-display-info">
        <div className="App__left-display-info-type">
          <h3>What type of display does your camera use?</h3>
          <select onChange={(e) => updateDisplayInfo('type', e.target.value)} value={displayInfo.type}>
            <option>DSI (flat ribbon cable)</option>
            <option>SPI (4 wire)</option>
          </select>
        </div>
        <div className="App__left-display-resolution">
          <h3>Your display resolution in px:</h3>
          <span>
            <p>width:</p>
            <input
              type="number"
              step="1"
              value={displayInfo.resolution[0]}
              onChange={
                (e) => updateDisplayInfo('resolution', [e.target.value, displayInfo.resolution[1]])
              }
            />
          </span>
          <span>
            <p>height:</p>
            <input
              type="number"
              step="1"
              value={displayInfo.resolution[1]}
              onChange={
                (e) => updateDisplayInfo('resolution', [displayInfo.resolution[0], e.target.value])
              }
            />
          </span>
        </div>
        <div className="App__left-display-padding">
          <h3>Padding in px:</h3>
          <input
            type="number"
            step="1"
            value={displayInfo.padding}
            onChange={
              (e) => updateDisplayInfo('padding', e.target.value)
            }
          />
        </div>
        <p className="disclaimer">Note that the font rendered below is different compared to your physical display font</p>
      </div>
      <div className="App__left-display">
        <div
          className="App__left-display-scene"
          onDragOver={(e) => {e.preventDefault()}}
          onDrop={imgDrop}
          style={{
            width: `${displayInfo.resolution[0]}px`,
            height: `${displayInfo.resolution[1]}px`
          }}
          ref={dispRef}
        >
          {Object.keys(sprites).length > 0 && renderSprites()}
          <div
            className="App__left-display-scene-padding-visual-guide"
            style={{
              top: displayInfo.padding,
              left: displayInfo.padding,
              width: (displayInfo.resolution[0] - (displayInfo.padding * 2)),
              height: (displayInfo.resolution[1] - (displayInfo.padding * 2))
            }}
          ></div>
        </div>
      </div>
      <div className="App__left-display-sprite-info">
        <h3>Active sprite: {lastActiveSprite?.id || ""}</h3>
        {
          lastActiveSprite &&
          lastActiveSprite?.name === '_text_tool' &&
          <span>
            Text:
            <input
              type="text"
              value={sprites[lastActiveSprite.id]?.value || textSpriteText}
              onChange={(e) => setTextSpriteText(e.target.value)}
              placeholder="custom text"
              className="sprite-text"
            />
          </span>
        }
        {
          lastActiveSprite &&
          <span>
            <p>Update coordinates:</p>
            <span>
              <p className="indent">X</p>
              <input
                type="number"
                step="1"
                value={lastActiveSprite?.left}
                onChange={
                  (e) => setLastActiveSprite(prevLastActiveSprite => ({
                    ...prevLastActiveSprite,
                    width: e.target.value
                  }))
                }
              />
            </span>
            <span>
              <p className="indent">Y</p>
              <input
                type="number"
                step="1"
                value={lastActiveSprite?.top}
                onChange={
                  (e) => setLastActiveSprite(prevLastActiveSprite => ({
                    ...prevLastActiveSprite,
                    width: e.target.value
                  }))
                }
              />
            </span>
          </span>
        }
        {
          lastActiveSprite &&
          <span>
            <p>Scale:</p>
            <input
              type="number"
              step="0.1"
              value={lastActiveSprite?.scale}
              onChange={
                (e) => {
                  setLastActiveSprite(prevLastActiveSprite => ({
                    ...prevLastActiveSprite,
                    scale: e.target.value
                  }));

                  setSprites(prevSprites => ({
                    ...prevSprites,
                    [lastActiveSprite.id]: {
                      ...prevSprites[lastActiveSprite.id],
                      scale: e.target.value
                    }
                  }));
                }
              }
            />
          </span>
        }
      </div>
    </div>
  );
};

export default Display;