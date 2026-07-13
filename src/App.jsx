import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ExternalLink, Download, Camera, Gamepad2, BookOpen, Code, Menu, X, Award, Briefcase, Wrench } from 'lucide-react';
import Projects from './components/Projects';
import Research from './components/Research';

// FIXED Typing Animation Hook
const useTypingEffect = (texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
};

// Floating Icon Component with entrance animation
const FloatingIcon = ({ children, delay = 0, duration = 3 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.2, rotate: 15 }}
        className="cursor-pointer"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Parallax Mouse Follow Component
const ParallaxContainer = ({ children, intensity = 20 }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / intensity);
      mouseY.set((clientY - innerHeight / 2) / intensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, intensity]);

  return (
    <motion.div style={{ x, y }}>
      {children}
    </motion.div>
  );
};

// Glassmorphism Card Component
const GlassCard = ({ children, color = '#0a9396', delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`bg-[#001219]/40 backdrop-blur-xl rounded-2xl p-8 border-2 transition-all duration-300 shadow-xl ${className}`}
      style={{ borderColor: `${color}50` }}
    >
      {children}
    </motion.div>
  );
};

// Scene3D component
import Scene3D from './components/Scene3D';

// 2D Animated PC Screen Component
const AnimatedPCScreen = () => {
  const [time, setTime] = useState(new Date());
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const cursorTimer = setInterval(() => setCursorVisible(prev => !prev), 500);
    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const texts = [
    'I am Showrav Karamkar, a Software Engineer who turns coffee and logic into clean, interactive web experiences. I specialize in building robust apps with React and Python, focusing on where high-end performance meets great design. Welcome to my digital workspace—let\'s create something cool.',
    'Git commit -m \'I don\'t know what I\'m doing anymore 🚩\'',
    'Software Engineer & Web Developer',
    'Creating amazing digital experiences',
    '99 little bugs in the code... patch one, 127 bugs in the code',
    'Error 404: Sleep Not Found',
    'sudo rm -rf /problems',
    'while(notSuccess) { try(); }',
    'I turn coffee into code ☕💻',
    'Ctrl+C, Ctrl+V Enthusiast',
    'Eat. Sleep. Code. Debug. Repeat. (Wait, I forgot the sleep part).',
    'I am not arguing, I am just explaining why I am right in Markdown.',
    'Okay byeeeeeeeeeeeee Have fun'
  ];

  const typingText = useTypingEffect(texts, 80, 40, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* PC Monitor Frame */}
      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-3xl shadow-2xl border-4 border-[#2c3e50]">
        {/* Monitor Screen */}
        <div className="bg-black rounded-2xl overflow-hidden border-2 border-[#0d0d0d] shadow-inner">
          {/* Screen Content */}
          <div className="aspect-[16/10] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-8">
            {/* Time Display */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#00ff88] mb-2 font-mono tracking-wider">
                {formatTime(time)}
              </div>
              <div className="text-lg md:text-xl text-[#64b5f6] font-mono">
                {formatDate(time)}
              </div>
            </motion.div>

            {/* Terminal Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-[#2c3e50] mt-8"
            >
              {/* Terminal Header */}
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="flex-1 text-center text-[#b0b0b0] text-sm font-mono">
                  Terminal
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 min-h-[200px]">
                <div className="font-mono text-base md:text-lg text-white">
                  <span className="text-[#00ff88]">$</span> <span className="text-[#64b5f6]">echo</span>{' '}
                  <span className="text-white">
                    "{typingText}"
                    {cursorVisible && <span className="bg-[#00ff88] text-black px-1 ml-1">▋</span>}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* System Info with Animated Graphs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 grid grid-cols-3 gap-4"
            >
              {/* CPU Graph */}
              <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-3 border border-[#0a9396]/30">
                <div className="text-[#0a9396] text-xs font-mono mb-2">CPU</div>
                <div className="flex items-end gap-1 h-12">
                  {[65, 45, 70, 55, 80, 60, 75, 50].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#0a9396] rounded-t"
                      animate={{ 
                        height: [`${height}%`, `${(height + 15) % 100}%`, `${height}%`]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <div className="text-[#00ff00] text-xs font-bold mt-2 text-center">62%</div>
              </div>

              {/* Memory Graph */}
              <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-3 border border-[#ee9b00]/30">
                <div className="text-[#ee9b00] text-xs font-mono mb-2">Memory</div>
                <div className="flex items-end gap-1 h-12">
                  {[55, 60, 50, 65, 58, 70, 62, 68].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#ee9b00] rounded-t"
                      animate={{ 
                        height: [`${height}%`, `${(height + 12) % 100}%`, `${height}%`]
                      }}
                      transition={{ 
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <div className="text-[#00ff00] text-xs font-bold mt-2 text-center">8.2GB</div>
              </div>

              {/* GPU Graph */}
              <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-3 border border-[#94d2bd]/30">
                <div className="text-[#94d2bd] text-xs font-mono mb-2">GPU</div>
                <div className="flex items-end gap-1 h-12">
                  {[40, 55, 45, 60, 50, 65, 55, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#94d2bd] rounded-t"
                      animate={{ 
                        height: [`${height}%`, `${(height + 18) % 100}%`, `${height}%`]
                      }}
                      transition={{ 
                        duration: 2.2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <div className="text-[#00ff00] text-xs font-bold mt-2 text-center">54%</div>
              </div>
            </motion.div>
          </div>
        </div>
                  {/* Windows Taskbar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="absolute bottom-0 left-0 right-0 h-10 bg-[#1e1e1e]/95 backdrop-blur-sm border-t border-[#2c3e50] flex items-center px-2 gap-1"
          >
            {/* Start Button */}
            <div className="w-8 h-8 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-[#0a9396] rounded-sm"></div>
                <div className="bg-[#0a9396] rounded-sm"></div>
                <div className="bg-[#0a9396] rounded-sm"></div>
                <div className="bg-[#0a9396] rounded-sm"></div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs h-7 bg-[#2c3e50]/50 rounded flex items-center px-3 text-[#94d2bd] text-xs">
              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </div>

            {/* Pinned Apps */}
            {/* Pinned Apps with Real Icons */}
            <div className="flex gap-1 ml-2">
              {/* File Explorer - Yellow Folder */}
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer relative group">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                  <path d="M40 12H22L18 8H8C5.8 8 4 9.8 4 12V36C4 38.2 5.8 40 8 40H40C42.2 40 44 38.2 44 36V16C44 13.8 42.2 12 40 12Z" fill="#FFC107"/>
                  <path d="M40 12H22L18 8H8C5.8 8 4 9.8 4 12V14H44V16C44 13.8 42.2 12 40 12Z" fill="#FFECB3"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0a9396] rounded-full"></div>
              </div>

              {/* VS Code - Blue */}
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer relative group">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                  <path d="M35.5 4L16 16L6 10L2 12V36L6 38L16 32L35.5 44L46 40V8L35.5 4Z" fill="#0078D4"/>
                  <path d="M35.5 4L16 16L6 10L2 12V36L6 38L16 32L35.5 44V4Z" fill="#0098D4"/>
                  <path d="M6 38L16 32V16L6 10V38Z" fill="#005BA1"/>
                  <path d="M16 24L35.5 12V36L16 24Z" fill="#0078D4"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0a9396] rounded-full"></div>
              </div>

              {/* WhatsApp - Green */}
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer relative group">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="#25D366"/>
                  <path d="M33.5 14.5C31.5 12.5 28.8 11.3 25.9 11.3C19.8 11.3 14.9 16.2 14.9 22.3C14.9 24.3 15.4 26.2 16.4 27.9L14.8 33.2L20.3 31.6C21.9 32.5 23.7 33 25.5 33H25.9C32 33 36.9 28.1 36.9 22C37 19.1 35.8 16.4 33.5 14.5ZM25.9 31H25.6C24 31 22.4 30.6 21 29.8L20.7 29.6L17.4 30.5L18.3 27.3L18.1 27C17.2 25.5 16.7 23.9 16.7 22.2C16.7 17.2 20.9 13 25.9 13C28.3 13 30.6 13.9 32.3 15.6C34 17.3 34.9 19.6 34.9 22C35 27 30.9 31 25.9 31Z" fill="white"/>
                  <path d="M29.8 24.8C29.5 24.7 28.1 24 27.8 23.9C27.6 23.8 27.4 23.8 27.2 24C27 24.2 26.5 24.9 26.3 25.1C26.2 25.3 26 25.3 25.7 25.2C25.4 25.1 24.5 24.8 23.4 23.8C22.6 23 22 22.1 21.9 21.8C21.8 21.5 21.9 21.4 22 21.3C22.1 21.2 22.3 21 22.4 20.9C22.5 20.8 22.6 20.7 22.6 20.5C22.7 20.4 22.6 20.2 22.6 20.1C22.5 20 22 18.7 21.8 18.1C21.6 17.5 21.4 17.6 21.2 17.5C21.1 17.5 20.9 17.5 20.7 17.5C20.5 17.5 20.2 17.6 20 17.8C19.7 18.1 19 18.8 19 20.1C19 21.4 19.9 22.7 20 22.8C20.1 23 22 25.9 25 27.1C25.7 27.4 26.2 27.6 26.6 27.7C27.3 27.9 28 27.9 28.5 27.8C29.1 27.7 30.2 27.1 30.4 26.5C30.6 25.9 30.6 25.4 30.5 25.3C30.5 25.2 30.3 25.1 29.8 24.8Z" fill="white"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0a9396] rounded-full"></div>
              </div>

              {/* Firefox - Orange/Red */}
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer relative group">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="url(#firefox-gradient)"/>
                  <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4Z" fill="url(#firefox-gradient2)"/>
                  <defs>
                    <linearGradient id="firefox-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF9500"/>
                      <stop offset="1" stopColor="#FF5722"/>
                    </linearGradient>
                    <radialGradient id="firefox-gradient2" cx="24" cy="24" r="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFCA28"/>
                      <stop offset="0.5" stopColor="#FF9800"/>
                      <stop offset="1" stopColor="#FF5722"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="24" cy="26" rx="12" ry="10" fill="#FFA000" opacity="0.8"/>
                  <path d="M28 16C28 16 26 14 24 14C22 14 20 16 20 16C20 16 18 18 18 20C18 22 20 24 20 24C20 24 22 20 24 20C26 20 28 24 28 24C28 24 30 22 30 20C30 18 28 16 28 16Z" fill="#FFE082"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0a9396] rounded-full"></div>
              </div>

              {/* CMD/Terminal - Black with green */}
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer relative group">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                  <rect x="4" y="8" width="40" height="32" rx="2" fill="#0D1117"/>
                  <rect x="4" y="8" width="40" height="6" rx="2" fill="#1F2937"/>
                  <circle cx="9" cy="11" r="1.5" fill="#EF4444"/>
                  <circle cx="14" cy="11" r="1.5" fill="#F59E0B"/>
                  <circle cx="19" cy="11" r="1.5" fill="#10B981"/>
                  <path d="M10 20L14 24L10 28" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="18" y1="28" x2="28" y2="28" stroke="#00FF00" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0a9396] rounded-full"></div>
              </div>

              {/* Notepad - Light blue */}
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#2c3e50] rounded transition-colors cursor-pointer relative group">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                  <rect x="10" y="6" width="28" height="36" rx="2" fill="#E3F2FD"/>
                  <rect x="10" y="6" width="28" height="8" fill="#2196F3"/>
                  <line x1="14" y1="20" x2="34" y2="20" stroke="#90CAF9" strokeWidth="1.5"/>
                  <line x1="14" y1="24" x2="34" y2="24" stroke="#90CAF9" strokeWidth="1.5"/>
                  <line x1="14" y1="28" x2="28" y2="28" stroke="#90CAF9" strokeWidth="1.5"/>
                  <line x1="14" y1="32" x2="32" y2="32" stroke="#90CAF9" strokeWidth="1.5"/>
                  <circle cx="19" cy="10" r="1.5" fill="white"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0a9396] rounded-full"></div>
              </div>
            </div>

            {/* System Tray */}
            <div className="ml-auto flex items-center gap-3 text-white text-xs">
              {/* Network */}
              <div className="flex items-center gap-1 cursor-pointer hover:bg-[#2c3e50] px-2 py-1 rounded">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              
              {/* Volume */}
              <div className="flex items-center gap-1 cursor-pointer hover:bg-[#2c3e50] px-2 py-1 rounded">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Clock */}
              <div className="cursor-pointer hover:bg-[#2c3e50] px-2 py-1 rounded">
                <div className="text-[10px] leading-tight">
                  <div>{formatTime(time).split(' ')[0]}</div>
                  <div className="text-[#94d2bd]">{formatDate(time).split(',')[0].substring(0, 3)}</div>
                </div>
              </div>

              {/* Notifications */}
              <div className="w-6 h-6 flex items-center justify-center hover:bg-[#2c3e50] rounded cursor-pointer">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
          </motion.div>


        {/* Monitor Stand */}
        <div className="flex justify-center mt-2">
          <div className="w-32 h-4 bg-gradient-to-b from-[#2c3e50] to-[#34495e] rounded-t-lg"></div>
        </div>
        <div className="flex justify-center">
          <div className="w-48 h-3 bg-gradient-to-b from-[#34495e] to-[#2c3e50] rounded-full"></div>
        </div>

        {/* Power LED */}
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 right-8 w-3 h-3 rounded-full bg-[#00ff00] shadow-lg"
          style={{ boxShadow: '0 0 10px #00ff00' }}
        />
      </div>

      {/* Desk Items */}
      <div className="mt-8 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        {/* Keyboard */}
        {/* Keyboard with Full Keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="col-span-2 bg-gradient-to-b from-[#34495e] to-[#2c3e50] rounded-xl p-4 shadow-xl"
        >
          {/* Row 1: Function Keys */}
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'].map((key, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded aspect-square shadow-inner flex items-center justify-center text-white text-[6px] font-mono">
                {key}
              </div>
            ))}
          </div>
          
          {/* Row 2: Number Keys */}
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '←'].map((key, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded aspect-square shadow-inner flex items-center justify-center text-white text-[8px] font-bold">
                {key}
              </div>
            ))}
          </div>

          {/* Row 3: QWERTY */}
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '['].map((key, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded aspect-square shadow-inner flex items-center justify-center text-white text-[8px] font-bold">
                {key}
              </div>
            ))}
          </div>

          {/* Row 4: ASDF */}
          <div className="grid grid-cols-12 gap-1 mb-1">
            {['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '⏎'].map((key, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded aspect-square shadow-inner flex items-center justify-center text-white text-[8px] font-bold">
                {key}
              </div>
            ))}
          </div>

          {/* Row 5: ZXCV + Spacebar */}
          <div className="flex gap-1">
            <div className="grid grid-cols-10 gap-1 flex-1">
              {['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'].map((key, i) => (
                <div key={i} className="bg-[#2a2a2a] rounded aspect-square shadow-inner flex items-center justify-center text-white text-[7px] font-bold">
                  {key}
                </div>
              ))}
            </div>
            <div className="w-20 bg-[#2a2a2a] rounded shadow-inner flex items-center justify-center text-white text-[8px] font-bold">
              SPACE
            </div>
          </div>
        </motion.div>

        {/* Mouse */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-b from-[#34495e] to-[#2c3e50] rounded-full aspect-[2/3] shadow-xl relative"
            >
              {/* Left and Right Click Buttons */}
              <div className="absolute top-4 left-0 right-0 flex gap-1 px-3">
                <div className="flex-1 h-16 bg-[#1a1a1a]/50 rounded-tl-full border-r border-[#2c3e50]"></div>
                <div className="flex-1 h-16 bg-[#1a1a1a]/50 rounded-tr-full"></div>
              </div>
              
              {/* Scroll Wheel */}
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full bg-[#ee9b00]"
                style={{ boxShadow: '0 0 10px #ee9b00' }}
              />
            </motion.div>
      </div>
    </motion.div>
  );
};

// Workspace section with 2D PC Screen
const Workspace = () => {
  return (
    <section id="workspace" className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#001219] to-[#005f73] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-2 text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#94d2bd] to-[#ee9b00] bg-clip-text text-transparent"
        >
          My Digital Workspace
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-[#e9d8a6] mb-12 text-lg"
        >
          
        </motion.p>

        {/* Animated PC Screen */}
        <AnimatedPCScreen />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: <Code size={32} />, title: 'Clean Code', description: 'Writing maintainable and efficient code', color: '#0a9396' },
            { icon: <Gamepad2 size={32} />, title: 'Interactive', description: 'Engaging user experiences', color: '#ee9b00' },
            { icon: <BookOpen size={32} />, title: 'Always Learning', description: 'Exploring new technologies', color: '#94d2bd' }
          ].map((item, i) => (
            <GlassCard key={i} color={item.color} delay={0.5 + i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#e9d8a6] mb-2">{item.title}</h3>
                <p className="text-[#94d2bd]">{item.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Floating particles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#0a9396]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </section>
  );
};

// Navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Education', 'Projects', 'Research', 'Skills', 'Workspace', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#001219]/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
      style={{ backdropFilter: scrolled ? 'blur(20px)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.a
          href="#hero"
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#0a9396] shadow-lg overflow-hidden bg-[#001219]">
            <video
              src="/images/Logo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </motion.a>

        <div className="hidden md:flex gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, color: '#ee9b00' }}
              className="text-[#e9d8a6] hover:text-[#ee9b00] transition-colors cursor-pointer"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#e9d8a6] z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 bg-[#001219]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl text-[#e9d8a6] hover:text-[#ee9b00]"
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// FIXED Hero Section - Profile positioned below 3D scene
const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#001219]">
      {/* 3D Scene Container - Top Section */}
      <div className="hidden md:block absolute inset-x-0 top-0 h-[35vh] pointer-events-none z-0">
        <Canvas camera={{ position: [0, 1.2, 6], fov: 50 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene3D
              introText="Hi, I am Showrav Karamkar."
              profileSrc="/images/profile.jpg"
              screenSrc="/images/photography1.jpg"
              use3DCase={true}
              caseImageSrc="/images/photography2.jpg"
              monitorPos={[0, 2.0, -0.65]}
              monitorScale={[1.12, 1.12, 1.12]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Tech Icons */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
        {[
          { name: 'React', color: '#0a9396', position: { top: '10%', left: '13%' } },
          { name: 'Node.js', color: '#94d2bd', position: { top: '10%', right: '13%' } },
          { name: 'Three.js', color: '#ee9b00', position: { top: '60%', left: '10%' } },
          { name: 'Python', color: '#ca6702', position: { top: '60%', right: '10%' } },
          { name: 'C++', color: '#65bea1ff', position: { top: '30%', right: '20%' } },
          { name: 'C#', color: '#80674eff', position: { top: '30%', left: '19%' } },
          { name: 'MDX', color: '#72921aff', position: { top: '16%', left: '36%' } },
          { name: 'SQL', color: '#8a3d5aff', position: { top: '16%', right: '30%' } },

        ].map((tech, i) => (
          <div
            key={tech.name}
            className="absolute"
            style={tech.position}
          >
            <FloatingIcon delay={1 + i * 0.2} duration={3 + i * 0.5}>
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-sm font-bold backdrop-blur-xl border-2 shadow-2xl"
                style={{ 
                  backgroundColor: `${tech.color}20`,
                  borderColor: tech.color,
                  color: tech.color
                }}
              >
                {tech.name}
              </div>
            </FloatingIcon>
          </div>
        ))}
      </div>

      {/* Content Section - Positioned below 3D scene */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start text-center px-6 pt-30 md:pt-[25vh]">
        <ParallaxContainer intensity={30}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.8 
            }}
            className="mb-8"
          >
            <div className="w-60 h-30 sm:w-36 sm:h-46 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[#0a9396] shadow-2xl mx-auto">
              <img
                src="/images/profile.jpg"
                alt="Showrav Karamkar"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#94d2bd] via-[#0a9396] to-[#ee9b00] bg-clip-text text-transparent"
          >
            Showrav Karamkar
          </motion.h1>

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="inline-block px-6 py-3 rounded-2xl bg-[#001219]/60 backdrop-blur-xl border border-[#0a9396]/30 shadow-2xl">
              <p className="text-base sm:text-lg md:text-xl text-[#e9d8a6]">
                Software Engineer & Web Developer
              </p>
            </div>
          </motion.div>

          <motion.div
  initial={{ y: 40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.7 }}
  className="flex flex-wrap gap-6 justify-center"
>
  {['View Work', 'GitHub', 'Contact'].map((text, i) => {
    const getHref = () => {
      if (text === 'GitHub') return 'https://github.com/Showrav88';
      if (text === 'View Work') return '#projects';
      return '#contact';
    };

    return (
      <motion.a
        key={text}
        href={getHref()}
        target={text === 'GitHub' ? '_blank' : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 + i * 0.1 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(10, 147, 150, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 sm:px-8 py-3 ${
            i === 0 ? 'bg-gradient-to-r from-[#0a9396] to-[#005f73]' :
            i === 1 ? 'bg-gradient-to-r from-[#ee9b00] to-[#ca6702]' :
            'border-2 border-[#e9d8a6]'
          } text-white rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base`}
        >
          {i === 1 && <Github size={20} />} {text}
        </motion.button>
      </motion.a>
    );
  })}
</motion.div>
        </ParallaxContainer>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-[#e9d8a6] rounded-full flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-[#e9d8a6] rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// About Section
const About = () => {
  return (
    <section id="about" className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#001219] to-[#005f73]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#94d2bd] to-[#ee9b00] bg-clip-text text-transparent"
        >
          About Me
        </motion.h2>

        <GlassCard color="#0a9396">

                        <p className="text-[#e9d8a6] text-lg leading-relaxed mb-6">
                I'm a passionate software engineer and web developer based in Dhaka, Bangladesh, with a strong foundation in computer science from American International University-Bangladesh. My expertise lies in creating modern, interactive web experiences using cutting-edge technologies.
              </p>

              <p className="text-[#e9d8a6] text-lg leading-relaxed mb-6">
                I specialize in full-stack development with a strong focus on backend engineering, where performance, accessibility, and clean architecture matter. I enjoy turning complex ideas into simple, usable digital products.
              </p>

              <p className="text-[#e9d8a6] text-lg leading-relaxed mb-6">
                My technical skill set includes Dot net MVC, API, PostgreSQL, JavaScript tooling. I have hands-on experience building responsive, scalable applications for real-world use cases.
              </p>

              <p className="text-[#e9d8a6] text-lg leading-relaxed mb-6">
                Alongside development work, I have experience with ERP system workflows and understand idea-level system architecture, which helps me think beyond code and focus on complete solutions.
              </p>


        </GlassCard>
      </div>
    </section>
  );
};

// Education Section

const Education = () => {
  const education = [
    {
      degree: 'Bachelor of Science in Computer Science & Engineering',
      institution: 'American International University-Bangladesh',
      location: 'Dhaka, Bangladesh',
      period: '2020 - 2024',
      grade: 'CGPA: 3.19 out of 4.00',
      color: '#0a9396'
    },
    {
      degree: 'Higher Secondary Certificate',
      institution: 'Milestone College Uttra, Dhaka',
      location: '30 & 44, Milestone College, Gareeb-e-Nawaz Ave, Dhaka',
      period: '2017 - 2019',
      grade: 'GPA: 5.00 out of 5.00',
      color: '#48d6caff'
    },
    {
      degree: 'Secondary School Certificate',
      institution: 'Lakshmipur Adarsha Samad Government High School',
      location: 'Lakshmipur, Bangladesh',
      period: '2015 - 2017',
      grade: 'GPA: 4.05 out of 5.00',
      color: '#94d2bd'
    }
  ];

  return (
    <section id="education" className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#005f73] to-[#001219]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#94d2bd] to-[#ee9b00] bg-clip-text text-transparent"
        >
          Education
        </motion.h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#0a9396] via-[#ee9b00] to-[#94d2bd] hidden md:block" />
          {education.map((edu, index) => (
            <div
              key={index}
              className={`relative mb-12 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}
            >
              <div
                className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full hidden md:block animate-pulse"
                style={{ backgroundColor: edu.color }}
              />

              <GlassCard color={edu.color} delay={index * 0.2}>
                <h3 className="text-2xl font-bold text-[#e9d8a6] mb-2">{edu.degree}</h3>
                <p className="text-xl mb-2" style={{ color: edu.color }}>{edu.institution}</p>
                <p className="text-[#94d2bd] mb-2">{edu.location}</p>
                <p className="text-[#e9d8a6] mb-2">{edu.period}</p>
                <p className="text-lg font-semibold" style={{ color: edu.color }}>{edu.grade}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



// Skills Section
const Skills = () => {
  const programmingLanguages = [
    { name: 'C++', color: '#00599C' },
    { name: 'C#', color: '#239120' },
    { name: 'Java', color: '#007396' }
  ];

  const frameworks = [
    { name: 'React', color: '#61DAFB' }
  ];

  const softwareTools = [
    { name: 'CI/CD', color: '#D83B01' },
    { name: 'VS Code', color: '#007ACC' },
    { name: 'VPS', color: '#217346' },
    { name: 'React', color: '#0a9396' },
    { name: 'Git', color: '#1BA0D7' },
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'Angular', color: '#512BD4' },
    { name: 'Dot net API', color: '#512BD4' },
    { name: 'Playwright', color: '#9999FF' },
    { name: 'TypeScript', color: '#31A8FF' },
    { name: 'JavaScript', color: '#31A8FF' }
  ];

  const operatingSystems = [
    { name: 'Linux', color: '#FCC624' },
    { name: 'Ubuntu', color: '#E95420' },
    { name: 'Windows', color: '#0078D6' }
  ];

  const certificates = [
    {
      title: 'Cisco Certified - Introduction to Programming',
      organization: 'Cisco',
      description: 'Successfully completed certification program focused on foundational concepts of programming languages.',
      year: '2023'
    },
    {
      title: 'SQA: Manual & Automated Testing',
      organization: 'Ostad',
      description: 'Completed basic course covering fundamental concepts of Manual & Automated Testing.',
      year: '2025'
    },
    {
      title: 'SQA: Manual & Automated Testing',
      organization: 'Online Course',
      description: 'Completed basic course covering fundamental concepts of Manual & Automated Testing.',
      year: '2025'
    }
  ];

  const experiences = [
    {
      title: 'Junior Software Engineer',
      company: 'Skiff Technologies',
      location: 'Chattogram, Bangladesh',
      period: ' April 2024– June 2024',
      type: 'Contractual',
      type: 'Software Company'
    },
    {
      title: 'Software Quality Assurance Intern',
      company: 'iLearnX Technologies',
      location: 'Dhaka, Bangladesh',
      period: 'Jan 2024– March 2024'
        },
    {
      title: 'Associate,',
      company: 'Quantanite BD Ltd',
      location: 'Dhaka, Bangladesh',
      period: 'June 2024– Present',
      
    }
  ];

  // Professional fade-in animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <section id="skills" className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#001219] to-[#005f73]">
      <div className="max-w-6xl mx-auto">
        {/* Header with Download CV */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#94d2bd] to-[#ee9b00] bg-clip-text text-transparent"
          >
            Skills & Certificates
          </motion.h2>
          
          <motion.a
            href="/cv.pdf"
            download="Showrav_Karamkar_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-[#ee9b00] to-[#ca6702] text-white rounded-full font-semibold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Download size={20} /> Download CV
          </motion.a>
        </div>

        {/* Programming Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code size={28} className="text-[#ee9b00]" />
            <h3 className="text-2xl md:text-3xl font-bold text-[#e9d8a6]">Programming Languages</h3>
          </div>
          <p className="text-[#94d2bd] mb-6">Skilled in Python, C++, C#, and Java for versatile software solutions.</p>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {programmingLanguages.map((skill, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  boxShadow: `0 10px 25px ${skill.color}40`,
                  transition: { duration: 0.2 }
                }}
                className="bg-[#001219]/80 backdrop-blur-lg rounded-xl p-4 border-2 flex items-center justify-center text-center font-bold transition-colors duration-200"
                style={{ borderColor: skill.color, color: skill.color }}
              >
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Frameworks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-[#e9d8a6] mb-4">Frameworks</h3>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {frameworks.map((skill, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  boxShadow: `0 10px 25px ${skill.color}40`,
                  transition: { duration: 0.2 }
                }}
                className="bg-[#001219]/80 backdrop-blur-lg rounded-xl p-4 border-2 flex items-center justify-center text-center font-bold transition-colors duration-200"
                style={{ borderColor: skill.color, color: skill.color }}
              >
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Software & Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            
            <h3 className="text-2xl md:text-3xl font-bold text-[#e9d8a6]">Software & Tools</h3>
          </div>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {softwareTools.map((skill, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  boxShadow: `0 10px 25px ${skill.color}40`,
                  transition: { duration: 0.2 }
                }}
                className="bg-[#001219]/80 backdrop-blur-lg rounded-xl p-4 border-2 flex items-center justify-center text-center font-semibold transition-colors duration-200"
                style={{ borderColor: skill.color, color: skill.color }}
              >
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Operating Systems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-[#e9d8a6] mb-4">Operating Systems</h3>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {operatingSystems.map((skill, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  boxShadow: `0 10px 25px ${skill.color}40`,
                  transition: { duration: 0.2 }
                }}
                className="bg-[#001219]/80 backdrop-blur-lg rounded-xl p-4 border-2 flex items-center justify-center text-center font-bold transition-colors duration-200"
                style={{ borderColor: skill.color, color: skill.color }}
              >
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            
            <h3 className="text-3xl md:text-4xl font-bold text-[#e9d8a6]">Certificates</h3>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {certificates.map((cert, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -6,
                  boxShadow: '0 12px 30px rgba(238, 155, 0, 0.25)',
                  transition: { duration: 0.3 }
                }}
                className="bg-[#001219]/80 backdrop-blur-lg rounded-xl p-6 border-2 border-[#0a9396] transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Award size={24} className="text-[#ee9b00] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-bold text-[#e9d8a6] mb-1">{cert.title}</h4>
                    <p className="text-[#ee9b00] font-semibold">{cert.organization}</p>
                  </div>
                </div>
                <p className="text-[#94d2bd] text-sm mb-3">{cert.description}</p>
                <p className="text-[#0a9396] font-semibold">{cert.year}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            
            <h3 className="text-3xl md:text-4xl font-bold text-[#e9d8a6]">Work Experience</h3>
          </div>
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  x: 8,
                  boxShadow: '0 8px 25px rgba(10, 147, 150, 0.25)',
                  transition: { duration: 0.3 }
                }}
                className="bg-[#001219]/80 backdrop-blur-lg rounded-xl p-6 border-l-4 border-[#ee9b00] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#e9d8a6] mb-1">{exp.title}</h4>
                    <p className="text-[#0a9396] font-semibold text-lg">{exp.company}</p>
                    <p className="text-[#94d2bd] text-sm">{exp.type}</p>
                  </div>
                  <div className="text-left md:text-right mt-2 md:mt-0">
                    <p className="text-[#ee9b00] font-semibold">{exp.period}</p>
                    <p className="text-[#94d2bd] text-sm">{exp.location}</p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-[#94d2bd] leading-relaxed">{exp.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section with EmailJS
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_zlwqyr8', // Your service ID
          template_id: 'template_s3mxbkt', // Replace with your template ID
          user_id: '5qr_HInl7Xz3WZaAs', // Replace with your public key
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'karmakar.showrav.42927@gmail.com'
          }
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        alert('✅ Message sent successfully! I will get back to you soon.');
      } else {
        setStatus('error');
        alert('❌ Failed to send message. Please try email directly.');
      }
    } catch (error) {
      setStatus('error');
      alert('❌ Failed to send message. Please try email directly.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#005f73] to-[#001219]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#94d2bd] to-[#ee9b00] bg-clip-text text-transparent"
        >
          Get In Touch
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.a
            href="mailto:karmakar.showrav.42927@gmail.com"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(10, 147, 150, 0.5)' }}
            className="bg-[#001219]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#0a9396] flex items-center gap-4 transition-all"
          >
            <Mail size={32} className="text-[#0a9396]" />
            <div>
              <p className="text-[#94d2bd] text-sm">Email</p>
              <p className="text-[#e9d8a6] font-semibold text-sm break-all">karmakar.showrav.42927@gmail.com</p>
            </div>
          </motion.a>

          <motion.a
            href="tel:+8801849951910"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(238, 155, 0, 0.5)' }}
            className="bg-[#001219]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#ee9b00] flex items-center gap-4 transition-all"
          >
            <Phone size={32} className="text-[#ee9b00]" />
            <div>
              <p className="text-[#94d2bd] text-sm">Phone</p>
              <p className="text-[#e9d8a6] font-semibold">+880 1849951910</p>
            </div>
          </motion.a>

          <motion.a
            href="https://github.com/Showrav88"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(148, 210, 189, 0.5)' }}
            className="bg-[#001219]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#94d2bd] flex items-center gap-4 transition-all"
          >
            <Github size={32} className="text-[#94d2bd]" />
            <div>
              <p className="text-[#94d2bd] text-sm">GitHub</p>
              <p className="text-[#e9d8a6] font-semibold">Showrav88</p>
            </div>
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/showrav-karmakar/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(233, 216, 166, 0.5)' }}
            className="bg-[#001219]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#e9d8a6] flex items-center gap-4 transition-all"
          >
            <Linkedin size={32} className="text-[#e9d8a6]" />
            <div>
              <p className="text-[#94d2bd] text-sm">LinkedIn</p>
              <p className="text-[#e9d8a6] font-semibold">Showrav Karmakar</p>
            </div>
          </motion.a>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#001219]/80 backdrop-blur-lg rounded-2xl p-8 border-2 border-[#0a9396]"
        >
          <div className="mb-6">
            <label className="block text-[#e9d8a6] mb-2 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#005f73]/50 border border-[#0a9396] text-[#e9d8a6] focus:outline-none focus:border-[#ee9b00] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#e9d8a6] mb-2 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#005f73]/50 border border-[#0a9396] text-[#e9d8a6] focus:outline-none focus:border-[#ee9b00] transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#e9d8a6] mb-2 font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-[#005f73]/50 border border-[#0a9396] text-[#e9d8a6] focus:outline-none focus:border-[#ee9b00] transition-colors resize-none"
              placeholder="Your message..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(238, 155, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 bg-gradient-to-r from-[#ee9b00] to-[#ca6702] text-white rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

// Footer
// Footer with Social Media Links
const Footer = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/showrav-karmakar/',
      icon: '/images/linkedin.jpg',
      color: '#0a66c2'
    }
  ];

  return (
    <footer className="bg-[#001219] py-12 px-6 border-t border-[#0a9396]/30">
      <div className="max-w-6xl mx-auto">
        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-6 mb-8 flex-wrap"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.2, 
                rotate: 5,
                boxShadow: `0 0 20px ${social.color}80`
              }}
              whileTap={{ scale: 0.9 }}
              className="group relative"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center bg-[#001219]/80 backdrop-blur-lg border-2 transition-all duration-300 overflow-hidden"
                style={{ borderColor: `${social.color}50` }}
              >
                <img 
                  src={social.icon} 
                  alt={social.name}
                  className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#001219] border border-[#0a9396] px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-[#e9d8a6] text-sm font-semibold">{social.name}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#0a9396]/30 to-transparent mb-8"></div>

        {/* Copyright Text */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[#94d2bd] mb-4 text-lg font-semibold"
          >
            © 2025 Showrav Karamkar. All rights reserved.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-[#005f73] text-sm"
          >
          
          </motion.p>
        </div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 bg-gradient-to-r from-[#0a9396] to-[#005f73] text-white rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-[#0a9396]/50 transition-shadow"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
            Back to Top
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
};

// Main App Component
export default function App() {
  return (
    <div className="bg-[#001219] text-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <About />
      <Education />
      <Projects />
      <Research />
      <Skills />
      <Workspace />
      <Contact />
      <Footer />
    </div>
  );
}
