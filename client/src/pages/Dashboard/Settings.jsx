import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  const { setTheme, theme } = useTheme();

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
              <div className="hover:border-accent items-center rounded-lg border-2 p-1">
                <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
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
              <div className="bg-popover hover:border-accent items-center rounded-lg border-2 p-1">
                <div className="space-y-2 rounded-lg bg-neutral-950 p-2">
                  <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-neutral-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-neutral-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-neutral-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
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
    </div>
  );
}
