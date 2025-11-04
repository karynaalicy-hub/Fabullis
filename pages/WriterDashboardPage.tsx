import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    stories as allStories, 
    genres as allGenres, 
    addStory,
    updateStory, 
    addChapter, 
    getChaptersByStoryId, 
    users as allUsers, 
    updateUser, 
    deleteUser, 
    addUser,
    addGenre,
    updateGenre,
    deleteGenre,
    getAllUserSubscriptions,
    getFinancialSummary,
    getRecentTransactions,
    getReportedComments,
    approveComment,
    deleteComment
} from '../data/mockData';
import { Story, StoryStatus, StoryType, Language, User, Genre, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

type ReportedCommentInfo = ReturnType<typeof getReportedComments>[0];

const WriterDashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [stories, setStories] = useState<Story[]>([]);
    const [users, setUsers] = useState<User[]>(allUsers);
    const [managedGenres, setManagedGenres] = useState<Genre[]>(allGenres);
    const [subscriptions, setSubscriptions] = useState(getAllUserSubscriptions());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportedComments, setReportedComments] = useState<ReportedCommentInfo[]>([]);


    // Modals for stories/chapters
    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [storyToAddTo, setStoryToAddTo] = useState<Story | null>(null);
    const [editingStory, setEditingStory] = useState<Story | null>(null);

    // Modals for authors (admin)
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<User | null>(null);
    const [isAuthorDeleteConfirmOpen, setIsAuthorDeleteConfirmOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<User | null>(null);

    // Modals for genres (admin)
    const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
    const [isGenreDeleteConfirmOpen, setIsGenreDeleteConfirmOpen] = useState(false);
    const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
    
    const initialStoryState = {
        titulo: '', sinopse: '', capa_url: `https://picsum.photos/seed/story${Date.now()}/400/600`,
        idioma: Language.Portuguese, status: StoryStatus.EmAndamento, tipo: StoryType.Livro, generos: [] as number[],
        isPremium: false,
    };
    const [newStoryData, setNewStoryData] = useState(initialStoryState);
    const [newChapterData, setNewChapterData] = useState({ titulo_capitulo: '', conteudo: '', isPremium: false });
    const initialAuthorState = { nome_usuario: '', email: '', password: '', avatar_url: '', role: 'author' as 'admin' | 'author' };
    const [authorFormData, setAuthorFormData] = useState(initialAuthorState);
    const [genreFormData, setGenreFormData] = useState({ nome: '' });

    // Financial Data State
    const [financialSummary, setFinancialSummary] = useState({ totalRevenue: 0, productRevenue: 0, subscriptionRevenue: 0, activeSubscribers: 0 });
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);


    useEffect(() => {
        if (currentUser) {
            setStories(allStories.filter(s => s.autor_id === currentUser.id));
             if (currentUser.role === 'admin') {
                setFinancialSummary(getFinancialSummary());
                setRecentTransactions(getRecentTransactions());
                setReportedComments(getReportedComments());
            }
        }
    }, [currentUser]);
    
    useEffect(() => {
        if(currentUser?.role === 'admin') {
            setSubscriptions(getAllUserSubscriptions());
        }
    }, [currentUser, users]);

    const refreshUsers = () => setUsers([...allUsers]);
    const refreshGenres = () => setManagedGenres([...allGenres]);
    const refreshReportedComments = () => setReportedComments(getReportedComments());


    // --- Story & Chapter Handlers ---
    const handleStoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setNewStoryData(prev => ({ 
            ...prev, 
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
        }));
    };
    const handleChapterFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setNewChapterData(prev => ({ 
            ...prev, 
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
        }));
    };
    const handleGenreChange = (genreId: number) => {
        setNewStoryData(prev => ({ ...prev, generos: prev.generos.includes(genreId) ? prev.generos.filter(id => id !== genreId) : [...prev.generos, genreId] }));
    };
    const handleAddStory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        
        if (editingStory) {
            // Editando história existente
            updateStory(editingStory.id, newStoryData);
        } else {
            // Criando nova história
            addStory(newStoryData, currentUser.id);
        }
        
        setStories(allStories.filter(s => s.autor_id === currentUser.id));
        setIsStoryModalOpen(false);
        setNewStoryData(initialStoryState);
        setEditingStory(null);
    };
    
    const closeChapterModal = () => {
        setIsChapterModalOpen(false);
        setStoryToAddTo(null);
        setNewChapterData({ titulo_capitulo: '', conteudo: '', isPremium: false });
        setIsSubmitting(false);
    };

    const handleAddChapter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!storyToAddTo || !currentUser || isSubmitting) return;

        setIsSubmitting(true);
        // Simulate async operation
        setTimeout(() => {
            addChapter({ ...newChapterData, historia_id: storyToAddTo.id });
            setStories([...allStories.filter(s => s.autor_id === currentUser.id)]);
            closeChapterModal();
        }, 500);
    };

    const openChapterModal = (story: Story) => {
        setStoryToAddTo(story);
        setIsChapterModalOpen(true);
    };

    const openEditStoryModal = (story: Story) => {
        setEditingStory(story);
        setNewStoryData({
            titulo: story.titulo,
            sinopse: story.sinopse,
            capa_url: story.capa_url,
            idioma: story.idioma,
            status: story.status,
            tipo: story.tipo,
            generos: story.generos,
            isPremium: story.isPremium
        });
        setIsStoryModalOpen(true);
    };

    const openAddStoryModal = () => {
        setEditingStory(null);
        setNewStoryData(initialStoryState);
        setIsStoryModalOpen(true);
    };

    // --- Author (Admin) Handlers ---
    const handleAuthorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAuthorFormData(prev => ({ ...prev, [name]: value }));
    };
    const openAddAuthorModal = () => {
        setEditingAuthor(null);
        setAuthorFormData(initialAuthorState);
        setIsAuthorModalOpen(true);
    };
    const openEditAuthorModal = (author: User) => {
        setEditingAuthor(author);
        setAuthorFormData({
            nome_usuario: author.nome_usuario,
            email: author.email,
            password: '', // Keep password field blank for editing
            avatar_url: author.avatar_url || '',
            role: author.role || 'author',
        });
        setIsAuthorModalOpen(true);
    };
    const handleAuthorFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAuthor) {
                const dataToUpdate: Partial<User> = { ...authorFormData };
                if (!dataToUpdate.password) delete dataToUpdate.password; // Don't send empty password
                updateUser(editingAuthor.id, dataToUpdate);
            } else {
                addUser({ ...authorFormData });
            }
            refreshUsers();
            setIsAuthorModalOpen(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Ocorreu um erro");
        }
    };
    const openDeleteAuthorConfirm = (author: User) => {
        setAuthorToDelete(author);
        setIsAuthorDeleteConfirmOpen(true);
    };
    const handleDeleteAuthor = () => {
        if (!authorToDelete) return;
        try {
            deleteUser(authorToDelete.id);
            refreshUsers();
            setIsAuthorDeleteConfirmOpen(false);
            setAuthorToDelete(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Ocorreu um erro");
        }
    };

    // --- Genre (Admin) Handlers ---
    const handleGenreFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGenreFormData(prev => ({ ...prev, [name]: value }));
    };
    const openAddGenreModal = () => {
        setEditingGenre(null);
        setGenreFormData({ nome: '' });
        setIsGenreModalOpen(true);
    };
    const openEditGenreModal = (genre: Genre) => {
        setEditingGenre(genre);
        setGenreFormData({ nome: genre.nome });
        setIsGenreModalOpen(true);
    };
    const handleGenreFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingGenre) {
                updateGenre(editingGenre.id, genreFormData);
            } else {
                addGenre(genreFormData);
            }
            refreshGenres();
            setIsGenreModalOpen(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Ocorreu um erro");
        }
    };
    const openDeleteGenreConfirm = (genre: Genre) => {
        setGenreToDelete(genre);
        setIsGenreDeleteConfirmOpen(true);
    };
    const handleDeleteGenre = () => {
        if (!genreToDelete) return;
        try {
            deleteGenre(genreToDelete.id);
            refreshGenres();
            setIsGenreDeleteConfirmOpen(false);
            setGenreToDelete(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Ocorreu um erro");
        }
    };

    // --- Comment Moderation Handlers ---
    const handleApproveComment = (commentId: number) => {
        approveComment(commentId);
        refreshReportedComments();
    };

    const handleModerateDeleteComment = (commentId: number) => {
        if (window.confirm("Tem certeza que deseja excluir este comentário permanentemente?")) {
            deleteComment(commentId);
            refreshReportedComments();
        }
    };


    const inputClasses = "mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary border-l-4 border-primary pl-4">Painel do Escritor</h1>
                <button onClick={openAddStoryModal} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">
                    Publicar Nova História
                </button>
            </div>

            {/* My Stories Section */}
            <div className="bg-surface rounded-lg p-4 sm:p-6 space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">Minhas Histórias</h2>
                {stories.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                        {stories.map(story => (
                            <div key={story.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-accent">{story.titulo} {story.isPremium && <span className="text-xs text-yellow-400">(Premium)</span>}</h3>
                                    <p className="text-sm text-text-secondary capitalize">Status: {story.status.replace('_', ' ')} | Capítulos: {getChaptersByStoryId(story.id).length}</p>
                                </div>
                                <div className="flex space-x-2 mt-2 md:mt-0">
                                    <button onClick={() => openChapterModal(story)} className="text-sm bg-primary/20 text-accent font-semibold py-1 px-3 rounded-md hover:bg-primary/40 transition-colors">Adicionar Capítulo</button>
                                    <button onClick={() => openEditStoryModal(story)} className="text-sm bg-slate-600 text-text-secondary font-semibold py-1 px-3 rounded-md hover:bg-slate-500 transition-colors">Editar História</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-secondary">Você ainda não publicou nenhuma história.</p>}
            </div>

            {/* Admin Section */}
            {currentUser?.role === 'admin' && (
                <div className="space-y-8">
                     {/* Financial Dashboard */}
                    <div className="bg-surface rounded-lg p-4 sm:p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-text-primary">Painel Financeiro</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-text-secondary">Faturamento Total</h3>
                                <p className="mt-1 text-3xl font-semibold text-text-primary">R$ {financialSummary.totalRevenue.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-text-secondary">Receita de Produtos</h3>
                                <p className="mt-1 text-3xl font-semibold text-text-primary">R$ {financialSummary.productRevenue.toFixed(2).replace('.', ',')}</p>
                            </div>
                             <div className="bg-slate-800 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-text-secondary">Receita de Assinaturas</h3>
                                <p className="mt-1 text-3xl font-semibold text-text-primary">R$ {financialSummary.subscriptionRevenue.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-text-secondary">Assinantes Ativos</h3>
                                <p className="mt-1 text-3xl font-semibold text-text-primary">{financialSummary.activeSubscribers}</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary pt-4">Transações Recentes</h3>
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-700">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Usuário</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Tipo</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Detalhes</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Data</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {recentTransactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{tx.user?.nome_usuario || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'Assinatura' ? 'bg-purple-200 text-purple-800' : 'bg-cyan-200 text-cyan-800'}`}>{tx.type}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{tx.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">R$ {tx.amount.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Comment Moderation */}
                    <div className="bg-surface rounded-lg p-4 sm:p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-text-primary">Moderação de Comentários</h2>
                        {reportedComments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Comentário</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Autor</th>
                                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {reportedComments.map(comment => (
                                            <tr key={comment.id}>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-text-secondary italic">"{comment.content}"</p>
                                                    <Link to={`/historias/${comment.story.id}/${comment.chapter.numero_capitulo}`} className="text-xs text-accent hover:underline mt-1 block">
                                                        em "{comment.story.titulo}" Cap. {comment.chapter.numero_capitulo}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{comment.user.nome_usuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button onClick={() => handleApproveComment(comment.id)} className="text-green-500 hover:text-green-400 transition-colors">Manter</button>
                                                    <button onClick={() => handleModerateDeleteComment(comment.id)} className="text-red-500 hover:text-red-700 transition-colors">Excluir</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-text-secondary">Nenhum comentário sinalizado no momento.</p>
                        )}
                    </div>


                    {/* Author Management */}
                    <div className="bg-surface rounded-lg p-4 sm:p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-text-primary">Gerenciar Autores</h2>
                            <button onClick={openAddAuthorModal} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">Adicionar Autor</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-700">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Autor</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Role</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url || 'https://i.pravatar.cc/150?u=' + user.id} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-text-primary">{user.nome_usuario}</div>
                                                        <div className="text-sm text-text-secondary">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => openEditAuthorModal(user)} className="text-accent hover:text-primary transition-colors">Editar</button>
                                                <button onClick={() => openDeleteAuthorConfirm(user)} className="text-red-500 hover:text-red-700 transition-colors">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                     {/* Subscription Management */}
                    <div className="bg-surface rounded-lg p-4 sm:p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-text-primary">Gerenciar Assinaturas</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-700">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Usuário</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Plano</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Expira em</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {subscriptions.map(sub => (
                                        <tr key={sub.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{sub.user?.nome_usuario}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{sub.plan?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(sub.endDate).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-accent hover:text-primary transition-colors">Detalhes</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Genre Management */}
                    <div className="bg-surface rounded-lg p-4 sm:p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-text-primary">Gerenciar Gêneros</h2>
                            <button onClick={openAddGenreModal} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">Adicionar Gênero</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-700">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nome</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {managedGenres.map(genre => (
                                        <tr key={genre.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{genre.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{genre.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => openEditGenreModal(genre)} className="text-accent hover:text-primary transition-colors">Editar</button>
                                                <button onClick={() => openDeleteGenreConfirm(genre)} className="text-red-500 hover:text-red-700 transition-colors">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {isStoryModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleAddStory} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-text-primary mb-4">{editingStory ? 'Editar História' : 'Publicar Nova História'}</h2>
                            {/* ... story form fields ... */}
                            <div><label htmlFor="titulo" className="block text-sm font-medium text-text-secondary">Título</label><input type="text" id="titulo" name="titulo" value={newStoryData.titulo} onChange={handleStoryFormChange} required className={inputClasses} /></div>
                            <div><label htmlFor="sinopse" className="block text-sm font-medium text-text-secondary">Sinopse</label><textarea id="sinopse" name="sinopse" value={newStoryData.sinopse} onChange={handleStoryFormChange} required rows={4} className={inputClasses}></textarea></div>
                            <div><label htmlFor="capa_url" className="block text-sm font-medium text-text-secondary">URL da Capa</label><input type="text" id="capa_url" name="capa_url" value={newStoryData.capa_url} onChange={handleStoryFormChange} required className={inputClasses} /></div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div><label htmlFor="idioma" className="block text-sm font-medium text-text-secondary">Idioma</label><select id="idioma" name="idioma" value={newStoryData.idioma} onChange={handleStoryFormChange} className={inputClasses}><option value={Language.Portuguese}>Português</option><option value={Language.English}>Inglês</option><option value={Language.Spanish}>Espanhol</option></select></div>
                                <div><label htmlFor="status" className="block text-sm font-medium text-text-secondary">Status</label><select id="status" name="status" value={newStoryData.status} onChange={handleStoryFormChange} className={inputClasses}><option value={StoryStatus.EmAndamento}>Em Andamento</option><option value={StoryStatus.Concluida}>Concluída</option><option value={StoryStatus.Hiato}>Hiato</option></select></div>
                                <div><label htmlFor="tipo" className="block text-sm font-medium text-text-secondary">Tipo</label><select id="tipo" name="tipo" value={newStoryData.tipo} onChange={handleStoryFormChange} className={inputClasses}><option value={StoryType.Livro}>Livro</option><option value={StoryType.Conto}>Conto</option><option value={StoryType.Fanfic}>Fanfic</option></select></div>
                            </div>
                            <div><label className="block text-sm font-medium text-text-secondary">Gêneros</label><div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 border border-slate-600 p-3 rounded-md">{managedGenres.map(genre => (<label key={genre.id} className="flex items-center space-x-2"><input type="checkbox" checked={newStoryData.generos.includes(genre.id)} onChange={() => handleGenreChange(genre.id)} className="rounded bg-background border-slate-500 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" /><span className="text-text-secondary text-sm">{genre.nome}</span></label>))}</div></div>
                             <div>
                                <div className="flex items-center">
                                    <input id="isPremiumStory" name="isPremium" type="checkbox" checked={newStoryData.isPremium} onChange={handleStoryFormChange} className="h-4 w-4 rounded bg-background border-slate-500 text-primary focus:ring-primary"/>
                                    <label htmlFor="isPremiumStory" className="ml-2 block text-sm text-text-secondary">Esta história é conteúdo premium</label>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={() => setIsStoryModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md text-text-primary bg-slate-600 hover:bg-slate-500">Cancelar</button><button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover">Salvar História</button></div>
                        </form>
                    </div>
                </div>
            )}
            
            {isChapterModalOpen && storyToAddTo && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleAddChapter} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-text-primary mb-4">Novo Capítulo para "{storyToAddTo.titulo}"</h2>
                             <div><label htmlFor="titulo_capitulo" className="block text-sm font-medium text-text-secondary">Título do Capítulo</label><input type="text" id="titulo_capitulo" name="titulo_capitulo" value={newChapterData.titulo_capitulo} onChange={handleChapterFormChange} required className={inputClasses} /></div>
                             <div><label htmlFor="conteudo" className="block text-sm font-medium text-text-secondary">Conteúdo</label><textarea id="conteudo" name="conteudo" value={newChapterData.conteudo} onChange={handleChapterFormChange} required rows={10} className={inputClasses}></textarea></div>
                             <div>
                                <div className="flex items-center">
                                    <input id="isPremiumChapter" name="isPremium" type="checkbox" checked={newChapterData.isPremium} onChange={handleChapterFormChange} className="h-4 w-4 rounded bg-background border-slate-500 text-primary focus:ring-primary"/>
                                    <label htmlFor="isPremiumChapter" className="ml-2 block text-sm text-text-secondary">Este capítulo é conteúdo premium</label>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={closeChapterModal} className="px-4 py-2 text-sm font-medium rounded-md text-text-primary bg-slate-600 hover:bg-slate-500">Cancelar</button>
                                <button type="submit" disabled={isSubmitting || !newChapterData.titulo_capitulo || !newChapterData.conteudo} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover disabled:bg-slate-500 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Publicando...' : 'Adicionar Capítulo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAuthorModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
                        <form onSubmit={handleAuthorFormSubmit} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-text-primary mb-4">{editingAuthor ? 'Editar Autor' : 'Adicionar Novo Autor'}</h2>
                            <div><label htmlFor="nome_usuario" className="block text-sm font-medium text-text-secondary">Nome de Usuário</label><input type="text" id="nome_usuario" name="nome_usuario" value={authorFormData.nome_usuario} onChange={handleAuthorFormChange} required className={inputClasses} /></div>
                            <div><label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label><input type="email" id="email" name="email" value={authorFormData.email} onChange={handleAuthorFormChange} required className={inputClasses} /></div>
                            <div><label htmlFor="password" className="block text-sm font-medium text-text-secondary">Senha</label><input type="password" id="password" placeholder={editingAuthor ? 'Deixe em branco para não alterar' : ''} value={authorFormData.password} onChange={handleAuthorFormChange} required={!editingAuthor} className={inputClasses} /></div>
                            <div><label htmlFor="avatar_url" className="block text-sm font-medium text-text-secondary">URL do Avatar (Opcional)</label><input type="text" id="avatar_url" name="avatar_url" value={authorFormData.avatar_url} onChange={handleAuthorFormChange} className={inputClasses} /></div>
                            <div><label htmlFor="role" className="block text-sm font-medium text-text-secondary">Role</label><select id="role" name="role" value={authorFormData.role} onChange={handleAuthorFormChange} className={inputClasses}><option value="author">Author</option><option value="admin">Admin</option></select></div>
                            <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={() => setIsAuthorModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md text-text-primary bg-slate-600 hover:bg-slate-500">Cancelar</button><button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover">Salvar</button></div>
                        </form>
                    </div>
                </div>
            )}

            {isAuthorDeleteConfirmOpen && authorToDelete && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-text-primary">Confirmar Exclusão</h2>
                            <p className="mt-2 text-sm text-text-secondary">Você tem certeza que deseja excluir o autor <span className="font-bold">{authorToDelete.nome_usuario}</span>? Esta ação não pode ser desfeita.</p>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button onClick={() => setIsAuthorDeleteConfirmOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md text-text-primary bg-slate-600 hover:bg-slate-500">Cancelar</button>
                                <button onClick={handleDeleteAuthor} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isGenreModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
                        <form onSubmit={handleGenreFormSubmit} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-text-primary mb-4">{editingGenre ? 'Editar Gênero' : 'Adicionar Novo Gênero'}</h2>
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-text-secondary">Nome do Gênero</label>
                                <input type="text" id="nome" name="nome" value={genreFormData.nome} onChange={handleGenreFormChange} required className={inputClasses} />
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={() => setIsGenreModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md text-text-primary bg-slate-600 hover:bg-slate-500">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isGenreDeleteConfirmOpen && genreToDelete && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-text-primary">Confirmar Exclusão</h2>
                            <p className="mt-2 text-sm text-text-secondary">Você tem certeza que deseja excluir o gênero <span className="font-bold">{genreToDelete.nome}</span>? Ele será removido de todas as histórias. Esta ação não pode ser desfeita.</p>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button onClick={() => setIsGenreDeleteConfirmOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md text-text-primary bg-slate-600 hover:bg-slate-500">Cancelar</button>
                                <button onClick={handleDeleteGenre} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WriterDashboardPage;