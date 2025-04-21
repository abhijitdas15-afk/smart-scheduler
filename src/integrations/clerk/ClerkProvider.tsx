import { ClerkProvider as BaseClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ReactNode } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

/**
 * ClerkProvider component that handles authentication for the application
 * This integrates with the same Clerk instance used by the parent application
 */
export function ClerkProvider({ children }: ClerkProviderProps) {
  // This should match the key used in the main application
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
  
  // If no key is available, show an error
  if (!publishableKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="font-medium">Configuration Error</h3>
            <p className="mt-1 text-sm">
              Missing Clerk publishable key. Add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BaseClerkProvider>
  );
}

export default ClerkProvider; 