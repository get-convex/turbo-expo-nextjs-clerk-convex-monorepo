import Header from "@/components/notes/Header";
import NoteDetails from "@/components/notes/NoteDetails";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="bg-[#F5F7FE] h-screen">
      <Header title={params.slug} />
      <NoteDetails title={params.slug} />
    </main>
  );
}
