import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Logs({ logs }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Logs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Logs</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        {logs.length > 0 ? (
            <div
              className={`overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] text-sm logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-x-auto`}
            >
              <pre className="flex flex-col gap-1 source-code">
                {logs.map((log, i) => (
                  <code
                    className={
                      log?.type === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                    key={i}
                  >{`> ${log.logMessage}`}</code>
                ))}
              </pre>
            </div>
          ): (
            <div className="flex gap-3 justify-center font-semibold">
              <p>No logs found</p>
            </div>
          )}
        <DialogFooter>
          {/* <Button type="">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
