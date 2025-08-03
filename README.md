# Transcendance

**FRONT-END**

Without framework : Typescript - OK

- 0.5 - Minor module : Tailwind CSS - OK
- 0.5 - Internationalisation - WIP
- 0.5 - Accessibility - WIP

**GAMEPLAY AND USER EXPERIENCE**

NON
- 1 - Major module : Another game - WIP

**GRAPHICS**

- 1- Major module : 3D Babylon.js - OK

**BACK-END**

- 1 - Major module : Framework - Fastify / Node.js - OK
- 0.5 - Minor module : Database in SQLite - OK
- 1 - Major module : Micro-services - OK

**USER MANAGEMENT**

- 1 - Major module : standard user management - OK
- 1 - Major module : OAuth Sign In

**CYBER SCURITY**
- 1 - Major module: 2FA and JWT - OK
- 1 - Major module: WAF / Hashicorp - OK

**DEV ops**
- 0.5 - Minor module: Grafana Prometheus - OK
- 1 - Major module: Elastic Search - OK


**GITHUB**

- Mono-repo

**Front-end :** 

TODO : 

- Terminer Tailwind CSS : tout passer en tailwind pour ne pas garder de CSS ?
- Mettre en place 2FA
- Terminer le module Game 2
- Mettre en place le OAuth 

**Routes :**
- LOGIN / SIGNIN :
    - post/register - OK
    - post/login - OK

- HOME:
    - route GET pour recuperer les infos
    - route GET pour les resultats des matchs / des tournois
    - route GET pour afficher les amis
    - route POST pour ajouter les amis

- USER MANAGEMENT :
    - route GET pour les infos du user ???
    - route POST pour le changement des infos
    - route POST pour le 2FA

- GAMES
    - route POST pour stocker les resultats des matchs 
    - route GET pour le matchmaking (si on le fait)


**INSTALLER NODE 20**
export NVM_DIR="$HOME/.nvm" &&
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" &&
nvm install 20 &&
nvm use 20 &&
npm run dev

