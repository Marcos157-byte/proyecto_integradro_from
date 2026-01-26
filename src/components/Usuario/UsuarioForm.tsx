import { useState } from "react";
import { createUsuario } from "../../services/usuarioService";

export default function RegistroUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    id_empleado: "",
    rolesIds: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm({ ...form, rolesIds: selected });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const usuario = await createUsuario(form);
      console.log("Usuario creado:", usuario);
      alert("Usuario creado correctamente");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
      <input name="id_empleado" placeholder="ID Empleado" onChange={handleChange} />

      <select multiple name="rolesIds" onChange={handleRolesChange}>
        <option value="uuid-del-rol-admin">Administrador</option>
        <option value="uuid-del-rol-ventas">Ventas</option>
        <option value="uuid-del-rol-usuario">Usuario</option>
      </select>

      <button type="submit">Registrar</button>
    </form>
  );
}