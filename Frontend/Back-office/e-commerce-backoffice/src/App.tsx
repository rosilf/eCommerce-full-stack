import React from "react";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Products from "./components/Products";
import NotFound from "./components/NotFound";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, Routes } from "react-router-dom";
import ProductForm from "./components/ProductForm";
import Orders from "./components/Orders";

function App() {
  return (
    <Provider store={store}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/" element={<Products />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/orders/" element={<Orders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
