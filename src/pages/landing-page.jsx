import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { SignInButton, useUser } from "@clerk/clerk-react";
import DeployForm from "../components/deploy";

export default function LandingPage() {

  const user = useUser();
  console.log(user);
  return (
    <div className="min-h-screen">
      <Container>
      <header className="flex text-center py-24 h-screen">
        <div className="text-left">
          <h1 className="text-8xl font-bold mb-6">
            Your fastest path to production
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Build, deploy your React application with just one click
          </p>
        </div>
        <div className="w-[30%] h-full flex flex-col">
          Img
        </div>
      </header>
      <div className="flex justify-center">

      <DeployForm />
      </div>
      </Container>
    </div>
  );
}
