export const MOBILE_BREAKPOINT = 576;

const theme = {
    color: {
        primary: "#1D1D25",
        secondary: "#818181",
        tertiary: "#A4A4AA",
        foreground: "#FDFDFD",
        background: "#EBECF5",
        success: "#00C358",
        info: "#0079F0",
        border: "rgba(164, 164, 170, 0.3)",
        shadow: "rgba(0, 0, 0, 0.1)",
    },
    shadow: {
        small: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        medium: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
        large: "0 8px 16px 0 rgba(0, 0, 0, 0.1)",
        inline: "rgb(0 0 0 / 50%) 0px 10px 24px -14px",
    },
    fontSize: {
        subcaption: "0.75rem", // 12px
        caption: "0.875rem", // 14px
        body: "1rem", // 16px
        title: "1.25rem", // 20px
    },
    fontWeight: {
        normal: "400",
        bold: "800",
    },
    spacing: {
        tiny: "6px",
        small: "12px",
        smedium: "16px",
        medium: "24px",
    },
    media: {
        tablet: "768px",
        mobile: "576px",
    },
    border: {
        small: "4px",
        large: "18px",
    },
};

export default theme;
