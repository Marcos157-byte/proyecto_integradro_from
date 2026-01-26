import { useNavigate } from "react-router-dom";
import LoginForm from "../components/layout/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSuccess = (rol: string) => {
    console.log("Rol recibido en LoginPage:", rol);

    switch (rol) {
      case "ventas": // 👈 plural
        navigate("/ventas");
        break;
      case "administrador":
        navigate("/admin");
        break;
      case "bodega":
        navigate("/bodega");
        break;
      default:
        navigate("/login");
        break;
    }
  };

  return (
    <div className="login-page">
      
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
}