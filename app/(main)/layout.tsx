import Header from "@/components/layout/public/header";
import Footer from "@/components/layout/public/footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main>
                {children}
            </main>

            <Footer />
        </div>
    );
}