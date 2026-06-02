import EventCard from "./event-card";

const events = [
    {
        id: 1,
        name: "SEAL Hackathon 2026",
        category: "AI/ML",
        round: "Semi Final",
        teams: 48,
        deadline: "18h",
        progress: 75,
    },
    {
        id: 2,
        name: "Cloud Arena",
        category: "Cloud",
        round: "Final",
        teams: 32,
        deadline: "2 days",
        progress: 60,
    },
    {
        id: 3,
        name: "Cyber Shield",
        category: "Cyber Security",
        round: "Round 2",
        teams: 26,
        deadline: "5h",
        progress: 90,
    },
    {
        id: 4,
        name: "EduVerse",
        category: "EdTech",
        round: "Round 1",
        teams: 40,
        deadline: "3 days",
        progress: 40,
    },
];

export default function EventsList() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                />
            ))}
        </div>
        
    );
}