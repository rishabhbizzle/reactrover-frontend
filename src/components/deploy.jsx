import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const socket = io("http://localhost:9002");

export default function DeployForm() {
  const [repoURL, setURL] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState();
  const [deployPreviewURL, setDeployPreviewURL] =
    useState("https://google.com");
  const logContainerRef = useRef(null);
  const [type, setType] = useState("vite");

  const isValidURL = useMemo(() => {
    if (!repoURL || repoURL.trim() === "") return [false, null];
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(repoURL), "Enter valid Github Repository URL"];
  }, [repoURL]);

  const handleClickDeploy = useCallback(async () => {
    setLoading(true);
    const { data } = await axios.post(`http://localhost:9000/project`, {
      gitURL: repoURL,
      slug: projectId,
      type: "vite",
    });

    if (data && data.data) {
      const { projectSlug, url } = data.data;
      setDeployPreviewURL(url);

      console.log(`Subscribing to logs:${projectSlug}`);
      socket.emit("subscribe", `logs:${projectSlug}`);
    }
  }, [projectId, repoURL]);

  const handleSocketIncommingMessage = useCallback((message) => {
    console.log(`[Incomming Socket Message]:`, typeof message, message);
    const { log } = JSON.parse(message);
    setLogs((prev) => [...prev, log]);
    logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    socket.on("message", handleSocketIncommingMessage);

    return () => {
      socket.off("message", handleSocketIncommingMessage);
    };
  }, [handleSocketIncommingMessage]);

  return (
    <main className="flex justify-center items-center h-[100vh] w-full">
      <Card className="w-1/2 flex flex-col justify-center">
        <CardHeader></CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="repo">Github Repo Link</Label>
            <span className="flex justify-start items-center gap-2">
              <Github className="text-5xl" />
              <Input
                disabled={loading}
                value={repoURL}
                onChange={(e) => setURL(e.target.value)}
                type="url"
                placeholder="Github URL"
              />
            </span>
          </div>
          <div className="flex items-end gap-2">
            <div className="grid gap-2 w-[70%]">
              <Label htmlFor="domain">Custom Domain</Label>
              <Input id="domain" value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="" />
            </div>
            <p>
              .reactrover.live
            </p>
          </div>
          <RadioGroup
            value={type}
            onValueChange={(newVal) => setType(newVal)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="vite" id="vite" className="peer sr-only" />
              <Label
                htmlFor="vite"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <img src="/vite.svg" className="mb-3 h-6 w-6" />
                Vite + React
              </Label>
            </div>
            <div>
              <RadioGroupItem value="cra" id="cra" className="peer sr-only" />
              <Label
                htmlFor="cra"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png"
                  className="mb-3 h-6 w-7"
                />
                React
              </Label>
            </div>
          </RadioGroup>
          {deployPreviewURL && (
            <div className="mt-2 py-4 px-2 rounded-lg">
              <p className="">
                Preview URL{" "}
                <a
                  target="_blank"
                  className="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg"
                  href={deployPreviewURL}
                >
                  {deployPreviewURL}
                </a>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleClickDeploy}
            disabled={!isValidURL[0] || loading}
            className="w-full mt-3"
          >
            {loading ? "In Progress" : "Deploy"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}