import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import { feed, ListData } from '../utils/data';
import { Header } from './Header';
import { Item } from './Item';
import { createGridFromArray2D } from "gridl/core";
import { rotate90, transform } from 'gridl';
import { StageSize } from '../types';
import { flushSync } from 'react-dom';
import { source } from '../App';

function downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const CALIBRATION_SIZE = 3;

const rotateMatrix90 = (matrix: number[][]) => {
    const grid = createGridFromArray2D(matrix);
    const rotatedGrid = transform(rotate90<number>(-1))(grid);
    return rotatedGrid.array2D;
}

export default function Drawing(props: StageSize & { littleBarType: boolean }) {
    const [list, setList] = useState<ListData>({
        "feed": {
            type: "fed4",
            value: 0,
            x: props.width / 2,
            y: props.height / 2,
            path: feed.fed4.path,
            connectors: [],
            rotate: 0,
        }
    });
    const [stagePos, setStagePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [selected, setSelected] = useState<string>();
    const [zoom, setZoom] = useState(0);
    const stageRef = useRef<any>();
    const layerRef = useRef<any>();
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }
        document.addEventListener('fullscreenchange', onFullscreenChange);

        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);

    }, []);

    useEffect(() => {
        const arrToSend = Object.values(list).filter((value) => value.type.startsWith("feed"))
        parent.postMessage(arrToSend)
        parent.postMessage("ei soono io")
        source?.postMessage(arrToSend)
        source?.postMessage("io la seconda opzione")
        console.log("send")
    }, [list && Object.keys(list).length])

    const rotate = () => {
        if (!selected) return;
        setList((currentList) => {
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
            const { [selected]: _, ...newList } = currentList;
            return newList
        })
    }

    const handleExport = async () => {
        if (!layerRef.current) return;
        stageRef.current.scale({ x: 1, y: 1 });
        flushSync(() => setSelected(undefined))
        const uri = layerRef.current.toDataURL({
            mimeType: 'image/png',
            quality: 1,
            pixelRatio: 2,
            ...stagePos,
            ...props

        });
        downloadURI(uri, "stage.png");
    };


    function zoomStage(event: any) {
        event.evt.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const oldScale = stage.scaleX();
            if (oldScale < 1 && event.evt.deltaY < 0) return;
            if (oldScale > 5 && event.evt.deltaY > 0) return;
            const { x: pointerX, y: pointerY } = stage.getPointerPosition();
            const mousePointTo = {
                x: (pointerX - stage.x()) / oldScale,
                y: (pointerY - stage.y()) / oldScale,
            };
            const newScale = event.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
            stage.scale({ x: newScale, y: newScale });
            const newPos = {
                x: pointerX - mousePointTo.x * newScale,
                y: pointerY - mousePointTo.y * newScale,
            }
            stage.position(newPos);
            setZoom(newScale);
            stage.batchDraw();
        }
    }

    return (
        <div className='bg'>
            <Header setList={setList} dim={props} littleBarType={props.littleBarType} />
            {list && selected && <div className='tools flex items-center justify-center'>
                <button onClick={rotate} type='button'>
                    <span>
                        <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                    </span>
                </button>
                <button onClick={deleteElement} type='button'>
                    <span>
                        <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </span>
                </button>

            </div>}
            <div className='zoom flex items-center justify-center p-4'>
                <p className='p-2 text-white'> zoom {Math.trunc(zoom)} </p>
                <button onClick={() => isFullscreen ? document.exitFullscreen() : document.body.requestFullscreen()} type='button'>
                    <span>
                        <svg height="14px" version="1.1" viewBox="0 0 14 14" width="14px" strokeWidth={1.5} stroke="white" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" id="Page-1" stroke="white" strokeWidth="1">
                                <g fill="white" transform="translate(-215.000000, -257.000000)">
                                    <g id="fullscreen" transform="translate(215.000000, 257.000000)">
                                        <path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z" id="Shape" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </span>
                </button>
                <button onClick={handleExport} type='button'>
                    <span className='font-black text-white'>
                        SAVE
                    </span>
                </button>
            </div>
            <Stage
                ref={stageRef}
                className='stage bg-slate-100'
                {...props}
                {...stagePos}
                onWheel={zoomStage}
                draggable
                onDragEnd={e => {
                    setStagePos(e.currentTarget.position());
                }}
            >
                <Layer
                    ref={layerRef}
                >
                    <Rect
                        x={0}
                        y={0}
                        {...props}
                        fill='white'
                    />
                    {selected && list?.[selected].path?.map((row, i) => {
                        return row.map((col, j) => {
                            // if (col === 0) return null;
                            return (
                                <Rect
                                    key={`${i}-${j}`}
                                    x={Math.round((list[selected].x + j * CALIBRATION_SIZE) / CALIBRATION_SIZE) * CALIBRATION_SIZE}
                                    y={Math.round((list[selected].y + i * CALIBRATION_SIZE) / CALIBRATION_SIZE) * CALIBRATION_SIZE}
                                    width={CALIBRATION_SIZE}
                                    height={CALIBRATION_SIZE}
                                    fill={col === 2 ? 'red' : '#f3ffc4'}
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


