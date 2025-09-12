import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import ImovelCard from "../../Components/ImovelCard/ImovelCard";
import "./catalog.css";

const Catalog = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true); // estado de carregamento

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

  return (
    <section className="catalog__main">
      <h1>Catálogo</h1>
      {loading ? (
        <p className="loading__message">Carregando imóveis...</p> // mensagem enquanto busca
      ) : imoveis.length > 0 ? (
        <div className="imoveis">
          {imoveis.map((imovel) => (
            <ImovelCard key={imovel.id} {...imovel} />
          ))}
        </div>
      ) : (
        <p>Nenhum imóvel encontrado.</p> // fallback caso venha vazio
      )}
    </section>
  );
};

export default Catalog;
