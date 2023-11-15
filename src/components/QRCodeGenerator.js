import React, { useEffect, useRef, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";
import { qrCodeConfig } from "../config/qrcode-config";

function QRCodeGenerator({ qrCodeContent }) {
    const { style } = qrCodeConfig;
    
    // Create a ref to the container where the QR code will be rendered
    const qrCodeContainerRef = useRef(null);

    const createQRCode = useCallback((qrCodeContent) => {
        return new QRCodeStyling({
            ...style,
            data: qrCodeContent,
        });
    }, [style]);

    useEffect(() => {
        // Capture the current value of qrCodeContainerRef
        const currentRef = qrCodeContainerRef.current;

        // Clear previous content if any
        if (currentRef) {
            currentRef.innerHTML = '';
        }

        // Create QR Code and append to DOM
        if (currentRef) {
            createQRCode(qrCodeContent).append(currentRef);
        }

        // Cleanup when component is unmounted
        return () => {
            // Use the captured value in the cleanup function
            if (currentRef) {
                currentRef.innerHTML = '';
            }
        };

    }, [qrCodeContainerRef, qrCodeContent, createQRCode]);

    // Render the container for the QR code
    return <div ref={qrCodeContainerRef}></div>;
}

export default QRCodeGenerator;
