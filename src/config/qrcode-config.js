import logoER from "../assets/images/logo.png";
import QRCodeStyling from "qr-code-styling";

const qrCodeConfig = {
    width: 200,
    height: 200,
    margin: 3,
    type: "canvas", // Choose 'canvas' or 'svg'
    image: logoER,
    backgroundOptions: {
        color: "#FFFFFF",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        imageSize: 0.4,
        margin: 1,
    },
    cornersSquareOptions: {
        type: "extra-rounded",
    },
    cornersDotOptions: {
        color: "#0F007F",
        type: "dot",
    },
    dotsOptions: {
        color: "#222222", // Base color
        gradient: {
        type: "linear", // or "radial"
        rotation: 0, // Angle in degrees (for linear gradient)
        colorStops: [
            { offset: 0, color: "#4267b2" }, // Start color at position 0
            { offset: 1, color: "#11AA00" }, // End color at position 1
        ],
        },
    },
};

const createQRCode = (qrCodeContent) => {
  return new QRCodeStyling({
    ...qrCodeConfig,
    data: qrCodeContent,
  });
};

export default createQRCode;
