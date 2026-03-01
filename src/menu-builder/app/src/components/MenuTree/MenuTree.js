import { act, useEffect, useState } from 'react';
import './MenuTree.scss';

const MenuTree = (props) => {
  const { sprites, lastActiveSprite, menuScenes, setMenuScenes, activeMenuName, setActiveMenuName } = props;
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [newMenuSceneName, setNewMenuSceneName] = useState('');
  const [menuParent, setMenuParent] = useState('');
  const [menuTree, setMenuTree] = useState({});

  const saveToLocalStorage = () => {
    localStorage.setItem('pelicam-menu-scenes', JSON.stringify(menuScenes));
    localStorage.setItem('pelicam-menu-tree', JSON.stringify(menuTree));
  };

  const getMenuTreeFromLocalStorage = () => {
    const localStore = localStorage.getItem('pelicam-menu-tree');

    if (localStore) {
      return JSON.parse(localStore);
    } else {
      return {};
    }
  };

  const getMenuScenesFromLocalStorage = () => {
    const localStore = localStorage.getItem('pelicam-menu-scenes');

    if (localStore) {
      return JSON.parse(localStore);
    } else {
      return {};
    }
  };

  const renderMenuSceneTab = (menuSceneName, altIndex, marginLeft) => (
    <div
      key={altIndex}
      className={`App__right-menu-tree-scene ${activeMenuName === menuSceneName ? 'active' : ''}`}
      title="click to view"
      style={{
        marginLeft: `${marginLeft}px`,
        width: `calc(100% - ${marginLeft})`
      }}
      onClick={() => setActiveMenuName(menuSceneName)}
    >
      <p>{menuSceneName}</p>
      <button
        title="add sub-menu scene"
        type="button"
        onClick={
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuParent(menuSceneName);
            setShowAddSceneModal(true);
          }
        }>+</button>
    </div>
  );

  const renderMenuSceneGroup = () => {
    const menus = [];

    const traverseObjBranch = (obj, indent) => {
      indent += 1;

      Object.keys(obj).forEach(key2 => {
        menus.push({
          name: key2,
          indent: indent
        });

        if (Object.keys(obj[key2]).length) {
          traverseObjBranch(obj[key2], indent);
        }
      });
    };

    Object.keys(menuTree).forEach(key => {
      let indent = 0;

      menus.push({
        name: key,
        indent: indent
      });

      traverseObjBranch(menuTree[key], indent);
    });

    return menus.map((menu, index) => {
      const marginLeft = menu.indent * 10;
      return renderMenuSceneTab(menu.name, index, marginLeft);
    });
  };

  const addMenuScene = () => {
    const re = new RegExp("^[a-zA-Z0-9_]*$");

    if (!newMenuSceneName) {
      alert("Can't be empty");
      return;
    }

    if (!re.test(newMenuSceneName)) {
      alert("Only letters, numbers and underscores allowed");
      return;
    }

    if (newMenuSceneName in menuScenes) {
      alert("Scene name already used");
      return;
    }

    setActiveMenuName(newMenuSceneName);

    setMenuScenes(prevMenuScenes => ({
      ...prevMenuScenes,
      [newMenuSceneName]: {
        background_type: "color",
        background_color: "white",
        parent: menuParent,
        menu_items: []
      }
    }));

    setMenuParent('');
    setShowAddSceneModal(false);
    setNewMenuSceneName('');
  };

  const sortMenuTree = () => {
    const sortedMenuTree = {};

    // Google Search AI Summary Code
    const getPathToKey = (obj, targetKey, currentPath = '') => {
      if (obj === null || typeof obj !== 'object') {
        return undefined;
      }

      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const newPath = currentPath ? `${currentPath}.${key}` : key;

          if (key === targetKey) {
            return newPath;
          }

          if (typeof obj[key] === 'object') {
            const foundPath = getPathToKey(obj[key], targetKey, newPath);

            if (foundPath) {
              return foundPath;
            }
          }
        }
      }

      return undefined;
    };

    const getRefFromPathKeys = (obj, pathKeys) => {
      if (pathKeys.length > 0) {
        return getRefFromPathKeys(obj[pathKeys[0]], pathKeys.slice(1));
      } else {
        return obj;
      }
    };

    Object.keys(menuScenes).forEach(key => {
      const parent = menuScenes[key].parent;

      if (!parent) {
        sortedMenuTree[key] = {};
      } else {
        const pathKeys = getPathToKey(sortedMenuTree, parent);
        const ref = getRefFromPathKeys(sortedMenuTree, pathKeys.split("."));
        ref[key] = {};
      }
    });
    
    setMenuTree(sortedMenuTree);
  };

  useEffect(() => {
    if (lastActiveSprite) {
      setMenuScenes(prevMenuScenes => ({
        ...prevMenuScenes,
        [activeMenuName]: {
          ...prevMenuScenes[activeMenuName],
          menu_items: {
            ...prevMenuScenes[activeMenuName].menu_items,
            [lastActiveSprite.id]: lastActiveSprite
          }
        }
      }));
    }
  }, [lastActiveSprite]);

  // temporary, will be saved in filesystem through Electron
  useEffect(() => {
    if (Object.keys(menuTree).length) {
      saveToLocalStorage();
    }
  }, [menuTree]);

  useEffect(() => {
    if (Object.keys(menuScenes).length) {
      sortMenuTree();
    }
  }, [menuScenes]);

  useEffect(() => {
    const storedMenuScenes = getMenuScenesFromLocalStorage();
    const storedMenuTrees = getMenuTreeFromLocalStorage();
    if (Object.keys(storedMenuScenes).length) { setMenuScenes(storedMenuScenes) };
    if (Object.keys(storedMenuTrees).length) { setMenuTree(storedMenuTrees) };

    if (Object.keys(menuScenes).length) {
      setActiveMenuName(Object.keys(menuScenes)[0]);
    }
  }, []);

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
