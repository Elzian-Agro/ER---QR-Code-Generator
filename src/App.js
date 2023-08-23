import logo from './logo.svg';
import './App.css';
import Login from '../src/pages/login';
import QR from '../src/pages/qrGenerator';

function App() {
  return (
    <div className="App">
      <Login/>
      <QR/>
    </div>
  );
}

export default App;
