import { problemType } from "../types";

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const generateProblem = (level: number): problemType => {
  const first = getRandomInt(1, 5 + level)
  const second = getRandomInt(1, 5 + level)

  return  {
    text: `${first} + ${second}`,
    answer: first+second
  }
}