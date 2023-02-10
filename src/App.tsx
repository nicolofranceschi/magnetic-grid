import Drawing from "./components/Drawing";
import useWindowSize from "./utils/useWindowSize";

export default function App() {

  const { width , height } = useWindowSize();

  return (
    <Drawing width={ width ?? 0 } height={ height ?? 0 } />
  );
}
