import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TeacherForm } from "./forms/TeacherForm";
import { SectionForm } from "./forms/SectionForm";
import { LabForm } from "./forms/LabForm";
import { TimingForm } from "./forms/TimingForm";

export const AddRecordsSection = () => {
  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Add Records</h2>
        <p className="text-muted-foreground">
          Manage your college's data - teachers, sections, labs, and timings
        </p>
      </div>

      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="labs">Classrooms</TabsTrigger>
          <TabsTrigger value="timings">Timings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers" className="mt-6">
          <Card className="p-6 glass-card">
            <TeacherForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="sections" className="mt-6">
          <Card className="p-6 glass-card">
            <SectionForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="labs" className="mt-6">
          <Card className="p-6 glass-card">
            <LabForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="timings" className="mt-6">
          <Card className="p-6 glass-card">
            <TimingForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};