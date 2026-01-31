import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

type FormData = z.infer<typeof schema>;

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: FormData) {
        await login(data.email, data.password);
        navigate('/dashboard');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder='Email' {...register('email')} />
            {errors.email && <span>Email inválido</span>}

            <input
                type="password"
                placeholder="Password"
                {...register('password')}
            />
            {errors.password && <span>Senha inválida</span>}

            <button type='submit'>Login</button>
        </form>
    )
}