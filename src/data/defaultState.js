export default {
  map: '',
  x: 0,
  y: 0,
  r: 0,
  saved: null,
  sec: 0,
  status: {
    hp: 100,
    heart: 0,
    body: 0
  },
  bagItems: [
    { id: 1, key: 'apple', bagX: 30, bagY: 40 },
    { id: 2, key: 'lily', bagX: 40, bagY: 90 }
  ],
  roomItems: [],
  places: [
    { key: 'home', x: 400, y: 400 },
    { key: 'forest3', x: 500, y: 480 },
    null,
    null,
    null,
    null,
    null,
    null
  ],
  events: {
    intro: 0,
    itemReactions: [],
    torrentFlog: 0,
    clover: 0,
    snakeFlog: 0,
    strawDoll: 0,
    curse: 0,
    eel: 0,
    liveForEveryone: 0,
    pityPenguin: 0,
    dark: 0
  }
}
