import React from "react";
import "./about.css";
import MateusLuanaImg from "../../assets/images/mateuseluana.png";

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about__container">
        <div className="about__img">
          <img draggable="false" src={MateusLuanaImg} alt="" />
        </div>
        <div className="about__content">
          <h1>Sobre nós</h1>
          <p>
            Fundada em 2024 e localizada em Uberlândia, a
            <span> Coimbra Imóveis</span> é uma imobiliária comprometida com a
            excelência, integridade e transparência. Nossa equipe oferece
            soluções imobiliárias seguras e personalizadas, valorizando a
            confiança, o respeito e o cuidado com nossos clientes. Nosso
            objetivo é transformar cada negócio em uma experiência única de
            bem-estar. <span>O seu sonho é a nossa missão!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
