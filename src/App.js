import "antd/dist/antd.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import PageNotFound from "./Pages/PageNotFound";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { AuthProvider } from "./components/Auth";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Login />} />
            <Route
              path="/login"
              element={
                <RequireAuth>
                  <Login />
                </RequireAuth>
              }
            />
            <Route
              path="/register"
              element={
                <RequireAuth>
                  <Register />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
