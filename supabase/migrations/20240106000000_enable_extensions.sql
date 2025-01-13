-- Enable pg_trgm for text search
create extension if not exists pg_trgm;

-- Enable moddatetime for automatic timestamp updates
create extension if not exists moddatetime schema extensions; 