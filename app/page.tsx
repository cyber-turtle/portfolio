'use client';

import { useState, useEffect, useRef } from 'react';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';

export default function Home() {
  const [isHyperdrive, setIsHyperdrive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize audio on mount
    const audioPath = '/soundrack.mp3';
    const audio = new Audio(audioPath);
    // checking file list again... Step 237 says "soundrack.mp3"
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (isLoaded && audioRef.current) {
      // Play immediately when loaded signal is received
      const playAudio = async () => {
          try {
              if (!audioRef.current?.paused) return; 
              await audioRef.current?.play();
          } catch (e) {
              console.log("Audio auto-play failed (should not happen with button click):", e);
          }
      };
      playAudio();
    }
  }, [isLoaded]);

  const toggleMute = () => {
    if (audioRef.current) {
        const newMutedState = !isMuted;
        audioRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
        
        // Also try to play if it was blocked initially
        if (!newMutedState && audioRef.current.paused && isLoaded) {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    }
  };

  const toggleHyperdrive = () => {
    const newState = !isHyperdrive;
    setIsHyperdrive(newState);
    
    // Dispatch event for ThreeBackground to pick up
    const event = new CustomEvent('toggle-hyperdrive', { detail: { active: newState } });
    window.dispatchEvent(event);
  };

  const handleModalScroll = () => {
    if (modalScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = modalScrollRef.current;
        const totalScrollable = scrollHeight - clientHeight;
        
        if (totalScrollable > 0) {
            const progress = (scrollTop / totalScrollable) * 100;
            setScrollProgress(progress);
            
            // Calculate thumb height proportionally
            const height = (clientHeight / scrollHeight) * 100;
            setThumbHeight(height);
        } else {
            setScrollProgress(0);
            setThumbHeight(0);
        }
    }
  };

  useEffect(() => {
    if (selectedProject) {
        // Initial calculation after modal opens and content renders
        setTimeout(handleModalScroll, 100);
    }
  }, [selectedProject]);

  return (
    <div className={`min-h-screen relative ${isHyperdrive ? 'animate-shake' : ''}`}>
      <Loader onLoadingComplete={() => setIsLoaded(true)} />
      
      {/* Dynamic shake animation style */}
      <style jsx global>{`
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
        }
      `}</style>
      
      <ThreeBackground />
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-exclusion text-white">
          <div className="flex items-center gap-4">
            <a href="#hero" className="text-xl font-bold tracking-tighter uppercase font-syne cursor-pointer">AD.</a>
            
            {/* Mute Button */}
            <button 
                onClick={toggleMute} 
                className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 hover:bg-white/10 transition-colors z-50 relative pointer-events-auto"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
            </button>
          </div>

          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
              <a href="#about" className="hover:text-[#ccff00] transition-colors">About</a>
              <a href="#work" className="hover:text-[#ccff00] transition-colors">Work</a>
              <a href="#contact" className="hover:text-[#ccff00] transition-colors">Contact</a>
          </div>
          <a href="#contact" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm uppercase hover:bg-[#ccff00] hover:scale-105 transition-all">Let's Talk</a>
      </nav>

      <main className="text-white relative z-10">

          {/* SECTION 1: HERO */}
          <section className="min-h-screen flex flex-col justify-center items-center px-4 md:px-10 relative overflow-hidden" id="hero">
              <div className="relative z-10 text-center w-full blend-exclusion">
                  <p className="text-[0.5rem] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.5em] mb-4 whitespace-nowrap">Design • Development • Direction</p>
                  <h1 className="hero-text leading-none">
                      <div>Andrew</div>
                      <div className="italic text-[#ccff00]">Dosumu</div>
                  </h1>
                  
                  <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
                      <div className="glass-card px-8 py-4 rounded-full">
                          <span className="block text-xs uppercase tracking-wider opacity-70">Role</span>
                          <span className="text-lg font-bold">Software Engineer</span>
                      </div>
                      <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                      <div className="glass-card px-8 py-4 rounded-full">
                          <span className="block text-xs uppercase tracking-wider opacity-70">Based In</span>
                          <span className="text-lg font-bold">Lagos, NG</span>
                      </div>
                  </div>
              </div>

              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              </div>
          </section>

          {/* SECTION 2: THE NARRATIVE (ABOUT) */}
          <section className="py-32 px-4 md:px-10 relative" id="about">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  <div className="md:col-span-7 z-10">
                      <h2 className="section-title blend-exclusion">The<br />Narrative</h2>
                      <p className="text-xl md:text-3xl leading-relaxed font-light mb-8">
                          Hey, I'm <span className="text-[#ccff00] font-syne italic">Andrew Dosumu</span>, a fullstack software engineer with over 3 years of experience.
                      </p>
                      <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl">
                          I craft scalable systems and sleek interfaces that occasionally work on the first try. I'm a first class computer science graduate fluent in a bunch of technologies and I really love building things that don't break (most of the time). I believe great software isn't just written, it's crafted. Every line of code carries a bit of thought, frustration and intention—built with <span className="text-white font-bold">Next.js, TypeScript, Tailwind CSS, Three.js (WebGL/GLSL), GSAP</span> and cups of coffee.
                      </p>
                      <div className="flex gap-4">
                          <div className="glass-card px-6 py-3 rounded-lg">
                              <span className="block text-2xl font-bold font-syne">3+</span>
                              <span className="text-xs uppercase tracking-wider opacity-60">Years Exp.</span>
                          </div>
                          <div className="glass-card px-6 py-3 rounded-lg">
                              <span className="block text-2xl font-bold font-syne">20+</span>
                              <span className="text-xs uppercase tracking-wider opacity-60">Projects</span>
                          </div>
                          <div className="glass-card px-6 py-3 rounded-lg">
                              <span className="block text-2xl font-bold font-syne">100%</span>
                              <span className="text-xs uppercase tracking-wider opacity-60">Success</span>
                          </div>
                      </div>
                  </div>
                  <div className="md:col-span-5 relative">
                       {/* Abstract Shape Representation of "Self" */}
                      <div className="w-full aspect-square wavy-border bg-gradient-to-tr from-[#ccff00] to-transparent opacity-20 animate-[float_6s_ease-in-out_infinite] border border-white/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden wavy-border group">
                          {/* Profile Image (Replaces 'AD') */}
                          <img 
                            src={`/profile-me.jpg`} 
                            alt="Andrew Dosumu" 
                            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                          />
                      </div>
                  </div>
              </div>
          </section>

          {/* SECTION 3: TECH ARSENAL (SKILLS) */}
          <section className="py-32 bg-[#ccff00] text-black relative overflow-hidden" id="skills">
              {/* Decorative Background Element */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <svg width="100%" height="100%">
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/>
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
              </div>

              <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
                  <h2 className="text-[clamp(3rem,6vw,6rem)] font-syne font-black leading-none mb-12 uppercase">
                      Tech<br />Arsenal
                  </h2>
                  
                  <div className="flex flex-wrap gap-4 md:gap-6">
                      {['Three.js', 'React', 'React Native', 'TypeScript', 'Next.js', 'Node.js', 'WebGL', 'GLSL Shaders', 'GSAP', 'Tailwind CSS', 'Python', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', '.NET', 'C', 'C#', 'C++', 'Java', 'SwiftUI', 'OpenCV', 'Microsoft Kinect SDK', 'Figma', 'Godot', 'Git / Version Control', 'Postman', 'Docker', 'Vercel', 'Railway', 'LangChain', 'Ollama', 'ChromaDB', 'PyTorch', 'PostgreSQL', 'SQLite', 'MySQL', 'MongoDB', 'Express.js', 'Socket.io', 'WebRTC', 'Zustand', 'E2E Encryption'].map((skill, i) => (
                           <span key={skill} className="skill-tag text-2xl md:text-4xl font-bold border-2 border-black px-6 py-3 rounded-full hover:bg-black hover:text-[#ccff00] transition-all cursor-none" style={{
                              animation: `float ${0.2 * i + 3}s ease-in-out infinite`
                           }}>
                               {skill}
                           </span>
                      ))}
                  </div>
              </div>
          </section>

          {/* SECTION 4: PROJECTS SHOWCASE (WORK) */}
          <section className="py-32 px-4 md:px-10" id="work">
              <div className="max-w-7xl mx-auto">
                  <div className="flex items-end justify-between mb-16 border-b border-white/20 pb-8">
                      <h2 className="section-title blend-exclusion">Selected<br />Artifacts</h2>
                      <span className="hidden md:block text-right text-xs uppercase tracking-widest opacity-60">2023 — {new Date().getFullYear()}<br />Case Studies</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                      {[
                        {
                          id: '01',
                          title: "Cortex AI",
                          subtitle: "Intelligent Trading System • Quant AI",
                          image: `/cortex.png`,
                          color: "from-purple-900 to-blue-900",
                          description: "An institutional-grade algorithmic trading platform that fuses Machine Learning (SVC Ensemble), RAG-powered AI reasoning (Llama 3.1), and professional risk management into a unified quantitative trading infrastructure.",
                          technologies: ["Python", "Flask", "Ollama", "ChromaDB", "Scikit-learn", "MetaTrader 5", "Binance API"],
                          challenges: "Implementing an 8-layer trade validation pipeline and optimizing LLM inference latency for sub-second signal filtering across multiple venues.",
                          githubUrl: "https://github.com/cyber-turtle/AI-based-quant"
                        },
                        {
                          id: '02',
                          title: "The Creation of Adam",
                          subtitle: "Narrative • Interactive 3D Experience",
                          image: `/DawnOfMan.png`,
                          color: "from-orange-900 to-red-900",
                          offset: true,
                          description: "An immersive 3D digital reconstruction of Michelangelo's Sistine Chapel masterpiece deconstructed through scroll-driven animations and procedural rendering.",
                          technologies: ["Next.js 15", "Three.js", "GSAP", "TypeScript", "Tailwind CSS"],
                          challenges: "Coordinating complex 3D camera paths with multi-layered narrative triggers while maintaining 60 FPS performance across devices.",
                          demoUrl: "https://cyber-turtle.github.io/Dawn-Of-Man/",
                          githubUrl: "https://github.com/cyber-turtle/Dawn-Of-Man"
                        },
                        {
                          id: '03',
                          title: "Klaus",
                          subtitle: "AI Assistant • Agentic Coding",
                          image: `/klaus.png`,
                          color: "from-blue-900 to-cyan-900",
                          description: "A professional-grade AI coding assistant for VS Code featuring an autonomous 'Composer' mode, sequential thinking for complex problem solving, and a 70% success rate on SWE-bench.",
                          technologies: ["TypeScript", "Node.js", "LangChain", "React", "LanceDB", "Ollama"],
                          challenges: "Optimizing memory efficiency for 16GB RAM devices by implementing lazy-loading for AI providers, preventing LangChain module bloat from causing Out-Of-Memory (OOM) crashes.",
                          githubUrl: "https://github.com/cyber-turtle/Klaus-AI-VsCode-Extension"
                        },
                        {
                          id: '04',
                          title: "MSG",
                          subtitle: "Secure Messaging • E2E Encryption",
                          image: `/msg.png`,
                          color: "from-green-900 to-emerald-900",
                          offset: true,
                          description: "A production-ready real-time messaging platform inspired by Telegram and WhatsApp, featuring military-grade client-side encryption for total privacy.",
                          technologies: ["MERN Stack", "Socket.io", "Web Crypto API", "WebRTC", "RSA-OAEP", "AES-GCM"],
                          challenges: "Implementing a zero-trust E2E architecture where private keys never leave the client, and conducting intensive security audits to eliminate key exchange vulnerabilities.",
                          githubUrl: "https://github.com/cyber-turtle/msg-realtime-E2E-encryption-messaging-app"
                        },
                        {
                          id: '05',
                          title: "Smart Attendance System",
                          subtitle: "AI Biometrics • Computer Vision",
                          image: `/Smart Attendance Sysem.png`,
                          color: "from-indigo-900 to-violet-900",
                          description: "My Final Year Project: An advanced attendance tracking solution utilizing Microsoft Kinect V2 sensors for multi-modal biometric validation, integrating depth and IR streams for high-precision face recognition and anti-spoofing.",
                          technologies: ["Python", "OpenCV", "Kinect SDK", "Face Recognition", "Flask"],
                          challenges: "Optimizing the real-time processing pipeline to synchronize RGB, Depth, and IR data streams while maintaining low latency and high accuracy in crowded environments.",
                          githubUrl: "https://github.com/cyber-turtle/KinectV2-AttendanceSystem",
                          docUrl: "https://drive.google.com/file/d/1yfHthB2YHWwLpPP3T6ql9SNPBsz16E87/view"
                        },
                        {
                          id: '06',
                          title: "Mobile Terminal Portfolio",
                          subtitle: "Terminal UI • Retro Experience",
                          image: `/terminalportfolio.png`,
                          color: "from-slate-900 to-zinc-900",
                          offset: true,
                          description: "A unique terminal-based mobile portfolio experience that brings retro command-line power and interactive games to modern touchscreens.",
                          technologies: ["Next.js 14", "OGL", "Tailwind CSS", "Framer Motion", "Lucide"],
                          challenges: "Engineering responsive layouts for terminal-embedded games, implementing intuitive touch-to-key control mapping, and optimizing ASCII/WebGL hybrid loading screens for older devices.",
                          demoUrl: "https://cyber-turtle.github.io/my-portfolio-terminal/",
                          githubUrl: "https://github.com/cyber-turtle/my-portfolio-terminal"
                        },
                        {
                          id: '07',
                          title: "Terra",
                          subtitle: "Environmental • 3D Visualization",
                          image: `/terra.png`,
                          color: "from-blue-900 to-indigo-900",
                          description: "An immersive 3D visualization experience showcasing Earth's fragility through scroll-driven storytelling, featuring real-time ISS orbital tracking and NASA-sourced imagery.",
                          technologies: ["React 19", "Three.js", "GSAP", "Tailwind CSS 4", "Vite", "Sharp"],
                          challenges: "Sourcing and optimizing high-resolution NASA textures for a smooth 60 FPS 3D experience, and synchronizing complex orbital physics with scroll-triggered animations.",
                          demoUrl: "https://cyber-turtle.github.io/Terra-TheBlueDot/",
                          githubUrl: "https://github.com/cyber-turtle/Terra-TheBlueDot"
                        }
                      ].map((project, i) => (
                        <div key={project.title} className={`group cursor-none ${project.offset ? 'md:mt-24' : ''}`}>
                            <div 
                              onClick={() => setSelectedProject(project)}
                              className="relative aspect-[4/3] rounded-lg mb-6 glass-card border-none cursor-pointer image-pan-container"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 group-hover:opacity-20 transition-opacity z-10`}></div>
                                <img 
                                  src={project.image} 
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <span className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-sm shadow-xl">View Case</span>
                                </div>
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-xs">{project.id}</div>
                                </div>
                                <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors z-30 rounded-lg pointer-events-none"></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-syne font-bold group-hover:text-[#ccff00] transition-colors">{project.title}</h3>
                            <p className="mt-2 text-white/60 uppercase tracking-wider text-sm">{project.subtitle}</p>
                        </div>
                      ))}
                  </div>
              </div>
          </section>

          {/* Project Modal */}
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
              <div 
                ref={modalScrollRef}
                onScroll={handleModalScroll}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card glass-card-modal rounded-3xl p-6 md:p-12 border border-white/10"
              >
                {/* Custom Scrollbar */}
                {thumbHeight > 0 && thumbHeight < 100 && (
                  <div className="custom-scrollbar-track hidden md:block">
                    <div 
                        className="custom-scrollbar-thumb"
                        style={{ 
                            height: `${thumbHeight}%`,
                            top: `${(scrollProgress * (100 - thumbHeight)) / 100}%`
                        }}
                    />
                  </div>
                )}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110]"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 modal-section-gap">
                  <div>
                    <div className="aspect-[4/3] modal-image-container image-pan-container rounded-2xl overflow-hidden relative mb-8">
                       <div className={`absolute inset-0 bg-gradient-to-br ${selectedProject.color} opacity-60`}></div>
                       <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover relative z-10" />
                    </div>
                    
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {selectedProject.demoUrl && (
                        <a 
                          href={selectedProject.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-white text-black py-3 md:py-4 rounded-xl font-bold uppercase text-xs md:text-sm hover:bg-[#ccff00] transition-colors text-center modal-action-btn"
                        >
                          View Demo
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a 
                          href={selectedProject.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 border border-white/20 py-3 md:py-4 rounded-xl font-bold uppercase text-xs md:text-sm hover:bg-white/10 transition-colors text-center modal-action-btn"
                        >
                          GitHub
                        </a>
                      )}
                      {selectedProject.docUrl && (
                        <a 
                          href={selectedProject.docUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full border border-white/20 py-3 md:py-4 rounded-xl font-bold uppercase text-xs md:text-sm hover:bg-white/10 transition-colors text-center modal-action-btn"
                        >
                          Documentation (PDF)
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col h-full">
                    <span className="text-[#ccff00] uppercase tracking-[0.3em] text-[8px] md:text-xs mb-1 md:mb-2 font-bold">{selectedProject.subtitle}</span>
                    <h2 className="text-3xl md:text-6xl modal-title font-syne font-black mb-4 md:mb-8 leading-tight uppercase break-words">{selectedProject.title}</h2>
                    
                    <div className="space-y-4 md:space-y-8 flex-1">
                      <div>
                        <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-[#ccff00] mb-1 md:mb-3 opacity-80">Overview</h4>
                        <p className="text-sm md:text-lg modal-overview text-white/80 leading-relaxed line-clamp-4 md:line-clamp-none">{selectedProject.description}</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-[#ccff00] mb-1 md:mb-3 opacity-80">Technologies</h4>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {selectedProject.technologies.map((tech: string) => (
                            <span key={tech} className="px-2 md:px-3 py-0.5 md:py-1 border border-white/20 rounded-full text-[70%] md:text-xs font-mono modal-tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>

                      <div className="pb-4">
                        <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-[#ccff00] mb-1 md:mb-3 opacity-80">Challenges & Issues</h4>
                        <p className="text-[90%] md:text-sm modal-challenges text-white/60 leading-relaxed italic border-l-2 border-[#ccff00]/30 pl-3 md:pl-4 line-clamp-3 md:line-clamp-none">
                          {selectedProject.challenges}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: PROCESS */}
          <section className="py-32 px-4 md:px-10 bg-white/5" id="process">
              <div className="max-w-7xl mx-auto">
                  <h2 className="section-title mb-16 text-center">The Algorithm</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Step 1 */}
                      <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 text-6xl font-syne font-bold text-white/5 group-hover:text-white/20 transition-colors">01</div>
                          <h4 className="text-xl font-bold mb-4 text-[#ccff00]">Discovery</h4>
                          <p className="text-sm text-white/70 leading-relaxed">Deep dive into brand DNA. We deconstruct the problem to find the core narrative thread.</p>
                          <div className="w-full h-1 bg-white/10 mt-6 overflow-hidden rounded-full">
                              <div className="h-full bg-[#ccff00] w-1/4"></div>
                          </div>
                      </div>

                      {/* Step 2 */}
                      <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 text-6xl font-syne font-bold text-white/5 group-hover:text-white/20 transition-colors">02</div>
                          <h4 className="text-xl font-bold mb-4 text-[#ccff00]">Design</h4>
                          <p className="text-sm text-white/70 leading-relaxed">High-fidelity exploration. We create maximalist visual systems that scale.</p>
                          <div className="w-full h-1 bg-white/10 mt-6 overflow-hidden rounded-full">
                              <div className="h-full bg-[#ccff00] w-2/4"></div>
                          </div>
                      </div>

                      {/* Step 3 */}
                      <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 text-6xl font-syne font-bold text-white/5 group-hover:text-white/20 transition-colors">03</div>
                          <h4 className="text-xl font-bold mb-4 text-[#ccff00]">Develop</h4>
                          <p className="text-sm text-white/70 leading-relaxed">Clean code. Shader magic. Performance optimization. Bringing the vision to life.</p>
                          <div className="w-full h-1 bg-white/10 mt-6 overflow-hidden rounded-full">
                              <div className="h-full bg-[#ccff00] w-3/4"></div>
                          </div>
                      </div>

                      {/* Step 4 */}
                      <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 text-6xl font-syne font-bold text-white/5 group-hover:text-white/20 transition-colors">04</div>
                          <h4 className="text-xl font-bold mb-4 text-[#ccff00]">Deploy</h4>
                          <p className="text-sm text-white/70 leading-relaxed">Rigorous testing. Smooth launch. Handover with documentation.</p>
                          <div className="w-full h-1 bg-white/10 mt-6 overflow-hidden rounded-full">
                              <div className="h-full bg-[#ccff00] w-full"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>


          {/* SECTION: BOLD STATEMENT BANNER */}
          <section className="py-20 border-y border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
            <div className="marquee-container">
              <div className="marquee-content gap-8 px-4">
                 {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-[10vw] font-black font-syne leading-none text-[#ccff00] whitespace-nowrap uppercase italic">
                        If you can think it, I can build it &nbsp; • &nbsp;
                    </span>
                 ))}
              </div>
              <div className="marquee-content gap-8 px-4" aria-hidden="true">
                 {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-[10vw] font-black font-syne leading-none text-[#ccff00] whitespace-nowrap uppercase italic">
                        If you can think it, I can build it &nbsp; • &nbsp;
                    </span>
                 ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: CONTACT */}
          <section className="py-32 px-4 md:px-10 min-h-[80vh] flex flex-col justify-center relative" id="contact">
              <div className="max-w-4xl mx-auto w-full text-center z-10 blend-exclusion">
                  <p className="text-[#ccff00] uppercase tracking-widest mb-4">Ready to start?</p>
                  <h2 className="text-[clamp(3rem,8vw,8rem)] font-syne font-bold leading-[0.9] mb-12 hover:italic transition-all duration-500 cursor-pointer">
                      Signal<br />Me.
                  </h2>
                  
                  <a href="mailto:dev@andrewdosumu.com" className="inline-block glass-card px-12 py-6 rounded-full text-xl md:text-2xl font-bold hover:!bg-[#ccff00] hover:!text-black transition-all transform hover:scale-105">
                      dev@andrewdosumu.com
                  </a>

                  <div className="flex justify-center gap-8 mt-16 text-sm uppercase tracking-widest flex-wrap">
                      <a href="https://www.linkedin.com/in/andrew-dosumu-491094255" target="_blank" rel="noopener noreferrer" className="hover:text-[#ccff00] border-b border-transparent hover:border-[#ccff00] transition-all">LinkedIn</a>
                      <a href="https://x.com/maepl_ai?s=21" target="_blank" rel="noopener noreferrer" className="hover:text-[#ccff00] border-b border-transparent hover:border-[#ccff00] transition-all">Twitter</a>
                      <a href="https://www.instagram.com/prakticool/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ccff00] border-b border-transparent hover:border-[#ccff00] transition-all">Instagram</a>
                      <a href="https://github.com/cyber-turtle" target="_blank" rel="noopener noreferrer" className="hover:text-[#ccff00] border-b border-transparent hover:border-[#ccff00] transition-all">GitHub</a>
                  </div>
              </div>
          </section>

          {/* FOOTER & EASTER EGG */}
          <footer className="py-10 px-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 uppercase tracking-widest">
              <div>© 2025 Andrew Dosumu. All Rights Reserved.</div>
              
              {/* Easter Egg Trigger */}
              <button 
                id="easter-egg-btn" 
                onClick={toggleHyperdrive}
                className={`mt-4 md:mt-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors ${
                  isHyperdrive ? 'bg-[#ccff00] text-black border-transparent' : 'bg-transparent text-inherit'
                }`} 
                title="Activate Hyperdrive"
              >
                  {isHyperdrive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  )}
              </button>
              
              <div>Lagos — New York</div>
          </footer>

      </main>
    </div>
  );
}
