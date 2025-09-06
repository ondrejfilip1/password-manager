import { useThemeConfig } from "@/components/active-theme";
import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { themeList, themeListTranslated } from "@/components/active-theme";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export default function Settings() {
  const { setTheme, theme } = useTheme();
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight">Nastavení</h1>
      <div className="bg-muted w-full h-px my-6" />

      <div className="grid gap-2 space-y-1">
        <Label htmlFor="theme">Téma</Label>
        <p className="text-muted-foreground text-sm">
          Zvolte téma pro aplikaci.
        </p>

        <RadioGroup
          defaultValue={theme}
          onValueChange={(value) => setTheme(value)}
          className="flex max-w-md gap-6 pt-2"
        >
          <div className="grid gap-2">
            <RadioGroupItem
              value="light"
              id="theme-light"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-light"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="hover:border-accent items-center rounded-xl border-2 p-1">
                <div
                  className={`space-y-2 rounded-lg bg-sidebar-border p-2 theme-${activeTheme}`}
                >
                  <div className="space-y-2 rounded-md bg-card p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-sidebar-border" />
                    <div className="h-2 w-[100px] rounded-lg bg-sidebar-border" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-card p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-sidebar-border" />
                    <div className="h-2 w-[100px] rounded-lg bg-sidebar-border" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-card p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-sidebar-border" />
                    <div className="h-2 w-[100px] rounded-lg bg-sidebar-border" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Světlý
              </span>
            </Label>
          </div>

          <div className="grid gap-2">
            <RadioGroupItem
              value="dark"
              id="theme-dark"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-dark"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="hover:border-accent items-center rounded-xl border-2 p-1">
                <div
                  className={`space-y-2 rounded-lg bg-card p-2 dark theme-${activeTheme}`}
                >
                  <div className="space-y-2 rounded-md bg-muted p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-muted-foreground" />
                    <div className="h-2 w-[100px] rounded-lg bg-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-muted p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-muted-foreground" />
                    <div className="h-2 w-[100px] rounded-lg bg-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-muted p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-muted-foreground" />
                    <div className="h-2 w-[100px] rounded-lg bg-muted-foreground" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Tmavý
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="bg-muted w-full h-px my-6" />
      <div className="grid gap-2 space-y-1">
        <Label htmlFor="theme">Barevný motiv</Label>
        <p className="text-muted-foreground text-sm">
          Zvolte barevný motiv pro aplikaci.
        </p>
        <Select onValueChange={setActiveTheme} defaultValue={activeTheme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vyberte si motiv" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Motivy</SelectLabel>
              {themeList.map((value, index) => (
                <SelectItem value={value} key={index}>
                  <div
                    className={`theme-${value} rounded-full h-4 w-4 bg-linear-45 from-primary to-primary-foreground`}
                  />
                  <span>{themeListTranslated[value]}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
