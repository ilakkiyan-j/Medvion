
import{BrowserRouter,Routes,Route} from "react-router-dom"; 

import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import Logs from "./Pages/Logs.jsx";
import Records from "./Pages/Records.jsx";
import Profile from "./Pages/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/logs" element={<Logs/>}/>
      <Route path="/records" element={<Records/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
