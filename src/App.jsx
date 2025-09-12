import { useState } from "react";
import Catalog from "./pages/Catalog/Catalog";
import Register from "./pages/adm/Register/Register";
import Edit from "./pages/adm/Edit/Edit";
import Header from "./Components/Header/Header";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Contact from "./pages/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import ImovelPage from "./pages/ImovelPage/ImovelPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalogo/imovel/:id" element={<ImovelPage />} />

        {/* Protegidas */}
        <Route
          path="/adm/cadastro"
          element={
            <PrivateRoute>
              <Register />
            </PrivateRoute>
          }
        />

        <Route
          path="/adm/edit"
          element={
            <PrivateRoute>
              <Edit />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
