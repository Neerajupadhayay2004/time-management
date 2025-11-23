import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TimetableDisplayProps {
  data: any;
}

export const TimetableDisplay = ({ data }: TimetableDisplayProps) => {
  if (!data?.timetable?.schedule) return null;

  const days = Object.keys(data.timetable.schedule);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day) => (
              data.timetable.schedule[day].map((slot: any, index: number) => (
                <TableRow key={`${day}-${index}`}>
                  {index === 0 && (
                    <TableCell rowSpan={data.timetable.schedule[day].length} className="font-semibold">
                      {day}
                    </TableCell>
                  )}
                  <TableCell>{slot.time}</TableCell>
                  <TableCell className="font-medium">{slot.subject}</TableCell>
                  <TableCell className="text-primary">{slot.teacher}</TableCell>
                  <TableCell>{slot.room}</TableCell>
                  <TableCell className="text-muted-foreground">{slot.note || '-'}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>

      {data.load_distribution && (
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-2">Load Distribution</h4>
          <div className="text-sm text-muted-foreground">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data.load_distribution, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};