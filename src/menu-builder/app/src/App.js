import './App.scss';

function App() {
  return (
    <div className="App">
      <div className="App__left">
        <div className="App__left-display"></div>
      </div>
      <div className="App__right">
        <div className="App__right-menu-tree"></div>
        <div className="App__right-sprites">
          <h2>Sprites</h2>
          <div class="App__right-sprites-body">
            <p>Drag and drop sprites here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
