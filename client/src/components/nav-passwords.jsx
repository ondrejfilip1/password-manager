import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function NavPasswords({ passwords: passwords, account: account }) {
  return (
    <div>
      <SidebarGroup
        className="pb-1" /*className="group-data-[collapsible=icon]:hidden"*/
      >
        <SidebarGroupLabel className="pointer-events-none">
          Hesla
        </SidebarGroupLabel>
        <SidebarMenu>
          {passwords.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup
        className="pt-1" /*className="group-data-[collapsible=icon]:hidden"*/
      >
        <SidebarGroupLabel className="pointer-events-none">
          Účet
        </SidebarGroupLabel>
        <SidebarMenu>
          {account.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
