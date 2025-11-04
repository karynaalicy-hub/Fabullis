
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSubscriptionPlans, getPlanById, getProducts } from '../data/mockData';
import { SubscriptionPlan, Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-green-400">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const StorePage: React.FC = () => {
    const { isAuthenticated, currentUser, activeSubscription } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [addedProductId, setAddedProductId] = useState<number | null>(null);
    const plans = getSubscriptionPlans();
    const products = getProducts();

    const handleSubscribe = (plan: SubscriptionPlan) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        addToCart(plan, 'subscription');
        navigate('/checkout');
    };
    
    const handleAddToCart = (product: Product) => {
        addToCart(product, 'product');
        setAddedProductId(product.id);
        setTimeout(() => {
            setAddedProductId(null);
        }, 2000);
    };

    const currentPlan = activeSubscription ? getPlanById(activeSubscription.planId) : null;

    return (
        <div className="space-y-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-text-primary">Loja e Assinaturas</h1>
                <p className="text-lg text-text-secondary mt-2">Apoie seus autores favoritos e tenha acesso a conteúdo exclusivo.</p>
            </div>
            
            {/* Subscription Section */}
            <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">Nossos Planos</h2>
                
                {isAuthenticated && currentPlan && (
                     <div className="bg-green-900/50 border border-green-500 text-center p-6 rounded-lg mb-8">
                        <h3 className="text-2xl font-semibold text-white">Você é um assinante!</h3>
                        <p className="text-green-300 mt-2">Seu plano atual é o <span className="font-bold">{currentPlan.name}</span>, válido até {new Date(activeSubscription!.endDate).toLocaleDateString('pt-BR')}.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {plans.map((plan: SubscriptionPlan) => (
                        <div key={plan.id} className={`bg-surface rounded-lg p-8 flex flex-col shadow-lg transition-all duration-300 ${currentPlan?.id === plan.id ? 'border-2 border-primary' : 'border border-transparent'}`}>
                            <h3 className="text-2xl font-bold text-accent">{plan.name}</h3>
                            <p className="mt-4 text-4xl font-extrabold text-text-primary">
                                R$ {plan.price.toFixed(2).replace('.', ',')}
                                <span className="text-lg font-medium text-text-secondary">{plan.durationDays > 30 ? '/ano' : '/mês'}</span>
                            </p>
                            <p className="mt-4 text-text-secondary flex-grow">{plan.description}</p>
                            <ul className="mt-6 space-y-2 text-text-secondary">
                                <li className="flex items-center"><CheckIcon /> Acesso a todas as histórias premium</li>
                                <li className="flex items-center"><CheckIcon /> Acesso a capítulos exclusivos</li>
                                <li className="flex items-center"><CheckIcon /> Apoie os autores da plataforma</li>
                            </ul>
                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={!isAuthenticated || currentPlan?.id === plan.id}
                                className="mt-8 w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-hover transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                            >
                                {!isAuthenticated ? 'Faça login para assinar' :
                                 currentPlan?.id === plan.id ? 'Seu Plano Atual' : 'Assinar Agora'}
                            </button>
                        </div>
                    ))}
                </div>
                 {!isAuthenticated && (
                     <p className="text-center text-text-secondary mt-8">Você precisa estar logado para assinar um plano.</p>
                 )}
            </section>
            
            {/* Products Section */}
            <section className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">Livros e E-books</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product: Product) => (
                        <div key={product.id} className="bg-surface rounded-lg p-4 flex flex-col shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-primary/50">
                            <img src={product.coverUrl} alt={`Capa de ${product.name}`} className="rounded-md h-64 w-full object-cover mb-4" />
                            <div className="flex-grow flex flex-col">
                                <h3 className="text-lg font-bold text-text-primary flex-grow">{product.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-primary/20 px-2 py-1 rounded-full">
                                        {product.type === 'book' ? 'Livro Físico' : 'E-book'}
                                    </span>
                                    <p className="text-xl font-extrabold text-text-primary">
                                        R$ {product.price.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={addedProductId === product.id}
                                className="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:bg-green-600 disabled:cursor-default"
                            >
                                {addedProductId === product.id ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StorePage;