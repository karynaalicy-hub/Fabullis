
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createSale, createSubscription } from '../data/mockData';

const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-text-secondary"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const SubscriptionIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-16 text-primary p-2 border-2 border-primary rounded-md"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
);

const CheckoutPage: React.FC = () => {
    const { cartItems, totalPrice, itemCount, clearCart, cartType } = useCart();
    const { currentUser, refreshSubscription } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Redirect if cart is empty or user is not logged in
    useEffect(() => {
        if (itemCount === 0 || !currentUser) {
            navigate('/carrinho');
        }
    }, [itemCount, currentUser, navigate]);

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            try {
                if (currentUser && cartType) {
                    if (cartType === 'product') {
                        // FIX: createSale expects an array of CartItem. The previous mapping was incorrect.
                        // When cartType is 'product', cartItems already contains the correct items.
                        createSale(currentUser.id, cartItems);
                    } else if (cartType === 'subscription') {
                        const planId = cartItems[0].id;
                        createSubscription(currentUser.id, planId);
                        refreshSubscription(); // Update subscription status in AuthContext
                    }
                    setIsLoading(false);
                    setIsSuccess(true);
                    clearCart();
                }
            } catch (error) {
                console.error("Failed to process payment:", error);
                alert("Ocorreu um erro ao processar seu pagamento.");
                setIsLoading(false);
            }
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-green-400">Pagamento Aprovado!</h1>
                <p className="text-text-secondary mt-2">
                    {cartType === 'subscription' 
                        ? 'Sua assinatura está ativa! Aproveite o conteúdo premium.' 
                        : 'Obrigado por sua compra. Você receberá uma confirmação em breve.'
                    }
                </p>
                <Link to="/loja" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105">
                    {cartType === 'subscription' ? 'Explorar Histórias' : 'Continuar Comprando'}
                </Link>
            </div>
        );
    }
    
    const inputClasses = "mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";


    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6 border-l-4 border-primary pl-4">Finalizar Compra</h1>
            <div className="flex flex-col lg:flex-row-reverse gap-8">
                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-surface rounded-lg shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold border-b border-slate-700 pb-3 mb-4">Resumo do Pedido</h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                         {item.type === 'product' ? (
                                            <img src={item.coverUrl} alt={item.name} className="w-12 h-16 object-cover rounded-md"/>
                                        ) : (
                                            <SubscriptionIcon />
                                        )}
                                        <div>
                                            <p className="text-text-primary">{item.name}</p>
                                            <p className="text-text-secondary">{item.quantity} x R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-text-primary">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-700 mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Subtotal</span>
                                <span className="text-text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                            {cartType === 'product' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Frete</span>
                                    <span className="text-text-primary">Grátis</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg">
                                <span className="text-text-primary">Total</span>
                                <span className="text-text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="lg:w-2/3">
                    <form onSubmit={handlePaymentSubmit} className="bg-surface rounded-lg shadow-lg p-6 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4">Endereço de Cobrança</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label htmlFor="fullName" className="block text-sm font-medium text-text-secondary">Nome Completo</label><input type="text" id="fullName" required className={inputClasses} /></div>
                                <div><label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label><input type="email" id="email" defaultValue={currentUser?.email} required className={inputClasses} /></div>
                                {cartType === 'product' && (
                                    <>
                                        <div><label htmlFor="address" className="block text-sm font-medium text-text-secondary">Endereço</label><input type="text" id="address" required className={inputClasses} /></div>
                                        <div><label htmlFor="city" className="block text-sm font-medium text-text-secondary">Cidade</label><input type="text" id="city" required className={inputClasses} /></div>
                                        <div><label htmlFor="state" className="block text-sm font-medium text-text-secondary">Estado</label><input type="text" id="state" required className={inputClasses} /></div>
                                        <div><label htmlFor="zip" className="block text-sm font-medium text-text-secondary">CEP</label><input type="text" id="zip" required className={inputClasses} /></div>
                                    </>
                                )}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">Informações de Pagamento</h2>
                            <p className="text-sm text-yellow-400 bg-yellow-900/50 p-3 rounded-md mb-4">Esta é uma simulação. Não utilize dados de cartão de crédito reais.</p>
                             <div className="space-y-4">
                                <div>
                                    <label htmlFor="card-number" className="block text-sm font-medium text-text-secondary">Número do Cartão</label>
                                    <div className="relative">
                                        <input type="text" id="card-number" placeholder="**** **** **** ****" required className={`${inputClasses} pl-10`} />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CreditCardIcon /></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor="card-expiry" className="block text-sm font-medium text-text-secondary">Validade</label>
                                        <input type="text" id="card-expiry" placeholder="MM/AA" required className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="card-cvc" className="block text-sm font-medium text-text-secondary">CVC</label>
                                        <input type="text" id="card-cvc" placeholder="***" required className={inputClasses} />
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="border-t border-slate-700 pt-6">
                             <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-hover transition-colors disabled:bg-slate-500 disabled:cursor-wait"
                            >
                                {isLoading ? 'Processando Pagamento...' : `Pagar Agora (R$ ${totalPrice.toFixed(2).replace('.', ',')})`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
