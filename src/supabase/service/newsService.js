import auth from "../auth";

export const getNews = async (page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const { data, error } = await auth.supabase
    .from('news')
    .select('id, title, image_url, created_at')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching news:', error);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
  return data;
};

export const createNews = async (newsData) => {
  const { title, image_url } = newsData;
  if (!title || !image_url) {
    throw new Error('Title and image URL are required');
  }
  const { data, error } = await auth.supabase
    .from('news')
    .insert([{ title, image_url }])
    .select()
    .single();

  if (error) {
    console.error('Error creating news:', error);
    throw new Error(`Failed to create news: ${error.message}`);
  }
  return data;
};

export const getAllNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deleteNews = async (id) => {
  if (!id) throw new Error('Invalid news ID');
  const { data, error } = await auth.supabase
    .from('news')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error deleting news:', error);
    throw new Error(`Failed to delete news: ${error.message}`);
  }
  return data || true;

  
};