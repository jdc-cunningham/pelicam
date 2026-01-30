// https://github.com/jdc-cunningham/freelancer-journal/blob/master/react-app/src/components/right-body/RightBody.js

import { useState, useEffect, useRef } from 'react';
import './SpritesDragDrop.scss';

const SpritesDragDrop = (props) => {
  const [sprites, setSprites] = useState([]); // {name, data}
  
  const verifyFileName = (fileName) => {
    const fn = fileName.split('.png').join('');
    const re = new RegExp("^[a-zA-Z0-9_]*$");

    if (re.test(fn)) {
      return fn + '.png';
    }

    return false;
  };

  const processSprite = (file) => {
    const reader = new FileReader();
    const fileName = verifyFileName(file.name);

    if (!fileName) {
      alert('File name needs to be letters, characters and underscores only eg. sprite_name.png');
      return;
    }

    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      if (e.target.result) {
        if (e.target.result.includes('data:image')) {
          window.api.sendImgData({
            imgInfo: {
              name: fileName,
              data: e.target.result
            }
          });
        }
      } else {
        console.warn("No img data");
      }
    };
    
    reader.onerror = (error) => {
      console.error("Failed to read image");
      console.error(error);
    };
  }

  const imgDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    processSprite(e.dataTransfer.files[0]);
  };

  const renderSprites = () => (
    sprites.map((sprite, index) => (
      <div key={index} className="App__right-sprites-body-sprite">
        <img src={`data:image/png;base64,${sprite.data}`} alt="sprite"/>
      </div>
    ))
  )

  useEffect(() => {
    if (window?.api) {
      window.api.imgAdded((event, data) => {
        if (sprites.find(sprite => sprite.name !== data.name)) {
          setSprites(prevSprites => ([
            ...prevSprites,
            {
              name: data.name,
              data: data.data
            }
          ]));
        }
      });
    }
  }, []);

  return (
    <div className="App__right-sprites">
      <h2>Sprites</h2>
      <div className={`App__right-sprites-body ${sprites.length ? 'has-sprites': ''}`} onDragOver={(e) => {e.preventDefault()}} onDrop={imgDrop}>
        {!sprites.length && <p>Drag and drop sprites here</p>}
        {sprites.length && renderSprites()}
      </div>
    </div>
  );
};

export default SpritesDragDrop;
