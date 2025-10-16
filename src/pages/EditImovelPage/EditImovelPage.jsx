import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useState, useRef, useEffect } from "react";
import "./edit-imovel-page.css";
import { Toaster, toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import ReturnBtn from "../../Components/ReturnBtn/ReturnBtn";

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

  const removedImages = [];

  async function handleEdit() {
    try {
      await api.put(`/edit/${imovel.id}`, {
        title: titleRef.current.value,
        text: textRef.current.value,
        price: priceRef.current.value,
        removedImages,
      });
    } catch (err) {
      throw err.response?.data?.message || "Erro ao salvar.";
    }
  }

  const commitEdit = async (e) => {
    e.preventDefault();

    await toast.promise(handleEdit(), {
      loading: "Alterando...",
      success: <p>Alterações salvas!</p>,
      error: <p>Erro ao salvar.</p>,
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

  const handleRemoveImg = (e) => {
    const removedImg = e.currentTarget.parentNode.querySelector("img");

    removedImg.parentNode.style.display = "none";

    removedImages.push(removedImg.src);

    console.log(removedImages);
  };

  return (
    <div className="edit__container__main">
      <Toaster />
      <ReturnBtn />
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
              maxLength={19}
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
          <div className="preview__container">
            {imovel?.images.map((img, imgId) => {
              return (
                <div className="preview__item">
                  <img src={img} key={imgId} />
                  <div onClick={handleRemoveImg} className="remove__img__btn">
                    ×
                  </div>
                </div>
              );
            })}
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
