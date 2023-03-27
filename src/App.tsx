import { useEffect, useState } from "react";
import Drawing from "./components/Drawing";
import useWindowSize from "./utils/useWindowSize";

export default function App() {

  const { width, height } = useWindowSize();

  const [message, setMessage] = useState<MessageEvent | null>(null);

  function displayMessage(evt: MessageEvent) {
    console.log(evt);
    setMessage(evt);
    alert(evt.toString());
  }

  useEffect(() => {
    if(!window) return;
    alert("instance");
    window.addEventListener("message", displayMessage, false);
    return window.removeEventListener("message", displayMessage, false);
  }, [])

  return (
    <Drawing width={width ?? 0} height={height ?? 0} />
  );
}
