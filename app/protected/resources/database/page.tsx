import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search,
  Sword,
  Shield,
  Crosshair,
  Trophy,
  Map,
  BookOpen,
  ChevronRight
} from 'lucide-react'

export default async function DestinyDatabasePage() {
  const cookieStore = cookies()
  const supabase = createServerClient(await cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Destiny Database</h1>
          <p className="text-muted-foreground mt-2">
            Explore items, activities, and collections from the Destiny universe
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search the database..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Advanced Search
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weapons */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crosshair className="h-5 w-5" />
                  Weapons
                </CardTitle>
                <CardDescription>
                  Browse weapons by type and archetype
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  View Weapons
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Armor */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Armor
                </CardTitle>
                <CardDescription>
                  Browse armor sets and pieces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  View Armor
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Exotics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Exotics
                </CardTitle>
                <CardDescription>
                  Browse exotic weapons and armor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  View Exotics
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Added Items</CardTitle>
              <CardDescription>
                Latest additions to the Destiny 2 universe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real data later */}
                <p className="text-muted-foreground text-sm">
                  No recent items to display
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
              <CardDescription>
                Browse raids, strikes, and other activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with activities later */}
                <p className="text-muted-foreground text-sm">
                  No activities to display
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <CardDescription>
                Track your progress and discover new items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with collections later */}
                <p className="text-muted-foreground text-sm">
                  No collections to display
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 