'use client';
import { useAuth } from '../context/AuthContext';

export default function LoginButton() {
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      await login();
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
