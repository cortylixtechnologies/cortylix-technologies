-- Create portfolio_projects table
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Public can view all projects
CREATE POLICY "Anyone can view portfolio projects"
ON public.portfolio_projects
FOR SELECT
USING (true);

-- Only admins can insert projects
CREATE POLICY "Admins can insert portfolio projects"
ON public.portfolio_projects
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update projects
CREATE POLICY "Admins can update portfolio projects"
ON public.portfolio_projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete projects
CREATE POLICY "Admins can delete portfolio projects"
ON public.portfolio_projects
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();