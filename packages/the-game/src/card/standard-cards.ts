import { CardSuiteValues } from './card-suite.js';
import { Card } from './card.js';

const standardCardMapping: Array<[string, number, number]> = [
    ['2', 2, 2],
    ['3', 3, 3],
    ['4', 4, 4],
    ['5', 5, 5],
    ['6', 6, 6],
    ['7', 7, 7],
    ['8', 8, 8],
    ['9', 9, 9],
    ['10', 10, 10],
    ['J', 10, 10],
    ['Q', 10, 10],
    ['K', 10, 10],
    ['A', 11, 1]
];

export const STANDARD_CARDS: ReadonlyArray<Card> = standardCardMapping
    .map(info => CardSuiteValues.map(suite => new Card(info[0], suite, [info[1], info[2]])))
    .flat();
