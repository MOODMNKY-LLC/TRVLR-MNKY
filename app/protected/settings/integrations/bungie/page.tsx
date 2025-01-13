'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Rocket, Shield, Database, AlertTriangle, RefreshCcw, User, Check } from "lucide-react"
import { BungieAuthButton } from "@/components/bungie/auth-button"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface BungieAccount {
  membership_id: string
  access_token: string
  refresh_token: string
  expires_at: string
  token_type: string
  updated_at: string
  auto_sync: boolean
  bungie_profile?: {
    displayName: string
    membershipType: number
    membershipId: string
  }
}

export default function BungieIntegrationPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<BungieAccount['bungie_profile'] | null>(null)
  const [autoSync, setAutoSync] = useState(false)

  const checkConnection = async () => {
    try {
      const supabase = createClient()
      const { data: bungieAccount } = await supabase
        .from('bungie_accounts')
        .select('*, bungie_profile')
        .single()

      if (bungieAccount) {
        setIsConnected(true)
        setLastSync(new Date(bungieAccount.updated_at).toLocaleString())
        setProfile(bungieAccount.bungie_profile)
        setAutoSync(bungieAccount.auto_sync)
      } else {
        setIsConnected(false)
        setLastSync(null)
        setProfile(null)
        setAutoSync(false)
      }
    } catch (error) {
      console.error('Error checking Bungie connection:', error)
      setIsConnected(false)
      setLastSync(null)
      setProfile(null)
      setAutoSync(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/bungie/refresh', {
        method: 'POST'
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to refresh tokens')
      }

      await checkConnection() // Refresh connection status
      setSuccess('Your Bungie.net connection has been refreshed')
      setTimeout(() => setSuccess(null), 3000) // Clear success after 3 seconds
    } catch (error) {
      console.error('Error refreshing Bungie connection:', error)
      setError('Failed to refresh connection')
      setTimeout(() => setError(null), 3000) // Clear error after 3 seconds
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Bungie.net account?')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/bungie/disconnect', {
        method: 'POST'
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to disconnect account')
      }

      await checkConnection() // Refresh connection status
      setSuccess('Your Bungie.net account has been disconnected')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error disconnecting Bungie account:', error)
      setError('Failed to disconnect account')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoSyncToggle = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('bungie_accounts')
        .update({ auto_sync: !autoSync })
        .single()

      if (error) throw error

      setAutoSync(!autoSync)
      setSuccess(`Auto sync ${!autoSync ? 'enabled' : 'disabled'}`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error updating auto sync:', error)
      setError('Failed to update auto sync setting')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check for error or success params
    const errorParam = searchParams.get('error')
    const successParam = searchParams.get('success')

    if (errorParam) {
      setError(errorParam)
    } else if (successParam) {
      setSuccess('Your Bungie.net account has been connected')
    }

    // Check connection status
    checkConnection()
  }, [searchParams])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bungie.net Integration</h2>
        <p className="text-muted-foreground">
          Configure your Bungie.net account connection and API access settings.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error === 'auth_failed' && 'Failed to authenticate with Bungie.net'}
            {error === 'invalid_state' && 'Invalid authentication state'}
            {error === 'invalid_request' && 'Invalid authentication request'}
            {error === 'server_error' && 'Server error occurred'}
            {error === 'Failed to refresh connection' && error}
            {error === 'Failed to disconnect account' && error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Rocket className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="manifest">Manifest</TabsTrigger>
          <TabsTrigger value="scopes">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bungie.net Account</CardTitle>
              <CardDescription>
                Manage your Bungie.net account connection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? "default" : "outline"}>
                      {isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                    {isConnected && (
                      <>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Active
                        </Badge>
                        {lastSync && (
                          <p className="text-sm text-muted-foreground">
                            Last synced: {lastSync}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isConnected ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Rocket className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="mr-2 h-4 w-4" />
                        )}
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDisconnect}
                        disabled={isLoading}
                        className="text-destructive"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <BungieAuthButton />
                  )}
                </div>
              </div>
              {isConnected && profile && (
                <>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{profile.displayName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Membership ID: {profile.membershipId}
                      </p>
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh tokens before expiration
                  </p>
                </div>
                <Switch 
                  disabled={!isConnected || isLoading}
                  checked={autoSync}
                  onCheckedChange={handleAutoSyncToggle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage Bungie.net API access and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? "default" : "outline"}>
                      {isConnected ? "Active" : "Inactive"}
                    </Badge>
                    {isConnected && (
                      <p className="text-sm text-muted-foreground">
                        Rate Limit: 25/50
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="icon" disabled={!isConnected}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smart rate limit handling
                  </p>
                </div>
                <Switch disabled={!isConnected} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manifest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destiny 2 Manifest</CardTitle>
              <CardDescription>
                Configure manifest download and caching settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Manifest Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Up to date</Badge>
                    <p className="text-sm text-muted-foreground">
                      Version: 12345.6789
                    </p>
                  </div>
                </div>
                <Button variant="outline" disabled={!isConnected}>Update Now</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Update</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update manifest when new version is available
                  </p>
                </div>
                <Switch disabled={!isConnected} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cache Management</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable manifest caching for faster access
                  </p>
                </div>
                <Switch disabled={!isConnected} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scopes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Permissions</CardTitle>
              <CardDescription>
                Manage Bungie.net API permission scopes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ReadBasicUserProfile</Label>
                  <p className="text-sm text-muted-foreground">
                    Read basic user profile information
                  </p>
                </div>
                <Badge>{isConnected ? "Granted" : "Required"}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ReadDestinyInventoryAndVault</Label>
                  <p className="text-sm text-muted-foreground">
                    Access to inventory and vault contents
                  </p>
                </div>
                <Badge>{isConnected ? "Granted" : "Required"}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>MoveEquipDestinyItems</Label>
                  <p className="text-sm text-muted-foreground">
                    Move and equip Destiny items
                  </p>
                </div>
                <Badge variant="outline">Required</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 