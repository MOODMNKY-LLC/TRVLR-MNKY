import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Sword, Target, Users, Search, Plus } from "lucide-react"

export default function LFGPage() {
  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Looking for Group</h1>
          <p className="text-muted-foreground">Find or create a fireteam for activities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Activity
        </Button>
      </div>

      <Separator />

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search activities..." className="pl-9" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="raids">Raids</TabsTrigger>
          <TabsTrigger value="nightfall">Nightfall</TabsTrigger>
          <TabsTrigger value="pvp">PvP</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Activity Cards */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sword className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Vault of Glass</h3>
                  <p className="text-sm text-muted-foreground">Looking for 2 more guardians</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span>4/6</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>1350+ Light</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Target className="h-4 w-4" />
                      <span>KWTD</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button>Join Fireteam</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Trials of Osiris</h3>
                  <p className="text-sm text-muted-foreground">Need 1 for flawless run</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span>2/3</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>1360+ Light</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button>Join Fireteam</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="raids">
          <Card className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No raid activities found</p>
          </Card>
        </TabsContent>

        <TabsContent value="nightfall">
          <Card className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No nightfall activities found</p>
          </Card>
        </TabsContent>

        <TabsContent value="pvp">
          <Card className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No PvP activities found</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 