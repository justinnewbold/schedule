import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wektbfkzbxvtxsremnnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla3RiZmt6Ynh2dHhzcmVtbm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDcyNjMsImV4cCI6MjA4MTQyMzI2M30.-oLnJRoDBpqgzDZ7bM3fm6TXBNGH6SaRpnKDiHQZ3_4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Schedule API functions
export const scheduleApi = {
  // Load schedule from Supabase
  async load(userId = 'justin') {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error loading schedule:', error);
      return null;
    }
    
    return data?.schedule_data || null;
  },

  // Save schedule to Supabase
  async save(scheduleData, userId = 'justin') {
    // First check if a record exists
    const { data: existing } = await supabase
      .from('schedules')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('schedules')
        .update({ 
          schedule_data: scheduleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating schedule:', error);
        return false;
      }
      return true;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('schedules')
        .insert({ 
          user_id: userId,
          schedule_data: scheduleData
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting schedule:', error);
        return false;
      }
      return true;
    }
  },

  // Delete schedule from Supabase
  async delete(userId = 'justin') {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting schedule:', error);
      return false;
    }
    return true;
  }
};
