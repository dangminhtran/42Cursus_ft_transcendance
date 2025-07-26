import { renderNavbar } from "../componentes/navbar";

export function renderProfile() {
	renderNavbar();
	document.getElementById('app')!.innerHTML = `
		<div class="profileContainer flex flex-col justify-center items-center gap-5 -mt-20 text-md text-indigo-950 font-semibold rounded-xl p-10">
			<div class="text-lg text-white text-xl font-semibold">Change your information here</div>	
		
			<div class="flex flex-col justify-center gap-2">
					<label for="emailInput">Profil picture : </label>
					<input class="rounded-sm bg-indigo-950 text-xl text-white border border-teal-50 ease-in-out" type="text" name="pictureInput" id="pictureInput">
				</div>

			<div class="flex flex-col justify-center gap-2">
					<label for="emailInput">Email : </label>
					<input class="rounded-sm bg-indigo-950 text-xl text-white border border-teal-50 ease-in-out" type="email" name="emailInput" id="emailInput">
				</div>
				<div class="flex flex-col justify-center gap-2">
					<label for="oldPassword">Old password : </label>
					<input class="rounded-sm bg-indigo-950 text-xl text-white border border-teal-50 ease-in-out" type="password" name="oldPassword" id="oldPassword">
				</div>
				<div class="flex flex-col justify-center gap-2">
					<label for="newPassword">New password : </label>
					<input class="rounded-sm bg-indigo-950 text-xl text-white border border-teal-50 ease-in-out" type="password" name="newPassword" id="newPassword">
				</div>
				<div class="flex justify-center gap-2">
					<label for="2fa">2FA : </label>
					<input class="rounded-sm bg-indigo-950 text-xl text-white border border-teal-50 ease-in-out" type="checkbox" name="2fa" id="2fa">
				</div>
				<button id="saveChangesBtn">Save changes</button>
		</div>
	`;

	const saveBtn = document.getElementById("saveChangesBtn");
saveBtn?.addEventListener('click', () => {
    const email = (document.getElementById("emailInput") as HTMLInputElement)?.value || '';
    const oldPassword = (document.getElementById("oldPassword") as HTMLInputElement)?.value || '';
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value || '';
    const twofa = (document.getElementById("2fa") as HTMLInputElement)?.checked || false;
    const profilePicture = (document.getElementById("pictureInput") as HTMLInputElement)?.value || '';
    
    const json = JSON.stringify({email, oldPassword, newPassword, twofa, profilePicture});
    console.log(json);
});
}