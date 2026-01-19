type User = { nombre: string; id: string; correo: string; rol: string; estado: string };

export function UserTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-indigo-100 text-gray-700">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Identificación</th>
            <th className="p-2 text-left">Correo</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2">{u.rol}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.estado === 'Activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {u.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

