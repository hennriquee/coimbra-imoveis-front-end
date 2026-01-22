import Cropper from "react-easy-crop";
import { useState } from "react";
import { getCroppedImage } from "../utils/cropImage";
import "../pages/adm/Register/imagecrop-modal.css";

const ImageCropModal = ({ imageSrc, file, onCancel, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleConfirm = async () => {
    const blob = await getCroppedImage(imageSrc, croppedAreaPixels);

    const croppedFile = new File([blob], file.name, {
      type: "image/jpeg",
    });

    onConfirm(croppedFile);
  };

  return (
    <div className="crop__modal">
      <div className="crop__container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        />

        <div className="crop__actions">
          <button className="cancelCropImage cropBtn" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirmCropImage cropBtn" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
