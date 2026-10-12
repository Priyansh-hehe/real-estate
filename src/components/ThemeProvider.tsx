/**
 * ==============================================================================
 * THEME PROVIDER WRAPPER (src/components/ThemeProvider.tsx)
 * ==============================================================================
 * Client wrapper around next-themes NextThemesProvider.
 * Enables class-based HTML dark mode switching across the entire React component tree.
 * ==============================================================================
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
