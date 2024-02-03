import { signal } from "@preact/signals-react";
import { commandType } from "../types";

// Commands sent from UI to game engine
export const command = signal<commandType>({
  type: 'idle',
  value: 0,
})
