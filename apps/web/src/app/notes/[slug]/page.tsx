import Header from '@/components/Header';
import NoteDetails from '@/components/notes/NoteDetails';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="bg-[#F5F7FE] h-screen">
      <Header />
      <NoteDetails title={params.slug} />
    </main>
  );
}
