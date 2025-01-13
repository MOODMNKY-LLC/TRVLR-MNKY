import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy,
  Calendar,
  Clock,
  Star,
  Target,
  Swords,
  Shield,
  Medal
} from 'lucide-react'

export default async function ProgressTrackingPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(await cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Track your achievements, seasonal progress, and weekly activities
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5" />
              Triumph Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5" />
              Season Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Weekly Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0/10</div>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Medal className="h-5 w-5" />
              Titles Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="triumphs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="triumphs" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Triumphs
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Seasonal
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Weekly Reset
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triumphs" className="space-y-6">
          {/* Active Triumphs */}
          <Card>
            <CardHeader>
              <CardTitle>Active Triumphs</CardTitle>
              <CardDescription>
                Track your progress on active triumph seals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real data later */}
                <p className="text-muted-foreground text-sm">
                  No active triumphs to display
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Completions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Completions</CardTitle>
              <CardDescription>
                Recently completed triumphs and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real data later */}
                <p className="text-muted-foreground text-sm">
                  No recent completions to display
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          {/* Season Pass Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Season Pass Progress</CardTitle>
              <CardDescription>
                Track your season pass rewards and unlocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real data later */}
                <p className="text-muted-foreground text-sm">
                  No season pass data to display
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Challenges</CardTitle>
              <CardDescription>
                Track your progress on seasonal challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real data later */}
                <p className="text-muted-foreground text-sm">
                  No seasonal challenges to display
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          {/* Weekly Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Raids & Dungeons
                </CardTitle>
                <CardDescription>
                  Weekly raid challenges and rotations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* We'll populate this with real data later */}
                  <p className="text-muted-foreground text-sm">
                    No weekly raid data to display
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Nightfall
                </CardTitle>
                <CardDescription>
                  Current Nightfall and modifiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* We'll populate this with real data later */}
                  <p className="text-muted-foreground text-sm">
                    No Nightfall data to display
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reset Timer */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Reset Timer</CardTitle>
              <CardDescription>
                Time until the next weekly reset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll populate this with real data later */}
                <p className="text-muted-foreground text-sm">
                  Reset timer not available
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 