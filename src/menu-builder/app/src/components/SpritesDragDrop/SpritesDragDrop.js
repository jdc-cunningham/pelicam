// https://github.com/jdc-cunningham/freelancer-journal/blob/master/react-app/src/components/right-body/RightBody.js

import { useEffect, useRef } from 'react';
import './SpritesDragDrop.scss';

const SpritesDragDrop = (props) => {
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
        console.log(e.target);
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

  useEffect(() => {
    window.api.imgAdded((event, data) => console.log(data));
  }, []);

  return (
    <div className="App__right-sprites">
      <h2>Sprites</h2>
      <div className="App__right-sprites-body" onDragOver={(e) => {e.preventDefault()}} onDrop={imgDrop}>
        <p>Drag and drop sprites here</p>
      </div>
    </div>
  );
};

export default SpritesDragDrop;
