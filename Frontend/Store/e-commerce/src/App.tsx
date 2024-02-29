import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Products from "./components/Products";
import ProductInfo from "./components/ProductInfo";
import NotFound from "./components/NotFound";
import { Item } from "./utils/types";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Success from "./components/Success";
import { Cart } from "./components/Cart";
import CheckOut from "./components/CheckOut";

function App() {
  return (
    <Provider store={store}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/" element={<Products />} />
        <Route path="/products/:id" element={<ProductInfo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
