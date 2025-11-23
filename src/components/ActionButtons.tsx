import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ActionButtons = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [freeRooms, setFreeRooms] = useState<string[]>([]);
  const { toast } = useToast();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleTakeAttendance = () => {
    window.open("https://google.com", "_blank");
  };

  const handleGetFreeClass = async () => {
    if (!selectedDay) {
      toast({
        title: "Error",
        description: "Please select a day",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get latest generated timetable
      const { data: timetables } = await supabase
        .from('generated_timetables')
        .select('timetable_data')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!timetables || timetables.length === 0) {
        toast({
          title: "Info",
          description: "No timetables generated yet",
        });
        return;
      }

      const timetableData = timetables[0].timetable_data as any;
      const schedule = timetableData?.timetable?.schedule?.[selectedDay] || [];
      
      // Get config to find total rooms
      const { data: config } = await supabase
        .from('timetable_config')
        .select('config_data')
        .single();

      const configData = config?.config_data as any;
      const totalRooms = configData?.room_count || 100;
      const usedRooms = new Set(schedule.map((slot: any) => slot.room));
      
      const allRooms = Array.from({ length: totalRooms }, (_, i) => `Room ${i + 1}`);
      const free = allRooms.filter(room => !usedRooms.has(room));
      
      setFreeRooms(free);

      toast({
        title: "Success",
        description: `Found ${free.length} free rooms for ${selectedDay}`,
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
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Quick Actions</h2>
        <p className="text-muted-foreground">
          Access attendance and classroom availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 glass-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Take Attendance</h3>
                <p className="text-sm text-muted-foreground">
                  Record student attendance
                </p>
              </div>
            </div>
            <Button onClick={handleTakeAttendance} className="w-full gap-2">
              <Users className="w-4 h-4" />
              Open Attendance System
            </Button>
          </div>
        </Card>

        <Card className="p-6 glass-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-semibold text-lg">Find Free Classrooms</h3>
                <p className="text-sm text-muted-foreground">
                  Check room availability
                </p>
              </div>
            </div>
            
            <div>
              <Label>Select Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a day" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGetFreeClass} variant="secondary" className="w-full gap-2">
              <CalendarIcon className="w-4 h-4" />
              Get Free Classrooms
            </Button>

            {freeRooms.length > 0 && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg max-h-60 overflow-y-auto">
                <h4 className="font-semibold mb-2">Available Rooms:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {freeRooms.slice(0, 20).map((room) => (
                    <div key={room} className="text-sm text-muted-foreground">
                      {room}
                    </div>
                  ))}
                </div>
                {freeRooms.length > 20 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{freeRooms.length - 20} more rooms
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};