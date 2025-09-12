import React from "react";
import Logo from "../../assets/images/logo.png";
import Bg from "../../assets/images/bg.jpg";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <div className="background">
        <img src={Bg} alt="backgrod-img" />
      </div>
      <div className="home__container">
        <div className="home__logo">
          <img draggable="false" src={Logo} alt="logo-img" />
        </div>

        <div className="home__btns">
          <Link to={"/catalogo"} className="home__btn catalog__btn">
            Catálogo
          </Link>
          <Link to={"/contato"} className="home__btn contact__btn">
            Contato
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
