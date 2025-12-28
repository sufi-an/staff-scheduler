import { 
  Calendar, 
  LayoutDashboard, 
  User, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Landmark, 
  Ticket, 
  PieChart, 
  Award, 
  Settings, 
  Link, 
  MessageSquare, 
  Star
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader, 
} from "@/components/ui/sidebar"

// Menu items matching the ShiftCare image
const items = [
  {
    title: "Recent Releases",
    url: "/releases",
    icon: Star,
    variant: "highlight", 
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Scheduler",
    url: "/schedule",
    icon: Calendar,
    // isActive: true, 
  },
  {
    title: "Staff",
    url: "/staff",
    icon: User,
  },
  // {
  //   title: "Clients",
  //   url: "/clients",
  //   icon: Users,
  // },
  // {
  //   title: "Timesheet",
  //   url: "/timesheet",
  //   icon: FileSpreadsheet,
  // },
  // {
  //   title: "Invoices",
  //   url: "/invoices",
  //   icon: Landmark,
  // },
  // {
  //   title: "Forms",
  //   url: "/forms",
  //   icon: FileText,
  //   badge: "Premium",
  // },
  // {
  //   title: "Incidents",
  //   url: "/incidents",
  //   icon: Ticket,
  //   badge: "Premium",
  // },
  // {
  //   title: "Reports",
  //   url: "/reports",
  //   icon: PieChart,
  // },
  // {
  //   title: "Certifications",
  //   url: "/certifications",
  //   icon: Award,
  //   badge: "New",
  // },
  // {
  //   title: "Account",
  //   url: "/account",
  //   icon: Settings,
  // },
  // {
  //   title: "Integrations",
  //   url: "/integrations",
  //   icon: Link,
  // },
  // {
  //   title: "Messages",
  //   url: "/messages",
  //   icon: MessageSquare,
  // },
]
export function AppSidebar() {
  return (
    <Sidebar>
      {/* Header Section */}
      <div className="bg-[#1e2a5e] p-4">
        <h1 className="text-xl font-bold text-white text-center">ShiftCare</h1>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            
          
            <SidebarMenu className="gap-4"> 
              
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    // isActive={item?.isActive ??}
                    // Keep your existing highlighting logic here
                    className={item.variant === "highlight" ? "bg-emerald-100/50 hover:bg-emerald-100 text-emerald-900 font-medium" : ""}
                  >
                    {/* CHANGE 2: Add 'py-2' and 'px-3' here for internal padding */}
                    <a href={item.url} className="flex justify-between items-center w-full py-4 px-3">
                      
                      <div className="flex items-center gap-3"> {/* Optional: increased gap between icon and text */}
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      
                      {/* {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          item.badge === "New" 
                            ? "bg-blue-600 text-white border-blue-600 rounded-full font-bold" 
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {item.badge}
                        </span>
                      )} */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}