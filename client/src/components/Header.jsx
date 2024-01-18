import { Link } from "react-router-dom";

import Auth from "../utils/auth";

const Header = () => {
  return (
    <header className="header-jg">
      <img
        src="/logo_1024x1024_black.png"
        alt="juggler logo"
        className="header-logo-jg"
      />
      <div className="header-brand-name-jg">
        <Link to="/">
          <h2>Juggler</h2>
        </Link>
      </div>
      <div>
        <button className="button-jg header-button-jg">
          <Link to="/login">Login</Link>
        </button>
        <button className="button-jg header-button-jg">
          <Link to="/signup">Signup</Link>
        </button>
      </div>
    </header>
  );
};

export default Header;
