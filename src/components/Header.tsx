import { Calendar, Plus, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header = ({ activeSection, setActiveSection }: HeaderProps) => {
  const NavButton = ({ section, icon: Icon, label }: { section: string; icon: any; label: string }) => (
    <Button
      variant={activeSection === section ? "default" : "ghost"}
      onClick={() => setActiveSection(section)}
      className="gap-2"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="w-8 h-8 text-primary animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">TimeTable AI</h1>
              <p className="text-xs text-muted-foreground">Advanced Scheduling System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavButton section="home" icon={Calendar} label="Home" />
            <NavButton section="add-records" icon={Plus} label="Add Records" />
            <NavButton section="generate" icon={Sparkles} label="Generate" />
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card">
              <div className="flex flex-col gap-4 mt-8">
                <NavButton section="home" icon={Calendar} label="Home" />
                <NavButton section="add-records" icon={Plus} label="Add Records" />
                <NavButton section="generate" icon={Sparkles} label="Generate" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};