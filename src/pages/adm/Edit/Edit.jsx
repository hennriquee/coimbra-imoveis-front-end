import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../services/api";
import "./edit.css";
import { Link, replace } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import "../../../Components/ImovelCard/imovel-card.css";

const Edit = () => {
  const searchRef = useRef();
  const [imovel, setImovel] = useState();
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const cardRef = useRef();

  async function handleSearch(e) {
    e.preventDefault();
    setLoading((prev) => !prev);
    const id = searchRef.current.value;

    try {
      setImovel((await api.get(`/imoveis/${id}`)).data);
      setLoading((prev) => !prev);
    } catch {
      setLoading((prev) => !prev);
      toast.error("ID não encontrado.");
    }
    searchRef.current.value = "";
  }

  const changeCards = (e) => {
    e.preventDefault();
    cardRef.current.classList.toggle("change__card");
    formRef.current.classList.toggle("change__card");
    setShowEdit((prev) => !prev);
  };

  // Edit Container

  const titleRef = useRef();
  const textRef = useRef();
  const priceRef = useRef();
  const formRef = useRef();

  async function handleEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/edit/${imovel.id}`, {
        title: titleRef.current.value,
        text: textRef.current.value,
        price: priceRef.current.value,
      });

      toast.success("Alterações salvas.");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar alterações.");
    }
  }

  async function deleteImovel() {
    await api.delete(`/imoveis/${imovel.id}`);
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        toast.promise(deleteImovel(), {
          loading: "Excluindo...",
          success: <p>Imóvel excluído.</p>,
          error: <p>Erro ao excluir imóvel.</p>,
        });
        window.location.reload();
      } catch (err) {
        toast.error(err.response?.data?.message || "Erro ao excluir imóvel.");
      }
    }
  }

  return (
    <section className="edit__main">
      <Toaster />
      <h1>Edição de Imóveis</h1>
      <form ref={formRef} onSubmit={handleSearch} className="edit__input__id">
        <input required ref={searchRef} type="text" placeholder="ID" />

        <button className="edit__search__btn" type="submit">
          <FontAwesomeIcon
            className="edit__search__icon"
            icon={faMagnifyingGlass}
          />
        </button>
      </form>

      <div className="edit__imovel__card">
        {imovel ? (
          <div ref={cardRef} className="imovel__card">
            <div className="imovel__card__img">
              <img src={imovel.images[0]} alt="sem imagem" />
            </div>

            <div className="imovel__card__content">
              <h5 className="imovel__card__category">{imovel.category}</h5>
              <p className="imovel__card__state">{`${imovel.city}(${imovel.state})`}</p>
              <p className="price">{imovel.price ?? "R$ -"}</p>

              <div className="edit__card_btns">
                <Link onClick={changeCards} className="learn__more__btn">
                  Editar
                </Link>
                <Link onClick={handleDelete} className="trash__btn">
                  <FontAwesomeIcon icon={faTrash} />
                </Link>
              </div>
            </div>
          </div>
        ) : loading ? (
          "Carregando imóvel..."
        ) : (
          <></>
        )}

        {/* Edit Container */}
        {showEdit && (
          <div className="edit__container">
            <Toaster />
            <p className="edit__container__id">ID: {imovel.id}</p>
            <form onSubmit={handleEdit} className="edit__form">
              <div className="edit__input__box">
                <label htmlFor="title">Título:</label>
                <input
                  maxLength={30}
                  ref={titleRef}
                  type="text"
                  name="title"
                  defaultValue={imovel.title}
                />
              </div>
              <div className="edit__input__box">
                <label htmlFor="text">Texto:</label>
                <textarea
                  maxLength={520}
                  ref={textRef}
                  rows={5}
                  cols={50}
                  type="text"
                  name="text"
                  defaultValue={imovel.text}
                />
              </div>
              <div className="edit__input__box">
                <label htmlFor="price">Preço:</label>
                <input
                  ref={priceRef}
                  type="text"
                  name="price"
                  defaultValue={imovel.price}
                />
              </div>
              <div className="edit__container__btns">
                <button onClick={changeCards}>Cancelar</button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default Edit;
