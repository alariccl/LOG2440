/**
 * @typedef {import('../managers/fileManager').FileManager} FileManager
 */

/**
 * Metadonnées d'un utilsateur
 * @typedef {Object} User
 * @property {string} name nom de l'utilisateur
 * @property {string} password mot de passe 
 * @property {string?} token jeton d'authentification. Peut être absent si l'utilisateur n'est pas connecté
 */

const { v4: uuidv4 } = require('uuid');

class AuthManager {
	constructor(fileManager) {
		this.fileManager = fileManager;
	}

	/**
	 * Récupère la liste des utilisateurs
	 * @returns {Promise<User[]>} la liste des utilisateurs
	 */
	async getUsers() {
		const users = JSON.parse(await this.fileManager.readFile());
		return users;
	}

	/**
	 * Crée un nouvel utilisateur si le nom fourni n'est pas déjà présent.
	 * Lui assigne un jeton d'authentification et le sauvegarde sur le disque
	 *
	 * @param {{username:string, password: string}} userData information de connexion de l'utilisateur
	 * @returns {string | null} le jeton d'authentification de l'utilisateur ou null si l'utilisateur existe déjà
	 *
	 * Valider que l'utilisateur n'existe pas déjà et lui assigner un jeton d'authentification
	 */
	async createUser(userData) {
		const token = uuidv4();
		const users = await this.getUsers();
		const userExists = users.some(
			(user) => user.username === userData.username
		);

		if (userExists) {
			return null;
		}
		users.push({
			username: userData.username,
			password: userData.password,
			token,
		});
		await this.fileManager.writeData(users);

		return token;
	}

	/**
	 * Connecte un utilisateur si le nom et le mot de passe correspondent aux informations enregistrées.
	 * Génère un nouveau jeton d'authentification qui est retourné
	 *
	 * @param {string} username nom de l'utilisateur
	 * @param {string} password mot de passe
	 * @returns {string | null} le jeton d'authentification ou null
	 *
	 * Générer un jeton d'authentification et le retourner en cas de succès. Retourner null sinon.
	 */
	async logInUser(username, password) {
		const users = await this.getUsers();
		const user = users.find((user) => user.username === username && user.password === password);
		if (user) {
			const token = uuidv4();
			user.token = token;
			await this.fileManager.writeData(users);
			return token;
		}

		return null;
	}

	/**
	 * Déconnecte un utilisateur en supprimant son jeton d'authentification
	 * @param {string} userToken jeton d'authentification de l'utilisateur
	 * @returns {boolean} true si l'utilisateur a été déconnecté, false sinon
	 *
	 */
	async logOffUser(userToken) {
		const users = await this.getUsers();
		const user = users.find((user) => user.token === userToken);
		if (user) {
			delete user.token;
			await this.fileManager.writeData(users);
			return true;
		}
		return false;
	}

	/**
	 * Vérifie si un jeton d'authentification est valide (associé à un utilisateur)
	 * @param {string} userToken jeton d'authentification
	 * @returns {User | undefined} l'utilisateur correspondant au jeton ou undefined si le jeton n'est pas valide
	 *
	 */
	async validateToken(userToken) {
		const users = await this.getUsers();
		const user = users.find((user) => user.token === userToken);
		if (user) {
			return user;
		}
		return undefined;
	}
}

module.exports = { AuthManager };