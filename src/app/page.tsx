"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25 }}
            className="text-[8rem] md:text-[12rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            Amplifi
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.25, delay: 1 }}
            className="text-white/60 tracking-[0.3em] uppercase text-sm"
          >
            Music Streaming
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            {/* Log In Button */}
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-white border border-white/20 min-w-[160px] transition-all duration-300 hover:scale-105 
                bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"
>
                Log in
              </Button>
            </Link>

          
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <div>© 2024 Amplifi. All rights reserved.</div>
          <nav className="flex gap-8">
            <Link href="/Privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/Terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
