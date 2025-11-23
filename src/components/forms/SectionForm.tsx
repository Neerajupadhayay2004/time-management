import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availableSubjects = [
  "Maths", "Verbal", "DSA", "DAA", "EmergingTech", 
  "MachineLearning", "UIUX", "Python",
  "MachineLearning_Practical", "DSA_Practical", 
  "DAA_Practical", "UIUX_Practical", "Python_Practical"
];

export const SectionForm = () => {
  const [sectionName, setSectionName] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const { toast } = useToast();

  const handleAddSubject = () => {
    if (currentSubject && !selectedSubjects.includes(currentSubject)) {
      setSelectedSubjects([...selectedSubjects, currentSubject]);
      setCurrentSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: existingConfig } = await supabase
        .from('timetable_config')
        .select('*')
        .single();

      let configData: any = existingConfig?.config_data || { teachers: {}, labs: {}, sections: {}, timing: {}, lunch: {} };
      
      configData.sections = configData.sections || {};
      configData.sections[sectionName] = {
        subjects: selectedSubjects
      };

      if (existingConfig) {
        await supabase
          .from('timetable_config')
          .update({ config_data: configData })
          .eq('id', existingConfig.id);
      } else {
        await supabase
          .from('timetable_config')
          .insert({ config_data: configData });
      }

      toast({
        title: "Success",
        description: "Section added successfully",
      });

      setSectionName("");
      setSelectedSubjects([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="sectionName">Section Name</Label>
        <Input
          id="sectionName"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="e.g., 1CSE22"
          required
        />
      </div>

      <div>
        <Label>Subjects</Label>
        <div className="flex gap-2 mb-2">
          <Select value={currentSubject} onValueChange={setCurrentSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {availableSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleAddSubject} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map((subject) => (
            <div
              key={subject}
              className="flex items-center gap-2 bg-secondary/20 text-secondary px-3 py-1 rounded-md"
            >
              {subject}
              <button
                type="button"
                onClick={() => handleRemoveSubject(subject)}
                className="hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Add Section
      </Button>
    </form>
  );
};