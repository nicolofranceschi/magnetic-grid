import { Image, Rect } from 'react-konva';
import useImage from 'use-image';
import { borderBound } from '../utils/function';
import { connectors, datas, feeds, ListData, ListItem } from '../utils/data';
import { CALIBRATION_SIZE } from './Drawing';
import { StageSize } from '../types';

type ItemProps = StageSize & {
    id: string;
    item: ListItem;
    list: ListData;
    setList: SetFunction<ListData>;
    selected: string | undefined;
    setSelected: SetFunction<string | undefined>;
    littleBarType: boolean;
};

function findConnectors (item: ListItem) {
    const x = Math.round(item.x / CALIBRATION_SIZE);
    const y = Math.round(item.y / CALIBRATION_SIZE);
    const connectorsCoordinates = item.path.flatMap((row, i) => row.map((col, j) => col === 2 ? `${j + Number(x)}:${i + Number(y)}` : "").filter(Boolean)).filter((arr) => arr.length > 0);
    const map = new Map();
    connectorsCoordinates.forEach(item => {
        const [x, y] = item.split(":");
        map.set(`x:${x}`, [...map.get(`x:${x}`) ?? [], item]);
        map.set(`y:${y}`, [...map.get(`y:${y}`) ?? [], item]);
    });
    return [...map.values()].filter(arr => arr.length > 2);
}

function calculateConnectedItemsWholeList (list: ListData) {
    return Object.fromEntries(Object.entries(list).map(([key, item]) => {
        const listWithoutCurrent = Object.entries(list).filter(([innerKey]) => innerKey !== key);
        const myConnectors = findConnectors(item);
        const connectedItems = Object.fromEntries(listWithoutCurrent.filter(([_, innerItem]) => {
            const innerConnectors = findConnectors(innerItem);
            if (!innerConnectors || innerConnectors.length === 0) return null;
            return myConnectors.some(group => innerConnectors.some(otherGroup => JSON.stringify(group) === JSON.stringify(otherGroup)))
        }));

        return [key, { ...item, connectedItems }];
    }))
}
const fullData = { ...datas, ...connectors, ...feeds };

export const Item = ({ id, item, setList, setSelected, height, width , littleBarType }: ItemProps) => {

    const itemConfigData = fullData[item.type];
    const isConnected = Object.keys(item.connectedItems ?? {}).length > 0;

    const [img] = useImage(`assets/${item.type}${isConnected ? '-no-pins' : littleBarType ? '-4' : '-5'}.png`);

    return (
        <Image
            image={img}
            x={item.x}
            y={item.y}
            rotation={-item.rotate}
            width={itemConfigData.path[0].length * CALIBRATION_SIZE}
            height={itemConfigData.path.length * CALIBRATION_SIZE}
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
                const x = Math.round(item.x / CALIBRATION_SIZE) * CALIBRATION_SIZE;
                const y = Math.round(item.y / CALIBRATION_SIZE) * CALIBRATION_SIZE;
                setList(list => {
                    const newList = calculateConnectedItemsWholeList(list);
                    return { ...newList, [id]: { ...newList[id], x, y } }
                });
            }}
            offset={offsetCalculation(item.rotate , item)}
            dragBoundFunc={(pos) => borderBound({ ...pos, height, width, sizeX: itemConfigData.path[0].length * CALIBRATION_SIZE, sizeY: itemConfigData.path.length * CALIBRATION_SIZE })} />
    );
};

const offsetCalculation = (rotate: number , item: ListItem) => {
    const itemConfigData = fullData[item.type];
    switch (rotate) {
        case 0:
            return { x: 0, y: 0 };
        case 90:
            return { x: itemConfigData.path[0].length * CALIBRATION_SIZE , y: 0 };
        case 180:
            return { x: itemConfigData.path[0].length * CALIBRATION_SIZE , y: itemConfigData.path.length * CALIBRATION_SIZE };
        case 270:
            return { x: 0, y: itemConfigData.path.length * CALIBRATION_SIZE };
        default:
            return { x: 0, y: 0 };
    }
}
