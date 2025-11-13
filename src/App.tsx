import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { TendersList } from "./pages/tenders/TendersList";
import { TenderForm } from "./pages/tenders/TenderForm";
import { TenderDetails } from "./pages/tenders/TenderDetails";
import { SuppliersList } from "./pages/suppliers/SuppliersList";
import { SupplierForm } from "./pages/suppliers/SupplierForm";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tenders" element={<TendersList />} />
        <Route path="/tenders/new" element={<TenderForm mode="create" />} />
        <Route path="/tenders/:id" element={<TenderDetails />} />
        <Route path="/tenders/:id/edit" element={<TenderForm mode="edit" />} />
        <Route path="/suppliers" element={<SuppliersList />} />
        <Route path="/suppliers/new" element={<SupplierForm mode="create" />} />
        <Route
          path="/suppliers/:id/edit"
          element={<SupplierForm mode="edit" />}
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
