
import { useEffect, useRef } from 'react';
import { Check, MoonIcon, SunIcon, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import gsap from 'gsap';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'forest', label: 'Forest', icon: Leaf }
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { rotation: -30, opacity: 0.8 },
        { rotation: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [theme]);

  const activeTheme = themes.find(t => t.value === theme) || themes[0];
  const Icon = activeTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          ref={buttonRef}
          variant="ghost" 
          size="icon"
          className="rounded-full h-8 w-8 hover:bg-foreground/10 transition-all duration-300"
        >
          <Icon className="h-[1.1rem] w-[1.1rem] text-foreground" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl overflow-hidden shadow-lg border border-border/40 bg-popover">
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value as 'dark' | 'light' | 'forest')}
              className={`flex items-center gap-2 py-2 px-3 cursor-pointer rounded-lg transition-all duration-300 ${
                theme === themeOption.value ? 'bg-foreground/10' : 'hover:bg-foreground/5'
              }`}
            >
              <ThemeIcon className="h-4 w-4" />
              <p className="font-medium">{themeOption.label}</p>
              {theme === themeOption.value && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
