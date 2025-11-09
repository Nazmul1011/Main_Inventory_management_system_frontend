
// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
const isAuthed = () => {
  try { return !!JSON.parse(localStorage.getItem("auth_tokens"))?.access; } catch { return false; }
};
export default ({ children }) => (isAuthed() ? children : <Navigate to="/loguser" replace />);
