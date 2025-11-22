import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-beige py-12 border-t border-gray-200">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-display font-bold text-xl text-black">RecipeAI</span>
        <div className="flex gap-8 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-black transition-colors">Contact</Link>
        </div>
        <span className="text-sm text-gray-500">© 2025 RecipeAI. All rights reserved.</span>
      </div>
    </footer>
  );
}
