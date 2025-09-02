import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme-switcher";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <ThemeSwitcher />
      <div className="min-h-screen flex justify-center text-center items-center flex-col">
        <h1 className="text-7xl leading-tight tracking-tight text-muted-foreground">
          404
        </h1>
        <p className="text-muted-foreground mb-6">Stránka nenalezena</p>
        <Link to="/">
          <Button variant="outline">
            <p>Zpět na hlavní stránku</p>
            <ArrowUpRight />
          </Button>
        </Link>
      </div>
    </>
  );
}
