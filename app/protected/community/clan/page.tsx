import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, UserPlus, Shield } from 'lucide-react'

export default async function ClanManagementPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(await cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Clan Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your clan members, roles, and recruitment settings
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="recruitment" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Recruitment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clan Members</CardTitle>
              <CardDescription>
                View and manage your clan members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real member data later */}
                <p className="text-muted-foreground text-sm">No members to display</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clan Roles</CardTitle>
              <CardDescription>
                Manage roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with role management UI later */}
                <p className="text-muted-foreground text-sm">No roles configured</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Settings</CardTitle>
              <CardDescription>
                Configure clan recruitment preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll add recruitment settings UI later */}
                <p className="text-muted-foreground text-sm">No recruitment settings configured</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 