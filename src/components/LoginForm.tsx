import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import logo from "../assets/slogan.svg";
import "../styles/logo.css";

interface LoginFormProps {
  onSuccess: (rol: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await login(email, password);
    console.log("Usuario logueado:", user);

    if (!user) {
      setError("Credenciales inválidas ❌");
      return;
    }

    onSuccess(user.rol.toLowerCase()); // 👈 pasamos el rol normalizado
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Promax Logo" className="logo" />
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Ingresa tu usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Ingresa contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}