"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Menu, X, ChefHat } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserNav } from "./common/UserNav";
import { usePathname } from "next/navigation";

type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
];

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-canvas/80 border-b border-border">
      {({ open }) => (
        <>
          <div className="container">
            <div className="flex h-20 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
                  <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-display font-bold tracking-tight text-text-primary">
                  RecipeAI
                </span>
              </Link>

              {/* Desktop Navigation */}
              {pathname === "/" && (
                <nav className="hidden md:flex items-center gap-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-base text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              )}

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    <Link href="/recipes">
                      <button className="btn-primary">
                        My Recipes
                      </button>
                    </Link>
                    <UserNav
                      image={user?.imageUrl}
                      name={user?.fullName!}
                      email={user?.primaryEmailAddress?.emailAddress!}
                    />
                  </>
                ) : (
                  <>
                    <Link href="/recipes">
                      <button className="btn-ghost">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/recipes">
                      <button className="btn-primary">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <DisclosureButton className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-surface transition-colors">
                {open ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </DisclosureButton>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="md:hidden border-t border-border bg-canvas">
            <div className="container py-4 space-y-4">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block text-lg text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              <div className="pt-4 space-y-3">
                <Link href="/recipes" className="block">
                  <button className="btn-ghost w-full">
                    Sign In
                  </button>
                </Link>
                <Link href="/recipes" className="block">
                  <button className="btn-primary w-full">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
