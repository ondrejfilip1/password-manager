import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { register } from "@/models/Users";
import ThemeSwitcher from "@/components/theme-switcher";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Register() {
  const [formData, setFormData] = useState();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const postForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await register(formData);
    if (data.status === 200) {
      window.location.replace("/dashboard");
    } else {
      setMessage(data.message);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      <ThemeSwitcher />
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Registrace účtu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={postForm}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Uživatelské jméno</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Vaše jméno"
                    required
                    maxLength={64}
                    minLength={3}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@example.com"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Heslo</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    maxLength={64}
                    minLength={8}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password2">Zopakujte heslo</Label>
                  <Input
                    id="password2"
                    type="password"
                    required
                    maxLength={64}
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner variant="ellipsis" />
                  ) : (
                    "Zaregistrovat se"
                  )}
                </Button>
              </div>
              <p className="text-center text-red-500 opacity-50 text-sm mt-2">
                {message}
              </p>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <span className="text-sm">Máte již účet?</span>
            <Link to="/login">
              <Button variant="link" className="p-0 font-normal">
                Přihlašte se
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
