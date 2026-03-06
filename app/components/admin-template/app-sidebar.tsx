

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { items } from "@/admin/admin-menu"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar
      className="border-r-0 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: "rgba(99,102,241,0.25)",
          filter: "blur(50px)",
          transform: "translate(20%, -20%)",
        }}
      />
      <div
        className="absolute bottom-20 left-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "rgba(56,189,248,0.15)",
          filter: "blur(40px)",
          transform: "translateX(-30%)",
        }}
      />

      {/* Header */}
      <SidebarHeader
        className="relative z-10 px-5 py-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(56,189,248,0.85))",
              boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
            }}
          >
            <span className="text-xl font-bold text-white">P</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
              PDAM
            </h2>
            <p className="text-xs" style={{ color: "rgba(165,180,252,0.8)" }}>
              Admin Panel
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="relative z-10 px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel
            className="text-xs font-bold uppercase tracking-widest px-3 mb-3"
            style={{ color: "rgba(165,180,252,0.65)" }}
          >
            Administrator
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-auto p-0 bg-transparent hover:bg-transparent focus:bg-transparent"
                  >
                    <Link href={item.href} className="pdam-nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl w-full">
                      <div className="pdam-nav-icon w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="pdam-nav-label font-medium text-sm">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer version */}
      <div
        className="relative z-10 mx-3 mb-4 p-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="text-xs text-center" style={{ color: "rgba(165,180,252,0.6)" }}>
          PDAM System v2.1.0
        </p>
      </div>

      {/* CSS-only hover — no event handlers needed */}
      <style>{`
        .pdam-nav-link {
          color: rgba(199, 210, 254, 1);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .pdam-nav-icon {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .pdam-nav-icon svg {
          color: rgba(165, 180, 252, 1);
          transition: color 0.18s ease;
        }
        .pdam-nav-label {
          color: rgba(199, 210, 254, 1);
          transition: color 0.18s ease;
        }

        /* Hover state */
        .pdam-nav-link:hover {
          background: rgba(255, 255, 255, 0.13) !important;
          backdrop-filter: blur(8px);
        }
        .pdam-nav-link:hover .pdam-nav-icon {
          background: rgba(99, 102, 241, 0.65) !important;
          border-color: rgba(99, 102, 241, 0.6) !important;
        }
        .pdam-nav-link:hover .pdam-nav-icon svg {
          color: white !important;
        }
        .pdam-nav-link:hover .pdam-nav-label {
          color: white !important;
        }

        /* Active/current page */
        .pdam-nav-link[data-active="true"],
        .pdam-nav-link.active {
          background: rgba(99, 102, 241, 0.25) !important;
          border: 1px solid rgba(99, 102, 241, 0.35);
        }
        .pdam-nav-link[data-active="true"] .pdam-nav-label {
          color: white !important;
        }
      `}</style>
    </Sidebar>
  )
}