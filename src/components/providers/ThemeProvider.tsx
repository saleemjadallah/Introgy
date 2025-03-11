
import { createContext, useContext } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProviderContext = createContext<null>(null);

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <ThemeProviderContext.Provider {...props} value={null}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

