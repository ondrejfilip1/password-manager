import { ThemeProvider } from "./components/theme-provider";
import AppRoutes from "./pages/AppRoutes";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  );
}
