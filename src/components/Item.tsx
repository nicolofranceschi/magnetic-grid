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
    setList: SetFunction<ListData | undefined>;
    selected: string | undefined;
    setSelected: SetFunction<string | undefined>;
};

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
            cornerRadius={10}
            fill="transparent"
            onDragStart={() => {
                setSelected(id);
            }}
            onDragMove={(e) => {
                setList(list => list && ({ ...list, [id]: { ...list[id], x: e.target.x(), y: e.target.y() } }));
            }}
            onDragEnd={() => {
                setList(list => list && ({ ...list, [id]: { ...list[id], x: Math.round(item.x / CALIBRATION_SIZE) * CALIBRATION_SIZE, y: Math.round(item.y / CALIBRATION_SIZE) * CALIBRATION_SIZE } }));
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
