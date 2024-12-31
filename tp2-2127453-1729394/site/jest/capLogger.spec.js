import CapLogger from '../src/assets/js/capLogger.js';
import { LOG_LEVEL } from '../src/assets/js/consts.js';
import DEFAULT_DATA from '../src/assets/js/defaultData.js';
import { jest } from "@jest/globals";

describe('capLogger tests', () => {
    let capLogger;
    const MAX_SIZE = 4;
    beforeEach(() => {
        capLogger = new CapLogger(MAX_SIZE);
    });

    describe('constructor tests', () => {
        it('should initialize with no logs', () => {
            expect(capLogger.logs).toEqual([]);
        });

        it('should have a max size based on constructor', () => {
            expect(capLogger.maxSize).toEqual(MAX_SIZE);
        });

        it('should have no max size if created with 0', () => {
            capLogger = new CapLogger(0);
            expect(capLogger.maxSize).toEqual(Infinity);
        });

        it('should have no max size if created with negative value', () => {
            capLogger = new CapLogger(-1);
            expect(capLogger.maxSize).toEqual(Infinity);
        });
    });

    describe('adding tests', () => {
        it('should allow adding logs', () => {
            capLogger.add('test', LOG_LEVEL.INFO);
            expect(capLogger.length).toEqual(1);
        });

        it('should remove first element if past MAX_SIZE', () => {
            addLogs(capLogger, DEFAULT_DATA);
            capLogger.add('test', LOG_LEVEL.INFO);
            expect(capLogger.length).toEqual(4);
            expect(capLogger.logs[0].text).toEqual(DEFAULT_DATA[1].text);
        });

        it('should call parent add method', () => {
            const spy = jest.spyOn(CapLogger.prototype, 'add');
            capLogger.add(DEFAULT_DATA[0].text, DEFAULT_DATA[0].level);
            expect(spy).toHaveBeenCalledWith(DEFAULT_DATA[0].text, DEFAULT_DATA[0].level);
        });
    });

    describe('maxSize modification tests', () => {
        it('should resize logs if maxSize is reduced', () => {
            addLogs(capLogger, DEFAULT_DATA);
            const NEW_SIZE = 2;
            capLogger.changeMaxSize(NEW_SIZE);
            expect(capLogger.length).toEqual(NEW_SIZE);
            expect(capLogger.logs[0].text).toEqual(DEFAULT_DATA[DEFAULT_DATA.length - NEW_SIZE].text);
        });

        it('should not change logs if maxSize is increased', () => {
            addLogs(capLogger, DEFAULT_DATA);
            capLogger.changeMaxSize(6);
            expect(capLogger.length).toEqual(4);
            capLogger.logs.forEach((log, index) => {
                expect(log.text).toEqual(DEFAULT_DATA[index].text);
            });
        });

        it('should set size to infinity if maxSize is 0', () => {
            capLogger.changeMaxSize(0);
            expect(capLogger.maxSize).toEqual(Infinity);
        });

        it('should handle negative maxSize', () => {
            capLogger.changeMaxSize(-1);
            expect(capLogger.maxSize).toEqual(Infinity);
        });
    });
});

// Fonction utilitaire pour ajouter des entrées
function addLogs(capLogger, logs) {
    logs.forEach((log) => {
        capLogger.add(log.text, log.level);
    });
}