import { useEffect, useState } from "react";
import Drawing from "./components/Drawing";
import useWindowSize from "./utils/useWindowSize";

export default function App() {

  const { width, height } = useWindowSize();

  const [message, setMessage] = useState<MessageEvent | null>();

  function displayMessage(evt: MessageEvent) {
    if (evt.data.toString() === "none") return;
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
    <div className="bg-white flex items-center justify-center h-full w-full text-black">
      {!message && <p>Select Model</p> }
      {message && <Drawing width={width ?? 0} height={height ?? 0} />}
    </div>
  );
}
