import './App.css';
import { BrowserRouter,Routes,Route } from "react-router"
import WriteDiaryPage from './components/writeDiary/WriteDiaryPage.tsx';
import LoginPage from './components/LoginPage/LoginPage.tsx';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/diary" element={<WriteDiaryPage />} />
        </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
