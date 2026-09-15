import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function CowboyFounderRoute() {
  redirect("/spiral-intent-founder.html");
}
