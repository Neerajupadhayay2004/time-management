import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AddRecordsSection } from "@/components/AddRecordsSection";
import { GenerateTimetableSection } from "@/components/GenerateTimetableSection";
import { ActionButtons } from "@/components/ActionButtons";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("home");

  return (
    <div className="min-h-screen">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="container mx-auto px-4 py-8">
        {activeSection === "home" && <HeroSection setActiveSection={setActiveSection} />}
        {activeSection === "add-records" && <AddRecordsSection />}
        {activeSection === "generate" && <GenerateTimetableSection />}
        {activeSection === "actions" && <ActionButtons />}
      </main>
    </div>
  );
};

export default Index;