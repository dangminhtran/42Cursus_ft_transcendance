export interface User {
	id: number
	username: string,
	profilepicture: string,
	email: string
	password: string
	is2FAEnabled: boolean
	twoFASecret?: string
	created_at: string
	updated_at: string
}

export interface UpdateUser {
	email?: string
	password?: string
	is2FAEnabled?: boolean
	twoFASecret?: string
}

export type GameResult = {
	id: number;
	player1: string;
	player2: string;
	player1score: number;
	player2score: number;
	user_id: number;
	created_at: string;
};

export interface Friend {
  username: string;
  profilepicture: string;
  email:   string;
};

