'use client';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Login con Google
    </button>
  );
}
