
import AuthGuard from "@/components/auth/AuthGuard";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
