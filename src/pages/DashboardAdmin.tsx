import { Sidebar } from '../components/Sidebar';
import { SummaryCards } from '../components/SummaryCards';
import { UserTable } from '../components/UserTable';

const cards = [
  { label: 'Usuarios', count: 4 },
  { label: 'Empleados', count: 45 },
  { label: 'Clientes', count: 154 },
  { label: 'Productos', count: 67 },
];

const users = [
  { nombre: 'Juan Endara', id: '1725468973', correo: 'juanendara@tctecnology.com', rol: 'Administrador', estado: 'Activo' },
  { nombre: 'Marcos Criollo', id: '1725468973', correo: 'marcoscriollo@tctecnology.com', rol: 'Ventas', estado: 'Activo' },
  { nombre: 'Juan Jiménez', id: '0801465030', correo: 'juankjimnz@tctecnology.com', rol: 'Bodega', estado: 'Activo' },
];

export default function DashboardAdmin() {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={['Dashboard', 'Usuarios', 'Empleados', 'Clientes', 'Productos', 'Inventario']} />
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center">
          <input type="text" placeholder="Buscar..." className="border p-2 rounded w-1/3" />
          <div className="flex items-center gap-2">
            <img src="/assets/karla.jpg" alt="Karla Jiménez" className="w-10 h-10 rounded-full" />
            <span className="font-semibold">Karla Jiménez</span>
          </div>
        </header>

        <SummaryCards cards={cards} />
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Usuarios</h2>
          <UserTable users={users} />
        </section>
      </main>
    </div>
  );
}