"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProductSelector from "@/components/ProductSelector";
import Reviews from "@/components/Reviews";
import StoreLocation from "@/components/StoreLocation";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <div className="section-divider mx-auto max-w-3xl" />
        <ProductSelector />
        <Reviews />
        <div className="section-divider mx-auto max-w-3xl" />
        <StoreLocation />
        <OrderForm />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
