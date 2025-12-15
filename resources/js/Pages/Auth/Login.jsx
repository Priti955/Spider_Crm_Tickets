import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
           
            {status && (
                <div className="mb-4 text-sm font-medium text-black-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                   
                    <InputLabel htmlFor="email" value="Email" className="text-black" /> 

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        
                        className="mt-1 block w-full bg-white/10 text-black border-black/20 focus:border-pink-400 focus:ring-pink-400 placeholder-gray-400"
                        autoComplete="off" 
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                   
                    <InputLabel htmlFor="password" value="Password" className="text-black" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                       
                        className="mt-1 block w-full bg-white/10 text-white border-black/20 focus:border-pink-400 focus:ring-pink-400 placeholder-gray-400"
                        autoComplete="off" 
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        {/* REMEMBER ME TEXT: Light gray text */}
                        <span className="ms-2 text-sm text-gray-300">
                            Remember me
                        </span>
                    </label>
                </div>

                {/* --- PRIMARY ACTION AREA --- */}
                <div className="mt-6 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            // FORGOT PASSWORD LINK: Subtle, clean accent color
                            className="rounded-md text-sm text-pink-400 underline hover:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            Forgot your password?
                        </Link>
                    )}
                    
                    {/* PRIMARY BUTTON: Strong call to action */}
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>

            {/* --- SECONDARY ACTION AREA (Correct UX) --- */}
            <div className="mt-6 border-t border-white/10 pt-4 text-center">
                <p className="text-sm text-gray-300">
                    Don't have an account? 
                    <Link
                        href={route('register')}
                        // REGISTER LINK: Clean accent color, semi-bold
                        className="font-semibold text-pink-400 hover:text-pink-300 ms-1"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}