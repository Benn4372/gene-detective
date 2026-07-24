import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { blobSpecies, chapters } from '../../content'
import type { Creature } from '../../engine/types'

// The very first screen the player sees. Not a menu — just a title, a hint
// of atmosphere, and a single "Begin" button. Vanishes once markStationSeen()
// is called and never comes back on this save.
//
// Three landing blobs, each a different personality: a horned striped
// creature with a long tail, a finned no-glow-eyed blotched creature, and a
// sparkling haloed creature. They show off the trait variety the player will
// unlock while breeding through the game.
export function LandingScreen() {
  const markSeen = useGameStore(s => s.markStationSeen)

  const demoBlobs: Creature[] = [
    // "The warrior" — long horns, stripes, long tail
    {
      id: 'landing-warrior',
      speciesId: blobSpecies.id,
      sex: 'M',
      genotype: {
        horns: ['L', 'L'],
        pattern: ['R', 'R'],
        tail: ['T', 'T'],
      },
      age: 1,
      scope: 'trophy',
    },
    // "The angel" — mitochondrial halo, sparkle, antennae
    {
      id: 'landing-angel',
      speciesId: blobSpecies.id,
      sex: 'F',
      genotype: {
        mitoHalo: ['Q'],
        sparkle: ['K', 'K'],
        antennae: ['A', 'A'],
      },
      age: 1,
      scope: 'trophy',
    },
    // "The sea blob" — fins, blotches, glowing eyes
    {
      id: 'landing-sea',
      speciesId: blobSpecies.id,
      sex: 'F',
      genotype: {
        fins: ['F', 'F'],
        pattern: ['B', 'B'],
        eyeGlow: ['G', 'G'],
      },
      age: 1,
      scope: 'trophy',
    },
  ]

  const chapterCount = chapters.length

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

        {/* Three demo blobs — each a distinct personality, showing off
            different traits the player will unlock over the game. Idle
            float with varying delay so they don't move in lockstep. */}
        <div className="flex items-end justify-center gap-8 mb-10">
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
              <BlobRenderer creature={b} species={blobSpecies} size={140} />
            </motion.div>
          ))}
        </div>

        <div className="text-sm text-stone-600 mb-8 leading-relaxed">
          You are an apprentice at the <strong>Blob Research Station</strong>,
          learning from Dr. Mendel and Prof. Weaver. {chapterCount} chapters
          take you from simple dominance through linkage, epistasis,
          modifier genes, mitochondrial inheritance, and more — every idea
          taught by breeding a blob that proves it. Finish the arc to unlock
          endless procedural puzzles in the field.
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
