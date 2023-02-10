import Drawing from "./components/Drawing";
import useWindowSize from "./utils/useWindowSize";

export default function App() {

  const { width , height } = useWindowSize();

  return (
    <Drawing maxX={ width ?? 0 } maxY={ height ?? 0 } />
  );
}
