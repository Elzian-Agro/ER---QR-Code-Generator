import React, { useEffect, useRef } from "react";
import logoER from "../assets/images/ER LOGO2.png"
import QRCodeStyling from "qr-code-styling";

function QRCodeComponent({ data }) {
    const qrCodeRef = useRef(null);

    useEffect(() => {
        // Clear previous content if any
        qrCodeRef.current.innerHTML = '';

        const currentRef = qrCodeRef.current; // Create a local variable

        const qrCode = new QRCodeStyling({
            width: 200,
            height: 200,
            margin: 3,
            type: "canvas", // Choose 'canvas' or 'svg'
            image: logoER,
            data: data,
            
            backgroundOptions: {
                color: "#FFFFFF",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize: 0.4,
                margin: 1,
            },
            cornersSquareOptions:{
                type: "extra-rounded"

            },
            cornersDotOptions:{
                color: "#0F007F",
                type: "dot"
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
            }
        });

        if (currentRef) {
            qrCode.append(currentRef);
        }

        // Cleanup when component is unmounted
        return () => {
            // Clear content and any other cleanup you may need
            if (currentRef) {
                currentRef.innerHTML = '';
            }
        };
    }, [qrCodeRef, data]);

    return <div ref={qrCodeRef}></div>;
}

export default QRCodeComponent;
