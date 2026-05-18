import { NavLink, useNavigate } from "react-router-dom";

export default function Gnb() {
  const navigate = useNavigate();

  return (
    <header className="gnb">
      <div className="gnb-inner">
        <button className="logo-button" type="button" onClick={() => navigate("/")}>
          <img src="/image/panda.png" alt="판다마켓" />
        </button>

        <nav className="gnb-nav">
          <NavLink
            to="/community"
            className={({ isActive }) =>
              isActive ? "gnb-nav-link active" : "gnb-nav-link"
            }
          >
            자유게시판
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive ? "gnb-nav-link active" : "gnb-nav-link"
            }
          >
            중고마켓
          </NavLink>
        </nav>

        <button className="login" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}
