import { signUpAction } from "@/app/actions";
import { DiscordAuthButton } from "@/components/auth/discord-auth-button";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Join Ghost MNKY</h1>
        <p className="text-muted-foreground max-w-sm">
          Connect with your clan, manage events, and optimize your loadouts. Sign up with Discord to begin.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6">
        <DiscordAuthButton className="w-full h-12 text-lg" />
        
        {/* Hidden email/password section - preserved for future use */}
        <div className="hidden">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <form className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              autoComplete="new-password"
            />
            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
              Sign up
            </SubmitButton>
          </form>
        </div>

        <FormMessage message={searchParams} />

        <p className="text-sm text-center text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>

      <SmtpMessage />
    </div>
  );
}
