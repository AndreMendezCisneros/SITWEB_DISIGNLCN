import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAccessModule,
  canManageUsers,
  canMutateTable,
  canViewAudit,
  canWriteContent,
  canWriteModule,
  homeForRole,
  navForRole,
  resolveWorkspaceRedirect,
  workspaceAllows,
} from "../src/lib/auth/roles";

describe("role helpers — LCS.docx Cap. VI", () => {
  it("only super_admin manages users", () => {
    assert.equal(canManageUsers("super_admin"), true);
    assert.equal(canManageUsers("admin"), false);
    assert.equal(canManageUsers("editor"), false);
  });

  it("admins can view audit; editor cannot", () => {
    assert.equal(canViewAudit("admin"), true);
    assert.equal(canViewAudit("marketing"), false);
    assert.equal(canAccessModule("editor", "auditoria"), false);
  });

  it("editor cannot write configuration", () => {
    assert.equal(canWriteModule("editor", "configuracion"), false);
    assert.equal(canMutateTable("editor", "site_settings"), false);
    assert.equal(canMutateTable("editor", "services"), true);
  });

  it("marketing can banners/media/clients/stats but not services/projects/settings", () => {
    assert.equal(canMutateTable("marketing", "banners"), true);
    assert.equal(canMutateTable("marketing", "media_assets"), true);
    assert.equal(canMutateTable("marketing", "clients"), true);
    assert.equal(canMutateTable("marketing", "home_stats"), true);
    assert.equal(canMutateTable("marketing", "site_settings"), false);
    assert.equal(canMutateTable("marketing", "services"), false);
    assert.equal(canMutateTable("marketing", "projects"), false);
    assert.equal(canMutateTable("marketing", "coverage_regions"), false);
    assert.equal(canWriteModule("marketing", "configuracion"), false);
  });

  it("viewer is read-only on content modules", () => {
    assert.equal(canWriteModule("viewer", "hero"), false);
    assert.equal(canWriteModule("viewer", "servicios"), false);
    assert.equal(canAccessModule("viewer", "servicios"), true);
    assert.equal(canWriteContent("viewer"), false);
  });
});

describe("workspaces por rol", () => {
  it("homeForRole maps each role to its base path", () => {
    assert.equal(homeForRole("super_admin"), "/admin");
    assert.equal(homeForRole("admin"), "/admin");
    assert.equal(homeForRole("editor"), "/editor");
    assert.equal(homeForRole("marketing"), "/marketing");
    assert.equal(homeForRole("viewer"), "/viewer");
  });

  it("navForRole(editor) excludes mensajes/config/usuarios", () => {
    const mods = navForRole("editor").map((l) => l.module);
    assert.ok(mods.includes("hero"));
    assert.ok(mods.includes("multimedia"));
    assert.ok(!mods.includes("mensajes"));
    assert.ok(!mods.includes("configuracion"));
    assert.ok(!mods.includes("usuarios"));
    assert.ok(navForRole("editor").every((l) => l.href.startsWith("/editor")));
  });

  it("navForRole(marketing) excludes servicios/proyectos", () => {
    const mods = navForRole("marketing").map((l) => l.module);
    assert.ok(mods.includes("hero"));
    assert.ok(mods.includes("configuracion"));
    assert.ok(!mods.includes("servicios"));
    assert.ok(!mods.includes("proyectos"));
    assert.equal(
      navForRole("marketing").find((l) => l.module === "configuracion")?.label,
      "Estadísticas del inicio"
    );
  });

  it("rejects unknown tables for mutation", () => {
    assert.equal(canMutateTable("super_admin", "secret_table"), false);
    assert.equal(canMutateTable("admin", "pg_shadow"), false);
  });

  it("workspaceAllows and resolveWorkspaceRedirect remap foreign paths", () => {
    assert.equal(workspaceAllows("editor", "/editor/multimedia"), true);
    assert.equal(workspaceAllows("editor", "/admin/multimedia"), false);
    assert.equal(
      resolveWorkspaceRedirect("editor", "/admin/multimedia"),
      "/editor/multimedia"
    );
    assert.equal(resolveWorkspaceRedirect("editor", "/editor/hero"), null);
    assert.equal(
      resolveWorkspaceRedirect("marketing", "/admin/servicios"),
      "/marketing"
    );
  });
});
