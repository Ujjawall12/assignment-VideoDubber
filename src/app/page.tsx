import DiscordColoredTextGenerator from "@/components/DiscordColoredTextGenerator";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen py-8 px-4">
      <div className="max-w-3xl w-full">
        <DiscordColoredTextGenerator />
      </div>
    </main>
  );
}
