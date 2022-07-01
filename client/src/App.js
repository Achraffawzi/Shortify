import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup.js";

function App() {
  return (
    <div className="App">
      navbar
      <Router>
        <Routes>
          <Route path="/auth/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
