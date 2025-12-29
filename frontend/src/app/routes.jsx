import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import PostDetails from "../pages/PostDetails/PostDetails";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import PostEditor from "../pages/PostEditor/PostEditor";
import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <PostEditor mode="create" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <PostEditor mode="edit" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
