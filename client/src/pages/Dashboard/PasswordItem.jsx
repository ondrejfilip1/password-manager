import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Trash, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="truncate">{props.url}</CardTitle>
          <CardDescription className="truncate">
            {props.createdAt}
          </CardDescription>
          <CardAction>
            <Button variant="icon">
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
              {showPassword
                ? props.password
                : fakePassword}
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
              <p className="text-muted-foreground text-sm mt-4">Poznámka</p>
              <p className="">{props.note}</p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
