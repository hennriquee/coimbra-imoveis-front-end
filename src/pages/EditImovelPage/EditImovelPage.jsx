import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useState, useRef, useEffect } from "react";
import "./edit-imovel-page.css";
import { Toaster, toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const EditImovelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const titleRef = useRef();
  const textRef = useRef();
  const priceRef = useRef();

  async function getImovel() {
    setImovel((await api.get(`/imoveis/${id}`)).data);
    setIsLoading(false);
  }

  useEffect(() => {
    getImovel();
  }, [id]);

  async function handleEdit() {
    try {
      await api.put(`/edit/${imovel.id}`, {
        title: titleRef.current.value,
        text: textRef.current.value,
        price: priceRef.current.value,
      });
    } catch (err) {
      throw err.response?.data?.message || "Erro ao salvar.";
    }
  }

  const commitEdit = async (e) => {
    e.preventDefault();

    await toast.promise(handleEdit(), {
      loading: "Alterando...",
      success: <b>Alterações salvas!</b>,
      error: <b>Erro ao salvar.</b>,
    });

    navigate("/adm/edit");
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
    <div className="edit__container__main">
      <Toaster />
      <div className="edit__container">
        <p onClick={copyID} className="edit__container__id">
          <FontAwesomeIcon icon={faCopy} /> ID: {id}
        </p>
        <form onSubmit={commitEdit} className="edit__form">
          <div className="edit__input__box">
            <label htmlFor="title">Título:</label>
            <input
              name="title"
              ref={titleRef}
              defaultValue={imovel?.title}
              disabled={isLoading}
              maxLength={22}
            />
          </div>
          <div className="edit__input__box">
            <label htmlFor="text">Texto:</label>
            <textarea
              name="text"
              ref={textRef}
              defaultValue={imovel?.text}
              disabled={isLoading}
              maxLength={500}
              rows={5}
            />
          </div>
          <div className="edit__input__box">
            <label htmlFor="price">Preço:</label>

            <input
              name="price"
              ref={priceRef}
              defaultValue={imovel?.price}
              disabled={isLoading}
            />
          </div>
          <div className="edit__container__btns">
            <Link className="edit__container__btn cancel__btn" to={"/adm/edit"}>
              Cancelar
            </Link>
            <button className="edit__container__btn save__btn" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditImovelPage;
