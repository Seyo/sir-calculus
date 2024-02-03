import { signal } from "@preact/signals-react";
import { resultType } from "../types";

// List of results from gameplay
export const results = signal<resultType[]>([])
