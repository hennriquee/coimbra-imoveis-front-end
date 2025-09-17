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
  const [imoveis, setImoveis] = useState();
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef();
  const formRef = useRef();

  async function getAllImoveis() {
    setImoveis((await api.get("/imoveis")).data);
  }

  useEffect(() => {
    getAllImoveis();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setImoveis([]);
    setLoading((prev) => !prev);
    const id = searchRef.current.value;

    try {
      setSelectedImovel((await api.get(`/imoveis/${id}`)).data);
      setLoading((prev) => !prev);
    } catch {
      setLoading((prev) => !prev);
      toast.error("ID não encontrado.");
    }
    searchRef.current.value = "";
  }

  async function deleteImovel(id) {
    return api.delete(`/imoveis/${id}`);
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await toast.promise(deleteImovel(id), {
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

      <div className="edit__imovel__cards">
        {selectedImovel ? (
          <div key={selectedImovel.id} ref={cardRef} className="imovel__card">
            <div className="imovel__card__img">
              <img src={selectedImovel.images[0]} alt="sem imagem" />
            </div>

            <div className="imovel__card__content">
              <h5 className="imovel__card__category">
                {selectedImovel.category}
              </h5>
              <p className="imovel__card__state">{`${selectedImovel.city}(${selectedImovel.state})`}</p>
              <p className="price">{selectedImovel.price ?? "R$ -"}</p>

              <div className="edit__card_btns">
                <Link
                  to={`/adm/edit/${selectedImovel.id}`}
                  className="black__btn edit__card__btn"
                >
                  Editar
                </Link>
                <Link
                  onClick={() => handleDelete(selectedImovel.id)}
                  className="trash__btn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Link>
              </div>
            </div>
          </div>
        ) : imoveis ? (
          imoveis.map((imovel) => {
            return (
              <div key={imovel.id} ref={cardRef} className="imovel__card">
                <div className="imovel__card__img">
                  <img src={imovel.images[0]} alt="sem imagem" />
                </div>

                <div className="imovel__card__content">
                  <h5 className="imovel__card__category">{imovel.category}</h5>
                  <p className="imovel__card__state">{`${imovel.city}(${imovel.state})`}</p>
                  <p className="price">{imovel.price ?? "R$ -"}</p>

                  <div className="edit__card_btns">
                    <Link
                      to={`/adm/edit/${imovel.id}`}
                      className="edit__card__btn black__btn"
                    >
                      Editar
                    </Link>
                    <Link
                      onClick={() => handleDelete(imovel.id)}
                      className="trash__btn"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : loading ? (
          "Carregando informações..."
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default Edit;
