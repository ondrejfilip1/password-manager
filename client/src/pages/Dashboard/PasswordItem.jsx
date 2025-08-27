import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { CopyButton } from "@/components/animate-ui/buttons/copy";
import {
  Trash,
  Eye,
  EyeOff,
  PenLine,
  Globe,
  Clipboard,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { removePassword } from "@/models/Users";
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PasswordItem(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showFavicon, setShowFavicon] = useState(true);

  const randomTextGenerator = (length) => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_*";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [fakePassword] = useState(() =>
    randomTextGenerator(props.password.length)
  );

  const removePasswordFunc = async () => {
    const data = await removePassword(
      { email: localStorage.getItem("email") },
      props._id
    );

    if (data.status === 200) {
      window.dispatchEvent(new Event("updatePasswords"));
      // todo: send event to reload passwords
      // alert("deleted successfully");
    }
  };

  const checkFavicon = (e) => {
    if (e.target.naturalWidth === 16 && e.target.naturalHeight === 16)
      setShowFavicon(false);
  };

  return (
    <>
      <Card className="relative group">
        <CardHeader>
          <CardTitle className="truncate pb-0.5">{props.url}</CardTitle>
          <CardDescription className="truncate flex items-center gap-1">
            <CalendarClock className="!h-4" />
            {"Přidáno " +
              moment(props.createdAt).locale("cz").format("DD.MM.YYYY HH:mm")}
          </CardDescription>
          <CardAction>
            {showFavicon ? (
              <img
                className="rounded-sm group-hover:hidden"
                src={`https://www.google.com/s2/favicons?domain_url=${props.url}&sz=32`}
                alt="favicon"
                height={28}
                width={28}
                onLoad={checkFavicon}
              />
            ) : (
              <Globe className="group-hover:hidden h-[28px] w-[28px]" />
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="icon"
                  className="!px-2.5 hidden group-hover:block hover:bg-muted relative bottom-1 left-1"
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Opravdu chcete smazat heslo?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce nelze vrátit zpět.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zavřít</AlertDialogCancel>
                  <AlertDialogAction onClick={removePasswordFunc}>
                    Smazat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="border-input flex relative h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none">
            <span
              className={
                (showPassword
                  ? "transition-[filter] duration-[100ms]"
                  : "blur-[4px] select-none") + " truncate"
              }
            >
              {showPassword ? props.password : fakePassword}
            </span>
            <div className="flex absolute right-0 top-1/2 transform -translate-y-1/2">
              {showPassword && (
                <CopyButton
                  content={props.password}
                  variant="ghost"
                  className="!px-2.5 h-9 w-9"
                  delay={1500}
                >
                  <Clipboard />
                </CopyButton>
              )}
              <Button
                variant="ghost"
                className="!px-2.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
          {props.note && (
            <>
              <p className="text-muted-foreground text-sm mt-4 flex items-center gap-1">
                <PenLine className="!h-4" />
                Poznámka:{" "}
                {props.note}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
