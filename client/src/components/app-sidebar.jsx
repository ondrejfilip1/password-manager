import * as React from "react";
import {
  KeyRound,
  Settings,
} from "lucide-react";

import { NavPasswords } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: localStorage.getItem("username") || "Username",
    email: localStorage.getItem("email") || "Email",
    avatar: "",
  },
  passwords: [
    {
      name: "Všechna hesla",
      url: "/dashboard",
      icon: KeyRound,
    },
  ],
    account: [
    {
      name: "Nastavení",
      url: `/dashboard?tab=Nastavení`,
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavPasswords passwords={data.passwords} account={data.account} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
