const DB_CONSTS = require("../utils/env");
const { dbService } = require("./database.service");
const { FileSystemManager } = require("./file_system_manager");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * @typedef {Object} Reservation
 * @property {string} clientName - Nom du client.
 * @property {string} plateauId - Id du plateau réservé.
 * @property {string[]} itemIds - Items à réserver
 * @property {number} startTime - Début de la réservation en millisecondes.
 * @property {number} endTime - Fin de la réservation en millisecondes.
 */

class ReservationService {
  constructor() {
    this.JSON_PATH_ITEMS = path.join(__dirname, "../data/items.json");
    this.JSON_PATH_PLATEAUS = path.join(__dirname, "../data/plateaus.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get reservationsCollection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_RESERVATIONS);
  }

  /**
   * done : Récupérer la collection des items
   */
  get itemsCollection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_ITEMS);
  }

  /**
   * done : Récupérer la collection des plateaus
   */
  get plateausCollection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_PLATEAUS);
  }

  /**
   * Remplir la collection avec les données du fichier JSON
   * Fonction fournie pour vous
   */
  async populateDb() {
    const items = JSON.parse(
      await this.fileSystemManager.readFile(this.JSON_PATH_ITEMS)
    ).items;
    const plateaus = JSON.parse(
      await this.fileSystemManager.readFile(this.JSON_PATH_PLATEAUS)
    ).plateaus;
    // await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_ITEMS, items);
    // await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_PLATEAUS, plateaus);
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_ITEMS, Array.isArray(items) ? items : [items]);
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_PLATEAUS, Array.isArray(plateaus) ? plateaus : [plateaus]);
  }

  /**
   * done : Récupérer tous les items de la base de données
   * @returns {Promise<Object[]>} - Tous les items
   */
  async getAllItems() {
    await this.populateDb();
    return await this.itemsCollection.find().toArray();
  }

  /**
   * done : Récupérer un item par son identifiant
   * @param {string} itemId identifiant de l'item 
   */
  async getItemById(itemId) {
    await this.populateDb();
    return await this.itemsCollection.findOne({ id: itemId });
  }

  /**
   * done : Récupérer tous les plateaux de la base de données
   * @returns {Promise<Object[]>} - Tous les plateaux
   */
  async getAllPlateaus() {
    await this.populateDb();
    return await this.plateausCollection.find().toArray();
  }

  /**
   * done : Récupérer un plateau par son identifiant
   * @param {string} plateauId identifiant du plateau
   */
  async getPlateauById(plateauId) {
    await this.populateDb();
    return await this.plateausCollection.findOne({ id: plateauId });
  }

  /**
   * done : Vérifier la disponibilité d'un plateau pour une réservation en comparant les heures de début et de fin 
   * avec les réservations existantes
   * @param {string} plateauId identifiant du plateau
   * @param {number} startTime heure de début de la réservation en millisecondes
   * @param {number} endTime heure de fin de la réservation en millisecondes
   */
  async checkPlateauAvailability(plateauId, startTime, endTime) {
    // done : Tenir compte des heures de début et fin des réservations existantes
    const overlappingReservations = await this.reservationsCollection
      .find({
        plateauId,
        $or: [
          { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
          { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(endTime) } },
          { startTime: { $lt: new Date(startTime) }, endTime: { $gt: new Date(startTime) } },
          { startTime: { $lt: new Date(startTime) }, endTime: { $gt: new Date(endTime) } },
        ],

      })
      .toArray();

    return overlappingReservations.length === 0;
  }

  /**
   * Récupérer toutes les réservations de la base de données
   */
  async getAllReservations() {
    return await this.reservationsCollection.find().toArray();
  }

  /**
   * done : Récupérer une réservation par son identifiant
   */
  async getReservationById(id) {
    await this.populateDb();
    return await this.reservationsCollection.findOne({ _id: id });
  }

  async getReservationsForPlateau(plateauId) {
    return await this.reservationsCollection.find({ plateauId }).toArray();
  }

  /**
   * done : Ajouter une nouvelle réservation. 
   * done : Gérer le cas de données valides (voir les commentaires ci-dessous)
   * @throws {Error} - Si le plateau n'existe pas
   * @throws {Error} - Si un item n'est pas autorisé pour ce plateau
   * @throws {Error} - Si la plage horaire n'est pas disponible
   * @param {Reservation} reservationData - Les données de la réservation
   */
  async createReservation(reservationData) {
    const {
      plateauId,
      itemIds = [],
      startTime,
      endTime,
      clientName,
    } = reservationData;

    // Vérifier la validité du plateau
    const plateau = await this.getPlateauById(plateauId);
    if (!plateau) {
      throw new Error("Invalid plateau");
    }

    // Vérifier la validité des items
    const items = await this.getAllItems();
    const allowedItems = items.filter((item) =>
      plateau.allowedItems.includes(item.id)
    );
    const allowedItemIds = allowedItems.map((item) => item.id);
    const isItemAllowed = itemIds.every((itemId) => allowedItemIds.includes(itemId));

    if (!isItemAllowed) {
      throw new Error("Some items are not allowed for this plateau");
    }

    // Vérifier la disponibilité du plateau
    const isPlateauAvailable = await this.checkPlateauAvailability(
      plateauId,
      startTime,
      endTime
    );

    if (!isPlateauAvailable) {
      throw new Error("Requested time slot not available");
    }

    const reservation = {
      _id: uuidv4(),
      plateauId,
      plateauName: plateau.name,
      clientName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      itemIds,
      createdAt: new Date(),
    };

    // Insérer la réservation dans la base de données
    await this.reservationsCollection.insertOne(reservation);

    return reservation;
  }

  /**
   * done : Supprimer une réservation par son identifiant
   * @param {string} id identifiant de la réservation
   * @returns {Promise<import("mongodb").DeleteResult>} - Résultat de la suppression
   */
  async deleteReservation(id) {
    return await this.reservationsCollection.deleteOne({ _id: id });
  }

  /**
   * Réinitialiser la base de données en supprimant toutes les collections et en les remplissant à nouveau
   * Fonction fournie à des fins de débogage durant le développement
   */
  async resetDatabase() {
    await this.reservationsCollection.deleteMany({});
    await this.itemsCollection.deleteMany({});
    await this.plateausCollection.deleteMany({});
    await this.populateDb();
  }

  async updateReservation(id, updatedData) { //rajout pour bonus
    const reservations = await readFile(RESERVATION_FILE);
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Reservation not found");
  
    reservations[index] = { ...reservations[index], ...updatedData };
    await writeFile(RESERVATION_FILE, reservations);
    return reservations[index];
  };
  
}

const reservationService = new ReservationService();
module.exports = { reservationService };
