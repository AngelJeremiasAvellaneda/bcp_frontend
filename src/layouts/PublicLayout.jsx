/**
 * PublicLayout — Para páginas públicas (landing, productos, nosotros, etc.)
 * Las páginas públicas ya incluyen su propio Navbar + Footer internamente,
 * por lo que este layout solo provee el contenedor semántico.
 * Si en el futuro se centraliza, cambiar aquí sin tocar cada página.
 */
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="bg-theme text-theme min-h-screen">
      <Outlet />
    </div>
  );
}
