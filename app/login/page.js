'use client';

import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        // Vérification que les champs ne sont pas vides
        if (formData.email.trim() === '' || formData.password.trim() === '') {
            setMessage('Veuillez remplir tous les champs.');
            setIsError(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // call vers /api/auth/login
        try {
            const response = await axios.post('/api/auth/login', formData);

            // Stockage du token dans le localStorage après la connexion réussie
            const token = response.data.token;
            localStorage.setItem('authToken', token);

            console.log('Connexion réussie: ', response.data);
            setMessage('Connexion réussie');
            setIsError(false);

        } catch (err) {
            // Vérification si l'API renvoie un message d'erreur spécifique
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage('Erreur lors de la connexion. Veuillez réessayer.');
            }
            setIsError(true);
            console.log('Erreur lors de la connexion', err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-400">Connexion</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 w-full text-gray-700 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Se connecter
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-4 p-4 rounded-lg text-center ${
                            isError
                                ? 'bg-red-100 text-red-700 border border-red-400'
                                : 'bg-green-100 text-green-700 border border-green-400'
                        }`}
                        role="alert"
                    >
                        {isError ? '⚠️ ' : '🎉 '}
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
