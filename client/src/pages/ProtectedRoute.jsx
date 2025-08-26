import { useEffect } from "react";

// for routes that users use but non-users will be redirected to login page
export default function ProtectedRoute({ route }) {
  useEffect(() => {
    if (!localStorage.getItem("token"))
      return window.location.replace("/login");
  }, []);

  return <>{route}</>;
}
