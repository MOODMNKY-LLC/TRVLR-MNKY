import { getUser } from './utils/user'
import { ProtectedLayoutClient } from './protected-layout-client'

// Server component for data fetching
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <ProtectedLayoutClient user={user}>
      {children}
    </ProtectedLayoutClient>
  )
} 