import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientsPage } from "./pages/ClientsPage";
import { SuppliersPage } from "./pages/SuppliersPage";
import { TendersPage } from "./pages/TendersPage";
import { TenderDetailsPage } from "./pages/TenderDetailsPage";
import { RequireAuth } from "./components/RequireAuth";
import { MainLayout } from "./components/MainLayout";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/clients"
            element={
              <RequireAuth>
                <MainLayout>
                  <ClientsPage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/suppliers"
            element={
              <RequireAuth>
                <MainLayout>
                  <SuppliersPage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/tenders"
            element={
              <RequireAuth>
                <MainLayout>
                  <TendersPage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/tenders/:id"
            element={
              <RequireAuth>
                <MainLayout>
                  <TenderDetailsPage />
                </MainLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
