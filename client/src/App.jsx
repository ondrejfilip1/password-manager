import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "./pages/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { ActiveThemeProvider } from "@/components/active-theme";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ActiveThemeProvider initialTheme="default" storageKey="shadcn-ui-theme">
        <AppRoutes />
        <Toaster
          closeButton
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "font-inter !text-sm !h-[55px]",
              closeButton:
                "dark:hover:!bg-[#1f1f1f] hover:!bg-[#f2f2f2] hover:!border-[#e5e5e5] dark:hover:!border-[#404040] ",
            },
          }}
        />
      </ActiveThemeProvider>
    </ThemeProvider>
  );
}
