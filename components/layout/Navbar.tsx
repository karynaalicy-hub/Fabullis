
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationsByUser, markNotificationAsRead } from '../../data/mockData';
import { Notification, Story, Chapter } from '../../types';
import { useCart } from '../../contexts/CartContext';

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3h16v18H4V3z"></path>
        <path d="M8 3v18"></path>
    </svg>
);


interface NotificationDetail {
    notification: Notification;
    story: Story;
    chapter: Chapter;
}

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `há ${Math.floor(interval)} anos`;

    interval = seconds / 2592000;
    if (interval > 1) return `há ${Math.floor(interval)} meses`;

    interval = seconds / 86400;
    if (interval > 1) return `há ${Math.floor(interval)} dias`;

    interval = seconds / 3600;
    if (interval > 1) return `há ${Math.floor(interval)} horas`;

    interval = seconds / 60;
    if (interval > 1) return `há ${Math.floor(interval)} minutos`;

    return 'agora mesmo';
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDetail[]>([]);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const hasUnreadNotifications = notifications.some(n => !n.notification.isRead);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // The explicit cast is needed because filter(Boolean) doesn't narrow the type automatically
      const userNotifications = getNotificationsByUser(currentUser.id) as NotificationDetail[];
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleNotificationClick = (notificationId: number) => {
      markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
          n.notification.id === notificationId 
              ? { ...n, notification: { ...n.notification, isRead: true } }
              : n
      ));
      setIsNotificationsOpen(false);
  };

  const navLinkClasses = "text-text-secondary hover:text-text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClasses = "text-text-primary";

  const NavLinks: React.FC<{onClick?: () => void}> = ({ onClick }) => (
    <>
      <NavLink to="/" onClick={onClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Início</NavLink>
      <NavLink to="/historias" onClick={onClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Histórias</NavLink>
      <NavLink to="/loja" onClick={onClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Loja</NavLink>
      {isAuthenticated && currentUser && (
        currentUser.role === 'author' || currentUser.role === 'admin' ? (
          <NavLink to="/painel-escritor" onClick={onClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Painel do Escritor</NavLink>
        ) : (
          <NavLink to="/painel-leitor" onClick={onClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Meu Painel</NavLink>
        )
      )}
    </>
  );

  const AuthButtons = () => (
    <div className="ml-4 flex items-center md:ml-6">
      <Link to="/carrinho" className="relative p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white">
        <span className="sr-only">Ver carrinho</span>
        <CartIcon />
         {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {itemCount}
          </span>
        )}
      </Link>

      {isAuthenticated && (
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
            className="ml-4 p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white relative"
            aria-label="Ver notificações"
          >
            <BellIcon />
            {hasUnreadNotifications && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background"></span>}
          </button>
          {isNotificationsOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 border-b border-slate-700">
                  <p className="text-sm font-semibold text-text-primary">Notificações</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(({ notification, story, chapter }) => (
                      <Link
                        key={notification.id}
                        to={`/historias/${story.id}/${chapter.numero_capitulo}`}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`block px-4 py-3 text-sm hover:bg-slate-700/50 transition-colors ${!notification.isRead ? 'bg-primary/10' : ''}`}
                        role="menuitem"
                      >
                         <div className="flex items-center space-x-4">
                            <img src={story.capa_url} alt={story.titulo} className="w-12 h-16 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-medium text-text-primary truncate">Novo capítulo em {story.titulo}!</p>
                                        <p className="text-text-secondary truncate">{`Cap. ${chapter.numero_capitulo}: ${chapter.titulo_capitulo}`}</p>
                                    </div>
                                    {!notification.isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1 ml-2"></div>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{timeAgo(notification.timestamp)}</p>
                            </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-text-secondary">Nenhuma notificação nova.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isAuthenticated ? (
        <div className="ml-3 relative flex items-center">
          <span className="text-text-secondary text-sm mr-4 hidden sm:block" aria-label="Current user">Olá, {currentUser?.nome_usuario}</span>
          <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Sair
          </button>
        </div>
      ) : (
        <NavLink to="/login" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Assinar
        </NavLink>
      )}
    </div>
  );

  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-text-primary">
              <BookIcon />
              <span>Fabullis</span>
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLinks />
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <AuthButtons />
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-surface inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLinks onClick={() => setIsMenuOpen(false)} />
          </div>
          <div className="pt-4 pb-3 border-t border-surface px-5">
             <div className="flex items-center">
              {isAuthenticated ? (
                  <>
                    <div className="flex-shrink-0">
                       <img className="h-10 w-10 rounded-full object-cover" src={currentUser?.avatar_url || 'https://i.pravatar.cc/150?u=' + currentUser?.id} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-text-primary">{currentUser?.nome_usuario}</div>
                      <div className="text-sm font-medium leading-none text-text-secondary">{currentUser?.email}</div>
                    </div>
                    <button onClick={handleLogout} className="ml-auto flex-shrink-0 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 focus:outline-none">
                        Sair
                    </button>
                  </>
              ) : (
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      Assinar
                  </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
