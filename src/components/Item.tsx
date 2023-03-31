import { Image } from 'react-konva';
import useImage from 'use-image';
import { borderBound } from '../utils/function';
import { datas, ListData, ListItem } from '../utils/data';
import { CALIBRATION_SIZE } from './Drawing';
import { StageSize } from '../types';

type ItemProps = StageSize & {
    id: string;
    item: ListItem;
    list: ListData;
    setList: SetFunction<ListData>;
    selected: string | undefined;
    setSelected: SetFunction<string | undefined>;
};

function findConnectedItems(id: string, connectors: string[][], list: ListData) {
    const listWithoutCurrent = Object.entries(list).filter(([key]) => key !== id);
    return Object.fromEntries(listWithoutCurrent.filter(([key, item]) => {
        if (!item.connectors || item.connectors.length === 0) return null;
        return connectors.some(group => item.connectors.some(otherGroup => JSON.stringify(group) === JSON.stringify(otherGroup)))
    }));
}

export const Item = ({ id, item, setList, setSelected, height, width }: ItemProps) => {

    const [img] = useImage(datas[item.type].image);

    return (
        <Image
            image={img}
            x={item.x}
            y={item.y}
            rotation={-item.rotate}
            width={datas[item.type].path[0].length * CALIBRATION_SIZE}
            height={datas[item.type].path.length * CALIBRATION_SIZE}
            draggable
            padding={0}
            fill="transparent"
            onClick={() => {
                setSelected(id);
            }}
            onDragStart={() => {
                setSelected(id);
            }}
            onDragMove={(e) => {
                setList(list => list && ({ ...list, [id]: { ...list[id], x: e.target.x() <= 0 || e.target.x() > width ?  list[id].x : e.target.x()  , y: e.target.y() <= 0 || e.target.y() >= height ? list[id].y : e.target.y() } }));
            }}
            onDragEnd={() => {
                const x = Math.round(item.x / CALIBRATION_SIZE);
                const y = Math.round(item.y / CALIBRATION_SIZE);
                setList(list => {
                    // TODO: invertire in base a rotation per prendere i gruppi di connettori giusti
                    const connectors = list[id].path.map((row, i) => row.map((col, j) => col === 2 ? `${j + Number(x)}:${i + Number(y)}` : null).filter(Boolean)).filter((arr) => arr.length > 0);
                    const connectedItems = findConnectedItems(id, connectors, list);
                    if (!list) return list;
                    const newConnectedItems = Object.fromEntries(Object.keys(connectedItems).map(key => [key, {
                        ...list[key],
                        connectedItems: { ...list[key].connectedItems, [id]: item }
                    }]));
                    return { ...list, [id]: { ...list[id], connectedItems, connectors, x: x * CALIBRATION_SIZE, y: y * CALIBRATION_SIZE }, ...newConnectedItems }
                });
            }}
            offset={offsetCalculation(item.rotate , item)}
            dragBoundFunc={(pos) => borderBound({ ...pos, height, width, sizeX: datas[item.type].path[0].length * CALIBRATION_SIZE, sizeY: datas[item.type].path.length * CALIBRATION_SIZE })} />
    );
};

const offsetCalculation = (rotate: number , item: ListItem) => {
    switch (rotate % 360) {
        case 0:
            return { x: 0, y: 0 };
        case 90:
            return { x: datas[item.type].path[0].length * CALIBRATION_SIZE , y: 0 };
        case 180:
            return { x: datas[item.type].path[0].length * CALIBRATION_SIZE , y: datas[item.type].path.length * CALIBRATION_SIZE };
        case 270:
            return { x: 0, y: datas[item.type].path.length * CALIBRATION_SIZE };
        default:
            return { x: 0, y: 0 };
    }
}
