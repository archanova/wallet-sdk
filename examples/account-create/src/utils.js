export function generateRandomEnsLabel() {
  return (
    'demo' +
    Date.now().toString(32) +
    Math.floor(Math.random()*100000).toString(32)
  );
}
