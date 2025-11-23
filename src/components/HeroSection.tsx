import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Sparkles, Database, Clock } from "lucide-react";

interface HeroSectionProps {
  setActiveSection: (section: string) => void;
}

export const HeroSection = ({ setActiveSection }: HeroSectionProps) => {
  const features = [
    {
      icon: Database,
      title: "Smart Data Management",
      description: "Store and manage teachers, labs, and sections efficiently"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Generate optimized timetables using advanced AI"
    },
    {
      icon: Calendar,
      title: "Conflict-Free Scheduling",
      description: "Automatic detection and resolution of scheduling conflicts"
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Instant updates and classroom availability tracking"
    }
  ];

  return (
    <div className="space-y-12 animate-slide-in-up">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-12 md:p-16 tech-grid">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Timetable Management
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create perfect schedules for your college with our advanced AI scheduling system. 
            Manage teachers, labs, and sections with ease while ensuring zero conflicts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={() => setActiveSection("add-records")}
              className="gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Database className="w-5 h-5" />
              Start Managing Data
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setActiveSection("generate")}
              className="gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Timetable
            </Button>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 glass-card hover:border-primary/50 transition-all hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <feature.icon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};