import React, { useState, useRef, useEffect } from "react";
import "./register.css";
import { api } from "../../../services/api";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const categoryRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const formRef = useRef();
  const priceRef = useRef();

  const [cities, setCities] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [priceDisabled, setPriceDisabled] = useState(true);

  // PRICE FORMAT
  const [price, setPrice] = useState("");

  const handlePriceChange = (e) => {
    // remove tudo que não é número
    const numericValue = e.target.value.replace(/\D/g, "");

    // converte para reais (duas casas decimais)
    const formattedValue = (Number(numericValue) / 100).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

    setPrice(formattedValue);
  };
  // PRICE FORMAT

  // Buscar cidades na API do IBGE
  async function getCities(uf) {
    if (uf !== "") {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        );
        const data = await response.json();
        setCities(data.map((city) => city.nome));
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    }
  }

  // Upload de imagem no Cloudinary
  const handleUploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_imoveis"); // preset deve existir no Cloudinary

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/diyr0pljs/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        // 👉 adiciona parâmetros de otimização direto na URL
        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1200/"
        );
        return optimizedUrl;
      }

      return null;
    } catch (err) {
      console.error("Erro no upload:", err);
      return null;
    }
  };

  // Seleção de arquivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newFile = files[0];
    setSelectedFiles((prev) => {
      if (prev.length < 4) {
        return [...prev, newFile];
      } else {
        const updated = [...prev];
        updated[updated.length - 1] = newFile;
        return updated;
      }
    });
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      // 1) Faz upload das imagens para Cloudinary
      let urls = [];
      if (selectedFiles.length > 0) {
        urls = await Promise.all(
          selectedFiles.map((file) => handleUploadToCloudinary(file))
        );
      }

      // Envia os dados para o backend

      const payload = {
        category: categoryRef.current.value,
        title: titleRef.current.value,
        state: stateRef.current.value,
        city: cityRef.current.value,
        images: urls,
        text: textRef.current.value,
      };

      // Só adiciona price se tiver valor
      if (
        priceRef.current &&
        priceRef.current.value &&
        priceRef.current.value !== "R$ 0,00"
      ) {
        payload.price = priceRef.current.value;
      } else {
        payload.price = "R$ -";
      }
      await api.post("/imoveis/cadastro", payload);

      // 3) Reset do formulário
      formRef.current.reset();
      priceRef.current.value = "";
      setSelectedFiles([]);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao cadastrar imóvel:", err);
      // relança para o toast.promise capturar
      throw err;
    }
  };

  // Commit com toast.promise
  async function commitImovel(e) {
    e.preventDefault();
    toast.promise(
      handleSubmit(), // retorna a Promise do handleSubmit
      {
        loading: "Cadastrando...",
        success: <p>Cadastro realizado!</p>,
        error: <p>Erro ao cadastrar imóvel.</p>,
      }
    );
  }

  const togglePriceInput = () => {
    setPriceDisabled((prev) => !prev);
  };

  useEffect(() => {
    priceRef.current.value = "";
  }, [priceDisabled]);

  return (
    <section className="register__page">
      <Toaster />
      <div className="register__main">
        <h1>Cadastro de Imóveis</h1>
        <form ref={formRef} className="register__form" onSubmit={commitImovel}>
          <div className="form__container-1">
            <select
              required
              ref={categoryRef}
              className="category__select"
              defaultValue=""
            >
              <option value="" disabled>
                Categoria
              </option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Terreno">Terreno</option>
            </select>
            <select
              required
              onChange={(e) => getCities(e.target.value)}
              ref={stateRef}
              defaultValue=""
            >
              <option value="" disabled>
                Estado
              </option>
              <option value="MG">Minas Gerais</option>
              <option value="SP">São Paulo</option>
            </select>
            <select required ref={cityRef} defaultValue="">
              <option value="" disabled>
                Cidade
              </option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <input
              maxLength={19}
              required
              ref={titleRef}
              type="text"
              placeholder="Título"
            />
            <textarea
              maxLength={500}
              ref={textRef}
              rows={5}
              cols={50}
              placeholder="Texto do anúncio"
            />
            <div className="price__input">
              <input
                onChange={togglePriceInput}
                className="price__input__check"
                type="checkbox"
              />
              <input
                disabled={priceDisabled}
                ref={priceRef}
                type="text"
                placeholder="Preço (R$)"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
            <button type="submit" className="cad__btn">
              Cadastrar
            </button>
          </div>
          {/* Upload de imagens */}
          <div className="form__container-2">
            {selectedFiles.length > 0 && (
              <div className="preview__container">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="preview__item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                    />
                    <button
                      type="button"
                      className="remove__btn"
                      onClick={() => handleRemove(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              required
              className="input__images"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
