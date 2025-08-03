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
};

export interface Friend {
	username: string;
	profilepicture: string;
	email:   string;
};

export interface FriendStat {
	username: string;
	profilepicture: string;
	email:   string;
	win: number;
	loss: number;
};

export type Match = {
	id: number;
	player1: string;
	player2: string;
	player1score: number;
	player2score: number;
	user_id: number;
	tournament_uuid?: string;
	created_at: string;
};

export type MatchToAdd = {
	player1: string;
	player2: string;
	player1score: number;
	player2score: number;
	user_id: number;
	tournament_uuid?: string;
};

export type Tournament = {
	id: number;
	uuid: string;
	start_date: string;
	end_date: string;
};
