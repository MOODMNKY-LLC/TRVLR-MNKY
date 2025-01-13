import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Hash, Users } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Channels Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold tracking-tight">Channels</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Hash className="h-4 w-4" />
              general
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Hash className="h-4 w-4" />
              raids
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Hash className="h-4 w-4" />
              pvp
            </Button>
            <Separator className="my-2" />
            <h3 className="px-2 text-sm font-medium text-muted-foreground">Direct Messages</h3>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Online (3)
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center gap-2">
          <Hash className="h-5 w-5" />
          <div>
            <h2 className="font-semibold tracking-tight">general</h2>
            <p className="text-sm text-muted-foreground">General clan discussion</p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Guardian</span>
                    <span className="text-sm text-muted-foreground">12:34 PM</span>
                  </div>
                  <p className="text-sm mt-1">
                    Welcome to the clan chat! This is a placeholder message.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 