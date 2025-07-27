import { User } from "../structs";

const DB_PORT = process.env.DB_PORT || 3001;

export async function getUserByEmail(email: string) : Promise<User | null> {
	try {
		const response = await fetch(`http://127.0.0.1:${DB_PORT}`, {
			body: JSON.stringify({email: email})
		})
		if (!response.ok)
			return null;
		console.log(response.body);

	}
	catch (error) {
    	console.error(error);
		return null;
	}

	return null;
}

async function getData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
