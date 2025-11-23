import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TimingForm = () => {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [lunchStart, setLunchStart] = useState("12:30");
  const [lunchEnd, setLunchEnd] = useState("14:30");
  const [lunchBreakMinutes, setLunchBreakMinutes] = useState("60");
  const [roomCount, setRoomCount] = useState("100");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: existingConfig } = await supabase
        .from('timetable_config')
        .select('*')
        .single();

      let configData: any = existingConfig?.config_data || { teachers: {}, labs: {}, sections: {}, timing: {}, lunch: {} };
      
      configData.timing = {
        start: startTime,
        end: endTime,
        duration_minutes: parseInt(durationMinutes)
      };
      
      configData.lunch = {
        start: lunchStart,
        end: lunchEnd,
        student_break_Minutes: lunchBreakMinutes
      };
      
      configData.room_count = parseInt(roomCount);

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
        description: "Timing configuration saved successfully",
      });
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="durationMinutes">Class Duration (minutes)</Label>
          <Input
            id="durationMinutes"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="lunchStart">Lunch Start</Label>
          <Input
            id="lunchStart"
            type="time"
            value={lunchStart}
            onChange={(e) => setLunchStart(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="lunchEnd">Lunch End</Label>
          <Input
            id="lunchEnd"
            type="time"
            value={lunchEnd}
            onChange={(e) => setLunchEnd(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="lunchBreakMinutes">Student Break (minutes)</Label>
          <Input
            id="lunchBreakMinutes"
            type="number"
            value={lunchBreakMinutes}
            onChange={(e) => setLunchBreakMinutes(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="roomCount">Total Rooms Available</Label>
        <Input
          id="roomCount"
          type="number"
          value={roomCount}
          onChange={(e) => setRoomCount(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Save Timing Configuration
      </Button>
    </form>
  );
};