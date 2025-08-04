// Language configuration and translation management system

export type Language = 'en' | 'fr' | 'es';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    pong: string;
    tron: string;
    profile: string;
    disconnect: string;
  };
  
  // Home page
  home: {
    title: string;
    welcomeMessage: string;
    recentGames: string;
    friends: string;
    addFriend: string;
    onlineFriends: string;
    gameHistory: string;
    noGamesYet: string;
    player: string;
    score: string;
    date: string;
    gameType: string;
    duration: string;
    winner: string;
    wins: string;
    losses: string;
    draws: string;
    totalGames: string;
    winRate: string;
    online: string;
    offline: string;
    inGame: string;
    myGames: string;
    allGames: string;
    back: string;
    yourProfile: string;
    memberSince: string;
    gameDashboard: string;
    friendsName: string;
    availableUsers: string;
    add: string;
    showingGames: string;
	enterFriendName: string;
  };
  
  // Login page
  login: {
    title: string;
    signInDescription: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    loginButton: string;
    signupButton: string;
    signUpTitle: string;
    signUpDescription: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    invalidCredentials: string;
    emailAlreadyUsed: string;
    registrationSuccess: string;
    loginSuccess: string;
  };
  
  // Pong game
  pong: {
    title: string;
    readyToPlay: string;
    selectDifficulty: string;
    selectPlayers: string;
    startGame: string;
    startTournament: string;
    easy: string;
    medium: string;
    hard: string;
    players2: string;
    players4: string;
    players8: string;
    tournament: string;
    tournamentMatch: string;
    round: string;
    vs: string;
    startMatch: string;
    tournamentWinner: string;
    newTournament: string;
    backToMenu: string;
    firstTo5Wins: string;
    player1Keys: string;
    player2Keys: string;
    enterPlayerName: string;
    player: string;
    congratulations: string;
    wins: string;
    finalScore: string;
    ai: string;
    difficulty: string;
  };
  
  // Tron game
  tron: {
    title: string;
    readyToPlay: string;
    oneVsOne: string;
    startGame: string;
    instructions: string;
    playerBlue: string;
    playerOrange: string;
    wins: string;
    finalScore: string;
  };
  
  // Profile page
  profile: {
    title: string;
    personalInfo: string;
    gameStats: string;
    settings: string;
    email: string;
    avatar: string;
    avatarUrl: string;
    saveChanges: string;
    changePassword: string;
    newPassword: string;
    confirmPassword: string;
    enable2FA: string;
    disable2FA: string;
    language: string;
    notifications: string;
    loading: string;
    success: string;
    error: string;
    profilePicturePreview: string;
    profilePictureUrl: string;
    previewImage: string;
    oldPassword: string;
    profileUpdated: string;
    validImageUrl: string;
  };
  
  // Common
  common: {
    back: string;
    next: string;
    cancel: string;
    confirm: string;
    save: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  
  // Language names
  languages: {
    en: string;
    fr: string;
    es: string;
  };
}

// English translations
export const en: Translations = {
  nav: {
    home: "Home",
    pong: "Pong",
    tron: "Tron",
    profile: "Profile",
    disconnect: "Disconnect"
  },
  home: {
    title: "Welcome to Transcendance",
    welcomeMessage: "Ready for some epic gaming?",
    recentGames: "Recent Games",
    friends: "Friends",
    addFriend: "Add Friend",
    onlineFriends: "Online Friends",
    gameHistory: "Game History",
    noGamesYet: "No games played yet",
    player: "Player",
    score: "Score",
    date: "Date",
    gameType: "Game Type",
    duration: "Duration",
    winner: "Winner",
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    totalGames: "Total Games",
    winRate: "Win Rate",
    online: "Online",
    offline: "Offline",
    inGame: "In Game",
    myGames: "My Games",
    allGames: "All Games",
    back: "← Back",
    yourProfile: "Your Profile",
    memberSince: "Member since",
    gameDashboard: "Game Dashboard",
    friendsName: "Friend's Name",
    availableUsers: "Available Users",
    add: "Add",
    showingGames: "Showing",
	enterFriendName: "Enter friend's name"
  },
  login: {
    title: "LOG IN",
    signInDescription: "Sign in with email address",
    emailPlaceholder: "Yourname@gmail.com",
    passwordPlaceholder: "YourPassword",
    loginButton: "Log In",
    signupButton: "Sign Up",
    signUpTitle: "SIGN UP",
    signUpDescription: "Create your account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    invalidCredentials: "Invalid credentials",
    emailAlreadyUsed: "Email already used. Please login.",
    registrationSuccess: "Registration successful!",
    loginSuccess: "Login successful!"
  },
  pong: {
    title: "Pong",
    readyToPlay: "Ready to play Pong?",
    selectDifficulty: "Select Difficulty",
    selectPlayers: "Select Number of Players",
    startGame: "Start Game",
    startTournament: "Start Tournament",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    players2: "2 Players",
    players4: "4 Players",
    players8: "8 Players",
    tournament: "Tournament",
    tournamentMatch: "Tournament Match",
    round: "Round",
    vs: "VS",
    startMatch: "Start Match",
    tournamentWinner: "TOURNAMENT WINNER!",
    newTournament: "New Tournament",
    backToMenu: "Back to Menu",
    firstTo5Wins: "First to 5 wins!",
    player1Keys: "W/S keys",
    player2Keys: "Arrow keys",
    enterPlayerName: "Enter player name",
    player: "Player",
    congratulations: "Congratulations!",
    wins: "Wins!",
    finalScore: "Final Score",
    ai: "AI",
    difficulty: "Difficulty"
  },
  tron: {
    title: "Tron",
    readyToPlay: "Ready to play Tron?",
    oneVsOne: "1 v 1 gare du nord",
    startGame: "Start Game",
    instructions: "Use W/S/A/D or Arrow Keys to move",
    playerBlue: "Player(blue)",
    playerOrange: "Player(orange)",
    wins: "Wins!",
    finalScore: "Final Score"
  },
  profile: {
    title: "Profile",
    personalInfo: "Personal Information",
    gameStats: "Game Statistics",
    settings: "Settings",
    email: "Email",
    avatar: "Avatar",
    avatarUrl: "Avatar URL",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    enable2FA: "Enable 2FA",
    disable2FA: "Disable 2FA",
    language: "Language",
    notifications: "Notifications",
    loading: "Loading...",
    success: "Success!",
    error: "Error!",
    profilePicturePreview: "Profile Picture Preview",
    profilePictureUrl: "Profile picture URL:",
    previewImage: "Preview Image",
    oldPassword: "Old password:",
    profileUpdated: "Profile updated successfully!",
    validImageUrl: "Please enter a valid image URL"
  },
  common: {
    back: "Back",
    next: "Next",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    close: "Close",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information"
  },
  languages: {
    en: "English",
    fr: "Français",
    es: "Español"
  }
};

// French translations
export const fr: Translations = {
  nav: {
    home: "Accueil",
    pong: "Pong",
    tron: "Tron",
    profile: "Profil",
    disconnect: "Déconnexion"
  },
  home: {
    title: "Bienvenue sur Transcendance",
    welcomeMessage: "Prêt pour des jeux épiques ?",
    recentGames: "Jeux Récents",
    friends: "Amis",
    addFriend: "Ajouter un Ami",
    onlineFriends: "Amis en Ligne",
    gameHistory: "Historique des Jeux",
    noGamesYet: "Aucun jeu joué pour le moment",
    player: "Joueur",
    score: "Score",
    date: "Date",
    gameType: "Type de Jeu",
    duration: "Durée",
    winner: "Gagnant",
    wins: "Victoires",
    losses: "Défaites",
    draws: "Égalités",
    totalGames: "Total des Jeux",
    winRate: "Taux de Victoire",
    online: "En Ligne",
    offline: "Hors Ligne",
    inGame: "En Jeu",
    myGames: "Mes Jeux",
    allGames: "Tous les Jeux",
    back: "← Retour",
    yourProfile: "Votre Profil",
    memberSince: "Membre depuis",
    gameDashboard: "Tableau de Bord de Jeu",
    friendsName: "Nom de l'Ami",
    availableUsers: "Utilisateurs Disponibles",
    add: "Ajouter",
    showingGames: "Affichage",
	enterFriendName: "Entrez le nom de l'ami"
  },
  login: {
    title: "CONNEXION",
    signInDescription: "Connectez-vous avec votre adresse email",
    emailPlaceholder: "votre.nom@gmail.com",
    passwordPlaceholder: "VotreMotDePasse",
    loginButton: "Se Connecter",
    signupButton: "S'Inscrire",
    signUpTitle: "INSCRIPTION",
    signUpDescription: "Créez votre compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    invalidCredentials: "Identifiants invalides",
    emailAlreadyUsed: "Email déjà utilisé. Veuillez vous connecter.",
    registrationSuccess: "Inscription réussie !",
    loginSuccess: "Connexion réussie !"
  },
  pong: {
    title: "Pong",
    readyToPlay: "Prêt à jouer au Pong ?",
    selectDifficulty: "Sélectionner la Difficulté",
    selectPlayers: "Sélectionner le Nombre de Joueurs",
    startGame: "Commencer le Jeu",
    startTournament: "Commencer le Tournoi",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    players2: "2 Joueurs",
    players4: "4 Joueurs",
    players8: "8 Joueurs",
    tournament: "Tournoi",
    tournamentMatch: "Match de Tournoi",
    round: "Manche",
    vs: "VS",
    startMatch: "Commencer le Match",
    tournamentWinner: "GAGNANT DU TOURNOI !",
    newTournament: "Nouveau Tournoi",
    backToMenu: "Retour au Menu",
    firstTo5Wins: "Premier à 5 gagne !",
    player1Keys: "Touches W/S",
    player2Keys: "Touches fléchées",
    enterPlayerName: "Entrez le nom du joueur",
    player: "Joueur",
    congratulations: "Félicitations !",
    wins: "a Gagné !",
    finalScore: "Score Final",
    ai: "IA",
    difficulty: "Difficulté"
  },
  tron: {
    title: "Tron",
    readyToPlay: "Prêt à jouer au Tron ?",
    oneVsOne: "1 contre 1 gare du nord",
    startGame: "Commencer le Jeu",
    instructions: "Utilisez W/S/A/D ou les touches fléchées pour vous déplacer",
    playerBlue: "Joueur(bleu)",
    playerOrange: "Joueur(orange)",
    wins: "a Gagné !",
    finalScore: "Score Final"
  },
  profile: {
    title: "Profil",
    personalInfo: "Informations Personnelles",
    gameStats: "Statistiques de Jeu",
    settings: "Paramètres",
    email: "Email",
    avatar: "Avatar",
    avatarUrl: "URL de l'Avatar",
    // saveChanges: "Sauvegarder les Modifications",
    saveChanges: "Sauvegarder",
    changePassword: "Changer le Mot de Passe",
    newPassword: "Nouveau Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    enable2FA: "Activer 2FA",
    disable2FA: "Désactiver 2FA",
    language: "Langue",
    notifications: "Notifications",
    loading: "Chargement...",
    success: "Succès !",
    error: "Erreur !",
    profilePicturePreview: "Aperçu de la Photo de Profil",
    profilePictureUrl: "URL de la photo de profil :",
    previewImage: "Aperçu de l'Image",
    oldPassword: "Ancien mot de passe :",
    profileUpdated: "Profil mis à jour avec succès !",
    validImageUrl: "Veuillez entrer une URL d'image valide"
  },
  common: {
    back: "Retour",
    next: "Suivant",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Sauvegarder",
    close: "Fermer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Avertissement",
    info: "Information"
  },
  languages: {
    en: "English",
    fr: "Français",
    es: "Español"
  }
};

// Spanish translations
export const es: Translations = {
  nav: {
    home: "Inicio",
    pong: "Pong",
    tron: "Tron",
    profile: "Perfil",
    disconnect: "Desconectar"
  },
  home: {
    title: "Bienvenido a Transcendance",
    welcomeMessage: "¿Listo para juegos épicos?",
    recentGames: "Juegos Recientes",
    friends: "Amigos",
    addFriend: "Agregar Amigo",
    onlineFriends: "Amigos en Línea",
    gameHistory: "Historial de Juegos",
    noGamesYet: "Aún no has jugado ningún juego",
    player: "Jugador",
    score: "Puntuación",
    date: "Fecha",
    gameType: "Tipo de Juego",
    duration: "Duración",
    winner: "Ganador",
    wins: "Victorias",
    losses: "Derrotas",
    draws: "Empates",
    totalGames: "Total de Juegos",
    winRate: "Tasa de Victoria",
    online: "En Línea",
    offline: "Desconectado",
    inGame: "Jugando",
    myGames: "Mis Juegos",
    allGames: "Todos los Juegos",
    back: "← Atrás",
    yourProfile: "Tu Perfil",
    memberSince: "Miembro desde",
    gameDashboard: "Panel de Juegos",
    friendsName: "Nombre del Amigo",
    availableUsers: "Usuarios Disponibles",
    add: "Agregar",
    showingGames: "Mostrando",
	enterFriendName: "Ingresa el nombre del amigo"
  },
  login: {
    title: "INICIAR SESIÓN",
    signInDescription: "Inicia sesión con tu dirección de correo",
    emailPlaceholder: "tunombre@gmail.com",
    passwordPlaceholder: "TuContraseña",
    loginButton: "Iniciar Sesión",
    signupButton: "Registrarse",
    signUpTitle: "REGISTRARSE",
    signUpDescription: "Crea tu cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    invalidCredentials: "Credenciales inválidas",
    emailAlreadyUsed: "Email ya utilizado. Por favor inicia sesión.",
    registrationSuccess: "¡Registro exitoso!",
    loginSuccess: "¡Inicio de sesión exitoso!"
  },
  pong: {
    title: "Pong",
    readyToPlay: "¿Listo para jugar Pong?",
    selectDifficulty: "Seleccionar Dificultad",
    selectPlayers: "Seleccionar Número de Jugadores",
    startGame: "Comenzar Juego",
    startTournament: "Comenzar Torneo",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    players2: "2 Jugadores",
    players4: "4 Jugadores",
    players8: "8 Jugadores",
    tournament: "Torneo",
    tournamentMatch: "Partido de Torneo",
    round: "Ronda",
    vs: "VS",
    startMatch: "Comenzar Partido",
    tournamentWinner: "¡GANADOR DEL TORNEO!",
    newTournament: "Nuevo Torneo",
    backToMenu: "Volver al Menú",
    firstTo5Wins: "¡El primero en llegar a 5 gana!",
    player1Keys: "Teclas W/S",
    player2Keys: "Teclas de flecha",
    enterPlayerName: "Ingresa el nombre del jugador",
    player: "Jugador",
    congratulations: "¡Felicitaciones!",
    wins: "¡Gana!",
    finalScore: "Puntuación Final",
    ai: "IA",
    difficulty: "Dificultad"
  },
  tron: {
    title: "Tron",
    readyToPlay: "¿Listo para jugar Tron?",
    oneVsOne: "1 vs 1 gare du nord",
    startGame: "Comenzar Juego",
    instructions: "Usa W/S/A/D o las teclas de flecha para moverte",
    playerBlue: "Jugador(azul)",
    playerOrange: "Jugador(naranja)",
    wins: "¡Gana!",
    finalScore: "Puntuación Final"
  },
  profile: {
    title: "Perfil",
    personalInfo: "Información Personal",
    gameStats: "Estadísticas del Juego",
    settings: "Configuración",
    email: "Email",
    avatar: "Avatar",
    avatarUrl: "URL del Avatar",
    saveChanges: "Guardar Cambios",
    changePassword: "Cambiar Contraseña",
    newPassword: "Nueva Contraseña",
    confirmPassword: "Confirmar Contraseña",
    enable2FA: "Habilitar 2FA",
    disable2FA: "Deshabilitar 2FA",
    language: "Idioma",
    notifications: "Notificaciones",
    loading: "Cargando...",
    success: "¡Éxito!",
    error: "¡Error!",
    profilePicturePreview: "Vista previa de la foto de perfil",
    profilePictureUrl: "URL de la foto de perfil:",
    previewImage: "Vista previa de imagen",
    oldPassword: "Contraseña anterior:",
    profileUpdated: "¡Perfil actualizado exitosamente!",
    validImageUrl: "Por favor ingresa una URL de imagen válida"
  },
  common: {
    back: "Atrás",
    next: "Siguiente",
    cancel: "Cancelar",
    confirm: "Confirmar",
    save: "Guardar",
    close: "Cerrar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información"
  },
  languages: {
    en: "English",
    fr: "Français",
    es: "Español"
  }
};

export const translations = { en, fr, es };
