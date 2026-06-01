import { RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SettingsHeader() {
    return (
        <header className="border-b border-border pb-6">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
                        Team Workspace
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                        Team Settings
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage your team workspace and preferences
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="rounded-2xl border-border bg-muted px-5">
                        <RotateCcw className="h-4 w-4" />
                        Discard
                    </Button>
                    <Button variant="orange" className="rounded-2xl px-5">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </header>
    );
}
