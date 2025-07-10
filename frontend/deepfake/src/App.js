import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HostState from './context/HostState';
import Home from './pages/Home'
function App() {
  return (
    <>
      <HostState>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/login' element={<Login />}></Route>
          </Routes>
        </Router>
      </HostState>
    </>
  );
}

export default App;
