import { Play, FileText, Paperclip } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FaGithub } from "react-icons/fa";

const links = [
    {
        title: "Github",
        icon: FaGithub,
    },
    {
        title: "Demo Video",
        icon: Play,
    },
    {
        title: "Slides",
        icon: FileText,
    },
    {
        title: "Attachments",
        icon: Paperclip,
    },
];

export function SubmissionLinks() {
    return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {links.map((item) => {
                const Icon = item.icon;

                return (
                    <GlassCard
                        key={item.title}
                        className="p-4 seal-card-hover"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/15 p-3">
                                <Icon size={18} />
                            </div>

                            <div>
                                <h4 className="font-medium">
                                    {item.title}
                                </h4>

                                <p className="text-xs text-muted-foreground">
                                    Open resource
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
}