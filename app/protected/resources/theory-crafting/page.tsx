import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sword, 
  Shield, 
  Zap,
  Brain,
  BarChart3,
  Archive,
  Sparkles
} from 'lucide-react'

export default async function TheoryCraftingPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(await cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Theory Crafting</h1>
          <p className="text-muted-foreground mt-2">
            Analyze and optimize your Guardian builds with AI assistance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loadout Builder Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Loadout Builder
            </CardTitle>
            <CardDescription>
              Create and optimize loadouts for any activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Armor optimization</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Mod recommendations</span>
            </div>
            <Button className="w-full">
              Build New Loadout
            </Button>
          </CardContent>
        </Card>

        {/* AI Analysis Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis
            </CardTitle>
            <CardDescription>
              Get AI-powered insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Build optimization</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Performance analysis</span>
            </div>
            <Button className="w-full">
              Analyze Build
            </Button>
          </CardContent>
        </Card>

        {/* Vault Analysis Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Vault Analysis
            </CardTitle>
            <CardDescription>
              Analyze your vault for optimal rolls and builds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sword className="h-4 w-4" />
              <span>God roll finder</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Armor stat distribution</span>
            </div>
            <Button className="w-full">
              Analyze Vault
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Builds */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Builds</CardTitle>
          <CardDescription>
            Your recently created or analyzed builds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* We'll populate this with real build data later */}
            <p className="text-muted-foreground text-sm">
              No recent builds to display
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Build Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Combinations</CardTitle>
            <CardDescription>
              Most effective weapon and mod combinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* We'll populate this with stats later */}
              <p className="text-muted-foreground text-sm">
                No combinations to display
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Build Performance</CardTitle>
            <CardDescription>
              How your builds perform in different activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* We'll populate this with performance data later */}
              <p className="text-muted-foreground text-sm">
                No performance data to display
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 