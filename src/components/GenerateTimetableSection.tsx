import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Download, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimetableDisplay } from "./TimetableDisplay";
import yaml from "js-yaml";

export const GenerateTimetableSection = () => {
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const { data } = await supabase
        .from('timetable_config')
        .select('config_data')
        .single();

      if (data?.config_data) {
        const configData = data.config_data as any;
        if (configData.sections) {
          setSections(Object.keys(configData.sections));
        }
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const handleGenerate = async () => {
    if (selectedSections.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one section",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: configData } = await supabase
        .from('timetable_config')
        .select('config_data')
        .single();

      if (!configData) {
        toast({
          title: "Error",
          description: "No configuration data found. Please add records first.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-timetable', {
        body: {
          configData: configData.config_data,
          userPrompt,
          sections: selectedSections
        }
      });

      if (error) throw error;

      // Parse YAML output
      const parsedTimetable = yaml.load(data.timetable);
      setGeneratedTimetable(parsedTimetable);

      // Save to database
      await supabase.from('generated_timetables').insert([{
        section_name: selectedSections.join(', '),
        timetable_data: parsedTimetable as any,
        user_prompt: userPrompt
      }]);

      toast({
        title: "Success",
        description: "Timetable generated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate timetable",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (!generatedTimetable) return;

    // Convert timetable to CSV
    let csv = "Day,Time,Subject,Teacher,Room,Note\n";
    
    Object.entries(generatedTimetable.timetable?.schedule || {}).forEach(([day, slots]: [string, any]) => {
      slots.forEach((slot: any) => {
        csv += `${day},${slot.time},${slot.subject},${slot.teacher},${slot.room},${slot.note || ''}\n`;
      });
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${generatedTimetable.timetable?.section || 'export'}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Generate Timetable</h2>
        <p className="text-muted-foreground">
          Use AI to generate optimized timetables for your sections
        </p>
      </div>

      <Card className="p-6 glass-card">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromSection">From Section</Label>
              <Select value={selectedSections[0] || ""} onValueChange={(value) => {
                const fromIndex = sections.indexOf(value);
                if (selectedSections.length > 1) {
                  const toIndex = sections.indexOf(selectedSections[selectedSections.length - 1]);
                  if (fromIndex <= toIndex) {
                    setSelectedSections(sections.slice(fromIndex, toIndex + 1));
                  }
                } else {
                  setSelectedSections([value]);
                }
              }}>
                <SelectTrigger id="fromSection">
                  <SelectValue placeholder="Select starting section" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="toSection">To Section</Label>
              <Select value={selectedSections[selectedSections.length - 1] || ""} onValueChange={(value) => {
                const toIndex = sections.indexOf(value);
                if (selectedSections.length > 0) {
                  const fromIndex = sections.indexOf(selectedSections[0]);
                  if (fromIndex <= toIndex) {
                    setSelectedSections(sections.slice(fromIndex, toIndex + 1));
                  }
                } else {
                  setSelectedSections([value]);
                }
              }}>
                <SelectTrigger id="toSection">
                  <SelectValue placeholder="Select ending section" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSections.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected sections: {selectedSections.join(', ')}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Add Custom Constraints (Optional)
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Custom Constraints</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="e.g., Maths Teacher has a meeting on Monday at 9am for 1 hour"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={5}
              />
              <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={handleGenerate} 
            className="w-full gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Timetable
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedTimetable && (
        <Card className="p-6 glass-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Generated Timetable</h3>
            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
          <TimetableDisplay data={generatedTimetable} />
        </Card>
      )}
    </div>
  );
};