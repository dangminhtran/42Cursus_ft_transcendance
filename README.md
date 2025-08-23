# ft_transcendence 🎮  

Projet réalisé dans le cadre de l’école 42.  
Objectif : développer une application web complète et sécurisée en full-stack, intégrant un jeu en temps réel, un système d’authentification avancé et des fonctionnalités sociales.  

---

## 🚀 Fonctionnalités principales  

### 🎨 Front-End
- **Typescript (sans framework)** : Application construite en pur TypeScript pour un contrôle total de l’architecture.
- **Tailwind CSS** : Styling moderne et responsive.
- **Internationalisation (i18n)** : Interface multilingue.

### 🖼️ Graphiques
- **Babylon.js (3D)** : Rendu 3D pour le jeu Pong, animations et gestion temps réel.  

### ⚙️ Back-End
- **Fastify / Node.js** : Framework performant pour les API REST et WebSocket.
- **Base de données SQLite** : Stockage léger et rapide.
- **Architecture micro-services** : Découpage logique du back-end pour une meilleure scalabilité.  

### 👥 Gestion des utilisateurs
- Authentification standard (inscription, login, gestion du profil).  

### 🔐 Cybersécurité
- **2FA + JWT** : Authentification forte et gestion sécurisée des sessions.
- **WAF (Web Application Firewall) + Hashicorp** : Protection et gestion des secrets.  

### 🛠️ DevOps & Monitoring
- **Grafana + Prometheus** : Supervision et métriques en temps réel.
- **ElasticSearch** : Centralisation et analyse des logs.  

---

## 🏗️ Stack technique  

- **Front-end** : TypeScript, TailwindCSS, Babylon.js  
- **Back-end** : Node.js (Fastify), SQLite, Micro-services  
- **Sécurité** : JWT, 2FA, Hashicorp, WAF  
- **DevOps** : Grafana, Prometheus, ElasticSearch  


---

## 👨‍💻 Équipe  

- [Mael C.](https://github.com/maecarva)  
- [Ugo T.](https://github.com/Frqnku)
- [Elio B.](https://github.com/X03phy)
- [Jacques Q.](https://github.com/ShinAshura)  
- [Dang-Minh T.](https://github.com/dangminhtran)


---
## ENGLISH VERSION 

# ft_transcendence 🎮  

Final project from **42 School**, developed as a full-stack web application.  
The goal was to build a **secure, scalable, and modern web app**, integrating a real-time multiplayer game, user management, and advanced DevOps monitoring.  

---

## 🚀 Main Features  

### 🎨 Front-End
- **TypeScript (no framework)**: Frontend fully built in pure TypeScript.  
- **Tailwind CSS**: Modern, responsive, and consistent UI design.  
- **Internationalization (i18n)**: Multi-language support.  

### 🖼️ Graphics
- **Babylon.js (3D engine)**: Real-time 3D rendering for the Pong game with animations.  

### ⚙️ Back-End
- **Fastify / Node.js**: High-performance API (REST & WebSocket).  
- **SQLite Database**: Lightweight relational storage.  
- **Micro-services architecture**: Modular and scalable back-end design.  

### 👥 User Management
- Standard user authentication: registration, login, profile management.  

### 🔐 Cybersecurity
- **2FA + JWT**: Strong authentication & secure session handling.  
- **WAF (Web Application Firewall) + Hashicorp**: Secret management and enhanced protection.  

### 🛠️ DevOps & Monitoring
- **Grafana + Prometheus**: Metrics visualization & system monitoring.  
- **ElasticSearch**: Log centralization & analytics.  

---

## ⚡ Pour lancer le projet  

```bash
# Cloner le repo
git clone https://github.com/dangminhtran/42Cursus_ft_transcendance.git

# Aller dans le dossier
cd ft_transcendence

# Installer les dépendances
npm install

# Lancer tous les services à l'aide du Makefile
make

# Se connecter sur le port 8843
https://localhost:8443

