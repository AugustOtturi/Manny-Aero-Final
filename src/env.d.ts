/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: { username: string } | null;
  }
}

interface Window {
  adminConfirm: (
    message: string,
    opts?: { title?: string; confirmLabel?: string; danger?: boolean }
  ) => Promise<boolean>;
  adminAlert: (message: string, opts?: { title?: string; okLabel?: string }) => Promise<void>;
}
