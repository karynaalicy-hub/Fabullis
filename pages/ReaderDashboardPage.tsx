import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    stories as allStories,
    subscriptions,
    getNotificationsByUser,
    markNotificationAsRead,
    getChapterById,
    getStoryById,
    getUserSubscription,
    subscriptionPlans,
    comments,
    getChaptersByStoryId
} from '../data/mockData';
import { Story, Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ReaderDashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [followedStories, setFollowedStories] = useState<Story[]>([]);
    const [userComments, setUserComments] = useState<any[]>([]);
    const [userSubscription, setUserSubscription] = useState<any>(null);

    useEffect(() => {
        if (currentUser) {
            // Carregar notificações
            const userNotifications = getNotificationsByUser(currentUser.id);
            const notificationsWithDetails = userNotifications.map(notif => {
                const chapter = getChapterById(notif.chapterId);
                const story = chapter ? getStoryById(chapter.historia_id) : null;
                return { ...notif, chapter, story };
            });
            setNotifications(notificationsWithDetails);

            // Carregar histórias seguidas
            const userSubs = subscriptions.filter(sub => sub.userId === currentUser.id);
            const stories = userSubs.map(sub => getStoryById(sub.storyId)).filter(s => s) as Story[];
            setFollowedStories(stories);

            // Carregar comentários do usuário
            const userCommentsList = comments
                .filter(c => c.userId === currentUser.id)
                .map(comment => {
                    const chapter = getChapterById(comment.chapterId);
                    const story = chapter ? getStoryById(chapter.historia_id) : null;
                    return { ...comment, chapter, story };
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setUserComments(userCommentsList);

            // Carregar assinatura do usuário
            const subscription = getUserSubscription(currentUser.id);
            if (subscription) {
                const plan = subscriptionPlans.find(p => p.id === subscription.planId);
                setUserSubscription({ ...subscription, plan });
            }
        }
    }, [currentUser]);

    const handleMarkAsRead = (notificationId: number) => {
        markNotificationAsRead(notificationId);
        setNotifications(prev => prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
        ));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary border-l-4 border-primary pl-4">
                    Meu Painel
                </h1>
                <div className="text-text-secondary">
                    Olá, <span className="text-accent font-semibold">{currentUser?.nome_usuario}</span>
                </div>
            </div>

            {/* Assinatura Ativa */}
            {userSubscription && (
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-6 border border-primary/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                ✨ Assinatura {userSubscription.plan?.nome}
                            </h2>
                            <p className="text-text-secondary">
                                Status: <span className="text-green-400 font-semibold">Ativa</span>
                            </p>
                            <p className="text-text-secondary text-sm mt-1">
                                Renovação: {new Date(userSubscription.endDate).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <Link 
                            to="/loja" 
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors text-sm font-semibold"
                        >
                            Gerenciar Assinatura
                        </Link>
                    </div>
                </div>
            )}

            {/* Sem Assinatura */}
            {!userSubscription && (
                <div className="bg-surface rounded-lg p-6 border border-slate-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary mb-2">
                                📚 Desbloqueie Conteúdo Premium
                            </h2>
                            <p className="text-text-secondary">
                                Assine agora e tenha acesso ilimitado a todas as histórias premium!
                            </p>
                        </div>
                        <Link 
                            to="/loja" 
                            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition-colors font-semibold"
                        >
                            Ver Planos
                        </Link>
                    </div>
                </div>
            )}

            {/* Notificações */}
            <div className="bg-surface rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">
                        🔔 Notificações {unreadCount > 0 && (
                            <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h2>
                </div>
                
                {notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.slice(0, 5).map(notif => (
                            <div 
                                key={notif.id} 
                                className={`p-4 rounded-lg border ${
                                    notif.isRead 
                                        ? 'bg-slate-800/50 border-slate-700' 
                                        : 'bg-primary/10 border-primary/30'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="text-text-primary font-semibold">
                                            {notif.story?.titulo}
                                        </p>
                                        <p className="text-text-secondary text-sm mt-1">
                                            Novo capítulo: {notif.chapter?.titulo_capitulo}
                                        </p>
                                        <p className="text-text-secondary text-xs mt-1">
                                            {new Date(notif.timestamp).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/historias/${notif.story?.id}/${notif.chapter?.id}`}
                                            className="text-accent hover:text-primary text-sm font-semibold transition-colors"
                                        >
                                            Ler
                                        </Link>
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notif.id)}
                                                className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                                            >
                                                Marcar como lida
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-secondary text-center py-8">
                        Você não tem notificações no momento.
                    </p>
                )}
            </div>

            {/* Histórias Seguindo */}
            <div className="bg-surface rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">📖 Histórias que Estou Seguindo</h2>
                
                {followedStories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {followedStories.map(story => {
                            const chapterCount = getChaptersByStoryId(story.id).length;
                            return (
                                <Link
                                    key={story.id}
                                    to={`/historias/${story.id}`}
                                    className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                                >
                                    <img 
                                        src={story.capa_url} 
                                        alt={story.titulo}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                                            {story.titulo}
                                        </h3>
                                        <p className="text-text-secondary text-sm">
                                            {chapterCount} capítulos
                                        </p>
                                        {story.isPremium && (
                                            <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-text-secondary mb-4">
                            Você ainda não está seguindo nenhuma história.
                        </p>
                        <Link
                            to="/historias"
                            className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-hover transition-colors font-semibold"
                        >
                            Explorar Histórias
                        </Link>
                    </div>
                )}
            </div>

            {/* Meus Comentários */}
            <div className="bg-surface rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">💬 Meus Comentários Recentes</h2>
                
                {userComments.length > 0 ? (
                    <div className="space-y-3">
                        {userComments.slice(0, 5).map(comment => (
                            <div key={comment.id} className="bg-slate-800 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <Link
                                            to={`/historias/${comment.story?.id}`}
                                            className="text-accent hover:text-primary font-semibold transition-colors"
                                        >
                                            {comment.story?.titulo}
                                        </Link>
                                        <p className="text-text-secondary text-sm">
                                            {comment.chapter?.titulo_capitulo}
                                        </p>
                                    </div>
                                    <span className="text-text-secondary text-xs">
                                        {new Date(comment.timestamp).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <p className="text-text-primary">{comment.content}</p>
                                {comment.isReported && (
                                    <span className="inline-block mt-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                        Reportado
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-secondary text-center py-8">
                        Você ainda não fez nenhum comentário.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReaderDashboardPage;
