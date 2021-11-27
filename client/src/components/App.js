import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import Register from "../views/register/Register";
import Messenger from "../views/messenger/Messenger";

const App = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="App">
            <BrowserRouter>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                    <Route path="/messenger" element={<Messenger />} />
                </Routes>
            </BrowserRouter>
        </div >

    )
}

export default App;