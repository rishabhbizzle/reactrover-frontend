import axios from "axios";
import { GitBranchIcon, GithubIcon, Link, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Logs } from "./logs";

export default function Deployments({ user }) {
  const [loading, setLoading] = useState(false);
  const [deployments, setDeployments] = useState([]);
  const fetchDeployments = async () => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_BASE_URL}/deployments/${user.id}`)
      .then(({ data }) => {
        setDeployments(data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  return (
    <div className="flex justify-center mt-16 w-full mb-16">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <GitBranchIcon className="text-gray-400" />
              <h1 className="text-3xl font-bold mb-1">Deployments</h1>
            </div>
            <div>
              <Button onClick={fetchDeployments} variant="secondary"><RefreshCcw className={loading ? "animate-spin" : ''} /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id} className="flex gap-2">
                <div className="w-[90%] grid grid-cols-1 gap-4 sm:gap-2 sm:grid-cols-7 m-3">
                  <div className="flex sm:col-span-2 items-center">
                    <a
                      href={`https://${deployment?.projectId}.reactrover.tech`}
                      target="_blank"
                    >
                      {deployment?.projectId}
                    </a>
                    <Link className="w-4 h-4 ml-1" />
                  </div>
                  <div className="sm:col-span-1">
                    <Badge
                      variant={
                        deployment?.status === "FAIL"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {deployment?.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1 justify-center items-center sm:col-span-3">
                    <GithubIcon className="w-14 sm:w-5 text-gray-400" />
                    <a
                      className="truncate"
                      href={deployment?.gitUrl}
                      target="_blank"
                    >
                      {deployment?.gitUrl}
                    </a>
                  </div>
                  <div className="sm:text-right sm:col-span-1">
                    {new Date(deployment?.createdAt).toLocaleDateString()}
                  </div>
                  {/* <div className="text-right col-span-1">
                    <Button variant="outline">Show Logs</Button>
                  </div> */}
                </div>
                <div className="flex justify-center items-center mx-5">
                  <Logs logs={deployment?.Log} />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
