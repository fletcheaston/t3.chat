import { Users } from "lucide-react";

import { useMessages, useUserMap } from "@/sync/conversation";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";

import { llmToName } from "./models";

export function MembersDialog() {
    /**************************************************************************/
    /* State */
    const userMap = useUserMap();
    const messages = useMessages();

    console.log(messages.length);

    // Calculate message counts
    const userMessageCounts = Object.fromEntries(
        Object.keys(userMap).map((userId) => [
            userId,
            messages.filter((msg) => msg.authorId === userId).length,
        ])
    );

    const llmMessageCounts = Object.fromEntries(
        Object.keys(llmToName).map((llm) => [llm, messages.filter((msg) => msg.llm === llm).length])
    );

    /**************************************************************************/
    /* Render */
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    tooltip="View Members"
                >
                    <Users className="h-5 w-5" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Conversation Members</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-lg">Users</h3>

                        <div className="flex flex-col gap-1">
                            {Object.values(userMap).map((user) => {
                                const count = userMessageCounts[user.id];

                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between gap-2 border-b py-1 text-sm"
                                    >
                                        <div className="grow">
                                            <p className="font-medium">{user.name}</p>
                                        </div>

                                        <div>
                                            {count} {count === 1 ? "message" : "messages"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg">Models</h3>

                        <div className="flex flex-col gap-1">
                            {Object.entries(llmToName).map(([llm, name]) => {
                                const count = llmMessageCounts[llm];

                                if (!count) return;

                                return (
                                    <div
                                        key={llm}
                                        className="flex items-center justify-between gap-2 border-b py-1 text-sm"
                                    >
                                        <div className="grow">
                                            <p className="font-medium">{name}</p>
                                        </div>

                                        <div>
                                            {count} {count === 1 ? "message" : "messages"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
