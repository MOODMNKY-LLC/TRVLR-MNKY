'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Box, Boxes, AlertTriangle, RefreshCcw, Sword } from "lucide-react"

export default function DIMIntegrationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">DIM Integration</h2>
        <p className="text-muted-foreground">
          Configure Destiny Item Manager (DIM) sync and inventory management settings.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          DIM integration requires an active Bungie.net connection with appropriate inventory permissions.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="connection">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          <TabsTrigger value="loadouts">Loadouts</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DIM Connection</CardTitle>
              <CardDescription>
                Manage your DIM connection and sync status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Connection Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Connected</Badge>
                    <p className="text-sm text-muted-foreground">
                      Last synced: 2 minutes ago
                    </p>
                  </div>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep DIM data synchronized automatically
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Configuration</CardTitle>
              <CardDescription>
                Configure how your data syncs with DIM.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sync Frequency</Label>
                  <p className="text-sm text-muted-foreground">
                    How often to sync with DIM
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Background Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep syncing when app is in background
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Conflict Resolution</Label>
                  <p className="text-sm text-muted-foreground">
                    How to handle conflicting changes
                  </p>
                </div>
                <Button variant="outline">Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loadouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loadout Management</CardTitle>
              <CardDescription>
                Configure loadout sync and management settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Loadout Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync loadouts between DIM and app
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-equip</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow automatic loadout equipping
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Loadout Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing loadouts with clan
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>
                Configure inventory management preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Item Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track item locations and movements
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-organize</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic inventory organization
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Vault Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smart vault management
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