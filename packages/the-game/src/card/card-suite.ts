export enum CardSuite {
    DIAMONDS = 'DIAMONDS',
    CLUBS = 'CLUBS',
    SPADES = 'SPADES',
    HEARTS = 'HEARTS'
}

export const CardSuiteValues = [
    CardSuite.CLUBS,
    CardSuite.DIAMONDS,
    CardSuite.HEARTS,
    CardSuite.SPADES
] as const;
