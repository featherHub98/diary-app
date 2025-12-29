import './App.css';
import { BrowserRouter,Routes,Route } from "react-router"
import HomePage from './components/HomePage.tsx';
import LoginPage from './components/LoginPage.tsx';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/diary" element={<HomePage />} />
        </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
