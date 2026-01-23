import React, { useState, useEffect, useRef } from "react";
import "./imovel-page.css";
import { api } from "../../services/api";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import ReturnBtn from "../../Components/ReturnBtn/ReturnBtn";

const ImovelPage = () => {
  const { id } = useParams();
  const [imovel, setImovel] = useState();
  const [imageIdx, setImageIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const textRef = useRef();
  const [temMais, setTemMais] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const url = window.location.href;

  const getImovel = async () => {
    setImovel((await api.get(`/imoveis/${id}`)).data);
  };

  useEffect(() => {
    getImovel();
  }, []);

  //LER MAIS
  const handleReadMore = () => {
    setTemMais((prev) => !prev);
    setExpandido((prev) => {
      const novoValor = !prev;
      novoValor ? (textRef.current.style.minHeight = "15.08rem") : null;
      textRef.current.style.overflow = novoValor ? "auto" : "hidden";
      return novoValor;
    });
  };

  useEffect(() => {
    if (textRef.current) {
      // Verifica se o conteúdo do texto passa do tamanho visível
      setTemMais(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [imovel]);

  const changeImage = (idx) => {
    if (!imovel?.images) return;
    const total = imovel.images.length;
    // loop infinito
    const newIndex = (idx + total) % total;
    setImageIdx(newIndex);
  };

  const copyID = () => {
    navigator.clipboard
      .writeText(imovel?.id)
      .then(() => {
        toast.success("ID copiado!");
      })
      .catch((err) => {
        toast.error("Erro ao copiar: ", err);
      });
  };

  // Funções de swipe de imagem
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      // arrastou para a esquerda → próxima imagem
      changeImage(imageIdx + 1);
    } else if (diff < -50) {
      // arrastou para a direita → imagem anterior
      changeImage(imageIdx - 1);
    }

    setTouchStart(null);
  };
  // Funções de swipe de imagem

  return (
    <section className="imovel__page__main">
      <Toaster />
      <ReturnBtn />
      {imovel && (
        <p onClick={copyID} className="imovel__page__id">
          <FontAwesomeIcon icon={faCopy} /> ID: {imovel?.id}
        </p>
      )}
      <div className="imovel__images__container">
        {imovel ? (
          <div
            className="destaque__img"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={imovel?.images?.[imageIdx] || "/placeholder.jpg"} />
          </div>
        ) : (
          <p className="loading__text">Carregando informações...</p>
        )}
        <div className="tiny__images__container">
          {imovel?.images?.map((img, idx) => (
            <div
              key={idx}
              className={`tiny__img ${idx === imageIdx ? "active" : ""}`}
            >
              <img
                onClick={() => changeImage(idx)}
                src={img}
                alt={`Imagem ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="imovel__content__container">
        <h1 className="imovel__title">
          {imovel?.category}{" "}
          {imovel?.category === "Apartamento"
            ? "🏢"
            : imovel?.category === "Casa"
              ? "🏠"
              : imovel?.category === "Terreno"
                ? "🌳"
                : ""}
        </h1>
        <p className="imovel__content__bairro">
          {imovel ? `◉ ${imovel?.title}` : ""}
        </p>
        <div ref={textRef} className="imovel__content__text">
          {imovel?.text}
        </div>
        {temMais && (
          <p onClick={handleReadMore} className="read__more">
            ...Ler mais
          </p>
        )}
        <p className="imovel__content__price">{imovel?.price}</p>
        {imovel && (
          <div className="imovel__page__btns">
            <Link
              className="imovel__page__btn wpp__btn"
              to={`https://wa.me/5534991821068?text=Olá,+tenho+interesse+neste+imóvel:%0A${url}`}
              target="_blank"
            >
              <i className="bx bxl-whatsapp"></i>
              <span>WhatsApp</span>
            </Link>

            <p className="or__btn">ou</p>

            <Link
              className="imovel__page__btn email__btn"
              to={`mailto:coimbraimoveisuberlandia@gmail.com?subject=Interesse%20em%20imóvel&body=Olá,%20tenho%20interesse%20neste%20imóvel:%0A${url}`}
            >
              <i className="bx bx-envelope"></i>E-mail
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImovelPage;
