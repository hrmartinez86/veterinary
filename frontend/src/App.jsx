import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import UserForm       from './pages/UserForm';
import PetList        from './pages/PetList';
import PetDetail      from './pages/PetDetail';
import PetForm        from './pages/PetForm';
import OwnerList      from './pages/OwnerList';
import OwnerForm      from './pages/OwnerForm';
import RequireAuth    from './components/RequireAuth';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Requiere sesión, permite mustChangePassword (para poder cambiarla) */}
          <Route element={<RequireAuth enforcePasswordChange={false} />}>
            <Route path="/cambiar-contrasena" element={<ChangePassword />} />
          </Route>

          {/* Requiere sesión completa (sin mustChangePassword) */}
          <Route element={<RequireAuth />}>
            <Route path="/mascotas" element={<PetList />} />
            <Route path="/mascotas/nueva" element={<PetForm />} />
            <Route path="/mascotas/:id" element={<PetDetail />} />
            <Route path="/mascotas/:id/editar" element={<PetForm />} />
            <Route path="/duenos" element={<OwnerList />} />
            <Route path="/duenos/nuevo" element={<OwnerForm />} />
            <Route path="/duenos/:id/editar" element={<OwnerForm />} />
            <Route path="/usuarios/nuevo" element={<UserForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
