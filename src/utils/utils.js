export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const generateProblem = (level) => {
  const first = getRandomInt(1, 5 + level)
  const second = getRandomInt(1, 5 + level)

  return  {
    text: `${first} + ${second}`,
    answer: first+second
  }
}