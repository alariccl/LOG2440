import { LOG_LEVEL } from "./consts";

/**
* TODO : Compléter la classe en fonction des tests unitaires fournis
*/
export default class CapLogger {
#maxSize;
    logs;

constructor(maxSize) {
        if (maxSize <= 0) {
            this.#maxSize = Infinity;
        }
        else {
            this.#maxSize = maxSize;
        }

        this.logs = [];
}

get maxSize() { return this.#maxSize; }

    get length() {
        return this.logs.length;
    }

    add(text, level) {
        if (this.length >= this.maxSize)
            this.logs.shift();

        this.logs.push({ text, level : LOG_LEVEL.INFO});
    }

    changeMaxSize(newSize) {
        if (newSize > this.#maxSize) {
            this.#maxSize = newSize;
        } else if (newSize <= 0) {
            this.#maxSize = Infinity;
        } else if (newSize <= this.#maxSize) {
            while (this.length > newSize) {
                this.logs.shift();
            }
            this.#maxSize = newSize;
        }
    }
}