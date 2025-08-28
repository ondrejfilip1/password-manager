import { KeyRound } from "lucide-react";
import PasswordItem from "./PasswordItem";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function PasswordGrid(props) {
   return (
      <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {props.passwords.length && props.passwords.length > 0 ? (
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
              {props.passwords.map((value, index) => (
                <PasswordItem {...value} key={index} />
              ))}
            </div>
          ) : (
            <div className="min-h-[100vh] text-muted-foreground flex-1 rounded-xl md:min-h-min text-center justify-center items-center flex">
              {props.isLoaded ? (
                <div className="flex flex-col items-center">
                  <KeyRound className="mb-6 h-12 w-12" />
                  <p>Nemáte žádná uložená hesla</p>
                </div>
              ) : (
                <Spinner variant="ellipsis" />
              )}
            </div>
          )}
        </div>
      </>
   )
}