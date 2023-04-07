import { connectors, datas, ListData } from '../utils/data';
console.log(datas)
export const Header = ({ setList, dim, littleBarType }: { setList: SetFunction<ListData>, dim: any , littleBarType: boolean }) => (
    <div className='header'>
        {[...Object.entries(datas), ...Object.entries(connectors)].map(([key, data]) => (
             <button key={key} className='selectProduct' onClick={() => setList(list => ({
                ...list, [Date.now()]: {
                    type: key,
                    path: data.path,
                    rotate: 0,
                    x: dim.width / 2 ,
                    y: dim.height / 2 ,
                }
            }))}>
                <span>{data.title}</span>
                <img src={`assets/${key}.png`} />
            </button>
            
        ))}
    </div>
);
