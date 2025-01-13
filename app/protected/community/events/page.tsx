import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus, Users, ChevronLeft, ChevronRight } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Schedule and manage clan activities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <Separator />

      {/* Calendar and Events View */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Mini Calendar */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">January 2024</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            <div className="text-muted-foreground">S</div>
            <div className="text-muted-foreground">M</div>
            <div className="text-muted-foreground">T</div>
            <div className="text-muted-foreground">W</div>
            <div className="text-muted-foreground">T</div>
            <div className="text-muted-foreground">F</div>
            <div className="text-muted-foreground">S</div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {/* Previous Month */}
            <div className="p-2 text-center text-muted-foreground">30</div>
            <div className="p-2 text-center text-muted-foreground">31</div>
            
            {/* Current Month */}
            {Array.from({ length: 31 }, (_, i) => (
              <Button
                key={i}
                variant={i === 12 ? "default" : "ghost"}
                className="p-2 h-9 w-9"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </Card>

        {/* Events List */}
        <div className="space-y-6">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Weekly Raid Night</h3>
                      <p className="text-sm text-muted-foreground">Join us for our weekly raid night!</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>8:00 PM EST</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          <span>0/6 Registered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button>Register</Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Trials Practice</h3>
                      <p className="text-sm text-muted-foreground">PvP training and practice matches</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>9:00 PM EST</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          <span>2/12 Registered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button>Register</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">No past events to display</p>
              </Card>
            </TabsContent>

            <TabsContent value="my-events">
              <Card className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">You haven't registered for any events</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 