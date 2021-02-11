
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
  ENLIGHTENMENT_STEPS,
  APPRECIATION_STEPS,
  BEAUTY_STEPS,
  FOREVER_STEPS
} from '@/data/eventSteps'
export default [
  {
    key: 'torrentFlog',
    started: state => state.events.torrentFlog >= TORRENT_FLOG_STEPS.STARTED,
    completed: state => state.events.torrentFlog === TORRENT_FLOG_STEPS.COMPLETED
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
    completed: state => state.events.snakeFlog === SNAKE_FLOG_STEPS.COMPLETED
  },
  {
    key: 'curse',
    started: state => state.events.curse >= CURSE_STEPS.STARTED,
    completed: state => state.events.curse >= CURSE_STEPS.EXECUTED_END
  },
  {
    key: 'eel',
    started: state => state.events.eel >= EEL_STEPS.STARTED,
    completed: state => state.events.eel >= EEL_STEPS.COMPLETED1
  },
  {
    key: 'pityPenguin',
    started: state => state.events.pityPenguin >= PITY_STEPS.STARTED,
    completed: state => state.events.pityPenguin === PITY_STEPS.COMPLETED
  },
  {
    key: 'liveForEveryone',
    started: state => state.events.liveForEveryone >= LIVE_FOR_EVERYONE_STEPS.COMPLETED,
    completed: state => state.events.liveForEveryone === LIVE_FOR_EVERYONE_STEPS.COMPLETED
  },
  {
    key: 'matsutake',
    started: state => state.events.matsutake >= MATSUTAKE_STEPS.STARTED,
    completed: state => state.events.matsutake === MATSUTAKE_STEPS.COMPLETED
  },
  {
    key: 'painter',
    started: state => state.events.painter >= PAINTER_STEPS.STARTED,
    completed: state => state.events.painter === PAINTER_STEPS.COMPLETED
  },
  {
    key: 'appreciation',
    started: state => state.events.appreciation >= APPRECIATION_STEPS.STARTED,
    completed: state => state.events.appreciation === APPRECIATION_STEPS.COMPLETED
  },
  {
    key: 'beauty',
    started: state => state.events.beauty >= BEAUTY_STEPS.STARTED,
    completed: state => state.events.beauty === BEAUTY_STEPS.COMPLETED
  },
  {
    key: 'enlightenment',
    started: state => state.events.enlightenment >= ENLIGHTENMENT_STEPS.COMPLETED,
    completed: state => state.events.enlightenment === ENLIGHTENMENT_STEPS.COMPLETED
  },
  {
    key: 'forever',
    started: state => state.events.forever >= FOREVER_STEPS.STARTED,
    completed: state => state.events.forever === FOREVER_STEPS.COMPLETED
  }
]
