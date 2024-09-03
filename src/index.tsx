import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import "./index.css";
import { AuthProvider } from "views/auth/AuthContext";
import { store } from "app/store";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));


/* Para debug de REDUX EN CONSOLA */
declare global {
  interface Window {
    store: typeof store;
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.store = store;
}

/* BORRAR LO DE DEBUG DE REDUX EN CONSOLA */

root.render(
<Provider store={store}>
  <BrowserRouter>
    <ChakraProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </BrowserRouter>
</Provider>
);
