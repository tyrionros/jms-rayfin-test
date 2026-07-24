import { useState } from 'react';
import { type AuthUser } from '@/services/IAuthService';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  id: string;
  isSpecial?: boolean;
  color?: string;
  submenu?: MenuItem[];
}

const icons = {
  menu: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  home: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
    </svg>
  ),
  digitaltwin: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2m6-2v2M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3m0 2V3m0 11h4m-4 0h4m0 0h4" />
    </svg>
  ),
  livedata: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  reports: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  projects: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-5 9 5m-9 5v6m-6-6v6m12-6v6" />
    </svg>
  ),
  sale: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  finance: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  property: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    </svg>
  ),
  modules: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  connect: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  logout: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  stream: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m0 0H3m12 0V4m0 10v6m0-6H3a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" />
    </svg>
  ),
  nvidia: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      {/* Nvidia stylized N logo */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2V9h2v8zm4-8h2v8h-2v-8zm4 4h-2v4h-2v-4h-2v-2h6v6z" />
    </svg>
  ),
  hemyx: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  ai: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  ),
};

interface SidebarProps {
  onNavigate?: (itemId: string) => void;
  onLogout?: () => void;
  user?: AuthUser | null;
}

export function Sidebar({ onNavigate, onLogout, user }: SidebarProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  const menuItems: MenuItem[] = [
    {
      name: 'Menu',
      icon: icons.menu,
      id: 'menu',
      isSpecial: true,
    },
    {
      name: 'Home',
      icon: icons.home,
      id: 'home',
    },
    {
      name: 'Hemy AI',
      icon: icons.ai,
      id: 'hemyai',
    },
    {
      name: 'Digital Twin',
      icon: icons.digitaltwin,
      id: 'digitaltwin',
      submenu: [
        {
          name: 'Omniverse',
          icon: icons.nvidia,
          id: 'omniverse',
        },
      ],
    },
    {
      name: 'Hemy Live Data & BMS',
      icon: icons.livedata,
      id: 'hemlivedata',
    },
    {
      name: 'Reports & Data',
      icon: icons.reports,
      id: 'reports',
      submenu: [
        {
          name: 'Hemy Reports',
          icon: icons.reports,
          id: 'hemyreports',
        },
        {
          name: 'Hemy Data',
          icon: icons.livedata,
          id: 'hemydata',
        },
      ],
    },
    {
      name: 'Hemy X',
      icon: icons.hemyx,
      id: 'hemyx',
    },
    {
      name: 'Hemy Projects',
      icon: icons.projects,
      id: 'hemyprojects',
    },
    {
      name: 'Hemy Sale',
      icon: icons.sale,
      id: 'hemysale',
    },
    {
      name: 'Hemy Finance',
      icon: icons.finance,
      id: 'hemyfinance',
    },
    {
      name: 'Property Information',
      icon: icons.property,
      id: 'property',
    },
    {
      name: 'Hemy Modules',
      icon: icons.modules,
      id: 'hemymodules',
      submenu: [
        {
          name: 'Hemy Fire',
          icon: icons.modules,
          id: 'hemyfire',
        },
        {
          name: 'Hemy HSE',
          icon: icons.modules,
          id: 'hemyhse',
        },
        {
          name: 'Hemy ESG',
          icon: icons.modules,
          id: 'hemyesg',
        },
        {
          name: 'Hemy Documents',
          icon: icons.modules,
          id: 'hemydocuments',
        },
        {
          name: 'Hemy - Lease Management',
          icon: icons.modules,
          id: 'hemylease',
        },
        {
          name: 'Hemy Organization System Architecture',
          icon: icons.modules,
          id: 'hemyosarch',
        },
      ],
    },
    {
      name: 'Hemy Connect',
      icon: icons.connect,
      id: 'hemyconnect',
    },
    {
      name: 'Log Out',
      icon: icons.logout,
      id: 'logout',
      isSpecial: true,
      color: 'red',
    },
  ];

  const handleItemClick = (index: number, item: MenuItem) => {
    if (index === 0) {
      setExpanded(!expanded);
      return;
    }

    if (item.id === 'logout') {
      onLogout?.();
      return;
    }

    setActive(index);
    onNavigate?.(item.id);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#021838] transition-all duration-300 ${
        expanded ? 'w-56' : 'w-20'
      } shadow-lg z-50 flex flex-col`}
    >
      {/* Scrollable menu items */}
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isMiddle = index !== 0 && index !== menuItems.length - 1;
          const isHovered = hovered === index;
          const isActive = active === index;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSubmenuOpen = expandedSubmenu === item.id;

          return (
            <div key={index} className="relative">
              <div
                className={`flex items-center ${expanded ? 'justify-start' : 'justify-center'} gap-4 px-4 py-4 cursor-pointer transition-all duration-200 ${
                  isMiddle && isHovered ? 'bg-[#0D2E5C]' : ''
                } ${isActive && isMiddle ? 'bg-[#7C4D2F] border-l-4 border-[#9B6240]' : ''}`}
                onMouseEnter={() => isMiddle && setHovered(index)}
                onMouseLeave={() => isMiddle && setHovered(null)}
                onClick={() => {
                  // Menu toggle (first item)
                  if (index === 0) {
                    setExpanded(!expanded);
                    return;
                  }

                  // Submenu items
                  if (hasSubmenu) {
                    if (expanded) {
                      // If expanded, toggle submenu inline
                      setExpandedSubmenu(isSubmenuOpen ? null : item.id);
                    } else {
                      // If collapsed, expand sidebar and open submenu
                      setExpanded(true);
                      setExpandedSubmenu(item.id);
                    }
                    return;
                  }

                  // Regular menu items - navigate and collapse
                  handleItemClick(index, item);
                  setExpanded(false);
                }}
              >
                <div
                  className={`flex-shrink-0 transition-colors ${
                    isActive && isMiddle
                      ? 'text-[#FAF8F2]'
                      : isHovered && isMiddle
                        ? 'text-[#FAF8F2]'
                        : item.color === 'red'
                          ? 'text-red-400'
                          : 'text-[#C4956A]'
                  }`}
                >
                  {item.icon}
                </div>

                {expanded && (
                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={`whitespace-nowrap text-sm font-medium transition-colors ${
                        isActive && isMiddle
                          ? 'text-[#FAF8F2]'
                          : isHovered && isMiddle
                            ? 'text-[#FAF8F2]'
                            : item.color === 'red'
                              ? 'text-red-400'
                              : 'text-[#C4956A]'
                      }`}
                    >
                      {item.name}
                    </span>
                    {hasSubmenu && (
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isSubmenuOpen ? 'rotate-180' : ''
                        } ${
                          isActive && isMiddle
                            ? 'text-[#FAF8F2]'
                            : isHovered && isMiddle
                              ? 'text-[#FAF8F2]'
                              : 'text-[#C4956A]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Submenu items - visible when expanded or when collapsed with hover */}
              {hasSubmenu && isSubmenuOpen && (
                <>
                  {/* Expanded view - inline submenu */}
                  {expanded && (
                    <div className="bg-[#0D2E5C]/50">
                      {item.submenu!.map((subitem, subindex) => (
                        <div
                          key={subindex}
                          className="flex items-center gap-4 px-8 py-3 cursor-pointer transition-all duration-200 hover:bg-[#0D2E5C] text-[#C4956A] hover:text-[#FAF8F2]"
                          onClick={() => {
                            setActive(index);
                            onNavigate?.(subitem.id);
                            setExpandedSubmenu(null);
                            setExpanded(false);
                          }}
                        >
                          <div className="flex-shrink-0">{subitem.icon}</div>
                          <span className="text-sm font-medium">{subitem.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collapsed view - popup submenu */}
                  {!expanded && (
                    <div className="absolute left-20 top-0 z-40 w-48 rounded-lg bg-[#021838] shadow-lg border border-[#0D2E5C]">
                      {item.submenu!.map((subitem, subindex) => (
                        <div
                          key={subindex}
                          className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-[#0D2E5C] text-[#C4956A] hover:text-[#FAF8F2] first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => {
                            setActive(index);
                            onNavigate?.(subitem.id);
                            setExpandedSubmenu(null);
                          }}
                        >
                          <div className="flex-shrink-0">{subitem.icon}</div>
                          <span className="text-sm font-medium">{subitem.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* User profile at bottom */}
      <div className="border-t border-[#0D2E5C]">
        <div className={`flex items-center ${expanded ? 'justify-start' : 'justify-center'} gap-3 px-4 py-4`}>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#7C4D2F] text-xs font-semibold text-[#FAF8F2]">
            {initial}
          </span>
          {expanded && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#FAF8F2]">
                {user?.name || user?.email || 'User'}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-[#C4956A]">{user.email}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
