
import {
  TORRENT_FLOG_STEPS,
  CLOVER_STEPS,
  SNAKE_FLOG_STEPS,
  CURSE_STEPS,
  EEL_STEPS,
  LIVE_FOR_EVERYONE_STEPS,
  PITY_STEPS,
  MATSUTAKE_STEPS,
  PAINTER_STEPS,
  BOGUS_STEPS,
  APPRECIATION_STEPS,
  BEAUTY_STEPS,
  FOREVER_STEPS,
  RAPTOR_STEPS,
  PHOTOSYNTHESIS_STEPS
} from '@/data/eventSteps'
export default [
  {
    key: 'torrentFlog',
    started: state => state.events.torrentFlog >= TORRENT_FLOG_STEPS.STARTED,
    completed: state => state.events.torrentFlog === TORRENT_FLOG_STEPS.COMPLETED,
    place: 'forest3',
    chara: 'torrent'
  },
  {
    key: 'clover',
    started: state => state.events.clover >= CLOVER_STEPS.STARTED,
    completed: state => state.events.clover === CLOVER_STEPS.COMPLETED,
    place: 'forest4',
    chara: 'flog'
  },
  {
    key: 'snakeFlog',
    started: state => state.events.snakeFlog >= SNAKE_FLOG_STEPS.STARTED,
    completed: state => state.events.snakeFlog === SNAKE_FLOG_STEPS.COMPLETED,
    place: 'cave1',
    chara: 'snake'
  },
  {
    key: 'curse',
    started: state => state.events.curse >= CURSE_STEPS.STARTED,
    completed: state => state.events.curse >= CURSE_STEPS.EXECUTED_END,
    place: 'cave3',
    chara: 'bat'
  },
  {
    key: 'eel',
    started: state => state.events.eel >= EEL_STEPS.STARTED,
    completed: state => state.events.eel >= EEL_STEPS.COMPLETED1,
    place: 'ice1',
    chara: 'penguin'
  },
  {
    key: 'pityPenguin',
    started: state => state.events.pityPenguin >= PITY_STEPS.STARTED,
    completed: state => state.events.pityPenguin === PITY_STEPS.COMPLETED,
    place: 'ice3',
    chara: 'penguin'
  },
  {
    key: 'liveForEveryone',
    started: state => state.events.liveForEveryone >= LIVE_FOR_EVERYONE_STEPS.COMPLETED,
    completed: state => state.events.liveForEveryone === LIVE_FOR_EVERYONE_STEPS.COMPLETED,
    place: 'ice2',
    chara: 'penguin'
  },
  {
    key: 'matsutake',
    started: state => state.events.matsutake >= MATSUTAKE_STEPS.STARTED,
    completed: state => state.events.matsutake === MATSUTAKE_STEPS.COMPLETED,
    place: 'coalmine3',
    chara: 'minePenguin'
  },
  {
    key: 'painter',
    started: state => state.events.painter >= PAINTER_STEPS.STARTED,
    completed: state => state.events.painter === PAINTER_STEPS.COMPLETED,
    place: 'coalmine2',
    chara: 'minePenguin'
  },
  {
    key: 'appreciation',
    started: state => state.events.appreciation >= APPRECIATION_STEPS.STARTED,
    completed: state => state.events.appreciation === APPRECIATION_STEPS.COMPLETED,
    place: 'mansion1',
    chara: 'pumpkin'
  },
  {
    key: 'beauty',
    started: state => state.events.beauty >= BEAUTY_STEPS.STARTED,
    completed: state => state.events.beauty === BEAUTY_STEPS.COMPLETED,
    place: 'mansion3',
    chara: 'pumpkin'
  },
  {
    key: 'bogusDoctor',
    started: state => state.events.bogusDoctor >= BOGUS_STEPS.STARTED,
    completed: state => state.events.bogusDoctor === BOGUS_STEPS.COMPLETED,
    place: 'hospital2',
    chara: 'doctorPenguin'
  },
  {
    key: 'forever',
    started: state => state.events.forever >= FOREVER_STEPS.STARTED,
    completed: state => state.events.forever === FOREVER_STEPS.COMPLETED,
    place: 'hospital1night',
    chara: 'ghost'
  },
  {
    key: 'raptor',
    started: state => state.events.raptor >= RAPTOR_STEPS.STARTED,
    completed: state => state.events.raptor === RAPTOR_STEPS.COMPLETED,
    place: 'mansion2',
    chara: 'pumpkin'
  },
  {
    key: 'photosynthesis',
    started: state => state.events.photosynthesis >= PHOTOSYNTHESIS_STEPS.STARTED,
    completed: state => state.events.photosynthesis === PHOTOSYNTHESIS_STEPS.COMPLETED,
    place: 'cosmos',
    chara: 'grey1'
  }
]
