export function getWords(str: string) {
  return str
    .trim()
    .split(/\s+/)
    .filter((char) => !!char)
}
