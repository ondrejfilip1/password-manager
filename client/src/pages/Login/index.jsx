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
import { login, verifyOTP } from "@/models/Users";
import ThemeSwitcher from "@/components/theme-switcher";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { MailWarning } from "lucide-react";
import Countdown from "react-countdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Login() {
  const [formData, setFormData] = useState();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [minuteAhead, setMinuteAhead] = useState();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await login(formData);
    if (data.status === 200) {
      setShowOTP(true);
      setEmail(formData.email);
      setMessage("");
      setFormData();
      // OTP expiration
      setMinuteAhead(Date.now() + 60000);
    } else {
      setMessage(data.message);
    }
    setIsLoading(false);
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await verifyOTP({ otp: formData });
    if (data.status === 200) {
      localStorage.removeItem("otpToken");
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
      <div className="flex justify-center items-center min-h-screen mx-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">
              {showOTP ? "Dvoufázová verifikace" : "Přihlášení k účtu"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showOTP ? (
              <form onSubmit={handleOTP}>
                <div className="flex flex-col gap-6 justify-center items-center text-center">
                  <MailWarning className="text-muted-foreground h-8 w-8" />
                  <p className="text-sm">
                    Na váš email <span className="underline">{email}</span> jsme
                    Vám zaslali verifikační kód
                  </p>
                  <InputOTP
                    maxLength={6}
                    value={formData}
                    onChange={(value) => setFormData(value)}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-center text-sm">
                    <Countdown
                      date={minuteAhead}
                      renderer={(props) => (
                        <>
                          {props.minutes}:
                          {props.seconds.toString().padStart(2, "0")}
                        </>
                      )}
                      onComplete={() => window.location.replace("/login")}
                    />
                  </p>
                  {message && (
                    <p className="text-center text-red-500 opacity-50 text-sm">
                      {message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading || !formData || formData.length !== 6}
                    className="w-full"
                  >
                    {isLoading ? <Spinner variant="ellipsis" /> : "Ověřit"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
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
                    <div className="flex items-center">
                      <Label htmlFor="password">Heslo</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Link
                            to="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Zapomněli jste heslo?
                          </Link>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Zapomněli jste heslo?</DialogTitle>
                            <DialogDescription>
                              <p className="my-4">
                                Vaše heslo u nás neukládáme, máme jen jeho
                                zašifrovaný otisk (hash).
                              </p>
                              <p>
                                Proto jej bohužel nemůžeme obnovit ani poslat
                                zpět. Pokud jste heslo zapomněli, vytvořte si
                                prosím nový účet s jiným heslem.
                              </p>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      maxLength={64}
                      minLength={8}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner variant="ellipsis" />
                    ) : (
                      "Přihlásit se"
                    )}
                  </Button>
                </div>

                <p className="text-center text-red-500 opacity-50 text-sm mt-2">
                  {message}
                </p>
              </form>
            )}
          </CardContent>
          {!showOTP && (
            <CardFooter className="flex-col gap-2">
              <span className="text-sm">Nemáte ještě účet?</span>
              <Link to="/register">
                <Button variant="link" className="p-0 font-normal">
                  Zaregistrujte se
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
}
