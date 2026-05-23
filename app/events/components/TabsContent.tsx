import OverviewTab from "./tabs/OverviewTab";
import PrizesTab from "./tabs/PrizesTab";
import CriteriaTab from "./tabs/CriteriaTab";
import SubmitTab from "./tabs/SubmitTab";

interface TabsContentProps {
    activeTab: "overview" | "prizes" | "criteria" | "submit";
}

export default function TabsContent({ activeTab }: TabsContentProps) {
    switch (activeTab) {
        case "overview":
            return <OverviewTab />;
        case "prizes":
            return <PrizesTab />;
        case "criteria":
            return <CriteriaTab />;
        case "submit":
            return <SubmitTab />;
        default:
            return null;
    }
}