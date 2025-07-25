import { renderNavbar } from "../componentes/navbar";

export function renderProfile() {
	renderNavbar();
	document.getElementById('app')!.innerHTML = `
		<div class="profileContainer">
			<div>
				<label for="emailInput">Email : </label>
				<input type="email" name="emailInput" id="emailInput">
			</div>
			<div>
				<label for="oldPassword">Old password : </label>
				<input type="password" name="oldPassword" id="oldPassword">
			</div>
			<div>
				<label for="newPassword">New password : </label>
				<input type="password" name="newPassword" id="newPassword">
			</div>
			<div>
				<label for="2fa">2FA : </label>
				<input type="checkbox" name="2fa" id="2fa">
			</div>
			<button id="saveChangesBtn">Save changes</button>
		</div>
	`;

	const saveBtn = document.getElementById("saveChangesBtn");
	saveBtn?.addEventListener('click', () => {
		const email: HTMLInputElement = document.getElementById("emailInput")?.value;
		const oldPassword: HTMLInputElement = document.getElementById("oldPassword")?.value;
		const newPassword: HTMLInputElement = document.getElementById("newPassword")?.value;
		const twofa: HTMLInputElement = document.getElementById("2fa")?.checked;

		const json = JSON.stringify({email, oldPassword, newPassword, twofa});
		console.log(json);

		// todo : add call to backend to change values
		// todo : disconnect if success request
	});
}