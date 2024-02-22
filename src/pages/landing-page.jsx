import Container from "@/components/ui/container";
import { SignedOut, SignedIn, useUser, SignInButton } from "@clerk/clerk-react";
import DeployForm from "../components/deploy";
import Deployments from "@/components/deployments";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import reactLogo from './../assets/react.svg'


export default function LandingPage() {
  const { user } = useUser();

  return (
    <Container>
      <header className="flex text-center py-24 h-screen justify-center items-center">
        <div className="text-center flex flex-col gap-6">
          
          <h1 className="text-5xl sm:text-8xl font-bold mb-6">
            Your fastest path to deployment
          </h1>
          <p className="text-xl text-gray-400">
            Build, deploy your React application with just one click
          </p>
          <img 
          src={reactLogo}
          className="logo react" alt="React logo" />
          <div>
            <SignedOut>
              <SignInButton>
                <Button><LogIn className="h-5 w-5 mr-2" />Sign in</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
      <div className="">
        <SignedIn>
          <div className="flex w-full flex-col justify-center">
            <DeployForm user={user} />
            <Deployments user={user} />
          </div>
        </SignedIn>
      </div>
    </Container>
  );
}
