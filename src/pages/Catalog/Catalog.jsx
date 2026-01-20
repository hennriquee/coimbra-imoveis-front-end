import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import ImovelCard from "../../Components/ImovelCard/ImovelCard";
import "./catalog.css";

const Catalog = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true); // estado de carregamento
  const [busca, setBusca] = useState("");

  async function getImoveis() {
    try {
      const response = await api.get("/imoveis");
      setImoveis(response.data);
    } finally {
      setLoading(false); // garante que o loading vai parar mesmo se der erro
    }
  }

  useEffect(() => {
    getImoveis();
  }, []);

  //BUSCA POR TITULO:

  const imoveisFiltrados = useMemo(() => {
    const lowerBusca = busca.toLowerCase();

    return busca === ""
      ? imoveis
      : imoveis.filter((imv) =>
          (imv.title ?? "").toLowerCase().includes(lowerBusca),
        );
  }, [busca, imoveis]);

  return (
    <section className="catalog__main">
      <h1>Catálogo</h1>
      <input
        className="catalog__input__busca"
        type="text"
        placeholder="Pesquisar"
        value={busca}
        onSubmit={(ev) => ev.preventDefault()}
        onChange={(ev) => setBusca(ev.target.value)}
      />
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
