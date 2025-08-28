import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  User, 
  Globe, 
  Bot, 
  Package, 
  Settings,
  Sparkles
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Avatar Creator",
    url: createPageUrl("AvatarCreator"),
    icon: User,
  },
  {
    title: "World",
    url: createPageUrl("World"),
    icon: Globe,
  },
  {
    title: "Companion",
    url: createPageUrl("Companion"),
    icon: Bot,
  },
  {
    title: "Inventory",
    url: createPageUrl("Inventory"),
    icon: Package,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <style>
          {`
            :root {
              --primary: #8b5cf6;
              --primary-foreground: #ffffff;
              --secondary: #1e293b;
              --secondary-foreground: #e2e8f0;
              --muted: #0f172a;
              --muted-foreground: #64748b;
              --accent: #06b6d4;
              --destructive: #ef4444;
              --border: rgba(139, 92, 246, 0.2);
              --input: rgba(30, 41, 59, 0.5);
              --ring: #8b5cf6;
              --background: #0f172a;
              --foreground: #f8fafc;
              --card: rgba(30, 41, 59, 0.3);
              --card-foreground: #f8fafc;
              --popover: rgba(15, 23, 42, 0.95);
              --popover-foreground: #f8fafc;
            }
            
            * {
              scrollbar-width: thin;
              scrollbar-color: #8b5cf6 transparent;
            }
            
            *::-webkit-scrollbar {
              width: 8px;
            }
            
            *::-webkit-scrollbar-track {
              background: transparent;
            }
            
            *::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #8b5cf6, #06b6d4);
              border-radius: 4px;
            }
            
            .glow-border {
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
              border: 1px solid rgba(139, 92, 246, 0.5);
            }
            
            .hologram {
              background: rgba(30, 41, 59, 0.3);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(139, 92, 246, 0.3);
            }
            
            .neon-glow {
              text-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6;
            }
            
            .cyber-grid {
              background-image: 
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
              background-size: 20px 20px;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
          <SidebarHeader className="border-b border-purple-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white neon-glow text-lg">NexusRealm</h2>
                <p className="text-xs text-purple-300">Immersive AI World</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300 rounded-lg mb-1 border border-transparent hover:border-purple-500/30 ${
                          location.pathname === item.url ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 glow-border' : 'text-slate-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">Player</p>
                <p className="text-xs text-purple-300 truncate">Level 1 Explorer</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-slate-900/30 border-b border-purple-500/20 px-6 py-4 md:hidden backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-purple-500/20 p-2 rounded-lg transition-colors duration-200 text-white" />
              <h1 className="text-xl font-semibold text-white neon-glow">NexusRealm</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto cyber-grid">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
