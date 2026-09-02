import { redirect } from "next/navigation";

const RECRUITMENT_URL = "https://recruitment.gdg-mitwpu.in/";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join Us — GDG MIT-WPU",
  description: "Redirecting to GDG MIT-WPU recruitment portal.",
};

export default function JoinPage() {
  redirect(RECRUITMENT_URL);
}
