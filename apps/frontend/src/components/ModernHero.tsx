import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ModernHeroProps {
  title: string
  subtitle?: string
  description?: string
  gradient?: string
  children?: ReactNode
  image?: string
  pattern?: 'dots' | 'grid' | 'waves' | 'none'
}

export default function ModernHero({
  title,
  subtitle,
  description,
  gradient = 'from-blue-600 via-blue-700 to-indigo-800',
  children,
  image,
  pattern = 'dots'
}: ModernHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const getPatternSVG = () => {
    switch (pattern) {
      case 'dots':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        )
      case 'grid':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )
      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <motion.path
                fill="white"
                fillOpacity="0.3"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                animate={{
                  d: [
                    "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,128L48,133.3C96,139,192,149,288,154.7C384,160,480,160,576,138.7C672,117,768,75,864,74.7C960,75,1056,117,1152,138.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 10,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-600/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Pattern overlay */}
      {getPatternSVG()}

      {/* Background image if provided */}
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30" />
        </div>
      )}

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1, duration: 5, repeat: Infinity }}
          className="absolute top-40 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2, duration: 6, repeat: Infinity }}
          className="absolute bottom-20 left-1/3 w-36 h-36 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32"
      >
        <div className="max-w-4xl">
          {subtitle && (
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 shadow-lg">
                {subtitle}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl"
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="white"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  )
}
