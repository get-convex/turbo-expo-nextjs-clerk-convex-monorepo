import Header from "@/components/Header";
import NoteDetails from "@/components/notes/NoteDetails";
import { Id } from "@packages/backend/convex/_generated/dataModel";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="bg-[#F5F7FE] h-screen">
      <Header />
      <NoteDetails noteId={params.slug as Id<"notes">} />
    </main>
  );
}
