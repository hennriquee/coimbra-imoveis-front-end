import React from "react";
import "./return-btn.css";
import returnImg from "../../assets/images/return-img.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ReturnBtn = () => {
  const { pathname } = useLocation();

  const imovelPage = pathname.includes("/catalogo/imovel") ? true : false;

  const editImovel = pathname.includes("/adm/edit") ? true : false;

  return (
    <Link
      to={imovelPage ? "/catalogo" : editImovel ? "/adm/edit" : "/"}
      className="return__btn"
    >
      <img src={returnImg} alt="< Retornar" />
    </Link>
  );
};

export default ReturnBtn;
