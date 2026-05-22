import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing   from './pages/Landing';
import PetList   from './pages/PetList';
import PetDetail from './pages/PetDetail';
import PetForm   from './pages/PetForm';
import OwnerList from './pages/OwnerList';
import OwnerForm from './pages/OwnerForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                       element={<Landing />} />
        <Route path="/mascotas"               element={<PetList />} />
        <Route path="/mascotas/nueva"         element={<PetForm />} />
        <Route path="/mascotas/:id"           element={<PetDetail />} />
        <Route path="/mascotas/:id/editar"    element={<PetForm />} />
        <Route path="/duenos"                 element={<OwnerList />} />
        <Route path="/duenos/nuevo"           element={<OwnerForm />} />
        <Route path="/duenos/:id/editar"      element={<OwnerForm />} />
      </Routes>
    </BrowserRouter>
  );
}
