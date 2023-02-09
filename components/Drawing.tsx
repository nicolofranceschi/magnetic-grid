import { useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import { datas, ListData } from '../utils/data';
import { Header } from './Header';
import { Item } from './Item';
import { createGridFromArray2D, selectCell } from "gridl/core";
import { rotate90, transform } from 'gridl';

export const CALIBRATION_SIZE = 10;

const rotateMatrix90 = (matrix: number[][], direction: number) => {
    const grid = createGridFromArray2D(matrix);
    const rotatedGrid = transform(rotate90(-1))(grid);
    return rotatedGrid.array2D as number[][];
}


export default function Drawing({ maxX, maxY }: { maxX: number, maxY: number }) {

    const [list, setList] = useState<ListData>();

    const [selected, setSelected] = useState<string>();

    const rotate = (id: string) => {
        setList((currentList: ListData | undefined): ListData | undefined => {
            if (!currentList) return undefined;
            return {
                ...currentList, [id]: {
                    ...currentList[id],
                    rotate: currentList[id].rotate + 90,
                    path: rotateMatrix90(currentList[id].path, 1)
                }
            }
        })
    }

    return (
        <div className='bg'>
            <Header setList={setList} />
            {list && selected && <div className='tools'>
                <button onClick={() => rotate(selected)} >
                    <span>rotate</span>
                </button>
            </div>}
            <Stage className='stage' width={maxX} height={maxY} >
                <Layer>
                    {selected && list && list[selected].path.map((row, i) => {
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
                    {list && Object.entries(list).map(([key, item], i) => (
                        <Item key={key} id={key} item={item} list={list} setList={setList} selected={selected} setSelected={setSelected} maxX={maxX} maxY={maxY} />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}


