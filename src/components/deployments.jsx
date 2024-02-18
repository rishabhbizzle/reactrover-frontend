import axios from "axios";
import { GitBranchIcon, GithubIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function Deployments({ user }) {
  const [deployments, setDeployments] = useState([]);
  const fetchDeployments = async () => {
    await axios
      .get(`http://localhost:3000/deployments/${user.id}`)
      .then(({ data }) => {
        setDeployments(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  return (
    <div className="flex justify-center mt-5 w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranchIcon className="text-gray-400" />
            <h1 className="text-3xl font-bold mb-1">Deployments</h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id} className="flex gap-2">
                <div className="grid grid-cols-7 m-3">
                  <div className="col-span-2">{deployment?.projectId}</div>
                  <div className="col-span-1">
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
                  <div className="flex gap-1 justify-center items-center col-span-3">
                    <GithubIcon className=" text-gray-400" />
                    <p>{deployment?.gitUrl}</p>
                  </div>
                  <div className="text-right col-span-1">
                    {new Date(deployment?.createdAt).toLocaleDateString()}
                  </div>
                  {/* <div className="text-right col-span-1">
                    <Button variant="outline">Show Logs</Button>
                  </div> */}
                </div>
                <div className="flex justify-center items-center mx-5">
                  <Button variant="outline" size="sm">
                    Show Logs
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
