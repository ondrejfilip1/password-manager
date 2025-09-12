import { Sun, Moon, UserRound } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import UserDropdown from "./user-dropdown";

export default function ThemeSwitcher(props) {
  const { setTheme, theme } = useTheme();

  const user = {
    name: localStorage.getItem("username") || "Username",
    email: localStorage.getItem("email") || "Email",
    avatar: "",
  };

  return (
    <>
      <div className="fixed right-2 top-2 flex gap-2">
        {props.showAccount && localStorage.getItem("token") && (
          <UserDropdown
            user={user}
            trigger={
              <Button variant="outline" size="icon">
                <UserRound />
              </Button>
            }
          />
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </>
  );
}
