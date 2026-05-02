import TenderUpload from '@/components/TenderUpload';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">
        CRPF Tender Evaluation System
      </h1>
      <TenderUpload />
    </main>
  );
}
