const firstNames = [
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Ava",
  "Elijah",
  "Sophia",
  "James",
  "Isabella",
  "Lucas",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Williams",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Lopez",
  "Wilson",
];

export function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}
