"use client";

import { useRouter } from "next/navigation";
import HeroSection from "@/components/features/HeroSection";

export default function Home() {
  const router = useRouter();

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case "matchs":
        router.push("/matches");
        break;
      case "stades":
        router.push("/stadiums");
        break;
      case "tarifs":
        router.push("/tickets?tab=tarifs");
        break;
      case "billets":
        router.push("/tickets?tab=billets");
        break;
      case "volontaires":
        router.push("/volunteer/register");
        break;
      case "dashboard":
        router.push("/dashboard");
        break;
      case "scanner":
        router.push("/scan");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="w-full">
      <HeroSection onNavigate={handleNavigate} />
    </div>
  );
}
