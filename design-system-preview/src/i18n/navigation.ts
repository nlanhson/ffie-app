import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link and useRouter — drop-in replacements for next/link and
// next/navigation that prepend the active locale when needed.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
