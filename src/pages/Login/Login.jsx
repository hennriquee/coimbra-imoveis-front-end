import React, { useRef, useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const formRef = useRef();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState("false");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      const token = res.data.token;

      sessionStorage.setItem("admLogged", token);

      emailRef.current.value = "";
      passwordRef.current.value = "";

      navigate("/adm/cadastro");

      toast.success("Modo Administrador.", {
        style: {
          border: "1px solid #0063F7",
          padding: "16px",
          color: "#0063F7",
        },
        iconTheme: {
          primary: "#0063F7",
          secondary: "#FFFAEE",
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro no login");
    }
  };
  return (
    <div className="login__main">
      <Toaster />
      <div className="login__container">
        <h1>Olá, administrador!</h1>

        <p className="login__text">
          Entre com seu email e senha de administrador.
        </p>
        <form ref={formRef} onSubmit={handleLogin} className="login__form">
          <input required ref={emailRef} type="email" placeholder="E-mail" />
          <div className="password__input">
            <input
              required
              ref={passwordRef}
              type={showPassword ? "password" : "text"}
              placeholder="Senha"
            />
            <FontAwesomeIcon
              onClick={togglePasswordVisibility}
              className="fa__eye"
              icon={showPassword ? faEyeSlash : faEye}
            />
          </div>
          <button type="submit">Login</button>
          <Link to={"/"} className="return__link">
            Retornar ao início
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
