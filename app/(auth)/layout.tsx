export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0604] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,112,34,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,112,34,0.07)_1px,transparent_1px)] bg-[size:128px_128px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,112,34,0.18),transparent_36%),radial-gradient(circle_at_50%_60%,rgba(255,112,34,0.09),transparent_42%)]" />
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </main>
  );
}
