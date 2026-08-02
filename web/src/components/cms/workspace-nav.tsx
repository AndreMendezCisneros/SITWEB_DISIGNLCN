"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  canWriteModule,
  type NavGroup,
  type NavLink,
} from "@/lib/auth/roles";
import type { AppRole } from "@/types/database";

function isActive(pathname: string, link: NavLink, isFirst: boolean) {
  if (isFirst) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

function NavItem({
  role,
  link,
  active,
}: {
  role: AppRole;
  link: NavLink;
  active: boolean;
}) {
  const readOnly =
    !canWriteModule(role, link.module) &&
    link.module !== "dashboard" &&
    link.module !== "auditoria";

  return (
    <Link
      href={link.href}
      prefetch
      className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition ${
        active
          ? "bg-white font-medium text-neutral-900 shadow-sm"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span>{link.label}</span>
      {readOnly ? (
        <span
          className={`text-[10px] uppercase tracking-wide ${
            active ? "text-neutral-400" : "text-white/35"
          }`}
        >
          ver
        </span>
      ) : null}
    </Link>
  );
}

export function WorkspaceNav({
  role,
  groups,
  mobile = false,
}: {
  role: AppRole;
  groups: NavGroup[];
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const flat = groups.flatMap((g) => g.items);
  const firstHref = flat[0]?.href;

  if (mobile) {
    return (
      <nav className="flex gap-2 overflow-x-auto pb-1">
        {flat.map((link) => {
          const active = isActive(pathname, link, link.href === firstHref);
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-lcs-black text-lcs-gold"
                  : "bg-white text-neutral-600 ring-1 ring-black/[0.06]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-5">
      {groups.map((group) => (
        <div key={group.id}>
          {group.label ? (
            <p className="mb-1.5 px-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {group.label}
            </p>
          ) : null}
          <div className="space-y-1.5">
            {group.items.map((link) => (
              <NavItem
                key={link.href}
                role={role}
                link={link}
                active={isActive(pathname, link, link.href === firstHref)}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
