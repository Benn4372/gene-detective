import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'

// The very first screen the player sees. Not a menu — just a title, a hint
// of atmosphere, and a single "Begin" button. Vanishes once markStationSeen()
// is called and never comes back on this save.
export function LandingScreen() {
  const markSeen = useGameStore(s => s.markStationSeen)

  // Three demo blobs with different phenotypes for atmosphere.
  const demoBlobs: Creature[] = [
    {
      id: 'landing-1',
      speciesId: blobSpecies.id,
      sex: 'F',
      genotype: {
        antennae: ['A', 'a'],
        spots: ['S', 's'],
        color: ['R', 'w'],
        pattern: ['B', 'B'],
        horns: ['M', 'n'],
        eyeGlow: ['G', 'g'],
        coatPigment: ['C', 'C'],
        sizeA: ['X', 'x'],
        sizeB: ['Y', 'y'],
        sizeC: ['Z', 'z'],
        fins: ['f', 'f'],
        heatSpot: ['h', 'h'],
        sparkle: ['k', 'k'],
        lethalCoat: ['y', 'y'],
        mitoHalo: ['q'],
      },
      age: 1,
      scope: 'trophy',
    },
    {
      id: 'landing-2',
      speciesId: blobSpecies.id,
      sex: 'M',
      genotype: {
        antennae: ['A', 'A'],
        spots: ['S', 'S'],
        color: ['R', 'R'],
        pattern: ['T', 'T'],
        horns: ['L', 'L'],
        eyeGlow: ['G'],
        coatPigment: ['C', 'C'],
        sizeA: ['X', 'X'],
        sizeB: ['Y', 'Y'],
        sizeC: ['Z', 'Z'],
        fins: ['F', 'f'],
        heatSpot: ['h', 'h'],
        sparkle: ['k', 'k'],
        lethalCoat: ['y', 'y'],
        mitoHalo: ['q'],
      },
      age: 1,
      scope: 'trophy',
    },
    {
      id: 'landing-3',
      speciesId: blobSpecies.id,
      sex: 'F',
      genotype: {
        antennae: ['a', 'a'],
        spots: ['s', 's'],
        color: ['w', 'w'],
        pattern: ['B', 'B'],
        horns: ['n', 'n'],
        eyeGlow: ['g', 'g'],
        coatPigment: ['C', 'C'],
        sizeA: ['x', 'x'],
        sizeB: ['y', 'y'],
        sizeC: ['z', 'z'],
        fins: ['f', 'f'],
        heatSpot: ['h', 'h'],
        sparkle: ['k', 'k'],
        lethalCoat: ['y', 'y'],
        mitoHalo: ['q'],
      },
      age: 1,
      scope: 'trophy',
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[color:var(--paper)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center"
      >
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          A game about genes, blobs, and quiet mysteries
        </div>
        <h1 className="text-6xl font-serif font-bold text-stone-800 mb-3">
          Gene Detective
        </h1>
        <div className="text-lg italic text-stone-600 mb-8">
          Something is wrong with the wild blob population.
          <br />
          You'll help figure out what.
        </div>

        {/* Trio of demo blobs, gently bobbing */}
        <div className="flex items-center justify-center gap-8 mb-10">
          {demoBlobs.map((b, i) => (
            <motion.div
              key={b.id}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
            >
              <BlobRenderer creature={b} species={blobSpecies} size={100} />
            </motion.div>
          ))}
        </div>

        <div className="text-sm text-stone-600 mb-8 leading-relaxed">
          You are an apprentice at the <strong>Blob Research Station</strong>,
          learning from Dr. Mendel and — later — a growing bench of mentors.
          Fifty-four chapters. Every major concept in genetics, taught by
          doing.
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={markSeen}
          className="px-8 py-4 rounded-lg bg-amber-500 text-white text-lg font-medium hover:bg-amber-600 shadow-md"
        >
          Begin →
        </motion.button>

        <div className="text-xs text-stone-500 italic mt-6">
          Your save lives in this browser. Export it from Settings once you're
          in.
        </div>
      </motion.div>
    </div>
  )
}
