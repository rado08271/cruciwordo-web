import axios from "axios";

const OK = 200 | 201 | 204

const createNewBoard = async (solution: string, rows: number, cols: number) => {
    const axiosResponse = axios
        .post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/g`, {
            rows: rows,
            cols: cols,
            message: solution
        })

    const response = await axiosResponse;

    return response.data
}


export default createNewBoard