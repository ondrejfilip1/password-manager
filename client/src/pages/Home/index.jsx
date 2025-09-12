import { Button } from "@/components/ui/button";
import { Component } from "@/components/etheral-shadow";
import { Link } from "react-router-dom";
import ThemeSwitcher from "@/components/theme-switcher";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
  return (
    <>
      <Component
        color="rgba(128, 128, 128, 1)"
        animation={isMobile ? undefined : { scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
        className="!fixed w-100 h-screen"
      />
      <ThemeSwitcher showAccount={true} />
      <div className="max-w-container mx-auto px-4 flex flex-col gap-12 pt-16 sm:gap-24 min-h-screen justify-center">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <div className="flex flex-col items-start gap-6 sm:gap-8 text-center">
            <h1 className="animate-appear tracking-tight from-foreground to-foreground dark:to-muted-foreground inline-block max-w-[840px] bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-transparent drop-shadow-2xl sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
              Chraňte svá hesla jednoduše a bezpečně.
            </h1>
            <p className="text-md mx-auto animate-appear dark:text-muted-foreground text-neutral-700 max-w-[840px] font-medium opacity-0 animation-delay-100 lg:text-xl">
              Moderní open-source aplikace, která vám umožní spravovat a chránit
              všechna hesla na jednom místě.
            </p>
            <div className="animate-appear mx-auto flex justify-center gap-4 opacity-0 animation-delay-300">
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button>
                  {isLoggedIn ? "Přejít do aplikace" : "Přihlásit se"}
                </Button>
              </Link>
              <Link to="https://github.com/ondrejfilip1/password-manager">
                <Button variant="outline">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="dark:fill-white"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Github
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
