import { supabase, type Profile, type ProfileInsert, type ProfileUpdate, type ProfileContact } from './supabase';

export interface ProfileWithStats extends Profile {
  totalListings?: number;
  activeCampaigns?: number;
  status?: 'Active' | 'InActive';
  email?: string;
}

export class ProfileService {
  /**
   * Get all profiles with optional filtering
   */
  static async getAllProfiles(): Promise<ProfileWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      // Get space counts for each profile
      const profilesWithStats = await Promise.all(
        data.map(async (profile) => {
          const { totalListings, activeCampaigns } = await this.getUserSpaceCounts(profile.id);
          return {
            ...profile,
            totalListings,
            activeCampaigns,
            status: profile.user_status || 'InActive' as const,
            email: '', // TODO: Get email from auth.users if needed
          };
        })
      );

      return profilesWithStats;
    } catch (error) {
      console.error('Error in getAllProfiles:', error);
      throw error;
    }
  }

  /**
   * Get user's spaces with details
   */
  static async getUserSpaces(profileId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('space')
        .select(`
          *,
          address:address_id(*),
          space_media(*)
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user spaces:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserSpaces:', error);
      return [];
    }
  }

  /**
   * Get space counts for a specific user
   */
  static async getUserSpaceCounts(profileId: string): Promise<{ totalListings: number; activeCampaigns: number }> {
    try {
      // Get total spaces count
      const { count: totalSpaces, error: totalError } = await supabase
        .from('space')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId);

      if (totalError) {
        console.error('Error fetching total spaces count:', totalError);
        throw totalError;
      }

      // Get approved spaces count (active campaigns)
      const { count: approvedSpaces, error: approvedError } = await supabase
        .from('space')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('list_status', 'approved');

      if (approvedError) {
        console.error('Error fetching approved spaces count:', approvedError);
        throw approvedError;
      }

      return {
        totalListings: totalSpaces || 0,
        activeCampaigns: approvedSpaces || 0,
      };
    } catch (error) {
      console.error('Error in getUserSpaceCounts:', error);
      return {
        totalListings: 0,
        activeCampaigns: 0,
      };
    }
  }

  /**
   * Get a single profile by ID
   */
  static async getProfileById(id: string): Promise<ProfileWithStats | null> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      const { totalListings, activeCampaigns } = await this.getUserSpaceCounts(id);

      return {
        ...data,
        totalListings,
        activeCampaigns,
        status: data.user_status || 'InActive' as const,
        email: '',
      };
    } catch (error) {
      console.error('Error in getProfileById:', error);
      throw error;
    }
  }

  /**
   * Create a new profile
   */
  static async createProfile(profileData: ProfileInsert): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  }

  /**
   * Update an existing profile
   */
  static async updateProfile(id: string, updates: ProfileUpdate): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  /**
   * Update user status
   */
  static async updateUserStatus(id: string, status: 'Active' | 'InActive'): Promise<Profile> {
    try {
      // Save the actual enum value directly
      console.log('Updating user status:', { id, status });
      
      const { data, error } = await supabase
        .from('profile')
        .update({ user_status: status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user status:', error);
        throw error;
      }

      console.log('Database response:', { data, error });
      return data;
    } catch (error) {
      console.error('Error in updateUserStatus:', error);
      throw error;
    }
  }

  /**
   * Delete a profile
   */
  static async deleteProfile(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw error;
    }
  }

  /**
   * Search profiles by name or phone
   */
  static async searchProfiles(query: string): Promise<ProfileWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching profiles:', error);
        throw error;
      }

      // Get space counts for each profile
      const profilesWithStats = await Promise.all(
        data.map(async (profile) => {
          const { totalListings, activeCampaigns } = await this.getUserSpaceCounts(profile.id);
          return {
            ...profile,
            totalListings,
            activeCampaigns,
            status: profile.user_status || 'InActive' as const,
            email: '',
          };
        })
      );

      return profilesWithStats;
    } catch (error) {
      console.error('Error in searchProfiles:', error);
      throw error;
    }
  }

  /**
   * Get profiles with pagination
   */
  static async getProfilesPaginated(
    page: number = 1,
    limit: number = 10,
    searchQuery?: string
  ): Promise<{ data: ProfileWithStats[]; total: number; page: number; limit: number }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('profile')
        .select('*', { count: 'exact' });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching paginated profiles:', error);
        throw error;
      }

      // Get space counts for each profile
      const transformedData = await Promise.all(
        data.map(async (profile) => {
          const { totalListings, activeCampaigns } = await this.getUserSpaceCounts(profile.id);
          return {
            ...profile,
            totalListings,
            activeCampaigns,
            status: profile.user_status || 'InActive' as const,
            email: '',
          };
        })
      );

      return {
        data: transformedData,
        total: count || 0,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error in getProfilesPaginated:', error);
      throw error;
    }
  }

  /**
   * Get user contact details
   */
  static async getUserContactDetails(userId: string): Promise<ProfileContact[]> {
    try {
      const { data, error } = await supabase
        .from('profile_contact')
        .select('*')
        .eq('userid', userId)
        .order('contactname', { ascending: true });

      if (error) {
        console.error('Error fetching user contact details:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserContactDetails:', error);
      throw error;
    }
  }
}
