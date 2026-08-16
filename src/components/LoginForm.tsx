import React, { useState } from 'react';
import { findGuestByName, Guest } from '../services/guestService';

interface LoginFormProps {
  onGuestFound: (guest: Guest) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onGuestFound }) => {
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setLoading(true);
    setErrorMsg('');

    const guest = await findGuestByName(nameInput);

    if (guest) {
      onGuestFound(guest);
    } else {
      setErrorMsg('Désolé, nous n\'avons pas trouvé ce nom dans la liste des invités. Vérifiez l\'orthographe !');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
      <h2>Bienvenue à notre Mariage</h2>
      <p>Entrez votre prénom et nom pour accéder à votre invitation :</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Ex: Albert Fiata"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
          required
        />

        {errorMsg && (
          <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Vérification...' : 'Accéder à mon invitation'}
        </button>
      </form>
    </div>
  );
};
