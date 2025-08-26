export const getURL = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://password-manager-app.onrender.com";
};
