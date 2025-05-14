import { useState } from "react";
import styles from "./Whiteboard.module.css";
import { sendMessageToClients } from "./ws";
import { TOKEN_NUMBER } from "../consts";

const getTokenName = (index: number) => `token-${index}`;

const getOptions = (position: number, state: (string | null)[]) => {
  const missingTokens = [];

  const isTokenUnused = (tokenName: string) => !state.includes(tokenName);
  const isTokenUsedInThisPosition = (position: number, tokenName: string) =>
    state[position] === tokenName;

  for (let i = 0; i < TOKEN_NUMBER; i++) {
    const tokenName = getTokenName(i);
    if (
      isTokenUnused(tokenName) ||
      isTokenUsedInThisPosition(position, tokenName)
    ) {
      missingTokens.push(tokenName);
    }
  }
  return missingTokens;
};

export default function Whiteboard() {
  const [state, setState] = useState(
    Array<string | null>(TOKEN_NUMBER).fill(null)
  );

  return (
    <div className={styles.whiteboard}>
      <div>Mock whiteboard</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessageToClients(
            JSON.stringify({
              type: "whiteboard-state",
              payload: state,
            })
          );
        }}
      >
        {state.map((_token, position) => (
          <select
            key={position}
            name={position + ""}
            value={state[position] ?? ""}
            onChange={(event) =>
              setState((arr) => {
                arr[position] = event.target.value || null;
                return [...arr];
              })
            }
          >
            <option value={""}>null</option>
            {getOptions(position, state).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        ))}
        <button type="submit">Set whiteboard</button>
      </form>
    </div>
  );
}
