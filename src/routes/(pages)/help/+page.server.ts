export const load = async () => {
  return {
    website: fetch('https://www.google.com').then((response) => response.text()),
  }
}
