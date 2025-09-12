import { useSidebar } from "./ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { LogOut, UserRound, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "./ui/alert-dialog";

export default function UserDropdown(props) {
  const { isMobile } = props.isSidebar ? useSidebar() : false;

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    window.location.replace("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg " +
          (props.isSidebar ? "" : "mt-2")
        }
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={props.isSidebar ? 4 : 8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={props.user.avatar} alt={props.user.name} />
              <AvatarFallback className="rounded-lg">
                <UserRound className="p-0.5" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{props.user.name}</span>
              <span className="truncate text-xs">{props.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={`/dashboard?tab=Nastavení`}>
            <DropdownMenuItem>
              <Settings />
              Nastavení
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <LogOut />
              Odhlásit se
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Opravdu se chcete odhlásit?</AlertDialogTitle>
              <AlertDialogDescription>
                Po odhlášení se můžete znovu přihlásit.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zavřit</AlertDialogCancel>
              <AlertDialogAction onClick={logOut}>
                Odhlásit se
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
