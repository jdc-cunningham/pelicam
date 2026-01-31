// https://github.com/jdc-cunningham/freelancer-journal/blob/master/react-app/src/components/right-body/RightBody.js

import { useState, useEffect, useRef } from 'react';
import './SpritesDragDrop.scss';

const SpritesDragDrop = (props) => {
  const [sprites, setSprites] = useState([
    {
      name: 'folder_line_icon',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABlklEQVR4nO2bsUrDUBhGT0txcq5Onbro4Cy4OjopiPgETj6GPoOTsw59BycpODqIq6KTqEW0Wm0cYrZcmra5/xfJf+BSmob0/IeQpbfgOI7j1JfG32sH2AeWSrjmM3AEfJdwLRPWgVcgKXGdmk4wJ33KHT5bx5ZDzMMPcQIkwKHhHDMTa/iENO6u3SizETNAAnwCm2bTTEmDVDI2A2AHuDf4riIMgIfsTew7oKrrAmhb3QFVpVf3AMO6B6BV4Jx34CW2SCRaQHvSSaGHxCOwTbFIVaYLXBKeM/fgCFgTyMZiGfhgigB9iWZccu+CZuDkoZWVIV95B0MBaoMHUAuo8QBqATUeQC2gxgOoBdR4ALWAGg+gFlDjAdQCajyAWkCNB1ALqPEAagE1HkAtoMYDqAXUeAC1gJpQgC6wYCliQCf0Qeh38xP+/96AjAMCc07aInMDnANPsQ0j0QQ2SDd65N7ttd8j5A9BYKyWEDJuAldqCyG3AKvAHfqtq9ZrBGxlf5lZBPaAFerxXHgDzoBrtYjjOI6j5BelzD/57vYDcAAAAABJRU5ErkJggg==',
      width: 64,
      height: 64
    }
  ]); // {name, data}

  const [displayInfo, setDisplayInfo] = useState({
    type: '',
    dimensions: [0, 0]
  });

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
          const img = new Image();

          img.onload = () => {
            const height = img.height;
            const width = img.width;

            if (window?.api?.sendImgData) { // web context no electron
              window.api.sendImgData({
                imgInfo: {
                  name: fileName,
                  data: e.target.result,
                  width,
                  height
                }
              });
            }
          };

          img.src = e.target.result;
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
      <div
        key={index}
        className="App__right-sprites-body-sprite"
        draggable="true"
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify(sprite));          
        }}
      >
        <img src={sprite.data} alt="sprite"/>
      </div>
    ))
  )

  useEffect(() => {
    if (window?.api) { // web context no electron
      window.api.imgAdded((event, data) => {
        if (sprites.find(sprite => sprite.name !== data.name)) {
          setSprites(prevSprites => ([
            ...prevSprites,
            {
              name: data.name,
              data: `data:image/png;base64,${data.data}`
            }
          ]));
        }
      });
    }
  }, []);

  return (
    <div className="App__right-sprites">
      <h2>Sprites</h2>
      <div
        className={`App__right-sprites-body ${sprites.length ? 'has-sprites': ''}`}
        onDragOver={(e) => {e.preventDefault()}}
        onDrop={imgDrop}
      >
        {!sprites.length > 0 && <p>Drag and drop sprites here</p>}
        {sprites.length > 0 && renderSprites()}
      </div>
    </div>
  );
};

export default SpritesDragDrop;
