import { supabase } from '../lib/supabase';

export interface Guest {
  id: string;
  full_name: string;
  is_attending: boolean | null;
  plus_one_allowed: boolean;
  plus_one_name: string | null;
}

// 1. Chercher un invité par son nom (insensible aux majuscules/minuscules)
export async function findGuestByName(name: string): Promise<Guest | null> {
  const formattedName = name.trim();

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .ilike('full_name', formattedName)
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la recherche :', error.message);
    return null;
  }

  return data;
}

// 2. Mettre à jour la réponse (RSVP) de l'invité
export async function updateGuestRSVP(
  guestId: string,
  isAttending: boolean,
  plusOneName?: string
) {
  const { data, error } = await supabase
    .from('guests')
    .update({
      is_attending: isAttending,
      plus_one_name: plusOneName || null,
    })
    .eq('id', guestId)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour :', error.message);
    return null;
  }

  return data;
}
