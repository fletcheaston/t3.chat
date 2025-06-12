import { useState } from "react";
import * as React from "react";

import { ArrowUpIcon } from "lucide-react";

import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";

export function MessageWindow(props: { sendMessage: (content: string) => Promise<void> }) {
    /**************************************************************************/
    /* State */
    const [message, setMessage] = useState("");

    /**************************************************************************/
    /* Render */
    return (
        <div className="bg-gunmetal/50 rounded-t-2xl p-2 pb-0 backdrop-blur-xs">
            <div className="bg-gunmetal-light/30 mb-0 flex flex-col justify-between gap-2 rounded-t-xl p-3 backdrop-blur-xs">
                <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message here..."
                    className="max-h-48"
                />

                <div className="flex items-center justify-between">
                    <p className="text-pantone-light">Model name</p>

                    <Button
                        size="icon"
                        className="hover:bg-pantone bg-pantone-light"
                        onClick={() => {
                            if (!message) return;

                            props.sendMessage(message).then(() => setMessage(""));
                        }}
                    >
                        <ArrowUpIcon className="text-gunmetal-dark size-5" />
                        <span className="sr-only">Send Message</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
