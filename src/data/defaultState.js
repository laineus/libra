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
    { id: 2, key: 'lily', bagX: 40, bagY: 90 },
    { id: 3, key: 'elixir', bagX: 40, bagY: 130 },
    { id: 4, key: 'matsutake', bagX: 40, bagY: 160 },
    { id: 5, key: 'kitchen', bagX: 60, bagY: 160 },
    { id: 6, key: 'audioSystem', bagX: 40, bagY: 190 },
    { id: 7, key: 'tv', bagX: 60, bagY: 250 },
    { id: 8, key: 'sofa', bagX: 70, bagY: 360 },
    { id: 9, key: 'sofa', bagX: 110, bagY: 260 },
    { id: 10, key: 'tissue', bagX: 110, bagY: 160 },
    { id: 11, key: 'apple', bagX: 55, bagY: 40 },
    { id: 12, key: 'tablemat1', bagX: 15, bagY: 140 },
    { id: 13, key: 'tablemat2', bagX: 15, bagY: 160 },
    { id: 14, key: 'trash', bagX: 130, bagY: 80 },
    { id: 15, key: 'trash', bagX: 130, bagY: 90 },
    { id: 16, key: 'trashCan1', bagX: 130, bagY: 100 },
    { id: 17, key: 'trashCan1', bagX: 130, bagY: 110 }
  ],
  roomItems: [],
  lastAbsenceAction: 1,
  stomach: [],
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
    main: 0,
    itemReactions: [],
    torrentFlog: 0,
    clover: 0,
    snakeFlog: 0,
    strawDoll: 0,
    curse: 0,
    eel: 0,
    liveForEveryone: 0,
    pityPenguin: 0,
    painter: 0,
    matsutake: 0,
    enlightenment: 0,
    appreciation: 0,
    regain: 0,
    beauty: 0,
    forever: 0
  },
  killed: [],
  tutorial: ['home', 'map']
}
