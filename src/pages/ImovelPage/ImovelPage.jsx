import React, { useState, useEffect } from "react";
import "./imovel-page.css";
import { api } from "../../services/api";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const ImovelPage = () => {
  const { id } = useParams();
  const [imovel, setImovel] = useState();
  const [imageIdx, setImageIdx] = useState(0);

  const getImovel = async () => {
    setImovel((await api.get(`/imoveis/${id}`)).data);
  };

  useEffect(() => {
    getImovel();
  }, []);

  const changeImage = (idx) => {
    setImageIdx(idx);
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

  return (
    <section className="imovel__page__main">
      <Toaster />
      <p onClick={copyID} className="imovel__page__id">
        <FontAwesomeIcon icon={faCopy} /> ID: {imovel?.id}
      </p>
      <div className="imovel__images__container">
        {imovel ? (
          <div className="destaque__img">
            <img src={imovel?.images?.[imageIdx] || "/placeholder.jpg"} />
          </div>
        ) : (
          <p className="loading__text">Carregando informações...</p>
        )}
        <div className="tiny__images__container">
          {imovel?.images?.map((img, idx) => (
            <div key={idx} className="tiny__img">
              <img
                onClick={() => changeImage(idx)}
                key={idx}
                src={img}
                alt={`Imagem ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="imovel__content__container">
        <h1 className="imovel__title">
          {imovel?.title}{" "}
          {imovel?.category === "Apartamento"
            ? "🏢"
            : imovel?.category === "Casa"
            ? "🏠"
            : imovel?.category === "Terreno"
            ? "🌳"
            : ""}
        </h1>
        <p className="imovel__content__text">{imovel?.text}</p>
        <p className="imovel__content__price">{imovel?.price}</p>
        {imovel && (
          <div className="imovel__page__btns">
            <Link
              className="imovel__page__btn wpp__btn"
              to={`https://wa.me/5534991821068?text=Olá,+tenho+interesse+no+imóvel+de+ID:+${imovel.id}`}
              target="_blank"
            >
              <i className="bx bxl-whatsapp"></i>
              <span>WhatsApp</span>
            </Link>

            <p className="or__btn">ou</p>

            <Link
              className="imovel__page__btn email__btn"
              to={"mailto:coimbraimoveisuberlandia@gmail.com"}
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
