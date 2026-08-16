import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Guest, updateGuestRSVP } from './services/guestService';

export default function App() {
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [plusOneName, setPlusOneName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Lorsque l'invité est trouvé via Supabase
  const handleGuestFound = (guest: Guest) => {
    setCurrentGuest(guest);
    setIsAttending(guest.is_attending);
    setPlusOneName(guest.plus_one_name || '');
  };

  // Envoi de la réponse (RSVP)
  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGuest || isAttending === null) return;

    setLoading(true);

    const updated = await updateGuestRSVP(
      currentGuest.id,
      isAttending,
      currentGuest.plus_one_allowed ? plusOneName : undefined
    );

    if (updated) {
      setCurrentGuest(updated);
      setIsSubmitted(true);
    }

    setLoading(false);
  };

  return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', padding: '20px' }}>
      {!currentGuest ? (
        // Étape 1 : Formulaire de connexion par nom
        <LoginForm onGuestFound={handleGuestFound} />
      ) : (
        // Étape 2 : Carte d'invitation personnalisée & Confirmation RSVP
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', border: '1px solid #eaeaea', borderRadius: '12px', textAlign: 'center' }}>
          <h1>Invitation à notre Mariage</h1>
          <h2>Bonjour {currentGuest.full_name} !</h2>
          <p>Nous serions ravis de vous compter parmi nous pour célébrer ce grand jour.</p>

          {isSubmitted ? (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ecfdf5', borderRadius: '8px', color: '#065f46' }}>
              <h3>Merci pour votre réponse !</h3>
              <p>
                Votre présence est enregistrée : <strong>{currentGuest.is_attending ? 'Présent(e)' : 'Absent(e)'}</strong>
              </p>
              {currentGuest.plus_one_name && (
                <p>Accompagnant(e) : {currentGuest.plus_one_name}</p>
              )}
              <button 
                onClick={() => setIsSubmitted(false)}
                style={{ marginTop: '10px', background: 'none', border: 'underline', color: '#047857', cursor: 'pointer' }}
              >
                Modifier ma réponse
              </button>
            </div>
          ) : (
            <form onSubmit={handleRSVPSubmit} style={{ marginTop: '30px', textAlign: 'left' }}>
              <p style={{ fontWeight: 'bold' }}>Serez-vous présent(e) ?</p>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="attending"
                    checked={isAttending === true}
                    onChange={() => setIsAttending(true)}
                  />{' '}
                  Oui, avec plaisir !
                </label>

                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="attending"
                    checked={isAttending === false}
                    onChange={() => setIsAttending(false)}
                  />{' '}
                  Non, désolé(e)
                </label>
              </div>

              {/* Si l'invité a le droit à un +1 */}
              {currentGuest.plus_one_allowed && isAttending && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Nom de votre accompagnant(e) (+1) :
                  </label>
                  <input
                    type="text"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    placeholder="Prénom et Nom"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isAttending === null || loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Enregistrement...' : 'Confirmer ma réponse'}
              </button>
            </form>
          )}

          <button
            onClick={() => setCurrentGuest(null)}
            style={{ marginTop: '30px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px' }}
          >
            ← Se déconnecter / Changer d'invité
          </button>
        </div>
      )}
    </main>
  );
}
