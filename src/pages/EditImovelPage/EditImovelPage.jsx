import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./edit-imovel-page.css";
import { Toaster, toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import ReturnBtn from "../../Components/ReturnBtn/ReturnBtn";
import ImageCropModal from "../../Components/ImageCropModal";

const EditImovelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imovel, setImovel] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [maxImages, setMaxImages] = useState(false);

  //CROP IMAGE
  const [imageSrc, setImageSrc] = useState(null);
  const [tempFile, setTempFile] = useState(null);

  const titleRef = useRef();
  const textRef = useRef();
  const priceRef = useRef();

  // Busca do imóvel
  async function getImovel() {
    const data = (await api.get(`/imoveis/${id}`)).data;
    setImovel(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getImovel();
  }, [id]);

  // Atualiza controle de máximo de imagens
  useEffect(() => {
    const totalImages = (imovel?.images?.length || 0) + selectedFiles.length;
    setMaxImages(totalImages >= 12);
  }, [imovel?.images, selectedFiles]);

  // Upload Cloudinary
  const handleUploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_imoveis"); // preset do Cloudinary

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/diyr0pljs/image/upload",
        { method: "POST", body: formData },
      );
      const data = await res.json();

      if (data.secure_url) {
        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1200/",
        );
        return optimizedUrl;
      }

      return null;
    } catch (err) {
      console.error("Erro no upload:", err);
      return null;
    }
  };

  // Envia alterações
  async function handleEdit() {
    try {
      let urls = [];
      if (selectedFiles.length > 0) {
        urls = await Promise.all(
          selectedFiles.map((file) => handleUploadToCloudinary(file)),
        );
      }

      await api.put(`/edit/${imovel.id}`, {
        title: titleRef.current.value,
        text: textRef.current.value,
        price: priceRef.current.value,
        removedImages,
        addedImages: urls,
      });
    } catch (err) {
      console.error("Erro no handleEdit:", err);
      throw err.response?.data?.message || err.message || "Erro ao salvar.";
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
      .then(() => toast.success("ID copiado!"))
      .catch((err) => toast.error("Erro ao copiar: ", err));
  };

  // Remove imagem (antiga ou nova)
  const handleRemoveImg = (imgObj, index) => {
    if (imgObj.isNew) {
      const indexInSelected = index - (imovel?.images?.length || 0);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== indexInSelected));
    } else {
      setRemovedImages((prev) => [...prev, imgObj.url]);
      setImovel((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== imgObj.url),
      }));
    }
  };

  const handleCropConfirm = (croppedFile) => {
    setSelectedFiles((prev) => {
      const total = (imovel?.images?.length || 0) + prev.length;

      if (total >= 12) return prev;

      return [...prev, croppedFile];
    });

    setImageSrc(null);
    setTempFile(null);
  };

  // Adiciona novos arquivos
  // Adiciona novos arquivos (com crop)
  const handleFileAdd = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setTempFile(file);
    };
    reader.readAsDataURL(file);
  };

  // Previews combinados
  const existingImages =
    imovel?.images?.map((img) => ({ url: img, isNew: false })) || [];
  const newPreviews = selectedFiles.map((file) => ({
    url: URL.createObjectURL(file),
    isNew: true,
  }));
  const allImages = [...existingImages, ...newPreviews];

  // Limpar URLs temporárias
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [selectedFiles]);

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

          {allImages.length > 0 && (
            <div className="preview__container">
              {allImages.map((imgObj, index) => (
                <div key={index} className="preview__item">
                  <img src={imgObj.url} alt="" />
                  <div
                    onClick={() => handleRemoveImg(imgObj, index)}
                    className="remove__img__btn"
                  >
                    ×
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            disabled={maxImages}
            multiple
            onChange={handleFileAdd}
          />

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
      {imageSrc && tempFile && (
        <ImageCropModal
          imageSrc={imageSrc}
          file={tempFile}
          onCancel={() => {
            setImageSrc(null);
            setTempFile(null);
          }}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
};

export default EditImovelPage;
