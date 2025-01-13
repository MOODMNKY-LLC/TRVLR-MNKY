import { ThemeSwitcher } from "@/components/theme-switcher"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {children}
      </div>
      <div className="fixed bottom-4 right-4">
        <ThemeSwitcher />
      </div>
    </div>
  )
}
