let goImpl = (hash: string) => {
  location.hash = hash
}

export function setNavigator(fn: (hash: string) => void): void {
  goImpl = fn
}

export function go(hash: string): void {
  if (location.hash === hash) goImpl(hash)
  else location.hash = hash
}
