
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
  { key: 'torrentFlog', completed: state => state.events.torrentFlog === TORRENT_FLOG_STEPS.COMPLETED },
  { key: 'clover', completed: state => state.events.clover === CLOVER_STEPS.COMPLETED },
  { key: 'snakeFlog', completed: state => state.events.snakeFlog === SNAKE_FLOG_STEPS.COMPLETED },
  { key: 'curse', completed: state => state.events.curse >= CURSE_STEPS.EXECUTED_END },
  { key: 'eel', completed: state => state.events.eel >= EEL_STEPS.COMPLETED1 },
  { key: 'pityPenguin', completed: state => state.events.pityPenguin === PITY_STEPS.COMPLETED },
  { key: 'liveForEveryone', completed: state => state.events.liveForEveryone === LIVE_FOR_EVERYONE_STEPS.COMPLETED },
  { key: 'matsutake', completed: state => state.events.matsutake === MATSUTAKE_STEPS.COMPLETED },
  { key: 'painter', completed: state => state.events.painter === PAINTER_STEPS.COMPLETED },
  { key: 'appreciation', completed: state => state.events.appreciation === APPRECIATION_STEPS.COMPLETED },
  { key: 'beauty', completed: state => state.events.beauty === BEAUTY_STEPS.COMPLETED },
  { key: 'enlightenment', completed: state => state.events.enlightenment === ENLIGHTENMENT_STEPS.COMPLETED },
  { key: 'forever', completed: state => state.events.forever === FOREVER_STEPS.COMPLETED }
]
