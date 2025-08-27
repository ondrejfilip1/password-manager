import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Trash, Eye, EyeOff, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { removePassword } from "@/models/Users";

export default function PasswordItem(props) {
  const [showPassword, setShowPassword] = useState(false);

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
      // todo: send event to reload passwords
      alert("deleted successfully");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="truncate">{props.url}</CardTitle>
          <CardDescription className="truncate">
            {props.createdAt}
          </CardDescription>
          <CardAction>
            <Button variant="icon" onClick={removePasswordFunc}>
              <Trash />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="border-input flex relative h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none">
            <span
              className={
                showPassword
                  ? "transition-[filter] duration-[100ms]"
                  : "blur-[4px] select-none"
              }
            >
              {showPassword ? props.password : fakePassword}
            </span>
            <Button
              variant="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          {props.note && (
            <>
              <p className="text-muted-foreground text-sm mt-4 mb-1 flex items-center gap-1"><PenLine className="!h-4" />Poznámka</p>
              <p className="">{props.note}</p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
