"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Tool from "@/components/tool"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Tool />
      </main>
      <Footer />
    </div>
  )
}
