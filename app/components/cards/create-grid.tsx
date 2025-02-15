import Card from "~/components/common/card/card";
import TextInput from "~/components/common/input/text-input";
import OutlinedContainer from "~/components/common/container/outlined-container";
import {TfiLayoutGrid2, TfiSave, TfiLoop} from "react-icons/tfi";
import Slider from "~/components/common/input/slider";
import {useEffect, useState} from "react";
import SelectGrid from "~/components/grid/select-grid";
import {BsArrowsCollapse} from "react-icons/bs";
import PrimaryButton from "~/components/common/buttons/primary-button";
import useBearStore from "~/actions/useBearStore";
import useCreateNewBoardStore from "~/actions/create-new-board";
import { useNavigate } from "react-router";             // TODO Update with action redirect

const MAX_ROWS = 10
const MAX_COLS = 10

const CreateGrid = () => {
    const [solution, onSetSolution] = useState("")
    const [error, setError] = useState<string | null>()
    const [rows, onSelectRows] = useState(3)
    const [cols, onSelectCols] = useState(3)
    const [showMore, setShowMore] = useState(false)

    const navigator = useNavigate()

    const {createBoard, boardInProgress, boardId} = useCreateNewBoardStore();

    useEffect(() => {
        console.log("C", cols, "R", rows, "S", solution, (rows) * (MAX_ROWS) + (cols))
        const maxSolutionLength = rows * cols / 3;
        let isError = false

        if (solution == null || solution == "") {
            setError("Solution is noll or nor available")
            isError = true
        } else if (solution.length >= maxSolutionLength) {
            setError("Puzzle solution exceeded length")
            isError = true
        }

        if (rows > MAX_ROWS || cols > MAX_COLS ) {
            setError("The grid size exceeds limit")
            isError = true
        }

        if (rows < 4 || cols < 4 ) {
            setError("The grid size need to be bigger")
            isError = true
        }

        if (!isError) {
            setError(null)
        }
    }, [rows, cols, solution]);

    useEffect(() => {
        if (!boardInProgress && boardId) {
            navigator(`/play/${boardId}`)
        }
    }, [boardId]);

    return (
        <>
            <Card>
                <Card.Title>Create New Puzzle</Card.Title>
                <Card.Content>
                    <TextInput title={"Puzzle Solution"} placeholder={"The tea in Nepal is very hot"} required onValueChange={onSetSolution}/>
                    <OutlinedContainer className={'flex flex-col gap-4'} title={'Grid Size'} icon={<TfiLayoutGrid2/>}>
                        <div className={'flex flex-col gap-4'}>
                            <div className={showMore ? 'h-full' : 'h-8 overflow-hidden relative'}>
                                <Slider min={4} max={MAX_ROWS} onSlide={onSelectRows} overrideValue={rows + 1}>Rows</Slider>
                                <Slider min={4} max={MAX_COLS} onSlide={onSelectCols} overrideValue={cols + 1}>Cols</Slider>
                                {!showMore ? <div onClick={() => setShowMore(!showMore)} className={'cursor-pointer left-0 right-0 absolute bottom-0 bg-gradient-to-t from-white to-transparent h-8'}></div> : <></>}
                            </div>
                            <div onClick={() => setShowMore(!showMore)}
                                className={'w-full gap-2 text-center inline-flex justify-center items-center text-blue-400 cursor-pointer'}>
                                <BsArrowsCollapse/>
                                Show {showMore ? "less" : "more"}
                            </div>
                        </div>
                        <SelectGrid overrideCols={cols} overrideRows={rows} rows={MAX_ROWS} cols={MAX_COLS} onSelect={cellId => {
                            onSelectRows(Math.floor(cellId / MAX_ROWS))
                            onSelectCols(cellId % MAX_COLS)
                        }} onHover={(cellId) => {}}></SelectGrid>
                    </OutlinedContainer>

                    {<label htmlFor={'text-input'} className={'text-sm text-red-500 text-right min-h-8'}>{error ?? ''}</label>}

                    <span onClick={() => {
                        createBoard(solution, rows, cols)
                    }}>
                        <PrimaryButton disabled={error != null || boardInProgress} id={'create-board'} icon={!boardInProgress ? <TfiSave/> : <TfiLoop/>}>Create Puzzle</PrimaryButton>
                    </span>
                </Card.Content>
            </Card>
        </>
    );
};

export default CreateGrid