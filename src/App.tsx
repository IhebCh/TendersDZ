import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { TendersList } from "./pages/tenders/TendersList";
import { TenderForm } from "./pages/tenders/TenderForm";
import { TenderDetails } from "./pages/tenders/TenderDetails";
import { SuppliersList } from "./pages/suppliers/SuppliersList";
import { SupplierForm } from "./pages/suppliers/SupplierForm";
import { LoginPage } from "./pages/auth/LoginPage";
import { getAuthToken } from "./api/client";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tenders"
          element={
            <PrivateRoute>
              <TendersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/tenders/new"
          element={
            <PrivateRoute>
              <TenderForm mode="create" />
            </PrivateRoute>
          }
        />
        <Route
          path="/tenders/:id"
          element={
            <PrivateRoute>
              <TenderDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/tenders/:id/edit"
          element={
            <PrivateRoute>
              <TenderForm mode="edit" />
            </PrivateRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <PrivateRoute>
              <SuppliersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/suppliers/new"
          element={
            <PrivateRoute>
              <SupplierForm mode="create" />
            </PrivateRoute>
          }
        />
        <Route
          path="/suppliers/:id/edit"
          element={
            <PrivateRoute>
              <SupplierForm mode="edit" />
            </PrivateRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
