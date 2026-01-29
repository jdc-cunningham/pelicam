// https://github.com/jdc-cunningham/freelancer-journal/blob/master/react-app/src/components/right-body/RightBody.js

import { useEffect, useRef } from 'react';
import './SpritesDragDrop.scss';

const SpritesDragDrop = (props) => {
  const processSprite = (file) => {
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      if (e.target.result) {
        if (e.target.result.includes('data:image')) {
          window.api.sendImgData({
            imgData: e.target.result
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
    // dropTargetRef.addEventListener('drop', (e) => {
    //   e.stopPropagation();
    //   e.preventDefault();
    //   //  getBase64(e.dataTransfer.files[0], imgDrop, id, clientId);
    // });
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
