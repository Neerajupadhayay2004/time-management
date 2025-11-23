import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LabForm = () => {
  const [classroomName, setClassroomName] = useState("");
  const [classroomType, setClassroomType] = useState<"theoretical" | "practical">("theoretical");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: existingConfig } = await supabase
        .from('timetable_config')
        .select('*')
        .single();

      let configData: any = existingConfig?.config_data || { teachers: {}, labs: {}, sections: {}, timing: {}, lunch: {}, classrooms: {} };
      
      configData.classrooms = configData.classrooms || {};
      configData.classrooms[classroomName] = classroomType;

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
        description: "Classroom added successfully",
      });

      setClassroomName("");
      setClassroomType("theoretical");
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
        <Label htmlFor="classroomName">Classroom Name</Label>
        <Input
          id="classroomName"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          placeholder="e.g., Room 101"
          required
        />
      </div>

      <div>
        <Label htmlFor="classroomType">Classroom Type</Label>
        <Select value={classroomType} onValueChange={(value: "theoretical" | "practical") => setClassroomType(value)}>
          <SelectTrigger id="classroomType">
            <SelectValue placeholder="Select classroom type" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="theoretical">Theoretical Class</SelectItem>
            <SelectItem value="practical">Practical Classroom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Add Classroom
      </Button>
    </form>
  );
};