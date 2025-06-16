import { useCallback, useEffect, useState } from "react";

import { useMountEffect } from "@react-hookz/web";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import { joinConversation, previewConversation } from "@/api";
import { PreviewConversationSchema } from "@/api/client/types.gen";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Skeleton } from "@/ui/skeleton";

export const Route = createFileRoute("/join/$token")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const { token } = Route.useParams();
    const navigate = useNavigate();
    const [conversation, setConversation] = useState<PreviewConversationSchema | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPreview() {
            const { data, error } = await previewConversation({
                body: { token },
            });

            if (!data) {
                throw error;
            }

            setConversation(data);
        }

        loadPreview().catch(() => {
            setError("Invalid or expired token.");
        });
    }, [token]);

    // Artificial delay so we don't see a flash of the loading state
    useMountEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    });

    const joinChat = useCallback(async () => {
        const { data, error } = await joinConversation({
            body: { token },
        });

        if (!data) {
            throw error;
        }

        await navigate({ to: "/chat/$chatId", params: { chatId: data.id } });
    }, [token, navigate]);

    /**************************************************************************/
    /* Render */
    return (
        <Dialog open>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>
                        {isLoading ? (
                            <Skeleton className="flex h-fit w-full items-center gap-1">
                                <p>
                                    Join Chat: <span className="text-primary-light">...</span>
                                </p>
                            </Skeleton>
                        ) : null}

                        {error && !isLoading ? <p>Error</p> : null}

                        {conversation && !isLoading ? (
                            <p>
                                Join Chat:{" "}
                                <span className="text-primary-light">{conversation.title}</span>
                            </p>
                        ) : null}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        <Skeleton className="flex h-fit w-full items-center gap-1">
                            <p>
                                Owner: <span className="text-primary-light">...</span>
                            </p>
                        </Skeleton>

                        <div className="flex gap-2">
                            <Button
                                disabled
                                variant="default"
                                onClick={joinChat}
                                className="hover:bg-primary-light hover:border-primary-light hover:text-background-dark basis-2/3"
                                tooltip={null}
                            >
                                Join Chat
                            </Button>

                            <Button
                                asChild
                                variant="default"
                                className="basis-1/3"
                                tooltip={null}
                            >
                                <Link to="/chat">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                ) : null}

                {error && !isLoading ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-primary">{error}</p>

                        <Button
                            asChild
                            variant="default"
                            tooltip={null}
                        >
                            <Link to="/chat">Return Home</Link>
                        </Button>
                    </div>
                ) : null}

                {conversation && !isLoading ? (
                    <div className="flex flex-col gap-4">
                        <p>
                            Owner:{" "}
                            <span className="text-primary-light">{conversation.owner.name}</span>
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={joinChat}
                                className="hover:bg-primary-light hover:border-primary-light hover:text-background-dark basis-2/3"
                                tooltip={null}
                            >
                                Join Chat
                            </Button>

                            <Button
                                asChild
                                variant="default"
                                className="basis-1/3"
                                tooltip={null}
                            >
                                <Link to="/chat">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
