"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaCalendarAlt,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

export default function Sidebar(): React.ReactElement {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { text: "Estoque", icon: <FaBoxOpen />, path: "/estoque" },
    { text: "Agendamentos", icon: <FaCalendarAlt />, path: "/agendamentos" },
    { text: "Clientes", icon: <FaUsers />, path: "/clientes" },
  ];

  return (
    <div
      className={`bg-surface shadow-md h-screen ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div className="flex flex-col h-full">
        <div className="py-4 border-b flex justify-between items-center px-4">
          {!collapsed && <h2 className="text-lg font-semibold">Menu</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 pt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 hover:bg-gray-100 ${
                    router.pathname === item.path
                      ? "bg-gray-100 border-l-4 border-primary"
                      : ""
                  }`}
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.text}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          {!collapsed && (
            <div className="text-xs text-gray-500">EzPet v1.0.0</div>
          )}
        </div>
      </div>
    </div>
  );
}
