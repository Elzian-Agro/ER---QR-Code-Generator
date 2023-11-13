import React, { useEffect, useRef } from "react";
import createQRCode from "../config/qrcode-config";

function QRCodeComponent({ qrCodeContent }) {
    // Create a ref to the container where the QR code will be rendered
    const qrCodeContainerRef = useRef(null);

    useEffect(() => {
        // Clear previous content if any
        qrCodeContainerRef.current.innerHTML = '';

        // Create QR Code and append to DOM
        if (qrCodeContainerRef.current) {
            createQRCode(qrCodeContent).append(qrCodeContainerRef.current);
        }

        // Cleanup when component is unmounted
        return () => {
            // Clear content and any other cleanup you may need
            if (qrCodeContainerRef.current) {
                qrCodeContainerRef.current.innerHTML = '';
            }
        };
    }, [qrCodeContainerRef, qrCodeContent]);

    // Render the container for the QR code
    return <div ref={qrCodeContainerRef}></div>;
}

export default QRCodeComponent;
