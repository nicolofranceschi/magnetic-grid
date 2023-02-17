import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import { ListData } from '../utils/data';
import { Header } from './Header';
import { Item } from './Item';
import { createGridFromArray2D } from "gridl/core";
import { rotate90, transform } from 'gridl';
import { StageSize } from '../types';

function downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const CALIBRATION_SIZE = 10;

const rotateMatrix90 = (matrix: number[][]) => {
    const grid = createGridFromArray2D(matrix);
    const rotatedGrid = transform(rotate90<number>(-1))(grid);
    return rotatedGrid.array2D;
}

export default function Drawing(props: StageSize) {
    const [list, setList] = useState<ListData>();
    const [zoom, setZoom] = useState<number>(0.5);
    const [stagePos, setStagePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const [selected, setSelected] = useState<string>();

    const stageRef = useRef<any>();

    const [isFullscreen, setIsFullscreen] = useState(false);

    // Watch for fullscreenchange
    useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }

        document.addEventListener('fullscreenchange', onFullscreenChange);

        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    const rotate = () => {
        if (!selected) return;
        setList((currentList) => {
            if (!currentList) return undefined;
            return {
                ...currentList, [selected]: {
                    ...currentList[selected],
                    rotate: currentList[selected].rotate + 90,
                    path: rotateMatrix90(currentList[selected].path)
                }
            }
        })
    }

    const deleteElement = () => {
        if (!selected) return;
        setSelected(undefined);
        setList((currentList) => {
            if (!currentList) return undefined;
            const { [selected]: _, ...newList } = currentList;
            return newList
        })
    }

    const handleExport = () => {
        if (!stageRef.current) return;
        setSelected(undefined);
        const uri = stageRef.current.toDataURL();
        console.log(uri);
        downloadURI(uri, "stage.png");
    };

    return (
        <div className='bg'>
            <Header setList={setList} />
            {list && selected && <div className='tools'>
                <button onClick={rotate} type='button'>
                    <span>
                        <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                    </span>
                </button>
                <button onClick={deleteElement} type='button'>
                    <span>
                        <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </span>
                </button>

            </div>}
            <div className='zoom'>
                <button onClick={() => setZoom((czoom) => czoom + 0.1)} type='button'>
                    <span>+</span>
                </button>
                <button onClick={() => setZoom((czoom) => czoom - 0.1)} type='button'>
                    <span>-</span>
                </button>
                <button onClick={() => isFullscreen ? document.exitFullscreen() : document.body.requestFullscreen()} type='button'>
                    <span>
                        <svg height="14px" version="1.1" viewBox="0 0 14 14" width="14px" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" id="Page-1" stroke="none" strokeWidth="1">
                                <g fill="#000000" transform="translate(-215.000000, -257.000000)">
                                    <g id="fullscreen" transform="translate(215.000000, 257.000000)">
                                        <path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z" id="Shape" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </span>
                </button>
                <button onClick={handleExport} type='button'>
                    <span>
                        SAVE
                    </span>
                </button>
            </div>
            <Stage
                ref={stageRef}
                className='stage'
                {...props}
                {...stagePos}
                scaleX={zoom}
                scaleY={zoom}
                draggable
                onDragEnd={e => {
                    setStagePos(e.currentTarget.position());
                }}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        {...props}
                        fill='white'
                    />
                    {selected && list?.[selected].path?.map((row, i) => {
                        return row.map((col, j) => {
                            if (col === 0) return null;
                            return (
                                <Rect
                                    key={`${i}-${j}`}
                                    x={Math.round((list[selected].x + j * CALIBRATION_SIZE) / CALIBRATION_SIZE) * CALIBRATION_SIZE}
                                    y={Math.round((list[selected].y + i * CALIBRATION_SIZE) / CALIBRATION_SIZE) * CALIBRATION_SIZE}
                                    width={CALIBRATION_SIZE}
                                    height={CALIBRATION_SIZE}
                                    fill='#f3ffc4'
                                />
                            )
                        })
                    })}
                    {list && Object.entries(list).map(([key, item]) => (
                        <Item key={key} id={key} item={item} list={list} setList={setList} selected={selected} setSelected={setSelected} {...props} />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}


