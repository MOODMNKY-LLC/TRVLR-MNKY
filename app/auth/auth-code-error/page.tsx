import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            There was a problem authenticating your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This could happen for several reasons:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
            <li>The authentication code has expired</li>
            <li>The code was already used</li>
            <li>There was a network error</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/sign-in">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 