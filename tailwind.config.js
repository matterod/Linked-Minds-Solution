/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#2563eb",
                "background-light": "#f8fafc",
                "background-dark": "#0f172a",
                "card-light": "#ffffff",
                "card-dark": "#1e293b",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1.5rem",
            },
        },
    },
    plugins: [],
}
