import { useNavigate } from "react-router-dom";
import "./css/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("token");
        localStorage.clear();
        navigate("/"); 
    }
  };

  return (
  <header className="header">
    <h1 className="title">Todo App</h1>
    <button className="logoutButton" onClick={handleLogout}>Logout</button>
  </header>
  );
};

export default Header;
