import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { configData, userPrompt, sections } = await req.json();
    console.log('Generating timetable for sections:', sections);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build the AI prompt
    const systemPrompt = `You are an expert academic scheduler AI. Generate an optimized, conflict-free weekly timetable based on the details and constraints provided. Generate TimeTable For Each Section. The college mess can hold up to 7 section students together. Each section student will consume 20 minutes time for lunch. So allow sections for lunch properly such that no class gets vacant due to lunch time and the mess doesn't get full with students. We have limited number of labs and we want each section student gets equal number of labs and class subject study hours. Also we want each subject teacher gets equal number of hours for teaching students. In your generated timetable, must show subject name, teacher name, room name so that students get better user experience.

Important: Give your output in ONLY YAML format, no other text. The output must follow this exact structure:

timetable:
  section: "String (Section Name)"
  schedule:
    Monday:
      - time: "HH:MM - HH:MM"
        subject: "Subject Name"
        teacher: "Teacher Code - Teacher Name"
        room: "Room Number or Lab Name"
        note: "Optional note"
    Tuesday:
      - time: "HH:MM - HH:MM"
        subject: "Subject Name"
        teacher: "Teacher Code - Teacher Name"
        room: "Room Number or Lab Name"
    Wednesday:
      - time: "HH:MM - HH:MM"
        subject: "Subject Name"
        teacher: "Teacher Code - Teacher Name"
        room: "Room Number or Lab Name"
    Thursday:
      - time: "HH:MM - HH:MM"
        subject: "Subject Name"
        teacher: "Teacher Code - Teacher Name"
        room: "Room Number or Lab Name"
    Friday:
      - time: "HH:MM - HH:MM"
        subject: "Subject Name"
        teacher: "Teacher Code - Teacher Name"
        room: "Room Number or Lab Name"
load_distribution:
  TeacherCode_TeacherName:
    theory_hours: Integer
    subjects: ["Subject1", "Subject2"]
  Labs:
    total_hours: Integer
    distribution: "Description"`;

    const userMessage = `Configuration Data:
${JSON.stringify(configData, null, 2)}

Sections to generate: ${sections.join(', ')}

${userPrompt ? `Additional Constraints: ${userPrompt}` : ''}

Generate complete timetables for the specified sections following all constraints.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated timetable:', generatedContent);

    return new Response(
      JSON.stringify({ timetable: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-timetable function:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});