import { useEffect, useState } from "react";
import Drawing from "./components/Drawing";
import useWindowSize from "./utils/useWindowSize";

export let source: MessageEventSource | null = null;

export default function App() {

  const { width, height } = useWindowSize();

  const [message, setMessage] = useState<string | null>();

  // 4-CU , 5-CU , 4-AL , 5-AL

  function displayMessage(evt: MessageEvent) {
    if (evt.data.toString() === "none") return;
    source = evt.source;
    setMessage(evt.data.toString());
  }

  useEffect(() => {
    if(!window) return;
    window.addEventListener("message", displayMessage);
    return () => {
      window.removeEventListener("message", displayMessage);
    }
  }, [])

  return (
    <div className="bg-white flex items-center justify-center h-[100vh] w-[100vw] text-black">
      {!message && <p>Select Model</p> }
      {message && width && height && <Drawing width={width} height={height} littleBarType={message.startsWith("4")} />}
    </div>
  );
}
