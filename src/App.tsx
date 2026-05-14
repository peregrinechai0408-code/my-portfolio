import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Download, ArrowRight, Home, Menu, X, Check, Copy, Sparkles, AlertCircle, Search, Gamepad2, Database, Palette, ChevronDown, ChevronRight, Hash, FileText } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Tooltip
} from 'recharts';

const ProjectDetail = ({ project, setLightboxImage }: { project: any, setLightboxImage: (img: string) => void }) => {
  if (!project) return null;
  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] pb-4 border-b-2 border-gray-100">
          {project.title}
        </h2>
      </header>

      {project.note && (
        <div className="mb-12 bg-[#ebf5fb] border border-[#d1e9f7] rounded-xl p-6 flex gap-6 items-start">
          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
            <img 
              src="https://www.notion.com/_next/image?url=%2Ffront-static%2Fshared%2Fcallouts%2Ftip-illustration-v4.png&w=96&q=75" 
              alt="Note icon" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="text-[#37352f] text-[16px] leading-[1.6]">
            {project.note}
          </div>
        </div>
      )}

      <div className="space-y-12">
        {project.overview && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <h3 className="text-xl font-bold">Overview</h3>
              <p className="text-[#37352f] text-[16px] leading-[1.6]">
                {project.overview}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-[11px] uppercase font-bold text-gray-500 tracking-widest mb-1">Team Size</p>
                  <p className="text-[15px] font-medium text-[#37352f]">{project.teamSize}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-[11px] uppercase font-bold text-gray-500 tracking-widest mb-1">Time Frame</p>
                  <p className="text-[15px] font-medium text-[#37352f]">{project.timeFrame}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-[11px] uppercase font-bold text-gray-500 tracking-widest mb-1">Engine/Tools</p>
                  <p className="text-[15px] font-medium text-[#37352f]">{project.engine}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {project.images && project.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((img: string, idx: number) => (
                <div 
                  key={idx}
                  className="aspect-square bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center overflow-hidden relative cursor-zoom-in group"
                  onClick={() => setLightboxImage(img)}
                >
                  <img 
                    src={img} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                    alt={`${project.title} Screenshot ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : project.image ? (
            <div 
              className="aspect-video bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center overflow-hidden relative cursor-zoom-in group"
              onClick={() => setLightboxImage(project.image)}
            >
              <img 
                src={project.image} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                alt={`${project.title} Screenshot`}
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center relative text-gray-400">
               <FileText size={24} className="mb-4 opacity-50" />
               <p className="text-sm font-bold tracking-tight">Content coming soon</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">What I Learnt</h3>
          <p className="text-[#37352f] text-[16px] leading-[1.6]">
            {project.learnt}
          </p>
        </div>
      </div>
    </>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'education' | 'traits' | 'work'>('home');
  const [showMobileAlert, setShowMobileAlert] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    // Check if the user is on a mobile device and if they haven't dismissed the alert yet this session
    const isMobile = window.innerWidth < 768;
    const hasSeenAlert = sessionStorage.getItem('hasSeenMobileAlert');
    
    if (isMobile && !hasSeenAlert) {
      setShowMobileAlert(true);
    }
  }, []);

  const dismissMobileAlert = () => {
    setShowMobileAlert(false);
    sessionStorage.setItem('hasSeenMobileAlert', 'true');
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('asteroid');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileWorkView, setMobileWorkView] = useState<'list' | 'detail'>('list');
  const [isMobileWorkNavOpen, setIsMobileWorkNavOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Management Systems', 'Games', 'Artistic Creations']);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const trackRef = useRef<HTMLDivElement>(null);

  const projects = useMemo(() => ([
    {
      id: 'vams',
      title: 'Vegetable Assembler Management System (VAMS)',
      type: 'Management Systems',
      overview: 'A digital platform designed to modernize vegetable produce management in Cameron Highlands. The system replaces manual record-keeping with automated workflows, featuring modular functions for inventory tracking, profit/loss calculations, and monthly financial reporting to enhance operational productivity.',
      teamSize: '1 + 1 (Supervisor)',
      timeFrame: '14 weeks',
      engine: 'Visual Studio (C++), phpMyAdmin',
      learnt: 'Honed time management skills through a rigorous 14-week development cycle. Significantly strengthened C++ proficiency by implementing complex logic for CRUD operations. Gained hands-on experience in database architecture by bridging a C++ application with MySQL to ensure secure data persistence.',
      image: '/vams.png',
      note: 'This project is my Workshop 1 work, supervised by Ts. Dr. Ibrahim bin Ahmad and evaluated by Assoc. Prof. Ts. Dr. Muhammad Haziq Lim Abdullah.'
    },
    {
      id: 'owl',
      title: 'Owl',
      type: 'Artistic Creations',
      overview: 'A stylized 3D model of an owl, created as part of my journey into the world of 3D artistry. This project marks one of my early forays into using Blender to bring imaginative characters to life.',
      teamSize: '1',
      timeFrame: '7 hours',
      engine: 'Blender',
      learnt: 'Focused on understanding the fundamentals of applying materials and working with colors in Blender. I explored different shader properties to achieve the desired tactile feel for the character, learning how lighting interacts with surfaces to create a sense of depth and personality.',
      images: ['/owl1.png', '/owl2.png']
    },
    {
      id: 'hammer',
      title: 'Hammer',
      type: 'Artistic Creations',
      overview: 'A high-fidelity 3D model of a hammer, focused on structural precision and geometric cleanlines. This project was a foundational exercise in learning the essential modeling tools within Blender.',
      teamSize: '1',
      timeFrame: '4 hours',
      engine: 'Blender',
      learnt: 'Mastered several core editing tools, specifically focusing on Beveling to create realistic edges and sub-division surface modeling to smooth out complex geometries. I also learned how to manage mesh topology to ensure clean renders.',
      images: ['/hammer1.png', '/hammer2.png']
    },
    {
      id: 'asteroid',
      title: 'Asteroid',
      type: 'Games',
      overview: 'A classic 2D arcade space shooter. The player pilots a spaceship, surviving in a space filled with meteorites by shooting down incoming asteroids to achieve a high score.',
      teamSize: '1',
      timeFrame: '3 weeks',
      engine: 'GDevelop 5',
      learnt: 'Mastered event-driven programming logic in GDevelop 5. Learnt how to manage game loops, dynamic object spawning and destroying, 2D collision detection mechanisms, and basic game state management.',
      image: '/asteroid.png'
    },
    {
      id: 'basketball',
      title: 'Basketball Strike',
      type: 'Games',
      overview: 'A casual 2D physics-based basketball game. The player must score as many hoops as possible within a limited time or number of shots to achieve the highest score.',
      teamSize: '1',
      timeFrame: '2 weeks',
      engine: 'GDevelop 5',
      learnt: 'Deepened my understanding of 2D physics engines in games, including parameter tuning for gravity and restitution. Learnt how to design intuitive user interactions (calculating drag force) and construct a UI scoring system.',
      image: '/basketballStrike.png'
    },
    {
      id: 'cheese',
      title: 'Cheese Chase',
      type: 'Games',
      overview: 'A fast-paced, top-down maze game. The player controls a nimble mouse that must collect all the cheese in a complex labyrinth whilst avoiding patrolling cats.',
      teamSize: '1',
      timeFrame: '4 hours',
      engine: 'Scratch',
      learnt: 'Rapid prototyping within a strict time limit. Honed the ability to quickly structure foundational game logic (such as if-else conditions, variables, and message broadcasting) in a visual programming environment.',
      image: '/cheeseChase.png'
    },
    {
      id: 'cyber',
      title: 'Cyber Chase',
      type: 'Games',
      overview: 'A high-mobility chase game set in a neon-lit cyberpunk 3D world. The player must navigate through complex 3D levels to execute extreme escapes or pursue targets.',
      teamSize: '4',
      timeFrame: '8 weeks',
      engine: 'Unity, Blender',
      learnt: 'Experienced a complete 3D game development pipeline. Learnt how to import 3D models created in Blender into Unity and set up materials and animation rigging. Mastered team collaboration, version control, as well as 3D physics, lighting (baking), and camera control in Unity.',
      image: '/cyberChase.jpg'
    },
    {
      id: 'glacier',
      title: 'Glacier Race',
      type: 'Games',
      overview: 'A minimalist, hyper-casual racing game. The player must slide as far as possible along an obstacle-filled glacial track.',
      teamSize: '1',
      timeFrame: '3 hours',
      engine: 'Scratch',
      learnt: "Experienced Game Jam-style rapid development. Learnt how to simulate specific physical feedback (like the slippery handling of ice) by tweaking variables (friction and acceleration), with a strong emphasis on refining 'game feel'.",
      image: '/glacierRace.png'
    },
    {
      id: 'maze',
      title: 'Tilting-Board Maze Game',
      type: 'Games',
      overview: 'A 3D physics puzzle game inspired by the classic wooden tilting maze toy. The player must tilt the entire board to guide a ball using gravity, avoiding traps and navigating through walls to reach the goal. This game features a physics engine written entirely from scratch, without the use of any third-party physics libraries.',
      teamSize: '1',
      timeFrame: '10 hours',
      engine: 'Processing 4',
      learnt: 'Gained a profound understanding of low-level physics simulation engine architecture. Learnt and implemented Symplectic Euler Integration to ensure energy conservation and simulation stability. Derived gravity projection vectors on a tilted plane; implemented custom circle-vs-AABB collision detection and impulse-based contact resolution with friction from scratch.',
      image: '/mazeGame.png'
    },
    {
      id: 'banana',
      title: "Where's My Banana?!",
      type: 'Games',
      overview: 'A native 3D hidden-object puzzle game, developed entirely using C++ and the low-level OpenGL graphics API. The player must explore, move, and interact with objects in a 3D environment to find a hidden banana.',
      teamSize: '4',
      timeFrame: '8 weeks',
      engine: 'Visual Studio (OpenGL)',
      learnt: 'Developed a highly comprehensive understanding of low-level system architecture and the graphics rendering pipeline. Without the aid of a pre-built game engine, I learnt how to apply 3D maths (matrix operations, vector dot/cross products) to execute object translation, rotation, and scaling. Sharpened my ability to build game engine components from scratch using C++ within a medium-sized team.',
      image: '/wheresMyBanana.jpg'
    }
  ] as { id: string, title: string, type: string, overview?: string, teamSize?: string, timeFrame?: string, engine?: string, learnt?: string, image?: string, images?: string[], note?: string }[]).sort((a, b) => a.title.localeCompare(b.title)), []);

  const categorizedProjects = useMemo(() => {
    const categories: Record<string, typeof projects> = {};
    projects.forEach(p => {
      if (!categories[p.type]) categories[p.type] = [];
      categories[p.type].push(p);
    });
    return categories;
  }, [projects]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categorizedProjects;
    
    const filtered: Record<string, typeof projects> = {};
    (Object.entries(categorizedProjects) as [string, typeof projects][]).forEach(([cat, items]) => {
      const matchingItems = items.filter((p: any) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (matchingItems.length > 0) {
        filtered[cat] = matchingItems;
      }
    });
    return filtered;
  }, [categorizedProjects, searchQuery]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setNavHidden(true); // Scrolling down, hide
      setIsMenuOpen(false); // Close menu on scroll
    } else {
      setNavHidden(false); // Scrolling up, show
    }
  });

  const handleNavClick = (item: string) => {
    const page = item.toLowerCase() as 'home' | 'about' | 'education' | 'work' | 'traits';
    if (['about', 'education', 'traits', 'work'].includes(page)) {
      setCurrentPage(page as any);
      if (page === 'work') setMobileWorkView('list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const goToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.getAnimations().forEach(anim => {
        anim.playbackRate = 0.2; // slow down to 20% speed
      });
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.getAnimations().forEach(anim => {
        anim.playbackRate = 1; // restore normal speed
      });
    }
  };

  const navItems = ['About', 'Education', 'Work', 'Traits'];

  const tools = [
    { name: 'Unreal Engine', icon: 'https://cdn.simpleicons.org/unrealengine/111111' },
    { name: 'Unity', icon: 'https://cdn.simpleicons.org/unity/111111' },
    { name: 'Processing', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Processing_2021_logo.svg' },
    { name: 'C++', icon: 'https://cdn.simpleicons.org/cplusplus/111111' },
    { name: 'Python', icon: 'https://cdn.simpleicons.org/python/111111' },
    { name: 'Java', icon: 'https://www.vectorlogo.zone/logos/java/java-icon.svg' },
    { name: 'GDevelop', icon: 'https://gdevelop.io/favicons/apple-touch-icon.png' },
  ];

  // We duplicate the tools array multiple times to create a seamless infinite loop in the marquee
  const sliderItems = [...tools, ...tools, ...tools, ...tools, ...tools, ...tools, ...tools, ...tools];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#1A1A1A] selection:bg-gray-200 selection:text-black overflow-x-hidden">
      {/* Navigation Bar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 w-full flex justify-center items-center py-6 px-6 z-50 transition-transform duration-300"
        initial={{ y: 0 }}
        animate={{ y: navHidden ? '-100%' : '0%' }}
      >
        {/* Home Button Overlay - Absolute to the container */}
        <div className="absolute left-6">
          <div 
            className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-sm hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all cursor-pointer group"
            onClick={goToHome}
          >
            <Home className="w-5 h-5 text-[#1A1A1A] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-2 bg-white/80 backdrop-blur-md border border-gray-100 p-1 rounded-xl shadow-sm text-sm font-medium text-[#666]">
          {navItems.map((item) => (
            <li 
              key={item} 
              onClick={() => handleNavClick(item)}
              className={`px-4 py-2 rounded-md transition-all cursor-pointer ${currentPage === item.toLowerCase() ? 'text-[#1A1A1A] bg-[#F5F5F5]' : 'hover:text-[#1A1A1A] hover:bg-[#F5F5F5]'}`}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle Button */}
        <div className="absolute right-6 md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-sm hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all cursor-pointer active:scale-90"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-20 left-6 right-6 md:hidden origin-top"
            >
              <ul className="flex flex-col space-y-1 bg-white/95 backdrop-blur-lg border border-gray-100 p-2 rounded-2xl shadow-xl text-lg font-medium text-[#666]">
                {navItems.map((item) => (
                  <li 
                    key={item} 
                    className="px-6 py-4 rounded-xl hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all cursor-pointer flex items-center justify-between group"
                    onClick={() => handleNavClick(item)}
                  >
                    {item}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Conditional Content rendering */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 mt-16 md:mt-24">
              
              {/* Avatar/Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 relative z-20"
              >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden mx-auto flex items-center justify-center drop-shadow-2xl">
                   <img 
                     src="/profile.png" 
                     alt="Chai Yu Hen" 
                     className="w-full h-full object-cover mix-blend-multiply"
                     onError={(e) => {
                       e.currentTarget.src = "https://placehold.co/400x400/eeeeee/a3a3a3?text=Upload+profile.png";
                       e.currentTarget.classList.remove('mix-blend-multiply');
                     }}
                   />
                </div>
              </motion.div>

              {/* Hero Text */}
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight mb-6">
                  Hello!
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-black leading-snug mb-6">
                  My name is Chai Yu Hen.
                </h2>
                <p className="text-[18px] md:text-[20px] text-[#37352f] max-w-2xl mx-auto font-light leading-[1.6] mb-10 text-balance">
                  I’m a 22-year-old Information Technology (Game Technology) student with a deep love for art and interactive experiences.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mb-12"
              >
                <button 
                  onClick={() => handleNavClick('Work')}
                  className="group w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:bg-[#333] hover:-translate-y-0.5"
                >
                  View My Work
                  <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                
                <a 
                  href="/resume.pdf" 
                  download="Chai_Yu_Hen_Resume.pdf"
                  className="group w-full sm:w-auto px-10 py-4 bg-white text-[#1A1A1A] border border-[#E5E5E5] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:bg-[#FAFAFA] hover:-translate-y-0.5"
                >
                  Download Resume
                  <Download className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" />
                </a>
              </motion.div>

            </main>

            {/* Tools Slider Section */}
            <section className="w-full pb-8 flex flex-col items-center">
              <div className="w-full text-center mb-6">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400">
                  powering my creation with
                </p>
              </div>
              
              <div 
                className="relative w-full flex overflow-hidden mask-image-fade py-4 group cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div ref={trackRef} className="flex animate-marquee slider-track whitespace-nowrap w-max items-center">
                  {sliderItems.map((tool, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-center transition-all duration-300 shrink-0 mx-8 md:mx-12 group/logo"
                    >
                      <img 
                        src={tool.icon} 
                        alt={tool.name} 
                        className="h-8 md:h-10 w-auto object-contain max-w-[100px] grayscale contrast-[1.1] opacity-60 group-hover/logo:opacity-100 group-hover/logo:brightness-[0.4] group-hover/logo:contrast-[1.3] transition-all duration-300"
                        title={tool.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('font-bold', 'text-xl', 'text-[#1A1A1A]');
                          e.currentTarget.parentElement?.querySelector('span')?.classList.remove('sr-only');
                        }}
                      />
                      <span className="sr-only font-bold text-xl text-[#1A1A1A] transition-colors opacity-60 group-hover/logo:opacity-100">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        ) : currentPage === 'about' ? (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow max-w-4xl mx-auto px-6 pt-32 pb-20 w-full"
          >
            {/* About Page Content */}
            <header className="mb-12">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">About Me</h1>
            </header>

            {/* Bento Grid: Personal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
              {/* Name Module */}
              <div className="md:col-span-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Name</p>
                <h3 className="text-base md:text-3xl font-bold">Chai Yu Hen</h3>
              </div>

              {/* Age Module */}
              <div className="md:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Age</p>
                <h3 className="text-base md:text-3xl font-bold">22 <span className="text-gray-300 font-light text-sm md:text-xl">(2026)</span></h3>
              </div>

              {/* Bio Module */}
              <div className="md:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Status</p>
                <p className="text-[#37352f] text-[16px] leading-[1.6] font-medium">
                  Currently pursuing a Bachelor of Information Technology (Game Technology) with Honours at Universiti Teknikal Malaysia Melaka (UTeM).
                </p>
              </div>

              {/* Map Module */}
              <div className="md:col-span-8 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-auto hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="p-6 pb-2">
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Hometown</p>
                  <h4 className="text-lg font-bold">Cameron Highlands, Pahang</h4>
                </div>
                <div className="flex-grow bg-gray-50 relative min-h-[250px]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127285.8736302398!2d101.3879092360755!3d4.469788446206848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31ca5082fa7f0d47%3A0x655625f6e1faf2f4!2sCameron%20Highlands%2C%20Pahang!5e0!3m2!1sen!2smy!4v1778644822209!5m2!1sen!2smy" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale contrast-[1.1] opacity-80"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Bento Grid: Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              <button 
                onClick={() => copyToClipboard('b032410270@student.utem.edu.my', 'email')}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col gap-2 group hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Email</p>
                  <Copy className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm sm:text-base md:text-[14px] lg:text-[17px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">b032410270@student.utem.edu.my</span>
                
                {/* Copied Feedback */}
                <AnimatePresence>
                  {copiedItem === 'email' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-0 bg-black flex items-center justify-center gap-2 text-white font-bold"
                    >
                      <Check className="w-5 h-5" />
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button 
                onClick={() => copyToClipboard('(+60) 17 901 9661', 'phone')}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col gap-2 group hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Phone</p>
                  <Copy className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm sm:text-base md:text-[14px] lg:text-[17px] font-bold">(+60) 17 901 9661</span>

                {/* Copied Feedback */}
                <AnimatePresence>
                  {copiedItem === 'phone' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-0 bg-black flex items-center justify-center gap-2 text-white font-bold"
                    >
                      <Check className="w-5 h-5" />
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        ) : currentPage === 'work' ? (
          <motion.div
            key="work"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow flex flex-col pt-[100px] bg-white min-h-screen"
          >
            {/* Header Section (Desktop Only) */}
            <div className="hidden md:block shrink-0 px-6 md:px-12 lg:px-20 py-8 md:py-10 border-b border-gray-100 bg-[#fbfbfa]/50 relative overflow-hidden">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-black mb-4">Work Created</h1>
              <p className="text-[#37352f] max-w-5xl text-[16px] leading-[1.6]">
                Guided by the principles of Technical and Vocational Education and Training (TVET), my journey is rooted in project-based learning. Each initiative represents a hands-on exploration of complex challenges, bridging academic theory with practical application. These projects are the milestones of my progress, evidencing a commitment to building robust, real-world solutions through disciplined problem-solving.
              </p>
            </div>

            <div className="flex-grow flex flex-col md:flex-row relative">
              {/* Mobile View */}
              <div className="md:hidden flex-grow bg-white">
                {mobileWorkView === 'list' ? (
                  <div className="pb-32">
                    {/* Header Section for Mobile (Scrolls with list) */}
                    <div className="px-6 pt-12 pb-10 border-b border-gray-100 bg-[#fbfbfa]/30 mb-8">
                       <h1 className="text-4xl font-black tracking-tight text-black mb-4">Work Created</h1>
                       <p className="text-[#37352f] text-[16px] leading-[1.6]">
                         Guided by the principles of Technical and Vocational Education and Training (TVET), my journey is rooted in project-based learning. Each initiative represents a hands-on exploration of complex challenges, bridging academic theory with practical application. These projects are the milestones of my progress, evidencing a commitment to building robust, real-world solutions through disciplined problem-solving.
                       </p>
                    </div>
                    
                    <div className="px-6 space-y-12">
                      {(Object.entries(filteredCategories) as [string, typeof projects][]).map(([category, items]) => (
                        <div key={category} className="space-y-6">
                          <h3 className="text-[12px] font-black text-gray-400 border-b border-gray-100 pb-2 uppercase tracking-[0.2em]">{category}</h3>
                          <div className="space-y-6">
                            {(items as typeof projects).map((project, idx) => (
                              <button
                                key={project.id}
                                onClick={() => {
                                  setSelectedProject(project.id);
                                  setMobileWorkView('detail');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex items-start gap-4 text-left w-full active:opacity-60 transition-opacity"
                              >
                                <span className="text-gray-500 font-mono text-sm pt-1">{String(idx + 1).padStart(2, '0')}.</span>
                                <span className="text-[19px] font-medium text-[#37352f] underline decoration-gray-200 underline-offset-8 decoration-2 group-hover:decoration-gray-600 transition-all">
                                  {project.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Desktop Sidebar (unchanged visually but hidden on mobile detail view to prevent layout shifts) */}
              <aside className={`hidden md:flex w-72 border-r border-gray-100 flex-col bg-[#fbfbfa] relative z-0 shrink-0`}>
                <div className="sticky top-[100px] flex flex-col h-[calc(100vh-100px)]">
                {/* Search Header */}
                <div className="p-4 pt-6 shrink-0">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-gray-300 transition-all text-gray-600"
                    />
                  </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-grow overflow-y-auto px-2 py-4 space-y-1">
                  {(Object.entries(filteredCategories) as [string, typeof projects][]).map(([category, items]) => (
                    <div key={category} className="space-y-0.5">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-200/50 rounded-lg group transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">{category}</span>
                        </div>
                        <span className={`transition-transform duration-200 ${expandedCategories.includes(category) ? 'rotate-0' : '-rotate-180'}`}>
                          <ChevronDown size={14} className="text-gray-400" />
                        </span>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {expandedCategories.includes(category) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 space-y-0.5 border-l border-gray-200 mt-0.5 pl-2">
                              {(items as typeof projects).map((project) => (
                                <button
                                  key={project.id}
                                  onClick={() => {
                                    setSelectedProject(project.id);
                                    setIsMobileWorkNavOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left group ${
                                    selectedProject === project.id 
                                      ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] border border-gray-200' 
                                      : 'hover:bg-gray-200/40 border border-transparent'
                                  }`}
                                >
                                  <FileText size={16} className={`shrink-0 ${selectedProject === project.id ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                  <span className={`text-[13px] line-clamp-1 ${selectedProject === project.id ? 'text-black font-semibold' : 'text-gray-600 font-medium'}`}>
                                    {project.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  
                  {Object.keys(filteredCategories).length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs italic">
                      No matching results
                    </div>
                  )}
                </div>
                </div>
              </aside>

              {/* Content Area (Mobile detail view or Desktop view) */}
              <main className={`flex-grow bg-white px-6 md:px-12 lg:px-20 py-8 md:py-12 relative transition-all duration-300 ${mobileWorkView === 'detail' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute pointer-events-none md:opacity-100 md:translate-x-0 md:relative md:pointer-events-auto'}`}>
                {/* Mobile Back Button */}
                <div className="md:hidden mb-8">
                  <button 
                    onClick={() => setMobileWorkView('list')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 active:scale-95 transition-all"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Projects
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedProject}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="max-w-4xl mx-auto"
                  >
                    <ProjectDetail 
                      project={projects.find(p => p.id === selectedProject)} 
                      setLightboxImage={setLightboxImage} 
                    />

                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
        ) : currentPage === 'education' ? (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow max-w-4xl mx-auto px-6 pt-32 pb-20 w-full"
          >
            {/* Education Page Content */}
            <header className="mb-16 relative flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Academic History</h1>
                <p className="text-[#37352f] text-[16px] leading-[1.6] max-w-2xl">
                  I view my academic journey not just as a timeline of institutions, but as a continuous process of growth. Every chapter of my education has been incredibly valuable to my life, enriching me with profound knowledge, diverse experiences, and meaningful insights that continue to shape who I am today.
                </p>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="w-32 md:w-40 shrink-0 self-center md:self-end"
              >
                <img 
                  src="https://images.ctfassets.net/spoqsaf9291f/4SKgWUM6X1GZFJALEi03qg/46e9675dfd269a3c9d9cc01b9bdc7808/7.png" 
                  alt="Academic Illustration" 
                  className="w-full h-auto object-contain drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </header>

            {/* Timeline */}
            <div className="relative pl-14 md:pl-0">
              {/* Vertical line - hidden on very small screens, visible as a center line or side line */}
              <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-[1px] bg-gray-100 -translate-x-1/2" />

              {/* SMK Kampung Raja */}
              <div className="relative mb-24 md:flex md:justify-between md:items-start group">
                <div className="md:w-[45%] md:text-right">
                  <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-400 mb-3">2017 - 2022</span>
                  <h3 className="text-xl font-bold mb-2">SMK Kampung Raja, Cameron Highlands</h3>
                  <p className="text-[#37352f] text-[16px] leading-[1.6] mb-6 md:mb-0">
                    During my secondary school years, I specialized in Pure Science. This rigorous curriculum laid the foundation for my scientific and critical thinking skills, teaching me how to approach complex problems with a structured, analytical mindset.
                  </p>
                </div>

                <div className="md:w-[45%] md:pl-0 space-y-6">
                  {/* Achievement dots/nodes for hover */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      { year: '2017', title: 'Beaver Computational Thinking (CADET)', award: 'Honorable Mention' },
                      { year: '2018', title: 'School Librarian', award: 'Member' },
                      { year: '2018', title: 'Beaver Computational Thinking (CADET)', award: 'Gold Award' },
                      { year: '2020', title: 'Beaver Computational Thinking (JUNIOR)', award: 'Bronze Award' },
                      { year: '2021', title: 'Beaver Computational Thinking (JUNIOR)', award: 'Bronze Award' },
                      { year: '2021', title: 'National Robotic & Coding Competition', award: 'Participant' },
                      { year: '2021', title: '22nd International High School Arts Festival', award: 'Pahang Rep' },
                      { year: '2020-21', title: 'School Librarian', award: 'Vice President' },
                      { year: '2022', title: 'Graduation', award: 'Delayed due to COVID' },
                    ].map((achievement, i) => (
                      <div key={i} className="group/item relative">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center cursor-help transition-all hover:border-black hover:shadow-lg hover:-translate-y-1">
                          <span className="text-[10px] font-bold text-gray-400 group-hover/item:text-black">{achievement.year.slice(-2)}</span>
                        </div>
                        {/* Tooltip Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover/item:opacity-100 group-hover/item:scale-100 transition-all z-20">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{achievement.year}</p>
                          <p className="text-xs font-bold mb-1">{achievement.title}</p>
                          <p className="text-[10px] text-gray-500">{achievement.award}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* School Image with decoration */}
                  <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                    <img src="/semekar.png" alt="SMK Kampung Raja" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>

              {/* SMK Sultan Ahmad Shah */}
              <div className="relative mb-24 md:flex md:flex-row-reverse md:justify-between md:items-start group">
                <div className="md:w-[45%]">
                  <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-400 mb-3">2023 - 2024</span>
                  <h3 className="text-xl font-bold mb-2">SMK Sultan Ahmad Shah, Cameron Highlands</h3>
                  <p className="text-[#37352f] text-[16px] leading-[1.6] mb-6 md:mb-0">
                    Pursuing Form 6 in the Arts and Business stream was a transformative period for me. It encouraged a high degree of independence and self-reliance. This transition from basic science to business foundations broadered my perspective on how structured thinking applies to organizational and cultural contexts.
                  </p>
                </div>

                <div className="md:w-[45%] md:text-right pr-0 md:pr-8 space-y-6">
                  <div className="flex flex-wrap md:flex-row-reverse gap-3">
                    {[
                      { year: '2023', title: 'Sports Day Committee', award: 'Treasurer & Game Lead' },
                      { year: '2023', title: 'Culture & Arts Club', award: 'Secretary' },
                      { year: '2023', title: 'Red Crescent (PBSM)', award: 'Secretary' },
                      { year: '2024', title: 'Kuala Lumpur Study Tour', award: 'Assistant Secretary' },
                      { year: '2024', title: 'Culture & Arts Club', award: 'Vice President' },
                    ].map((achievement, i) => (
                      <div key={i} className="group/item relative">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center cursor-help transition-all hover:border-black hover:shadow-lg hover:-translate-y-1">
                          <span className="text-[10px] font-bold text-gray-400 group-hover/item:text-black">{achievement.year.slice(-2)}</span>
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover/item:opacity-100 group-hover/item:scale-100 transition-all z-20">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{achievement.year}</p>
                          <p className="text-xs font-bold mb-1">{achievement.title}</p>
                          <p className="text-[10px] text-gray-500">{achievement.award}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* School Image with decoration */}
                  <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                    <img src="/sas.png" alt="SMK Sultan Ahmad Shah" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>

              {/* UTeM */}
              <div className="relative md:flex md:justify-between md:items-start group">
                <div className="md:w-[45%] md:text-right">
                  <span className="inline-block px-3 py-1 bg-[#1A1A1A] border border-black rounded-full text-xs font-bold text-white mb-3 tracking-wider">2024 - NOW</span>
                  <h3 className="text-xl font-bold mb-2">Universiti Teknikal Malaysia Melaka (UTeM), Durian Tunggal</h3>
                  <p className="text-[#37352f] text-[16px] leading-[1.6] mb-6 md:mb-0">
                    My university experience has been incredibly fulfilling, marking a period of countless "firsts" in my life. Immersed in Game Technology, I have found a perfect marriage between my passion for art and my foundation in logic. Every project and lecture serves as a catalyst for growth, pushing me to evolve both as a developer and as an individual in this dynamic field.
                  </p>
                </div>

                <div className="md:w-[45%] md:pl-0 space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {[
                      { year: '2024/25', title: 'Semester 2', award: 'Dean\'s List Award', label: 'Y1' },
                      { year: '2025/26', title: 'Semester 1', award: 'Dean\'s List Award', label: 'Y2' },
                    ].map((achievement, i) => (
                      <div key={i} className="group/item relative">
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center cursor-help transition-all hover:border-black hover:shadow-lg hover:-translate-y-1">
                          <span className="text-xs font-bold text-gray-400 group-hover:text-black">{achievement.label}</span>
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover/item:opacity-100 group-hover/item:scale-100 transition-all z-20">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{achievement.year}</p>
                          <p className="text-xs font-bold mb-1">{achievement.title}</p>
                          <p className="text-[10px] text-gray-500">{achievement.award}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* School Image */}
                  <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                    <img src="/ftmk.png" alt="UTeM" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="traits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow max-w-4xl mx-auto px-6 pt-32 pb-20 w-full"
          >
            {/* Traits Page Content */}
            <header className="mb-16 relative">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Personal Qualities</h1>
              <p className="text-[#37352f] text-[16px] leading-[1.6] max-w-3xl">
                Beyond technical skills, I believe that personal qualities define the soul of my work.
              </p>
            </header>

            <div className="space-y-12">
              {/* MBTI Section */}
              <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 overflow-hidden rounded-xl shadow-sm border border-gray-100">
                      <img src="https://framerusercontent.com/images/IiRZ8TzPMBz7ZsO1Lo3y5y5gLfk.png?width=257&height=256" alt="MBTI Logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight">MBTI</h2>
                   </div>
                    
                    <p className="text-[#37352f] text-[16px] leading-[1.6]">
                      MBTI has become a global language for understanding personality patterns. It helps identify how we perceive the world and make decisions, providing a framework for personal growth and better interpersonal understanding.
                    </p>

                    <div className="pt-4">
                      <div className="inline-block relative group/tooltip">
                        <span className="text-4xl font-black tracking-tighter text-black border-b-4 border-gray-100 pb-1 cursor-help hover:border-black transition-all">
                          INFJ-T
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-0 mb-4 w-72 p-5 bg-black text-white rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all z-50">
                          <p className="text-xs leading-relaxed font-medium">
                            Advocates are quiet visionaries, often serving as inspiring and tireless idealists. These rare types are open-minded and imaginative, applying care and creativity.
                          </p>
                          <div className="absolute top-full left-6 w-3 h-3 bg-black rotate-45 -translate-y-1.5"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest font-bold">The Advocate</p>
                    </div>
                  </div>

                  <div className="w-full md:w-[400px] h-[350px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'Introverted', A: 85, fullMark: 100 },
                        { subject: 'Intuitive', A: 59, fullMark: 100 },
                        { subject: 'Feeling', A: 58, fullMark: 100 },
                        { subject: 'Judging', A: 58, fullMark: 100 },
                        { subject: 'Turbulent', A: 78, fullMark: 100 },
                      ]}>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl border border-white/10">
                                  {`${payload[0].payload.subject} – ${payload[0].value}%`}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                        />
                        <Radar
                          name="INFJ-T (%)"
                          dataKey="A"
                          stroke="#000000"
                          strokeWidth={2}
                          fill="#000000"
                          fillOpacity={0.03}
                          dot={false}
                          activeDot={{ r: 6, fill: 'black', stroke: 'black' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Core Values Section */}
              <section className="space-y-6">
                <div className="px-4">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-3">Core Values</h2>
                  <p className="text-[#37352f] text-[16px] leading-[1.6] max-w-2xl">
                    These core values guide how I approach challenges, collaborate with others, and grow as an individual.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      title: "Relentless Problem-solving", 
                      description: "A deep-seated drive to dissect complex challenges and find elegant, efficient solutions where others see obstacles." 
                    },
                    { 
                      title: "Boundless Creativity", 
                      description: "Constantly exploring new artistic frontiers and unconventional ideas to create experiences that resonate on a visceral level." 
                    },
                    { 
                      title: "Intense Discipline", 
                      description: "Maintaining a rigorous standard for quality and a steadfast commitment to seeing every vision through to its finest detail." 
                    }
                  ].map((trait, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:border-gray-300 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Value {i + 1}</p>
                      <h3 className="text-xl font-bold mb-4 text-black group-hover:translate-x-1 transition-transform">{trait.title}</h3>
                      <p className="text-[#37352f] text-[16px] leading-[1.6]">{trait.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Facts Assistant Bubble - Fixed to About Page */}
      <AnimatePresence>
        {currentPage === 'about' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-8 right-8 z-[90] group"
          >
            <div className="relative">
              {/* Speech Bubble */}
              <div className="absolute bottom-full right-0 mb-4 w-72 md:w-80 p-6 bg-white border border-gray-100 rounded-[2rem] shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">facts about me</p>
                <p className="text-[#37352f] text-[14px] leading-[1.6]">
                  I was born with Encephalocele, a congenital condition that once had me registered as an OKU. Fortunately, it hasn't impacted my physical mobility. I am fully active and healthy, which is something I never take for granted. This early life challenge has instilled in me a strong sense of gratitude and resilience, qualities I bring into everything I do.
                </p>
                {/* Arrow for speech bubble */}
                <div className="absolute top-full right-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45 -translate-y-2"></div>
              </div>

              {/* Profile Circle */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-white shadow-lg shadow-black/10 transition-all duration-300 active:scale-90 group-hover:shadow-2xl group-hover:shadow-black/20 group-hover:-translate-y-1 cursor-help">
                <img 
                  src="/profile.png" 
                  alt="Facts Assistant" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100/1a1a1a/ffffff?text=Facts";
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-12 mt-0 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 text-center md:text-left gap-6">
        <ul className="flex flex-wrap justify-center space-x-6 text-[#666] font-medium">
          {navItems.map((item) => (
            <li 
              key={item} 
              onClick={() => handleNavClick(item)}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
        <p>
          © {new Date().getFullYear()} Chai Yu Hen — All rights reserved.
        </p>
      </footer>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={lightboxImage} 
                alt="Enlarged screenshot" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-0 right-0 md:-top-12 md:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Experience Alert Modal */}
      <AnimatePresence>
        {showMobileAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 md:hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4 text-black">
                Better on Desktop
              </h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                For the best interactive experience and to fully appreciate the design details, I recommend viewing this portfolio on a computer.
              </p>
              <button
                onClick={dismissMobileAlert}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg transition-transform active:scale-95 shadow-xl shadow-black/10"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
