import React from "react";
import "./imovel-card.css";
import { Link } from "react-router-dom";
import "../../pages/Catalog/catalog.css";

const ImovelCard = ({ id, category, title, price, images, city, state }) => {
  return (
    <div className="imovel__card">
      <div className="imovel__card__img">
        <img src={images[0]} alt="sem imagem" />
      </div>

      <div className="imovel__card__content">
        <h5 className="imovel__card__category">{category}</h5>
        <p className="imovel__card__title">{`${title}`}</p>
        <p className="imovel__card__state">{`${city}(${state})`}</p>
        <hr />
        <p className="price">{price}</p>

        <Link
          to={`/catalogo/imovel/${id}`}
          className="learn__more__btn black__btn"
        >
          Saiba mais
        </Link>
      </div>
    </div>
  );
};

export default ImovelCard;
