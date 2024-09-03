'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/Auth/Buttons/SubmitButton/SubmitButton';
import { login } from '@/utils/auth/auth';

const LoginForm = () => {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if(error) {
            console.log('Error:', error);
        }
    }, [error]);

    return (
        
        <main className={`w-screen h-screen flex flex-col gap-y-8  items-center text-primary-light-text`}>
            <h1 className={`text-4xl`}>Tickify</h1>
            <form onSubmit={handleSubmit} className={`w-2/5 py-8 px-16 flex flex-col gap-y-6  justify-center items-center bg-white/30 backdrop-blur-md rounded-lg`}>
                <h2 className={`text-3xl`}>Connexion à mon compte</h2>
                <div className={`flex flex-col gap-y-2 w-full`}>
                    <label className={`font-medium`} htmlFor="email">Email</label>
                    <input 
                        className={`w-full py-1 rounded-md px-2 text-base  border-2 border-white/20`}
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                    />
                </div>
                <div className={`flex flex-col gap-y-2 w-full`}>
                    <label className={`font-medium`} htmlFor="password">Mot de passe</label>
                    <input 
                        className={`w-full py-1 rounded-md px-1 text-base  border-2 border-white/20`}
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password"
                    />
                </div>
                <SubmitButton label="Se connecter" />
                {error && <div>{error}</div>}
            </form>
        </main>
       
    );
};

export default LoginForm;
