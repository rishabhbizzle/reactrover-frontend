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
    <div>
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold mb-1">Deployments</h1>
          <div className="flex items-center text-sm space-x-1 mb-6">
            <GitBranchIcon className="text-gray-400" />
            <span>Continuously generated from</span>
            <GithubIcon className="text-gray-400" />
            <span className="font-medium">rishabhbizzle/SpotAnalytics-V2</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id}>
                <div className="grid grid-cols-5 m-3">
                  <div>{deployment?.projectId}</div>
                  <div>
                    <Badge>{deployment?.status}</Badge>
                  </div>
                  <div>
                    {deployment?.gitUrl}
                  </div>
                  <div className="text-right" >
                    {new Date(deployment?.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-right">
                    <Button variant="outline">
Show Logs
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
