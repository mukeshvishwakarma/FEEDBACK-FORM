import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Feedbacklist from "./Components/Feedbacklist";
import Edit from "./Components/Edit";
import Addfeedback from "./Components/Addfeedback";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Feedbacklist" element={<Feedbacklist />} />
          <Route path="/feedbacks/edit/:id" element={<Edit />} />
          <Route path="/Addfeedback" element={<Addfeedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
