import React, { useRef, useEffect } from "react";
import "./header.css";
import LogoImg from "../../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.includes("/adm")) {
      sessionStorage.removeItem("admLogged");
    }
  }, [pathname]);

  const menuHamburguer = useRef();
  const responsiveNav = useRef();

  const toggleMenu = () => {
    menuHamburguer.current.classList.toggle("change");

    if (menuHamburguer.current.classList.contains("change")) {
      responsiveNav.current.style.display = "block";
    } else {
      responsiveNav.current.style.display = "none";
    }
  };

  // Fecha ao clicar fora do menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      const outClick =
        responsiveNav.current &&
        !responsiveNav.current.contains(event.target) &&
        !menuHamburguer.current.contains(event.target);

      if (menuHamburguer.current.classList.contains("change") && outClick) {
        menuHamburguer.current.classList.remove("change");
        responsiveNav.current.style.display = "none";
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fecha ao clicar em qualquer link dentro do menu
  const handleLinkClick = () => {
    menuHamburguer.current.classList.remove("change");
    responsiveNav.current.style.display = "none";
  };

  return (
    <header>
      <Link className="logo" to="/login">
        <img draggable="false" src={LogoImg} alt="logo" />
      </Link>

      {pathname.includes("/adm") ? (
        <>
          <nav className="nav">
            <div className="nav__links">
              <Link to={"/"}>Início</Link>
              <Link to={"/adm/cadastro"}>Cadastrar</Link>
              <Link to={"/adm/edit"}>Editar</Link>
            </div>
          </nav>

          <nav ref={responsiveNav} className="responsive__nav">
            <Link to={"/"} onClick={handleLinkClick}>
              Início
            </Link>
            <Link to={"/adm/cadastro"} onClick={handleLinkClick}>
              Cadastrar
            </Link>
            <Link to={"/adm/edit"} onClick={handleLinkClick}>
              Editar
            </Link>
          </nav>
        </>
      ) : (
        <>
          <nav className="nav">
            <div className="nav__links">
              <Link to={"/"}>Início</Link>
              <Link to={"/catalogo"}>Imóveis</Link>
              <Link to={"/contato"}>Contato</Link>
              <Link to={"/sobre"}>Sobre</Link>
            </div>
          </nav>
          <nav ref={responsiveNav} className="responsive__nav">
            <Link to={"/"} onClick={handleLinkClick}>
              Início
            </Link>
            <Link to={"/catalogo"} onClick={handleLinkClick}>
              Imóveis
            </Link>
            <Link to={"/contato"} onClick={handleLinkClick}>
              Contato
            </Link>
            <Link to={"/sobre"} onClick={handleLinkClick}>
              Sobre
            </Link>
          </nav>
        </>
      )}

      <div
        ref={menuHamburguer}
        onClick={toggleMenu}
        className="menu__hamburguer"
      >
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </div>
    </header>
  );
};

export default Header;
