
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themes = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const IconComponent = currentTheme.icon;

  return (
    <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
      <SelectTrigger 
        className="w-auto min-w-[120px]"
        aria-label="Theme selector"
      >
        <div className="flex items-center space-x-2">
          <IconComponent size={16} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <SelectItem key={themeOption.value} value={themeOption.value}>
              <div className="flex items-center space-x-2">
                <Icon size={16} />
                <span>{themeOption.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ThemeToggle;
