import sqlite3
from datetime import datetime

conn = sqlite3.connect('/home/ebonutto/Documents/42Cursus_ft_transcendance/back_end/database/transcendence.db')
cursor = conn.cursor()

password_hash = "$2y$10$MMuhe3zlHdkoELrhGemlGeoIAPCqUfmU47Qr21enqaqzEuEMRBwWu"

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    profilepicture TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is2FAEnabled INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
""")

# Création table matchs si pas déjà présente
cursor.execute("""
CREATE TABLE IF NOT EXISTS matchs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1 TEXT NOT NULL,
    player2 TEXT NOT NULL,
    player1score INTEGER NOT NULL,
    player2score INTEGER NOT NULL,
    user_id INTEGER,
    tournament_uuid TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
""")

# Exemple d'insertion dans la table users
users = [
	# Mael ce goat
    {
        "username": "mael",
        "email": "mael@mail.com",
		"profilepicture": "sylvain.png",
        "password": password_hash,
        "is2FAEnabled": 0,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    },

	# Minh la goat
	{
		"username": "minh",
		"email": "minh@mail.com",
		"profilepicture": "sylvain.png",
		"password": password_hash,
		"is2FAEnabled": 0,
		"created_at": datetime.utcnow().isoformat(),
		"updated_at": datetime.utcnow().isoformat(),
    },
	# Jacques le goat
	{
		"username": "jacques",
		"email": "jacques@mail.com",
		"profilepicture": "sylvain.png",
		"password": password_hash,
		"is2FAEnabled": 0,
		"created_at": datetime.utcnow().isoformat(),
		"updated_at": datetime.utcnow().isoformat(),
    },
	# Elio
	{
		"username": "elio",
		"email": "elio@mail.com",
		"profilepicture": "sylvain.png",
		"password": password_hash,
		"is2FAEnabled": 0,
		"created_at": datetime.utcnow().isoformat(),
		"updated_at": datetime.utcnow().isoformat(),
    },
   	# Ugo
	{
		"username": "ugo",
		"email": "ugo@mail.com",
		"profilepicture": "sylvain.png",
		"password": password_hash,
		"is2FAEnabled": 0,
		"created_at": datetime.utcnow().isoformat(),
		"updated_at": datetime.utcnow().isoformat(),
    },
]

matches = [
	{
		"player1": "jacques",
		"player2": "minh",
		"player1score": 5,
		"player2score": 3,
		"user_id": 1,
		"tournament_uuid": None,  # ou une string si tu as un tournoi
		"created_at": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
	},

	{
		"player1": "elio",
		"player2": "minh",
		"player1score": 1,
		"player2score": 5,
		"user_id": 2,
		"tournament_uuid": None,  # ou une string si tu as un tournoi
		"created_at": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
    },
]

insert_user_sql = """
INSERT INTO users (username, profilepicture, email, password, is2FAEnabled, created_at, updated_at)
VALUES (:username, :profilepicture, :email, :password, :is2FAEnabled, :created_at, :updated_at)
"""

insert_match_sql = """
INSERT INTO matchs (player1, player2, player1score, player2score, user_id, tournament_uuid, created_at)
VALUES (:player1, :player2, :player1score, :player2score, :user_id, :tournament_uuid, :created_at)
"""

for user in users:
    cursor.execute(insert_user_sql, user)

for match in matches:
	cursor.execute(insert_match_sql, match)

conn.commit()
conn.close()

print("✅ Seed users done")
