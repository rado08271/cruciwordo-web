import React, {useState} from "react";
import useConnection from "~/hooks/use-connection";
import GenerateNewBoard from "~/api/reducers/generate-new-board";
import {IoCogSharp, IoGridSharp, IoKeySharp, IoLanguageSharp} from "react-icons/io5";
import MoveGrid from "~/components/grid/move-grid";
import Loading from "~/components/common/loading/loading";
import {useNavigate} from "react-router";

type SupportedLangType = { language: string, i18n: string, id: string }
type SupportedGridSize = {
    size: string,
    rows: number,
    cols: number,
    id: string,
    max_solution?: number,
    average_words?: number
}

type TabName = 'SETTINGS' | 'PREVIEW'

const SUPPORTED_LANG: SupportedLangType[] = [
    {language: 'English', i18n: 'en', id: 'langauge_en'},
    {language: 'Slovak', i18n: 'sk', id: 'langauge_sk'},
    {language: 'Spanish', i18n: 'es', id: 'langauge_es'}
]
const SUPPORTED_GRID: SupportedGridSize[] = [
    {size: '6x6', cols: 6, rows: 6, id: 'grid_6'},
    {size: '9x9', cols: 9, rows: 9, id: 'grid_9'},
    {size: '13x13', cols: 13, rows: 13, id: 'grid_13'},
    {size: '17x17', cols: 17, rows: 17, id: 'grid_17'},
    {size: '20x20', cols: 20, rows: 20, id: 'grid_20'},
    {size: '25x25', cols: 25, rows: 25, id: 'grid_25'},
]

const CreateGrid = () => {
    const [lang, onSelectLang] = useState<SupportedLangType>(SUPPORTED_LANG[0])
    const [gridSize, onSelectGridSize] = useState<SupportedGridSize>(SUPPORTED_GRID[0])
    const [solution, onSetSolution] = useState("")
    const [tabName, setTabName] = useState<TabName>('SETTINGS')

    const [conn, connectionState] = useConnection()
    const navigator = useNavigate();

    const [error, setError] = useState<string | null>()
    const [isLoading, setIsLoading] = useState(false)

    const createBoard = (solution: string, rows: number, cols: number) => {
        if (conn) {
            setIsLoading(true);
            const start = new Date()
            const stop = GenerateNewBoard.builder()
                .addConnection(conn)
                .addOnSuccess(() => {
                    console.log("board was created")
                    const remaining = Date.now() - start;
                    setTimeout(() => {
                        setIsLoading(true);
                        navigator('/create')

                    }, remaining < 0 ? 0 : remaining)
                })
                .addOnError((generateError) => {
                    setError(generateError.message);
                    console.error("board error", generateError)
                })
                .execute({
                    cols: rows,
                    rows: cols,
                    message: solution
                })


            setTimeout(() => {
                stop("Stopping the listener")
            }, 3000)
        }
    }

    const generateGrid = () => {
        const grid: string[][] = []

        for (let row = 0; row < gridSize.rows; row++) {
            const cols: string[] = new Array(gridSize.cols).fill(null).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(
                Math.random() * 26
            )])

            grid.push(cols)
        }

        return grid
    }

    return (
        <>
            {isLoading && <div className={'absolute flex w-screen h-screen backdrop-blur justify-center items-center'}>
                <Loading/>
            </div>}
            <div className={'min-w-screen min-h-screen bg-sky-500 flex flex-col justify-center items-center p-24'}>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    createBoard(solution, gridSize.rows, gridSize.cols)
                }}
                      className={`text-stone-00 min-w-1/3 bg-white rounded-xl p-8 flex-col gap-4 justify-around flex`}>
                    <section className={'flex flex-col items-center text-center'}>
                        <h1 className={'font-header text-3xl'}>Create new cruciwordo puzzle</h1>
                        <h1 className={'text-md'}>Create your own 8-way word search puzzle with a hidden
                            message</h1>
                    </section>
                    <center className={`flex flex-col gap-2 ${tabName === 'SETTINGS' ? 'flex' : 'hidden'}`}>
                        <section className={'w-full flex flex-col gap-1'}>
                            <div className={'flex flex-row items-center gap-1'}>
                                <IoLanguageSharp/>
                                <h3 className={'font-bold'}>Language</h3>
                            </div>
                            <div className={'language p-2 bg-sky-100 rounded-lg flex flex-row justify-around'}>
                                {SUPPORTED_LANG.map(language => {
                                    return <div key={language.language}>
                                        <label
                                            className={`py-1 px-2 rounded-lg ${language === lang ? 'bg-sky-400 font-bold text-white' : 'font-bold text-stone-600'}`}
                                            htmlFor={language.id}>{language.language}</label>
                                        <input name={'language'} id={language.id} type={'radio'}
                                               className={'hidden checked:text-red-500'}
                                               onChange={event => {
                                                   onSelectLang(language)
                                               }}
                                        />
                                    </div>
                                })}
                            </div>
                        </section>
                        <section className={'w-full flex flex-col gap-1'}>
                            <div className={'flex flex-row items-center gap-1'}>
                                <IoGridSharp/>
                                <h3 className={'font-bold'}>Grid size</h3>
                            </div>
                            <div className={'language p-2 bg-sky-100 rounded-lg flex flex-row justify-around'}>
                                {SUPPORTED_GRID.map(grid => {
                                    return <div key={grid.id}>
                                        <label
                                            className={`py-1 px-2 rounded-lg ${grid === gridSize ? 'bg-sky-400 font-bold text-white' : 'font-bold text-stone-600'}`}
                                            htmlFor={grid.id}>{grid.size}</label>
                                        <input name={'language'} id={grid.id} type={'radio'}
                                               className={'hidden checked:text-red-500'}
                                               onChange={event => {
                                                   onSelectGridSize(grid)
                                               }}
                                        />
                                    </div>
                                })}
                            </div>
                        </section>
                        <section className={'w-full flex flex-col gap-1'}>
                            <label htmlFor='solution' className={'flex flex-row items-center gap-1'}>
                                <IoKeySharp/>
                                <h3 className={'font-bold'}>Hidden message</h3>
                            </label>
                            <input name='solution' id='solution' type={'text'}
                                   value={solution} onChange={ev => {
                                const solutionValue = ev.target.value;
                                onSetSolution(solutionValue)
                            }}
                                   className={'border-sky-100 border-2 py-1 px-4 rounded-lg'}
                                   placeholder={'The tea in Nepal is very hot'}/>
                            <label htmlFor='solution'
                                   className={'flex flex-row items-center justify-end gap-6 text-sm'}>
                                <span className={'flex flex-row items-center gap-1 font-thin'}>
                                    <p>Remaining:</p>
                                    <p>{(gridSize.max_solution ? gridSize.max_solution : Math.floor(gridSize.rows * gridSize.cols / 3)) - solution.length}</p>
                                </span>
                            </label>
                        </section>
                    </center>
                    <center className={`flex flex-col gap-2 ${tabName === 'PREVIEW' ? 'flex' : 'hidden'}`}>
                        <section className={'flex flex-col justify-center p-2 border-2 border-dotted rounded-xl'}>
                            <MoveGrid grid={generateGrid()}/>
                            <p className={'text-md text-center p-4 text-sky-500'}>
                                This is just a preview click generate to create a similar puzzle!
                            </p>
                        </section>
                    </center>
                    <section className={'w-full flex flex-col gap-1'}>
                        <button
                            className={'bg-sky-400 py-2 px-4 rounded-lg text-white text-md flex flex-row gap-3 justify-center items-center'}>
                            <IoCogSharp/>
                            <h3 className={'font-bold'}>Generate Puzzle</h3>
                        </button>
                    </section>
                    <section>
                        <span className={'items-center overflow-ellipsis line-clamp-3'}>
                            <p className={'text-red-500 font-light'}>{error}</p>
                        </span>
                    </section>
                </form>

                <section className={'flex flex-col gap-1'}>
                    <button onClick={() => {
                        setTabName(tabName === 'SETTINGS' ? "PREVIEW" : "SETTINGS")
                    }}
                            className={'text-3xl font-header text-center text-white py-4 px-8 capitalize'}>Show {tabName === 'SETTINGS' ? 'Preview' : 'Settings'}</button>
                </section>
            </div>
        </>
    );
};

export default CreateGrid