import './App.scss';
import Display from './components/Display/Display';
import SpritesDragDrop from './components/SpritesDragDrop/SpritesDragDrop';

function App() {
  return (
    <div className="App">
      <div className="App__left">
        <Display/>
      </div>
      <div className="App__right">
        <div className="App__right-menu-tree"></div>
        <SpritesDragDrop />
      </div>
    </div>
  );
}

export default App;
