import logoER from "../assets/images/logo.png";

export const qrCodeConfig = {
    fields: [
        { label: "Farmer", key: ["Farmers Name ", "B"] },
        { label: "Registration", key: ["Registration No", "C"] },
        { label: "LF Unit No", key: ["LF UNIT NO", "D"] },
        { label: "Investors", key: ["Inestors Details", "E"] },
        { label: "UE Date", key: ["Unit Established  Date ", "F"] },
        { label: "GPS", key: ["GPS", "G"] },
        { label: "Species", key: [" Species", "H"] },
        { label: "PB(Sum)", key: ["PB Accumilation/Grms(summery)", "Y"] },
        { label: "DCC(Sum)", key: ["Dynamic Carbon Capturing, Grams of C(summery)", "Z"] },
        { label: "O2(Sum)", key: ["O2 Production/Liters(summery)", "AA"] },
        { label: "H2O(Sum)", key: ["H2O Production/Liters(summery)", "AB"] },
        { label: "Performance(2019/2)", key: ["performance  of plants/Units as at date 2019/Feb ", "AD"] },
        { label: "Payment", key: ["Payment ", "AE"] },
        { label: "Performance(2020/2)", key: ["performance  of plants/Units as at date 2020/Feb ", "AF"] },
        { label: "Payment", key: ["Payment _1", "AG"] },
        { label: "Performance(2021/2)", key: ["performance  of plants/Units as at date 2021/Feb ", "AH"] },
        { label: "$ ", key: ["Payment Ammount,$", "AI"] },
        { label: "Rs. ", key: ["In SL Rupies", "AJ"] },
        { label: "Performance(2022/2)", key: ["performance  of plants/Units as at date 2022/Feb ", "AK"] },
        { label: "$ ", key: ["Payment exchange $", "AL"] },
        { label: "Rs.", key: ["In SL Rupies_1", "AM"] },
    ],
    style: {
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
    }
};
