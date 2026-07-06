import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { House, ListChecks, UploadSimple, ChatText, Files, Robot } from "@phosphor-icons/react"
import { Link, useLocation } from "react-router-dom"

const items = [
  {
    title: "Sprachmodell",
    url: "/",
    icon: Robot,
  },
  {
    title: "Diskussion",
    url: "/discussion",
    icon: ChatText,
  },
  {
    title: "Dokumentation",
    url: "/documentation",
    icon: Files,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-text-subinfo">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3 px-4 py-2">
                        <item.icon size={20} weight={isActive ? "fill" : "regular"} className={isActive ? "text-primary" : ""} />
                        <span className={isActive ? "font-semibold" : ""}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
