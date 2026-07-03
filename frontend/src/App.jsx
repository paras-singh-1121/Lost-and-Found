import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import ChatsPage from "./pages/ChatsPage";
// import ViewItems from "./pages/ViewItems";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import FoundItems from "./pages/FoundItems";
import LostItems from "./pages/LostItems";
import ItemClaims from "./pages/ItemClaims";

import { useAuthStore } from "./store/useAuthStore";

export default function App() {

  const {
    authUser,
    checkAuth,
    isCheckingAuth,
  } = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }


  return (
    <BrowserRouter>

      <Navbar />

      <div className="pt-16 pb-10">

        <Routes>

          <Route
            path="/login"
            element={
              !authUser
                ? <Login />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/register"
            element={
              !authUser
                ? <Register />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

         <Route
            path="/chats"
            element={
              <PrivateRoute>
                <ChatsPage />
              </PrivateRoute>
            }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

          {/* <Route
            path="/view-items"
            element={
              <PrivateRoute>
                <ViewItems />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/report-lost-item"
            element={
              <PrivateRoute>
                <ReportLost />
              </PrivateRoute>
            }
          />

          <Route
            path="/report-found-item"
            element={
              <PrivateRoute>
                <ReportFound />
              </PrivateRoute>
            }
          />

          <Route
            path="/found-items"
            element={
              <PrivateRoute>
                <FoundItems />
              </PrivateRoute>
            }
          />

          <Route
            path="/lost-items"
            element={
              <PrivateRoute>
                <LostItems />
              </PrivateRoute>
            }
          />

          <Route
            path="/claims/:itemId"
            element={
              <PrivateRoute>
                <ItemClaims />
              </PrivateRoute>
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}