import { useState } from 'react';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  id: string;
  isSpecial?: boolean;
  color?: string;
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
  compass: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  envelope: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  spreadsheet: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2m6-2v2M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3m0 2V3m0 11h4m-4 0h4m0 0h4" />
    </svg>
  ),
  star: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  cog: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M12 15a3 3 0 100-6 3 3 0 000 6z" />
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
  hemyx: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

interface SidebarProps {
  onNavigate?: (itemId: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ onNavigate, onLogout }: SidebarProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState(1);
  const [expanded, setExpanded] = useState(false);

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
      name: 'Explore',
      icon: icons.compass,
      id: 'explore',
    },
    {
      name: 'Messages',
      icon: icons.envelope,
      id: 'messages',
    },
    {
      name: 'Resources',
      icon: icons.spreadsheet,
      id: 'resources',
    },
    {
      name: 'Starred',
      icon: icons.star,
      id: 'starred',
    },
    {
      name: 'Stream',
      icon: icons.stream,
      id: 'stream',
    },
    {
      name: 'Hemy X',
      icon: icons.hemyx,
      id: 'hemyx',
    },
    {
      name: 'Settings',
      icon: icons.cog,
      id: 'settings',
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
      className={`fixed left-0 top-0 h-screen bg-[#1B2A4A] transition-all duration-300 ${
        expanded ? 'w-56' : 'w-20'
      } shadow-lg z-50 flex flex-col`}
    >
      {menuItems.map((item, index) => {
        const isMiddle = index !== 0 && index !== menuItems.length - 1;
        const isHovered = hovered === index;
        const isActive = active === index;

        return (
          <div
            key={index}
            className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition-all duration-200 ${
              isMiddle && isHovered ? 'bg-[#243B5E]' : ''
            } ${isActive && isMiddle ? 'bg-[#7C4D2F] border-l-4 border-[#9B6240]' : ''} ${
              index === 0 || index === menuItems.length - 1 ? 'justify-center' : ''
            }`}
            onMouseEnter={() => isMiddle && setHovered(index)}
            onMouseLeave={() => isMiddle && setHovered(null)}
            onClick={() => handleItemClick(index, item)}
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
            )}
          </div>
        );
      })}
    </div>
  );
}
