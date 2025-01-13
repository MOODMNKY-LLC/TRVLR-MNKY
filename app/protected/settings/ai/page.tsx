'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Brain, MessageSquare, Sparkles, Upload, Settings2, Zap } from "lucide-react"

export default function AISettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Assistant Settings</h2>
        <p className="text-muted-foreground">
          Configure your AI assistant's behavior, preferences, and capabilities.
        </p>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>AI Assistant Status</AlertTitle>
        <AlertDescription>
          Your AI assistant is active and ready to help with loadouts, strategies, and clan management.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="behavior">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="chat">Chat Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Behavior</CardTitle>
              <CardDescription>
                Configure how your AI assistant interacts and responds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Personality</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust how formal or casual the AI responds
                  </p>
                </div>
                <div className="w-[120px]">
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Proactive Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow AI to suggest loadouts and strategies
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Learning Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Learn from your preferences and feedback
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
              <CardDescription>
                Enable or disable specific AI assistant features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Loadout Analysis</Label>
                  <p className="text-sm text-muted-foreground">
                    Analyze and suggest optimal loadouts
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Strategy Generation</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate activity strategies and tips
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Clan Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Provide insights on clan activities
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat Configuration</CardTitle>
              <CardDescription>
                Customize your chat experience with the AI assistant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Response Length</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust how detailed AI responses should be
                  </p>
                </div>
                <div className="w-[120px]">
                  <Slider defaultValue={[75]} max={100} step={1} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stream Responses</Label>
                  <p className="text-sm text-muted-foreground">
                    Show AI responses as they're generated
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chat History</Label>
                  <p className="text-sm text-muted-foreground">
                    Save chat history for context
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced AI assistant settings and model behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Model Selection</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose AI model for different tasks
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Context Window</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust how much history AI considers
                  </p>
                </div>
                <div className="w-[120px]">
                  <Slider defaultValue={[60]} max={100} step={1} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show detailed AI processing information
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 