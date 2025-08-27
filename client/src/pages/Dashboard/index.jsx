import { AppSidebar } from "@/components/app-sidebar";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordItem from "./PasswordItem";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { addPassword, getPasswords } from "@/models/Users";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [breadcrumb, setBreadcrumb] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setBreadcrumb(searchParams.size === 0 ? "" : searchParams.get("tab"));
    load();
  }, []);

  const [passwords, setPasswords] = useState([]);

  const load = async () => {
    const data = await getPasswords({ email: localStorage.getItem("email") });

    if (data.status === 200) setPasswords(data.user);
    //console.log(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const addPasswordFunc = async (e) => {
    e.preventDefault();
    const data = await addPassword(formData);

    if (data.status === 200) {
      setFormData({});
      setPasswords(data.user);
      /*
      console.log(data)
      alert("success wow!");
      */
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-between items-center gap-2 w-full pr-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Password manager</BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumb && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Přidat heslo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Přidat heslo</DialogTitle>
                  <DialogDescription>
                    Zadejte všechny povinné údaje.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addPasswordFunc}>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="url">URL adresa</Label>
                      <Input
                        type="url"
                        id="url"
                        name="url"
                        required
                        placeholder="https://example.com"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Heslo</Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="note">Poznámka</Label>
                        <p className="text-sm text-muted-foreground">
                          Nepovinné
                        </p>
                      </div>
                      <Input
                        type="text"
                        id="note"
                        name="note"
                        
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Zavřít</Button>
                    </DialogClose>
                    <Button type="submit">Uložit heslo</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {passwords.length > 0 ? (
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
              {passwords.map((value, index) => (
                <PasswordItem {...value} key={index} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min text-center justify-center items-center flex">
              Nemáte žádná uložená hesla
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
