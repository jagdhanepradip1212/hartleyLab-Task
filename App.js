//import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Header from './Components/Header/Header';


function App() {
  return (
    <div className="App">
      <Header></Header>
        <Register></Register>

      <Login></Login>
    </div>
  );
}

export default App;
