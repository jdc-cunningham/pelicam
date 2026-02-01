import { useEffect, useState } from 'react';
import './MenuTree.scss';

const MenuTree = (props) => {
  const { sprites } = props;
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [newMenuSceneName, setNewMenuSceneName] = useState('');
  const [menuParent, setMenuParent] = useState('');

  // unsorted
  const [menuScenes, setMenuScenes] = useState({
    // "boot_splash_screen": {
    //   "background_type": "color",
    //   // "background_color": "white", // optional, takes global bg color
    //   "items": [
    //     {
    //       "name": "logo",
    //       "type": "sprite",
    //       "path": "sprites/logo.png",
    //       "transparent": false,
    //       "location": [60, 110],
    //       "dimensions": [512, 215]
    //     },
    //     {
    //       "name": "version",
    //       "type": "text",
    //       "font_size": "small",
    //       "text": "ver 0.0.1",
    //       "location": [260, 330],
    //       "dimensions": [93, 33]
    //     }
    //   ]
    // }
  });

  const [menuTree, setMenuTree] = useState({});

  const renderMenuSceneTab = (menuSceneName, altIndex, isChild, marginLeft) => (
    <div
      key={altIndex}
      className={`App__right-menu-tree-scene ${isChild ? 'child' : ''}`}
      title="click to view"
      style={{
        marginLeft: `${marginLeft}px`,
        width: `calc(100% - ${marginLeft})`
      }}
    >
      <p>{menuSceneName}</p>
      <button
        title="add sub-menu scene"
        type="button"
        onClick={
          () => {
            setMenuParent(menuSceneName);
            setShowAddSceneModal(true);
          }
        }>+</button>
    </div>
  );

  const renderMenuSceneGroup = () => {
    return Object.keys(menuScenes).map((menuName, index) => {
      const parent = menuScenes[menuName].parent;
      const marginLeft = parent in menuTree ? menuTree[parent][menuName] : 0;
      return renderMenuSceneTab(menuName, index, parent, marginLeft);
    });
  };

  const sortMenuTree = () => {
    // const sortedGroup = {};

    // const traverseObj = (key, obj, depth) => {
    //   depth += 1;

    //   if (key in obj) {
    //     return key;
    //   } else {
    //     Object.keys(obj).forEach(key => {
    //       traverseObj(key, obj[key]);
    //     });
    //   }
    // };

    // Object.keys(menuScenes).forEach(key => {
    //   const parent = menuScenes[key].parent;

    //   if (!parent) {
    //     sortedGroup[key] = {};
    //   } else {
    //     let depth = 1;
    //     const parentKey = traverseObj(parent, menuScenes, depth);

    //     sortedGroup[parentKey] = {
    //       ...sortedGroup[parentKey],
    //       [key]: depth * 10
    //     };
    //   }
    // });

    // console.log(menuScenes);

    // console.log(sortedGroup);

    // setMenuTree(sortedGroup);
  };

  const addMenuScene = () => {
    const re = new RegExp("^[a-zA-Z0-9_]*$");

    if (!re.test(newMenuSceneName)) {
      alert("Only letters, numbers and underscores allowed");
      return;
    }

    setMenuScenes(prevMenuScenes => ({
      ...prevMenuScenes,
      [newMenuSceneName]: {
        parent: menuParent
      }
    }));

    setMenuParent('');
    setShowAddSceneModal(false);
    setNewMenuSceneName('');
  };

  useEffect(() => {
    if (Object.keys(menuScenes).length) {
      sortMenuTree();
    }
  }, [menuScenes]);

  return (
    <div className="App__right-menu-tree">
      <div className="App__right-menu-tree-add-menu">
        <h2>Menu tree</h2>
        <button type="button" onClick={() => setShowAddSceneModal(true)}>Add scene +</button>
      </div>
      {
        showAddSceneModal &&
        <div className="App__right-menu-tree-add-scene-modal">
          <button type="button" className="close" title="cancel" onClick={() => setShowAddSceneModal(false)}>X</button>
          <span>
            <p>Name</p>
            <input type="text" placeholder="example_name" value={newMenuSceneName} onChange={(e) => setNewMenuSceneName(e.target.value)}/>
          </span>
          <button type="button" className="save" onClick={() => addMenuScene()}>Add</button>
        </div>
      }
      <div className="App__right-menu-tree-scenes">
        {
          Object.keys(menuScenes).length > 0 &&
          <div className="App__right-menu-tree-scene-group">
            {renderMenuSceneGroup()}
          </div>
        }
      </div>
    </div>
  );
};

export default MenuTree;
