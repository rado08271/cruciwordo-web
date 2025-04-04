import {Identity, Timestamp} from "@clockworklabs/spacetimedb-sdk";
import type {GameSessionDatabaseModel} from "@spacetime";
import type Word from "~/types/word";

type IPlayer = {
    id: string,
    boardId: string,
    startedDate: Timestamp,
    playerIdentity: Identity,
    finished: boolean,
    isOnline: boolean,
    foundWords: Word[],
    ident3hex: string
}

class Player implements IPlayer {
    private gameSessionDatabaseModel: GameSessionDatabaseModel
    public boardId: string;
    public finished: boolean;
    public id: string;
    public ident3hex: string;
    public isOnline: boolean;
    public playerIdentity: Identity;
    public startedDate: Timestamp;
    public foundWords: Word[];

    constructor(gameSessionDatabaseModel: GameSessionDatabaseModel) {
        this.gameSessionDatabaseModel = gameSessionDatabaseModel

        this.boardId = gameSessionDatabaseModel.boardId
        this.id = gameSessionDatabaseModel.id
        this.finished = gameSessionDatabaseModel.finished
        this.isOnline = gameSessionDatabaseModel.isOnline
        this.playerIdentity = gameSessionDatabaseModel.playedBy
        this.startedDate = gameSessionDatabaseModel.startedDate
        this.ident3hex = (gameSessionDatabaseModel.playedBy.data % 0xffffffn).toString(16)
        this.foundWords = []
    }

    public assignFoundWords = (words: Word[]) => {
        const playerWords = this.gameSessionDatabaseModel.foundWords.split("|")
        const foundWords = words.filter(word => playerWords.includes(word.word))

        const wordsToUpdate = foundWords.filter(word => !word.playerFoundWord(this))
        wordsToUpdate.forEach(word => word.assignPlayerToWord(this))

        this.foundWords = foundWords
    }
}

export default Player
