import axios from "axios";
import type {BoardDTO, BoardModel} from '~/types/board';
import {boardDTOToModel} from "~/types/board";

const OK = 200 | 201 | 204

const getBoardById = async (id: string = "JAcShjrig8"): Promise<BoardModel>  => {
    const axiosResponse = axios.get(`https://${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/${id}`)

    const response = await axiosResponse;

    if (response.status === 200) {
        const boardDto: BoardDTO = (response.data<BoardDTO>)
        const boardModel: BoardModel = boardDTOToModel(boardDto)
        return boardModel
    } else {
        throw Error(`Get board by id failed with ${response.status} error ${response.statusText}`)
    }
}

export default getBoardById