import { connectors, datas, ListData } from '../utils/data';
export const Header = ({ setList, dim, littleBarType }: { setList: SetFunction<ListData>, dim: any, littleBarType: boolean }) => (
    <div className='flex flex-col overflow-scroll bg-blue-400 fixed top-2 bottom-2 left-2 w-24 p-1 gap-1 rounded-lg z-50'>
        {[...Object.entries(datas),...Object.entries(connectors)].map(([key, data]) => (
            <button key={key} className='flex flex-col gap-2 justify-center items-center' onClick={() => setList(list => ({
                ...list, [Date.now()]: {
                    type: key,
                    path: data.path,
                    value: data.value,
                    rotate: 0,
                    x: dim.width / 2,
                    y: dim.height / 2,
                }
            }))}>
                <span>{data.title}</span>
                <img src={`assets/${key}${littleBarType ? "-4" : "-5"}.png`} />
            </button>
        ))}
    </div>
);
