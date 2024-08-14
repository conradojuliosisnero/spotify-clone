"use client";
import { CloseEyeSvg, EyeSvg } from "@/data/svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidate, setValidatedPassword] = useState(null);
  const [nameValidate, setValidatedName] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  // router
  const router = useRouter();

  // regular expression to validate password
  const validatePassword = (password) => {
    /* esta expresion regular solo acepta mayusculas, minusculas, numeros y simbolos
      valida que el password tenga al menos una mayuscula, una minuscula, un numero y un simbolo */
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValid = regex.test(password);
    if (!isValid) {
      setValidatedPassword(false);
      setIsError(true);
    } else {
      setValidatedPassword(true);
      setIsError(false);
    }
  };

  // mostra o oculta la password
  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  // validate username
  const validateUserName = (username) => {
    if (username !== "") {
      /* esta expresion regular solo acepta letras y numeros
      con un maximo de 20 caracteres*/
      const regex = /^[a-z\sA-Z0-9]{1,20}$/i;
      const isValid = regex.test(username);
      if (!isValid) {
        setValidatedName(false);
      } else {
        setValidatedName(true);
      }
    }
  };

  useEffect(() => {
    if (password !== "") {
      validatePassword(password);
    }
  }, [password]);

  useEffect(() => {
    if (username !== "") {
      validateUserName(username);
    }
  }, [username]);

  // submit data
  async function handleSubmit(e) {
    e.preventDefault();

    if (username === "" && password === "") {
      setIsError("Rellene los campos para iniciar sesión.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status === "ok") {
        router.push("/");
      } else {
        setIsError("ocurrio un error al iniciar sesión.");
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#121212] text-white">
      <div className="w-full max-w-md p-6 bg-[#1a1a1a] rounded-lg shadow-lg">
        {/* title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Iniciar sesión</h1>
          <p className="text-muted-foreground">
            Ingresa tus credenciales para acceder a{" "}
            <Link
              href="/about"
              style={{ color: "#1db954", textDecoration: "underline" }}
            >
              Spotify Clone.
            </Link>
          </p>
        </div>
        {/* form */}
        <form className="space-y-4 relative" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-muted-foreground"
            >
              Nombre de usuario *
            </label>
            <input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              className={` ${
                nameValidate
                  ? "focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                  : "focus:outline-none focus:ring-2 focus:ring-[#f15252]"
              } w-full px-3 py-2 bg-[#2a2a2a] border-none rounded-md`}
            />
            {username !== "" && !nameValidate && (
              <p className="text-[#f15252] text-sm">
                el nombre no debe de tener caracteres especiales y un maximo de
                20 caracteres
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-muted-foreground"
            >
              Contraseña *
            </label>
            <input
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              className={`${
                passwordValidate
                  ? "focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                  : "focus:outline-none focus:ring-2 focus:ring-[#f15252]"
              } w-full px-3 py-2 bg-[#2a2a2a] border-none rounded-md`}
            />
            {/* Icons for show/hide password */}
            <div
              className="absolute right-2 top-8 cursor-pointer"
              onClick={showPasswordHandler}
            >
              {!showPassword ? (
                <EyeSvg width={28} height={28} />
              ) : (
                <CloseEyeSvg width={28} height={28} />
              )}
            </div>
            {password !== "" && !passwordValidate && (
              <p className="text-[#f15252] text-[12px]">
                La contraseña debe de tener al menos 8 caracteres una mayuscula,
                una minuscula, un numero y un simbolo
              </p>
            )}
          </div>

          {isError && <p className="text-[#f15252] text-[12px]">{isError}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-[#1db954]"
            onClick={() => ""}
          >
            {isLoading ? "Iniciando Sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:underline"
          >
            Olvidaste la contraseña?
          </Link>
          <span className="mx-2 text-muted-foreground">·</span>
          <Link
            href="/register"
            className="text-sm text-muted-foreground hover:underline"
          >
            Crear una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
