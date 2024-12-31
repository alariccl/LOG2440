/**
 * Vide le contenu HTML interne d'un élément HTML quelconque
 * @param {HTMLElement} parent élément à vider
 */
export function removeAllChildren(parent) {
    parent.innerHTML = "";
}

/**
 * Génère un identifiant unique composé de 3 segments hexadécimaux :
 *
 * {segment_size}-{segment_size*2}-{segment_size}
 * @param {number} segment_size taille du segment de l'id, par défaut = 4
 * @returns
 */
export function generateId(segment_size = 4) {
    const hexChars = '0123456789abcdef';
    const randomSegment = (length) => {
        return Array.from({ length },
            () => hexChars[Math.floor(Math.random() * hexChars.length)])
            .join('');
    };

    const segment1 = randomSegment(segment_size);
    const segment2 = randomSegment(segment_size * 2);
    const segment3 = randomSegment(segment_size);

    const complexHexID = `${segment1}-${segment2}-${segment3}`;

    return complexHexID;
}

/**
 * Formate une date au format ISO 8601 en date lisible
 *
 * Format : `YYYY-MM-DD HH:MM:SS`
 */
export function formatDate(dateString) {
    const isoString = new Date(dateString).toISOString();
    const parts = isoString.split('T');
    return `${parts[0]} ${parts[1].split('.')[0]}`;
}