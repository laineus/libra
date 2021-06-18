export default () => {
  return {
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
    amiliFollowing: false,
    bagItems: [],
    roomItems: [],
    fieldApples: [],
    lastAbsenceAction: 1,
    stomach: [],
    places: [
      null,
      null,
      null,
      null,
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
      bogusDoctor: 0,
      appreciation: 0,
      regain: 0,
      beauty: 0,
      forever: 0,
      raptor: 0,
      cosmos: false,
      photosynthesis: 0,
      photosynthesisAte: []
    },
    killed: [],
    tutorial: []
  }
}
