import { useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import { ListData } from '../utils/data';
import { Header } from './Header';
import { Item } from './Item';
import { createGridFromArray2D } from "gridl/core";
import { rotate90, transform } from 'gridl';
import { StageSize } from '../types';

export const CALIBRATION_SIZE = 10;

const rotateMatrix90 = (matrix: number[][]) => {
    const grid = createGridFromArray2D(matrix);
    const rotatedGrid = transform(rotate90<number>(-1))(grid);
    return rotatedGrid.array2D;
}

export default function Drawing(props: StageSize) {
    const [list, setList] = useState<ListData>();
    const [zoom, setZoom] = useState<number>(0.5);

    const [selected, setSelected] = useState<string>();

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
            const { [selected]:_ , ...newList } = currentList;
            return newList
        })
    }

    console.log(list)

    return (
        <div className='bg'>
            <Header setList={setList} />
            {list && selected && <div className='tools'>
                <button onClick={rotate} type='button'>
                    <span>rotate</span>
                </button>
                <button onClick={deleteElement} type='button'>
                    <span>delete</span>
                </button>
            </div>}
            <div className='zoom'>
                <button onClick={()=>setZoom((czoom)=> czoom + 0.1 )} type='button'>
                    <span>+</span>
                </button>
                <button onClick={()=>setZoom((czoom)=> czoom - 0.1 )} type='button'>
                    <span>-</span>
                </button>
            </div>
            <Stage className='stage' width={2000} height={2000} scaleX={zoom} scaleY={zoom} >
                <Layer>
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


