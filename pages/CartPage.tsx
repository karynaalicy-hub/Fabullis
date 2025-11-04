
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const SubscriptionIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-28 text-primary p-4 border-2 border-primary rounded-md flex-shrink-0"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
);

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, itemCount, cartType } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (itemCount === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-text-primary">Seu carrinho está vazio</h1>
                <p className="text-text-secondary mt-2">Parece que você ainda não adicionou nenhum item.</p>
                <Link to="/loja" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105">
                    Ir para a Loja
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6 border-l-4 border-primary pl-4">Seu Carrinho</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-surface rounded-lg shadow-lg">
                        <div className="divide-y divide-slate-700">
                            {cartItems.map(item => (
                                <div key={`${item.type}-${item.id}`} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        {item.type === 'product' ? (
                                            <img src={item.coverUrl} alt={item.name} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
                                        ) : (
                                            <SubscriptionIcon />
                                        )}
                                        <div className="flex-grow">
                                            <p className="font-semibold text-text-primary">{item.name}</p>
                                            <p className="text-sm text-text-secondary">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                        {item.type === 'product' ? (
                                            <div className="flex items-center border border-slate-600 rounded-md">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg hover:bg-slate-700 rounded-l-md transition-colors">-</button>
                                                <span className="w-12 text-center bg-transparent border-none">
                                                    {item.quantity}
                                                </span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg hover:bg-slate-700 rounded-r-md transition-colors">+</button>
                                            </div>
                                        ) : (
                                            <div className="w-24 text-center">
                                                <span className="text-sm text-text-secondary">Assinatura</span>
                                            </div>
                                        )}
                                        <p className="font-semibold w-24 text-right">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                        <button onClick={() => removeFromCart(item.id, item.type)} className="text-red-500 hover:text-red-400 p-1" aria-label={`Remover ${item.name}`}>
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-surface rounded-lg shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold border-b border-slate-700 pb-3 mb-4">Resumo do Pedido</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Subtotal ({itemCount} {itemCount > 1 ? 'itens' : 'item'})</span>
                                <span className="text-text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                            {cartType === 'product' && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Frete</span>
                                    <span className="text-text-primary">Grátis</span>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-slate-700 mt-4 pt-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span className="text-text-primary">Total</span>
                                <span className="text-text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-hover transition-colors"
                        >
                            {isAuthenticated ? 'Ir para o Checkout' : 'Fazer Login para Finalizar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;