import "./App.css";
import { useWhiteboardState } from "./useWhiteboardState";

function App() {
  const whiteboard = useWhiteboardState();

  return (
    <>
      <h1>Whiteboard</h1>
      {whiteboard.map((token, position) => (
        <div key={position}>
          Position {position + 1}: {token ?? "nothing yet"}
        </div>
      ))}
    </>
  );
}

export default App;
