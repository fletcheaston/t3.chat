import { useState } from "react";
import * as React from "react";

import { useNavigate } from "@tanstack/react-router";
import { ArrowUpIcon } from "lucide-react";
import { toast } from "sonner";

import { LargeLanguageModel } from "@/api";
import { useUser } from "@/components/auth";
import { ModelSelect } from "@/components/model-select";
import { createConversation } from "@/sync/data";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils";

export function CreateConversation() {
    /**************************************************************************/
    /* State */
    const user = useUser();

    const navigate = useNavigate();

    const [llms, setLlms] = useState<Array<LargeLanguageModel>>([]);
    const [message, setMessage] = useState("");

    const empty = message === "";

    /**************************************************************************/
    /* Render */
    return (
        <div className="bg-background/50 rounded-t-2xl p-2 pb-0 backdrop-blur-xs">
            <div className="bg-background-light/30 mb-0 flex flex-col justify-between gap-2 rounded-t-xl p-3 backdrop-blur-xs">
                <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message here..."
                    className="max-h-48"
                />

                <div className="flex items-center justify-between">
                    <ModelSelect
                        llms={llms}
                        setLlms={setLlms}
                    />

                    <Button
                        size="icon"
                        className={cn(
                            "bg-primary-light",
                            empty ? "cursor-default opacity-50" : "hover:bg-primary"
                        )}
                        onClick={async () => {
                            if (!message) return;

                            const tempMessage = message;

                            setMessage("");

                            try {
                                await createConversation(user.id, message, llms, async (id) => {
                                    // Navigate to the chat page
                                    await navigate({
                                        to: "/chat/$chatId",
                                        params: { chatId: id },
                                    });
                                });
                            } catch (e) {
                                toast.error(`Unable to create chat: ${e}`);
                                setMessage(tempMessage);
                            }
                        }}
                        tooltip={empty ? "Message requires text" : "Send message"}
                    >
                        <ArrowUpIcon className="text-background-dark size-5" />
                        <span className="sr-only">Send Message</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
