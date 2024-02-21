import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Confetti from "react-confetti";
import { Github, Info, Loader2, Plus, Terminal, Trash, X } from "lucide-react";
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
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const socket = io(import.meta.env.VITE_BASE_URL);

export default function DeployForm({ user }) {
  const [repoURL, setURL] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState();
  const [deployPreviewURL, setDeployPreviewURL] = useState(null);
  const logContainerRef = useRef(null);
  const [type, setType] = useState(null);
  const [envVariables, setEnvVariables] = useState([]); // {key: "VITE_TEST", value: "27277272ff"}

  const { toast } = useToast();
  const isValidURL = useMemo(() => {
    if (!repoURL || repoURL.trim() === "") return [false, null];
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(repoURL), "Enter valid Github Repository URL"];
  }, [repoURL]);

  const validate = (url, type, domain) => {
    if (!url || !type) {
      toast({
        title: "Error",
        description: "URL and type both are required",
        variant: "destructive",
      });
      return false;
    }
    if (domain.includes(" ") || url.includes(" ")) {
      toast({
        title: "Error",
        description: "Domain and URL should not contain spaces",
        variant: "destructive",
      });
      return false;
    }
    if (!url.startsWith("https://github.com")) {
      toast({
        title: "Error",
        description: "URL should be a valid Github Repository URL",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleClickDeploy = useCallback(async () => {
    setLoading(true);
    if (!validate(repoURL, type, projectId)) {
      setLoading(false);
      return;
    }
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/project`,
      {
        gitURL: repoURL,
        domain: projectId,
        type: type,
        userId: user.id,
        envVariables: envVariables,
      }
    );

    if (data && data.data) {
      const { projectSlug, url } = data.data;
      toast({
        title: "Queued",
        description: "Project Build Started",
      });
      setDeployPreviewURL(url);
      console.log(`Subscribing to logs:${projectSlug}`);
      socket.emit("subscribe", `logs:${projectSlug}`);
    }
  }, [projectId, repoURL, type, envVariables]);

  const handleSocketIncommingMessage = useCallback((message) => {
    console.log(`[Incomming Socket Message]:`, message);
    const log = JSON.parse(message);
    setLogs((prev) => [...prev, log]);
    logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    socket.on("message", handleSocketIncommingMessage);

    return () => {
      socket.off("message", handleSocketIncommingMessage);
    };
  }, [handleSocketIncommingMessage]);

  const handleEnvChange = (value, index, type) => {
    setEnvVariables((prev) => {
      const newEnv = [...prev];
      newEnv[index][type] = value;
      console.log(newEnv);
      return newEnv;
    });
  };

  const handleRemoveEnv = (index) => {
    setEnvVariables((prev) => {
      const newEnv = [...prev];
      newEnv.splice(index, 1);
      console.log(newEnv);
      return newEnv;
    });
  };

  return (
    <main className="flex justify-center items-center w-full mb-10">
      <Card className="w-[90%] sm:w-[60%] flex flex-col justify-center">
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
              <Input
                id="domain"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder=""
              />
            </div>
            <p>.reactrover.tech</p>
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
          <div>
            <Label htmlFor="env">Environment Variables</Label>
            <div className="">
              {envVariables.map((env, i) => (
                <div className="flex flex-col sm:flex-row mx-2 my-3 gap-2">
                  <Input
                    value={env.key}
                    placeholder="Key"
                    onChange={(e) => handleEnvChange(e.target.value, i, "key")}
                  />
                  <Input
                    value={env?.value}
                    placeholder="Value"
                    onChange={(e) =>
                      handleEnvChange(e.target.value, i, "value")
                    }
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveEnv(i)}
                      size="icon"
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setEnvVariables((prev) => [...prev, {}])}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Env Variables
              </Button>
            </div>
          </div>

          {deployPreviewURL && (
            <div className="flex flex-col gap-4 mt-2 py-4 px-2 rounded-lg">
              <p className="">
                Preview URL{" "}
                <a
                  target="_blank"
                  className="bg-sky-950 px-3 py-2 rounded-lg "
                  href={deployPreviewURL}
                >
                  {deployPreviewURL}
                </a>
              </p>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  This may take a few minutes to build and deploy. Check logs
                  for more details.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {logs.length > 0 && (
            <div
              className={`overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] text-sm logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-x-auto`}
            >
              <pre className="flex flex-col gap-1 source-code">
                {logs.map((log, i) => (
                  <code
                    ref={logs.length - 1 === i ? logContainerRef : undefined}
                    className={
                      log?.type === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                    key={i}
                  >{`> ${log.log}`}</code>
                ))}
              </pre>
            </div>
          )}

          {deployPreviewURL && logs?.length <= 0 && (
            <div className="flex gap-3 justify-center font-semibold">
              <p>Waiting for logs: </p>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
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
