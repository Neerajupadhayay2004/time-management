-- Create table for storing timetable configuration (the input YAML data)
CREATE TABLE IF NOT EXISTS public.timetable_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for storing generated timetables (the AI output)
CREATE TABLE IF NOT EXISTS public.generated_timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  timetable_data JSONB NOT NULL,
  user_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timetable_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_timetables ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for this use case)
CREATE POLICY "Allow public read access to timetable_config"
  ON public.timetable_config FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to timetable_config"
  ON public.timetable_config FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to timetable_config"
  ON public.timetable_config FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read access to generated_timetables"
  ON public.generated_timetables FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to generated_timetables"
  ON public.generated_timetables FOR INSERT
  WITH CHECK (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_timetable_config_updated_at
  BEFORE UPDATE ON public.timetable_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();