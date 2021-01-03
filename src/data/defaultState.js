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
    { id: 1, key: 'flower', bagX: 30, bagY: 40 },
    { id: 2, key: 'flower', bagX: 40, bagY: 90 }
  ],
  roomItems: [],
  places: [
    { key: 'room1', x: 400, y: 400 },
    { key: 'town1', x: 500, y: 480 },
    null,
    null,
    null,
    null,
    null,
    null
  ],
  events: {
    intro: 0
  }
}
