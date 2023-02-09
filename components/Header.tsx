import { datas, ListData } from '../utils/data';

export const Header = ({ setList }: { setList: SetFunction<ListData | undefined> }) => (
    <div className='header'>
        {Object.entries(datas).map(([key, data]) => (
             <button key={key} className='selectProduct' onClick={() => setList(list => ({
                ...list, [Date.now()]: {
                    type: key,
                    path: data.path,
                    rotate: 0,
                    x: 150,
                    y: 20,
                }
            }))}>
                <span>{data.title}</span>
                <img src={data.image} />
            </button>
            
        ))}
    </div>
);
