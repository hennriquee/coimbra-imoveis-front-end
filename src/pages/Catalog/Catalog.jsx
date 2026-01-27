import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../services/api";
import ImovelCard from "../../Components/ImovelCard/ImovelCard";
import "./catalog.css";

const Catalog = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true); // estado de carregamento
  const [busca, setBusca] = useState("");
  const [filterCat, setFilterCat] = useState("");

  async function getImoveis() {
    try {
      const response = await api.get("/imoveis");
      setImoveis([...response.data].reverse());
    } finally {
      setLoading(false); // garante que o loading vai parar mesmo se der erro
    }
  }

  useEffect(() => {
    getImoveis();
  }, []);

  function formatText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  //BUSCA POR TITULO:

  const imoveisFiltrados = useMemo(() => {
    if (!imoveis) return [];

    const lowerBusca = formatText(busca.toLowerCase());

    return imoveis.filter((imv) => {
      const matchBusca = formatText(imv.title ?? "")
        .toLowerCase()
        .includes(lowerBusca);

      const matchCategoria = filterCat === "" || imv.category === filterCat;

      return matchBusca && matchCategoria;
    });
  }, [busca, imoveis, filterCat]);

  //FILTRO POR CATEGORIA:

  const categoriasUnicas = useMemo(() => {
    if (!imoveis) return [];

    return [...new Set(imoveis.map((imv) => imv.category))];
  }, [imoveis]);

  return (
    <section className="catalog__main">
      <h1>Catálogo</h1>

      <div className="filter__container">
        <form
          className="catalog__search__form"
          onSubmit={(e) => {
            e.preventDefault();
            inputBuscaRef.current?.blur(); // fecha teclado no mobile
          }}
        >
          <input
            className="catalog__input__busca"
            type="search"
            placeholder="Pesquisar"
            value={busca}
            onChange={(ev) => setBusca(ev.target.value)}
          />
        </form>
        <select
          value={filterCat}
          onChange={(ev) => setFilterCat(ev.target.value)}
          className="catalog__category__filter"
        >
          <option value="">Todos</option>
          {categoriasUnicas.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading__message">Carregando imóveis...</p> // mensagem enquanto busca
      ) : imoveis.length > 0 ? (
        <div className="imoveis">
          {imoveisFiltrados.map((imovel) => (
            <ImovelCard key={imovel.id} {...imovel} />
          ))}
        </div>
      ) : (
        <p className="catalog__fallback">Nenhum imóvel encontrado.</p> // fallback caso venha vazio
      )}
    </section>
  );
};

export default Catalog;
