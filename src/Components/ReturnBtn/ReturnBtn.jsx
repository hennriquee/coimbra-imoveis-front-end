import React from "react";
import "./return-btn.css";
import returnImg from "../../assets/images/return-img.png";
import { Link, useNavigate } from "react-router-dom";

const ReturnBtn = () => {
  const navigate = useNavigate();

  return (
    <Link onClick={() => navigate(-1)} className="return__btn">
      <img src={returnImg} alt="< Retornar" />
    </Link>
  );
};

export default ReturnBtn;
