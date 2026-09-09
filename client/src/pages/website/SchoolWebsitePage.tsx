import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Puzzle,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Baby,
  Sprout,
  Sun,
  Palette,
  Music,
  Trees,
  Compass,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  X,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Play,
  Pause,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  SvgPencil,
  SvgBubble,
  SvgStar,
  SvgCloud,
  SvgRainbow,
  SvgButterfly,
  SvgPaperPlane,
  SvgSun,
  SvgFlower,
  SvgOpenBook,
  SvgAlphabetBlocks,
  SvgHandDrawnLine,
  SvgLeafBranch,
  SvgHeartDoodle,
  SvgLoopFlightTrail,
  SvgSunCompass,
  AnimatedButterfly,
  AnimatedBee,
  AnimatedCuteBunny,
  AnimatedCuteLion,
  AnimatedCuteGiraffe,
  AnimatedFloatingBalloon
} from '../../components/common/Doodles.js';

interface SchoolWebsitePageProps {
  onNavigateToPortal: () => void;
  onNavigateToLogin: () => void;
  onNavigateToDashboard?: () => void;
  isStaffLoggedIn?: boolean;
}

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: 'spaces' | 'outdoor' | 'activities' | 'children';
  categoryLabel: string;
  desc: string;
}

const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'entrance',
    src: '/images/school/school-entrance-sign.jpg',
    title: 'Welcome to Bubbles Early Years School',
    category: 'spaces',
    categoryLabel: 'Campus & Entrance',
    desc: 'Our welcoming school entrance with secure gates, warm wood signage, and dedicated parent support (0948 88 33 88 / 0940 88 00 55).'
  },
  {
    id: 'hero-girl',
    src: '/images/children/child-portrait-girl.jpg',
    title: 'Joyful Mornings in the Garden',
    category: 'children',
    categoryLabel: 'Little Explorers',
    desc: 'Bright smiles and curious minds greeting each morning with laughter, outdoor discovery, and warm encouragement.'
  },
  {
    id: 'main-classroom',
    src: '/images/school/main-classroom-wide.jpg',
    title: 'Sunny Learning Studios',
    category: 'spaces',
    categoryLabel: 'Campus & Spaces',
    desc: 'Natural sunlight, child-height collaborative tables, calendar discovery walls, and science learning stations.'
  },
  {
    id: 'art-worksheet',
    src: '/images/children/child-art-worksheet.jpg',
    title: 'Proud Young Artists — Worksheet Time',
    category: 'activities',
    categoryLabel: 'Art & Creativity',
    desc: 'Every milestone celebrated! A proud pupil displaying her colored banana worksheet with the official Bubbles emblem.'
  },
  {
    id: 'playground-grass',
    src: '/images/school/playground-grass.jpg',
    title: 'Safe Grass Lawn & Climbing Dome',
    category: 'outdoor',
    categoryLabel: 'Playground & Outdoor',
    desc: 'Lush natural green grass, geodesic climbing dome, caterpillar crawl tunnel, and colorful rainbow safety fences.'
  },
  {
    id: 'nap-room',
    src: '/images/school/nap-room-beds.jpg',
    title: 'Cozy Dream & Nap Haven',
    category: 'spaces',
    categoryLabel: 'Campus & Spaces',
    desc: 'Individual soft toddler cots, warm cove ceiling lighting, plush teddy bears, and peaceful lullaby acoustics for midday rest.'
  },
  {
    id: 'sensory-dough',
    src: '/images/children/child-sensory-dough.jpg',
    title: 'Tactile Sensory Play with Dough',
    category: 'activities',
    categoryLabel: 'Art & Creativity',
    desc: 'Hands-on molding with non-toxic sensory dough, boosting fine motor coordination and spatial exploration.'
  },
  {
    id: 'garden-trikes',
    src: '/images/school/garden-patio.jpg',
    title: 'Shaded Patio & Tricycle Runway',
    category: 'outdoor',
    categoryLabel: 'Playground & Outdoor',
    desc: 'Smooth rubberized pathway bordered by palm trees and fresh flowerbeds, equipped with mini trikes for coordination.'
  },
  {
    id: 'art-studio',
    src: '/images/school/art-craft-room.jpg',
    title: 'Art & Paint Atelier',
    category: 'activities',
    categoryLabel: 'Art & Creativity',
    desc: 'Dedicated standing wooden easels, splatter walls, heart-cutout chairs, and non-toxic finger paints.'
  },
  {
    id: 'traditional-music',
    src: '/images/children/child-traditional-music.jpg',
    title: 'Cultural Day & Outdoor Music',
    category: 'activities',
    categoryLabel: 'Music & Culture',
    desc: 'Celebration of rich cultural traditions, rhythm instruments, and communal music exploration outdoors.'
  },
  {
    id: 'playmat-friends',
    src: '/images/children/children-playmat.jpg',
    title: 'Friendships Blossom on Soft Play Mats',
    category: 'children',
    categoryLabel: 'Little Explorers',
    desc: 'Developing empathy and cooperative play with friends in a secure, padded indoor playroom.'
  },
  {
    id: 'tree-mural',
    src: '/images/school/classroom-tree-mural.jpg',
    title: 'Inspiring Tree Mural & Weather Station',
    category: 'spaces',
    categoryLabel: 'Campus & Spaces',
    desc: 'Hanging floral vines, feelings wheel, daily weather charts, and magic words wall (Thank you, Please, Excuse me).'
  },
  {
    id: 'mushroom-playhouse',
    src: '/images/school/playground-mushroom.jpg',
    title: 'Mushroom Playhouse & Sunny Lawn',
    category: 'outdoor',
    categoryLabel: 'Playground & Outdoor',
    desc: 'Imaginative play structures designed specifically for toddlers and early-years children ages 1 to 6.'
  },
  {
    id: 'garden-patch',
    src: '/images/school/gardening-patch.jpg',
    title: 'Living Botanical Garden & Lavender Bed',
    category: 'outdoor',
    categoryLabel: 'Playground & Outdoor',
    desc: 'Hands-in-the-soil gardening, fresh lavender, child-scaled handwashing sinks, and nature observation.'
  },
  {
    id: 'apple-snack',
    src: '/images/children/child-apple-picnic.jpg',
    title: 'Nutritious Snack Time — Crisp Green Apples',
    category: 'children',
    categoryLabel: 'Little Explorers',
    desc: 'Instilling healthy eating habits with daily fresh organic fruits and communal seated picnics.'
  },
  {
    id: 'kids-kitchen',
    src: '/images/school/kids-kitchen.jpg',
    title: 'Pristine Kitchen "Seasoned with Love"',
    category: 'spaces',
    categoryLabel: 'Campus & Spaces',
    desc: 'Spotless hygienic meal prep and dining facilities adhering to highest child safety standards.'
  },
  {
    id: 'hallway-dots',
    src: '/images/school/classroom-hallway-dots.jpg',
    title: 'Whimsical Bubble Hallways',
    category: 'spaces',
    categoryLabel: 'Campus & Spaces',
    desc: 'Playful colorful bubble circles and hanging heart mobiles leading into each grade’s learning room.'
  },
  {
    id: 'traditional-coffee',
    src: '/images/children/child-traditional-coffee.jpg',
    title: 'Traditional Ethiopian Coffee Ceremony Roleplay',
    category: 'activities',
    categoryLabel: 'Music & Culture',
    desc: 'Honoring heritage through imaginative cultural roleplay in beautiful traditional white garments.'
  },
  {
    id: 'boy-apple',
    src: '/images/children/child-boy-apple.jpg',
    title: 'Happy & Healthy Explorers',
    category: 'children',
    categoryLabel: 'Little Explorers',
    desc: 'Smiles that light up the day — growing stronger, healthier, and happier every single day at Bubbles.'
  }
];

export const SchoolWebsitePage: React.FC<SchoolWebsitePageProps> = ({
  onNavigateToPortal,
  onNavigateToLogin,
  onNavigateToDashboard,
  isStaffLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Photo Show Gallery States
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'spaces' | 'outdoor' | 'activities' | 'children'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredGallery = galleryCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === galleryCategory);

  // Autoplay timer for Photo Show
  useEffect(() => {
    if (!isPlaying || lightboxOpen) return;
    if (filteredGallery.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredGallery.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, lightboxOpen, filteredGallery.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const testimonials = [
    {
      quote:
        "Bubbles has given our child the best start in life. The teachers are caring, the environment is beautiful, and we've seen so much growth in just a few months!",
      author: 'Selam M.',
      role: 'Parent of Noah (Toddler Class)',
      photo: '/images/children/child-portrait-girl.jpg',
    },
    {
      quote:
        'The live transparency in the Parent Portal is a dream for working parents. We see meals, nap times, and teacher notes daily. Emma loves coming to school every single morning!',
      author: 'David & Sarah J.',
      role: 'Parents of Emma (KG1 Sunshine)',
      photo: '/images/children/child-apple-picnic.jpg',
    },
  ];

  const [tourForm, setTourForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    childAge: '2 – 3 Years',
    program: 'Little Learners Nursery',
    preferredDate: '',
  });

  // Sticky header scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTourSubmitted(true);
    setTimeout(() => {
      setTourSubmitted(false);
      setTourModalOpen(false);
      setTourForm({
        parentName: '',
        phone: '',
        email: '',
        childName: '',
        childAge: '2 – 3 Years',
        program: 'Little Learners Nursery',
        preferredDate: '',
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFF7EC] text-[#4B4039] font-sans selection:bg-[#BDF3EE] selection:text-[#168F89] overflow-x-hidden">
      {/* =========================================================
          1. TOP FLOATING NAVBAR (Pill shaped, Deep Teal #0B4E49)
      ========================================================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3 ${
          isScrolled
            ? 'bg-[#0B4E49]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
            : 'bg-[#38D3C7] pt-4'
        }`}
      >
        <div className="max-w-[1280px] mx-auto bg-[#0B4E49] text-white rounded-full px-5 sm:px-7 py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(11,78,73,0.3)]">
          {/* Official School Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Bubbles Early Years School Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform hover:scale-105"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-white/90">
            <a href="#hero" className="hover:text-[#FFB58F] transition">
              Home
            </a>
            <a href="#adventure" className="hover:text-[#FFB58F] transition">
              About Us
            </a>
            <a href="#pillars" className="hover:text-[#FFB58F] transition">
              Learning
            </a>
            <a href="#spaces" className="hover:text-[#FFB58F] transition">
              Our Spaces
            </a>
            <a href="#activities" className="hover:text-[#FFB58F] transition">
              Activities
            </a>
            <a href="#gallery" className="hover:text-[#FFB58F] transition">
              Photo Show
            </a>
            <button
              onClick={onNavigateToPortal}
              className="hover:text-[#FFB58F] transition flex items-center gap-1 font-bold"
            >
              Parents
            </button>
            <a href="#footer" className="hover:text-[#FFB58F] transition">
              Contact
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Parent Portal link on mobile/tablet */}
            <button
              onClick={onNavigateToPortal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black transition"
              title="Open Parent Portal (PIN Login)"
            >
              <span>Portal</span>
              <span className="text-xs">📱</span>
            </button>

            {/* Staff / Teacher Login */}
            <button
              onClick={isStaffLoggedIn && onNavigateToDashboard ? onNavigateToDashboard : onNavigateToLogin}
              className="hidden md:inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black transition"
              title="Staff & Educator Access"
            >
              <span>{isStaffLoggedIn ? 'Dashboard' : 'Staff'}</span>
              <span className="text-xs">🔑</span>
            </button>

            {/* Enroll Now Button (Coral Pill) */}
            <button
              onClick={() => setTourModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-[#F47767] hover:bg-[#E85E50] text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_15px_rgba(244,119,103,0.4)] transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Enroll Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. HERO SECTION ("Little Steps. Big Discoveries.")
      ========================================================= */}
      <section id="hero" className="relative bg-[#38D3C7] pt-6 sm:pt-10 pb-20 sm:pb-28 overflow-hidden">
        {/* Playful Floating SVG Doodles & Clusters of Soap Bubbles */}
        <div className="floating-cloud top-8 left-[6%] hidden sm:block pointer-events-none">
          <SvgCloud className="w-24 h-14" />
        </div>
        <div className="floating-cloud top-12 right-[8%] hidden sm:block pointer-events-none">
          <SvgCloud className="w-28 h-16" />
        </div>
        <div className="floating-star top-28 left-[42%] pointer-events-none">
          <SvgStar className="w-9 h-9" color="#FFB58F" />
        </div>
        <div className="floating-pencil bottom-16 left-[4%] hidden lg:block pointer-events-none">
          <SvgPencil className="w-16 h-16 drop-shadow-md" />
        </div>

        {/* --- Top Sky Clusters of Bubbles (from Mockup) --- */}
        {/* Top-Right Sky Bubble Cluster */}
        <div className="absolute top-2 right-6 pointer-events-none">
          <SvgBubble size={78} color="#FFFFFF" className="animate-pulse duration-3000" />
        </div>
        <div className="absolute top-12 right-24 pointer-events-none">
          <SvgBubble size={46} color="#FFFFFF" />
        </div>
        <div className="absolute top-24 right-4 pointer-events-none">
          <SvgBubble size={34} color="#FFFFFF" />
        </div>
        <div className="absolute top-28 right-20 pointer-events-none">
          <SvgBubble size={52} color="#FFFFFF" />
        </div>
        <div className="absolute top-6 right-[30%] pointer-events-none hidden md:block">
          <SvgBubble size={28} color="#FFFFFF" />
        </div>

        {/* Top-Center Bubble Cluster (above headline and center space) */}
        <div className="absolute top-8 left-[46%] pointer-events-none">
          <SvgBubble size={60} color="#FFFFFF" />
        </div>
        <div className="absolute top-18 left-[51%] pointer-events-none">
          <SvgBubble size={38} color="#FFFFFF" />
        </div>
        <div className="absolute top-4 left-[41%] pointer-events-none hidden sm:block">
          <SvgBubble size={28} color="#FFFFFF" />
        </div>
        <div className="absolute top-24 left-[56%] pointer-events-none hidden lg:block">
          <SvgBubble size={44} color="#FFFFFF" />
        </div>

        {/* Left Headline Bubble Cluster */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <SvgBubble size={66} color="#FFFFFF" />
        </div>
        <div className="absolute top-20 left-20 pointer-events-none">
          <SvgBubble size={36} color="#FFFFFF" />
        </div>
        <div className="absolute top-36 left-[34%] pointer-events-none hidden md:block">
          <SvgBubble size={26} color="#FFFFFF" />
        </div>

        {/* Bottom Left Bubble Cluster */}
        <div className="absolute bottom-8 left-6 pointer-events-none">
          <SvgBubble size={72} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-24 left-24 pointer-events-none">
          <SvgBubble size={40} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-4 left-[35%] pointer-events-none hidden sm:block">
          <SvgBubble size={30} color="#FFFFFF" />
        </div>

        {/* Bottom Center-Right Bubbles along the wave */}
        <div className="absolute bottom-4 right-[38%] pointer-events-none hidden sm:block">
          <SvgBubble size={52} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-10 right-[24%] pointer-events-none hidden md:block">
          <SvgBubble size={36} color="#FFFFFF" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Headline */}
            <h1 className="font-['Baloo_2'] text-[clamp(44px,6.2vw,78px)] font-black leading-[1.04] tracking-tight">
              <span className="text-white block">Little Steps.</span>
              <span className="text-[#F47767] block">Big Discoveries.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-[500px] text-white/95 text-base sm:text-lg leading-[1.7] mx-auto lg:mx-0 font-medium">
              A warm, nurturing and inspiring early years school where curious minds grow, friendships blossom and every child finds their unique path.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setTourModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#F47767] hover:bg-[#E85E50] text-white font-black text-sm shadow-[0_8px_25px_rgba(244,119,103,0.35)] transition transform hover:-translate-y-1 active:scale-95"
              >
                <span>Explore Our School</span>
                <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs">
                  ➔
                </span>
              </button>

              <button
                onClick={() => setTourModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#20BDB2] hover:bg-[#1CA89E] border-2 border-white/70 text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(32,189,178,0.3)] transition transform hover:-translate-y-0.5"
              >
                <Calendar size={16} />
                <span>Book a Visit</span>
              </button>
            </div>
          </div>

          {/* Right Visual: Irregular Organic Fluid Pebble Photo Frame with Peach Layer */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6">
            {/* Ambient Background Glow */}
            <div className="absolute w-[480px] h-[480px] rounded-full bg-white/25 blur-3xl pointer-events-none" />

            {/* Irregular Fluid Photo Container */}
            <div className="relative z-10 w-full max-w-[480px] sm:max-w-[520px]">
              {/* Outer Warm Peach / Coral Organic Splash Layer (From Mockup) */}
              <div
                className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-[#FFB58F] via-[#FFAE88] to-[#FF9E73] pointer-events-none z-0 shadow-[0_15px_40px_rgba(244,119,103,0.3)] transform -rotate-1"
                style={{
                  borderRadius: '42% 58% 62% 38% / 54% 42% 58% 46%'
                }}
              />

              {/* Inner Photo Frame with Irregular Organic Fluid Shape */}
              <div
                className="relative z-10 overflow-hidden border-4 sm:border-6 border-white shadow-[0_25px_60px_rgba(11,78,73,0.22)] group"
                style={{
                  borderRadius: '45% 55% 65% 35% / 52% 44% 56% 48%'
                }}
              >
                <img
                  src="/images/children/child-portrait-girl.jpg"
                  alt="Bubbles Early Years Pupils Smiling and Building"
                  className="w-full h-[350px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Botanical Leafy Sprig Doodle in White (From Mockup) */}
              <div className="absolute -bottom-6 -right-6 z-20 pointer-events-none transform rotate-12 hidden sm:block">
                <SvgLeafBranch className="w-18 h-22 text-white" color="#FFFFFF" />
              </div>

              {/* Floating Badge: "💚 Happy Children" (Circular Pill Badge from Mockup) */}
              <div className="absolute -bottom-4 right-2 sm:right-6 bg-white py-2.5 px-5 rounded-[26px] shadow-[0_12px_35px_rgba(11,78,73,0.18)] flex items-center gap-2.5 border-2 border-white z-30 animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-full bg-[#EBF8F2] flex items-center justify-center text-[#83C98B]">
                  <Heart size={16} fill="#83C98B" />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-xs font-bold text-[#5A4D44]">Happy</p>
                  <p className="text-[13px] font-black text-[#0B4E49]">Children</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wavy bottom transition */}
        <div className="wave" />
      </section>

      {/* =========================================================
          3. "EVERY DAY IS AN ADVENTURE" SECTION (Warm Cream + Animated Animals & Emojis)
      ========================================================= */}
      <section id="adventure" className="pt-20 sm:pt-28 pb-0 bg-gradient-to-b from-[#FFF7EC] via-[#FFF7EE] to-[#FFFDF9] relative overflow-hidden">
        {/* Buzzing Bee on Top-Right */}
        <div className="absolute top-8 right-[10%] z-20 pointer-events-none hidden md:block">
          <AnimatedBee className="w-16 h-16" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FFE1D2] shadow-sm animate-emoji-float">
              <span className="text-base">🎈</span>
              <span className="text-xs font-black text-[#F47767] uppercase tracking-wider">A World of Wonder</span>
              <span className="text-base">✨</span>
            </div>

            <h2 className="font-['Baloo_2'] text-[clamp(36px,4.8vw,58px)] font-black leading-[1.08] tracking-tight">
              <span className="text-[#0B4E49] block">Every Day is an</span>
              <span className="text-[#F47767] block">Adventure</span>
            </h2>

            <p className="text-[#746860] text-base leading-[1.8] font-normal">
              At Bubbles Early Years School, we create a safe and stimulating environment where children learn through play, build friendships and develop the skills they need for a bright future.
            </p>

            <div>
              <button
                onClick={() => setTourModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#F47767] hover:bg-[#E85E50] text-white font-black text-sm shadow-[0_8px_20px_rgba(244,119,103,0.3)] transition transform hover:-translate-y-1"
              >
                <span>Discover More</span>
                <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs">
                  ➔
                </span>
              </button>
            </div>
          </div>

          {/* Right Pebble 3-Photo Collage with Animated Animals & Badges */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[440px]">
            {/* Peach Circle Background Accent from Mockup */}
            <div className="absolute w-[90px] h-[90px] rounded-full bg-[#FFB58F] top-1/4 -left-3 z-0 shadow-md" />
            <div className="absolute -bottom-4 right-12 z-0">
              <SvgRainbow className="w-28 h-18" />
            </div>

            {/* Botanical Leaf Branch Accent */}
            <div className="absolute -bottom-6 left-6 z-30 pointer-events-none">
              <SvgLeafBranch className="w-16 h-20 text-[#83C98B]" color="#83C98B" />
            </div>

            {/* Star Doodle */}
            <div className="absolute -top-4 right-1/3 z-30 pointer-events-none">
              <SvgStar className="w-9 h-9" color="#42D3C9" />
            </div>

            {/* Peeking Cute Bunny on top-left of photo */}
            <div className="absolute -top-10 -left-4 z-30 pointer-events-none hidden sm:block">
              <AnimatedCuteBunny className="w-14 h-14 filter drop-shadow-md" />
            </div>

            {/* Fluttering Butterfly on bottom-right */}
            <div className="absolute -bottom-6 -right-6 z-30 pointer-events-none hidden sm:block">
              <AnimatedButterfly className="w-14 h-14" color="#21B8AF" wingColor="#BDF3EE" />
            </div>

            {/* Floating Emoji Badges */}
            <div className="absolute -top-3 right-1/4 z-30 bg-white/95 px-3 py-1.5 rounded-full shadow-md border border-[#F47767]/30 flex items-center gap-1.5 animate-emoji-float" style={{ animationDelay: '0.8s' }}>
              <span className="text-sm">🎨</span>
              <span className="text-xs font-black text-[#5A3F33]">Creative Sparks</span>
            </div>
            <div className="absolute -bottom-4 left-6 z-30 bg-white/95 px-3 py-1.5 rounded-full shadow-md border border-[#83C98B]/40 flex items-center gap-1.5 animate-emoji-float" style={{ animationDelay: '1.6s' }}>
              <span className="text-sm">🌱</span>
              <span className="text-xs font-black text-[#0B4E49]">Sensory Discovery</span>
            </div>

            {/* Main Center Pebble: Girl with Banana Art Worksheet */}
            <img
              src="/images/children/child-art-worksheet.jpg"
              alt="Bubbles Pupil Displaying Art Worksheet"
              className="w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] object-cover rounded-[55px] rounded-tl-[110px] rounded-br-[110px] border-4 border-white shadow-[0_18px_45px_rgba(11,78,73,0.15)] relative z-10"
            />

            {/* Top Right Pebble: Sensory Play with Dough */}
            <img
              src="/images/children/child-sensory-dough.jpg"
              alt="Toddler Sensory Play at Bubbles"
              className="w-[170px] sm:w-[210px] h-[140px] sm:h-[160px] object-cover rounded-[38px] rounded-tr-[75px] border-4 border-white shadow-[0_10px_25px_rgba(11,78,73,0.12)] absolute -top-4 right-0 sm:right-6 z-20"
            />

            {/* Bottom Right Pebble: Happy Children on Play Mat */}
            <img
              src="/images/children/children-playmat.jpg"
              alt="Happy Children Playing on Soft Mat"
              className="w-[170px] sm:w-[200px] h-[150px] sm:h-[170px] object-cover rounded-[42px] rounded-br-[80px] border-4 border-white shadow-[0_10px_25px_rgba(11,78,73,0.12)] absolute -bottom-6 right-4 sm:right-10 z-20"
            />

            {/* Little Floating Bubbles */}
            <div className="absolute top-24 right-2 z-30">
              <SvgBubble size={48} color="#42D3C9" />
            </div>
            <div className="absolute -bottom-8 left-20 z-30">
              <SvgBubble size={36} color="#F47767" />
            </div>
          </div>
        </div>

        {/* Irregular Fluid Wave Divider: Flowing smoothly into Blue Age Path */}
        <div className="w-full overflow-hidden leading-none pt-12">
          <svg className="w-full h-14 sm:h-20 text-[#38D3C7] block" viewBox="0 0 1440 90" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,45 C280,95 480,10 720,50 C960,90 1180,15 1440,55 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* =========================================================
          5. "OUR AGE PATH — Growing Together" SECTION (Turquoise background)
      ========================================================= */}
      <section id="age-path" className="py-24 bg-[#38D3C7] text-white relative overflow-hidden">
        {/* Floating Paper Plane & Looped Flight Trail */}
        <div className="floating-plane top-8 right-[12%] pointer-events-none">
          <SvgPaperPlane className="w-18 h-18" />
        </div>

        {/* --- Soap Bubble Clusters across this Blue/Turquoise Section --- */}
        {/* Top-Left Cluster */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <SvgBubble size={72} color="#FFFFFF" />
        </div>
        <div className="absolute top-18 left-24 pointer-events-none">
          <SvgBubble size={38} color="#FFFFFF" />
        </div>
        <div className="absolute top-4 left-[34%] pointer-events-none hidden sm:block">
          <SvgBubble size={26} color="#FFFFFF" />
        </div>

        {/* Top-Right Cluster (around plane trail) */}
        <div className="absolute top-4 right-8 pointer-events-none">
          <SvgBubble size={76} color="#FFFFFF" />
        </div>
        <div className="absolute top-16 right-28 pointer-events-none">
          <SvgBubble size={44} color="#FFFFFF" />
        </div>
        <div className="absolute top-28 right-6 pointer-events-none">
          <SvgBubble size={32} color="#FFFFFF" />
        </div>
        <div className="absolute top-10 right-[32%] pointer-events-none hidden md:block">
          <SvgBubble size={24} color="#FFFFFF" />
        </div>

        {/* Center Sky Bubbles */}
        <div className="absolute top-14 left-[44%] pointer-events-none hidden sm:block">
          <SvgBubble size={48} color="#FFFFFF" />
        </div>
        <div className="absolute top-24 left-[52%] pointer-events-none hidden md:block">
          <SvgBubble size={30} color="#FFFFFF" />
        </div>

        {/* Bottom-Left Cluster */}
        <div className="absolute bottom-8 left-8 pointer-events-none">
          <SvgBubble size={64} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-20 left-28 pointer-events-none">
          <SvgBubble size={36} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-6 left-[38%] pointer-events-none hidden sm:block">
          <SvgBubble size={28} color="#FFFFFF" />
        </div>

        {/* Bottom-Right Cluster */}
        <div className="absolute bottom-6 right-8 pointer-events-none">
          <SvgBubble size={72} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-18 right-24 pointer-events-none">
          <SvgBubble size={42} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-8 right-[36%] pointer-events-none hidden sm:block">
          <SvgBubble size={30} color="#FFFFFF" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-[650px] mx-auto mb-16 space-y-2">
            <h2 className="font-['Baloo_2'] text-[clamp(36px,5vw,58px)] font-black leading-none">
              <span className="text-[#0B4E49]">Growing </span>
              <span className="text-[#F47767]">Together</span>
            </h2>
            <p className="text-white/95 text-sm sm:text-base font-medium">
              A smooth and joyful journey from 1 to 6 years.
            </p>
          </div>

          {/* 5 Connected Pebble Age Cards with Organic River-Stone Shapes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative">
            {/* Connecting Looped Flight Trail from Mockup */}
            <div className="hidden lg:block absolute top-[40px] left-0 right-0 w-full z-0 pointer-events-none">
              <SvgLoopFlightTrail />
            </div>

            {/* Floating Heart Doodle in Sky */}
            <div className="absolute -top-10 left-[48%] pointer-events-none hidden sm:block">
              <SvgHeartDoodle className="w-8 h-8 text-white opacity-85" color="#FFFFFF" />
            </div>

            {/* Age 1: 1–2 Toddlers (Vertical Egg / Pebble Arch) */}
            <div className="bg-white rounded-[46px] rounded-t-[78px] rounded-b-[44px] p-6 text-center shadow-[0_14px_35px_rgba(11,78,73,0.14)] relative z-10 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(11,78,73,0.2)] border border-white">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FFE1D2] flex items-center justify-center text-[#F47767] mb-4 shadow-sm">
                <Baby size={28} />
              </div>
              <p className="font-['Baloo_2'] font-extrabold text-2xl text-[#0B4E49] leading-none mb-1">
                1–2
              </p>
              <h4 className="font-bold text-[15px] text-[#0B4E49] mb-1.5">Toddlers</h4>
              <p className="text-[13px] text-[#423832] font-semibold leading-snug">
                Build trust &amp; explore the world
              </p>
            </div>

            {/* Age 2: 2–3 Little Learners (Smooth Tilted Pebble) */}
            <div className="bg-white rounded-[46px] rounded-tr-[78px] rounded-bl-[78px] p-6 text-center shadow-[0_14px_35px_rgba(11,78,73,0.14)] relative z-10 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(11,78,73,0.2)] border border-white">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF8F2] flex items-center justify-center text-[#83C98B] mb-4 shadow-sm">
                <Sprout size={28} />
              </div>
              <p className="font-['Baloo_2'] font-extrabold text-2xl text-[#0B4E49] leading-none mb-1">
                2–3
              </p>
              <h4 className="font-bold text-[15px] text-[#0B4E49] mb-1.5">Little Learners</h4>
              <p className="text-[13px] text-[#423832] font-semibold leading-snug">
                Develop independence &amp; confidence
              </p>
            </div>

            {/* Age 3: 3–4 Growing Minds (Central Organic Pebble) */}
            <div className="bg-white rounded-[46px] rounded-tl-[78px] rounded-br-[78px] p-6 text-center shadow-[0_14px_35px_rgba(11,78,73,0.14)] relative z-10 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(11,78,73,0.2)] border border-white">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#BDF3EE] flex items-center justify-center text-[#168F89] mb-4 shadow-sm">
                <Sparkles size={28} />
              </div>
              <p className="font-['Baloo_2'] font-extrabold text-2xl text-[#0B4E49] leading-none mb-1">
                3–4
              </p>
              <h4 className="font-bold text-[15px] text-[#0B4E49] mb-1.5">Growing Minds</h4>
              <p className="text-[13px] text-[#423832] font-semibold leading-snug">
                Expand curiosity &amp; creativity
              </p>
            </div>

            {/* Age 4: 4–5 Big Thinkers (Teardrop Pebble) */}
            <div className="bg-white rounded-[46px] rounded-b-[78px] rounded-t-[44px] p-6 text-center shadow-[0_14px_35px_rgba(11,78,73,0.14)] relative z-10 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(11,78,73,0.2)] border border-white">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FFE1D2] flex items-center justify-center text-[#F47767] mb-4 shadow-sm">
                <Heart size={28} />
              </div>
              <p className="font-['Baloo_2'] font-extrabold text-2xl text-[#0B4E49] leading-none mb-1">
                4–5
              </p>
              <h4 className="font-bold text-[15px] text-[#0B4E49] mb-1.5">Big Thinkers</h4>
              <p className="text-[13px] text-[#423832] font-semibold leading-snug">
                Build social skills &amp; problem solving
              </p>
            </div>

            {/* Age 5: 5–6 Future Ready (Smooth Pebble Dome) */}
            <div className="bg-white rounded-[46px] rounded-tr-[78px] rounded-bl-[78px] p-6 text-center shadow-[0_14px_35px_rgba(11,78,73,0.14)] relative z-10 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(11,78,73,0.2)] border border-white">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E6DDF7] flex items-center justify-center text-[#9C82D8] mb-4 shadow-sm">
                <GraduationCap size={28} />
              </div>
              <p className="font-['Baloo_2'] font-extrabold text-2xl text-[#0B4E49] leading-none mb-1">
                5–6
              </p>
              <h4 className="font-bold text-[15px] text-[#0B4E49] mb-1.5">Future Ready</h4>
              <p className="text-[13px] text-[#423832] font-semibold leading-snug">
                Prepare for school &amp; beyond
              </p>
            </div>
          </div>
        </div>

        {/* Irregular Fluid Wave transition to Spaces */}
        <div className="w-full overflow-hidden leading-none mt-16 -mb-24">
          <svg className="w-full h-14 sm:h-20 text-[#FFFDF9] block" viewBox="0 0 1440 90" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,40 C320,-5 540,85 760,35 C980,-15 1200,75 1440,30 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* =========================================================
          6. "OUR SPACES & CAMPUS — Designed for Little Explorers" (Warm Sunlit Pastel + Animals & Emojis)
      ========================================================= */}
      <section id="spaces" className="py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FFF5EA] to-[#FFF0E2] relative overflow-hidden">
        {/* Ambient Warm Pastel Background Glows */}
        <div className="absolute top-10 left-[-5%] w-[420px] h-[420px] rounded-full bg-[#FFE4D6]/45 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-[-5%] w-[450px] h-[450px] rounded-full bg-[#D8F6E8]/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[15%] w-[400px] h-[400px] rounded-full bg-[#FEF3C7]/40 blur-3xl pointer-events-none" />

        {/* Peeking Cute Giraffe on Top-Right */}
        <div className="absolute top-10 right-[6%] z-20 pointer-events-none hidden md:block">
          <AnimatedCuteGiraffe className="w-20 h-24 filter drop-shadow-md" />
        </div>

        {/* Fluttering Butterfly on Top-Left */}
        <div className="absolute top-12 left-[5%] z-20 pointer-events-none hidden sm:block">
          <AnimatedButterfly className="w-14 h-14" color="#F47767" wingColor="#FFE1D2" />
        </div>

        {/* Buzzing Bee on Left Side */}
        <div className="absolute top-1/2 left-[2%] z-20 pointer-events-none hidden xl:block">
          <AnimatedBee className="w-14 h-14" />
        </div>

        {/* Floating Drifting Balloon on Right Side */}
        <div className="absolute bottom-24 right-[3%] z-20 pointer-events-none hidden xl:block">
          <AnimatedFloatingBalloon className="w-11 h-16" color="#F47767" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-[720px] mx-auto mb-14 space-y-3">
            <h2 className="font-['Baloo_2'] text-[clamp(34px,4.5vw,56px)] font-black text-[#0B4E49] leading-tight">
              Designed For Little Explorers
            </h2>
            <p className="text-[#746860] text-sm sm:text-base leading-relaxed">
              Every corner of Bubbles is child-scaled, safe, and thoughtfully created to stimulate imagination, sensory growth, and peaceful rest.
            </p>

            {/* Playful Floating Emoji Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-[#FFE1D2] text-[#5A3F33] text-xs font-black shadow-xs animate-emoji-float">
                <span>☀️</span> Sunlit Classrooms
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-[#C5F3DB] text-[#0B4E49] text-xs font-black shadow-xs animate-emoji-float" style={{ animationDelay: '0.8s' }}>
                <span>🌿</span> Natural Grass Playground
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-[#E6DDF7] text-[#6B46C1] text-xs font-black shadow-xs animate-emoji-float" style={{ animationDelay: '1.4s' }}>
                <span>🧸</span> Cozy Nap Haven
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-[#FFE1D2] text-[#C05621] text-xs font-black shadow-xs animate-emoji-float" style={{ animationDelay: '2s' }}>
                <span>🍎</span> Fresh Wholesome Kitchen
              </span>
            </div>
          </div>

          {/* 6 Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* Space 1: Main Sunny Classroom */}
            <div className="group bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(11,78,73,0.08)] border-2 border-white hover:border-[#FFB58F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(11,78,73,0.14)] flex flex-col">
              <div className="h-[220px] rounded-[24px] overflow-hidden mb-4 relative">
                <img
                  src="/images/school/main-classroom-wide.jpg"
                  alt="Bright and Sunny Early Years Classroom"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-[#0B4E49]/85 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Classrooms
                </span>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] mb-1.5">
                    Sunny Learning Studios
                  </h4>
                  <p className="text-[13.5px] sm:text-sm text-[#423832] leading-relaxed font-medium">
                    Filled with natural light, child-height tables, tree wall mural, and dedicated discovery stations for counting, letters, and science.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5E9D8] flex items-center justify-between text-xs font-bold text-[#21B8AF]">
                  <span>Ages 1–6</span>
                  <span>Interactive &amp; Child-Centred</span>
                </div>
              </div>
            </div>

            {/* Space 2: Cozy Dream & Nap Room */}
            <div className="group bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(11,78,73,0.08)] border-2 border-white hover:border-[#FFB58F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(11,78,73,0.14)] flex flex-col">
              <div className="h-[220px] rounded-[24px] overflow-hidden mb-4 relative">
                <img
                  src="/images/school/nap-room-beds.jpg"
                  alt="Peaceful Nap Room with Beds"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-[#9C82D8]/85 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Rest Haven
                </span>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] mb-1.5">
                    Cozy Dream &amp; Nap Haven
                  </h4>
                  <p className="text-[13.5px] sm:text-sm text-[#423832] leading-relaxed font-medium">
                    Padded soft floors, individual comfortable cots, plush teddy bears, and gentle warm cove lighting for quiet, restorative midday rest.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5E9D8] flex items-center justify-between text-xs font-bold text-[#9C82D8]">
                  <span>Rest &amp; Rejuvenation</span>
                  <span>Calm Environment</span>
                </div>
              </div>
            </div>

            {/* Space 3: Safe Grass Playground */}
            <div className="group bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(11,78,73,0.08)] border-2 border-white hover:border-[#FFB58F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(11,78,73,0.14)] flex flex-col">
              <div className="h-[220px] rounded-[24px] overflow-hidden mb-4 relative">
                <img
                  src="/images/school/playground-mushroom.jpg"
                  alt="Outdoor Grass Playground with Mushroom Playhouse"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-[#83C98B]/90 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Outdoor Adventure
                </span>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] mb-1.5">
                    Lush Grass Playground
                  </h4>
                  <p className="text-[13.5px] sm:text-sm text-[#423832] leading-relaxed font-medium">
                    Spacious natural green lawn, geodesic climbing dome, caterpillar crawl tunnel, gentle slides, swings, and rainbow safety fences.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5E9D8] flex items-center justify-between text-xs font-bold text-[#83C98B]">
                  <span>Gross Motor Skills</span>
                  <span>Fresh Air Every Day</span>
                </div>
              </div>
            </div>

            {/* Space 4: Art & Creative Easel Studio */}
            <div className="group bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(11,78,73,0.08)] border-2 border-white hover:border-[#FFB58F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(11,78,73,0.14)] flex flex-col">
              <div className="h-[220px] rounded-[24px] overflow-hidden mb-4 relative">
                <img
                  src="/images/school/art-craft-room.jpg"
                  alt="Art and Craft Room with Child Chairs and Easels"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-[#F47767]/90 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Creativity
                </span>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] mb-1.5">
                    Art &amp; Paint Atelier
                  </h4>
                  <p className="text-[13.5px] sm:text-sm text-[#423832] leading-relaxed font-medium">
                    Wooden standing easels, washable finger paints, heart-back chairs, and splash walls where children freely express their creative spirit.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5E9D8] flex items-center justify-between text-xs font-bold text-[#F47767]">
                  <span>Self-Expression</span>
                  <span>Sensory Exploration</span>
                </div>
              </div>
            </div>

            {/* Space 5: Shaded Garden Patio & Trike Track */}
            <div className="group bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(11,78,73,0.08)] border-2 border-white hover:border-[#FFB58F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(11,78,73,0.14)] flex flex-col">
              <div className="h-[220px] rounded-[24px] overflow-hidden mb-4 relative">
                <img
                  src="/images/school/garden-patio.jpg"
                  alt="Garden Patio with Trikes and Palm Tree"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-[#0B4E49]/85 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Patio &amp; Trikes
                </span>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] mb-1.5">
                    Garden Walkway &amp; Trike Lane
                  </h4>
                  <p className="text-[13.5px] sm:text-sm text-[#423832] leading-relaxed font-medium">
                    Smooth rubberized pathways, flowerbeds, towering palm trees, and mini tricycles parked ready for outdoor riding and coordination games.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5E9D8] flex items-center justify-between text-xs font-bold text-[#21B8AF]">
                  <span>Balance &amp; Steering</span>
                  <span>Safe Paved Track</span>
                </div>
              </div>
            </div>

            {/* Space 6: Wholesome Kids Kitchen */}
            <div className="group bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(11,78,73,0.08)] border-2 border-white hover:border-[#FFB58F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(11,78,73,0.14)] flex flex-col">
              <div className="h-[220px] rounded-[24px] overflow-hidden mb-4 relative">
                <img
                  src="/images/school/kids-kitchen.jpg"
                  alt="Clean Children's Kitchen Seasoned with Love"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-[#F47767]/90 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  Nutrition &amp; Dining
                </span>
              </div>
              <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] mb-1.5">
                    Nutrition &amp; Dining Station
                  </h4>
                  <p className="text-[13.5px] sm:text-sm text-[#423832] leading-relaxed font-medium">
                    Pristine culinary kitchen "Seasoned with Love", preparing fresh daily fruit snacks, wholesome warm lunches, and clean hydration.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5E9D8] flex items-center justify-between text-xs font-bold text-[#F47767]">
                  <span>Healthy Habits</span>
                  <span>100% Hygienic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Irregular Fluid Wave transition to Blue Activities Section */}
        <div className="w-full overflow-hidden leading-none pt-12 -mb-24">
          <svg className="w-full h-14 sm:h-20 text-[#38D3C7] block" viewBox="0 0 1440 90" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,45 C280,95 480,10 720,50 C960,90 1180,15 1440,55 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* =========================================================
          7. "OUR ACTIVITIES — Play • Discover • Create" SECTION (BLUE BACKGROUND)
      ========================================================= */}
      <section id="activities" className="py-24 bg-[#38D3C7] text-white relative overflow-hidden">
        {/* Floating Paper Plane */}
        <div className="floating-plane top-6 right-[14%] pointer-events-none opacity-85">
          <SvgPaperPlane className="w-16 h-16" />
        </div>

        {/* Soap Bubble Clusters across Blue Activities Section */}
        <div className="absolute top-6 left-8 pointer-events-none">
          <SvgBubble size={74} color="#FFFFFF" />
        </div>
        <div className="absolute top-20 left-28 pointer-events-none">
          <SvgBubble size={38} color="#FFFFFF" />
        </div>
        <div className="absolute top-10 right-10 pointer-events-none">
          <SvgBubble size={80} color="#FFFFFF" />
        </div>
        <div className="absolute top-24 right-32 pointer-events-none hidden sm:block">
          <SvgBubble size={42} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-10 left-12 pointer-events-none">
          <SvgBubble size={64} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-8 right-14 pointer-events-none">
          <SvgBubble size={70} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-20 right-32 pointer-events-none hidden sm:block">
          <SvgBubble size={36} color="#FFFFFF" />
        </div>

        {/* Twinkling Sunshine Stars */}
        <div className="absolute top-10 left-[24%] pointer-events-none hidden md:block">
          <SvgStar className="w-9 h-9 text-[#FFE779]" />
        </div>
        <div className="absolute top-14 right-[24%] pointer-events-none hidden md:block">
          <SvgStar className="w-10 h-10 text-[#FFE779]" />
        </div>
        <div className="absolute bottom-14 left-[40%] pointer-events-none hidden md:block">
          <SvgStar className="w-8 h-8 text-white opacity-80" />
        </div>

        {/* Animated Floating Balloon & Butterfly in Blue Section */}
        <div className="absolute top-12 left-[6%] z-20 pointer-events-none hidden lg:block">
          <AnimatedFloatingBalloon className="w-11 h-16" color="#FFE779" />
        </div>
        <div className="absolute top-12 right-[6%] z-20 pointer-events-none hidden lg:block">
          <AnimatedButterfly className="w-14 h-14" color="#FFFFFF" wingColor="#BDF3EE" />
        </div>

        {/* Peeking Cute Bunny at bottom-left */}
        <div className="absolute -bottom-2 left-[5%] z-20 pointer-events-none hidden md:block">
          <AnimatedCuteBunny className="w-14 h-14 filter drop-shadow-md" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-[720px] mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-[#0B4E49] text-xs font-black uppercase tracking-wider shadow-sm mb-1">
              <span className="text-[#F47767]">✨</span>
              <span>OUR ACTIVITIES</span>
              <span className="text-[#F47767]">✨</span>
            </div>

            <h2 className="font-['Baloo_2'] text-[clamp(36px,5vw,60px)] font-black text-white leading-tight">
              <span>Play</span> <span className="text-[#FFE779]">•</span> <span className="text-[#FFE779]">Discover</span> <span className="text-[#FFE779]">•</span> <span>Create</span>
            </h2>

            <p className="text-white/95 text-sm sm:text-base font-medium max-w-[640px] mx-auto">
              From outdoor adventures to creative expression, our activities help children explore their interests and build new skills with wonder.
            </p>
          </div>

          {/* 5 Activity Cards with Arch Photos & Overlapping Circular Icon Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
            {/* Act 1: Outdoor Play */}
            <div className="group bg-white rounded-[32px] p-3.5 shadow-[0_16px_45px_rgba(11,78,73,0.2)] hover:shadow-[0_24px_55px_rgba(11,78,73,0.3)] border-2 border-white hover:border-[#FFE1D2] transition-all duration-300 hover:-translate-y-2.5 flex flex-col justify-between">
              <div>
                <div className="relative mb-2">
                  <div className="h-[175px] rounded-t-[26px] rounded-b-[16px] overflow-hidden">
                    <img
                      src="/images/school/playground-grass.jpg"
                      alt="Outdoor Grass Playground with Climbing Dome"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </div>
                  {/* Circular Floating Badge overlapping bottom of photo */}
                  <div className="absolute -bottom-3.5 left-3 w-9 h-9 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-white z-10">
                    <div className="w-7 h-7 rounded-full bg-[#83C98B] flex items-center justify-center text-white shadow-xs">
                      <Trees size={14} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 px-1.5 pb-1">
                  <h4 className="font-['Baloo_2'] text-[17px] font-bold text-[#0B4E49] mb-1 group-hover:text-[#F47767] transition-colors">
                    Outdoor Play
                  </h4>
                  <p className="text-[13px] text-[#423832] leading-snug font-medium">
                    Fresh air, movement and fun
                  </p>
                </div>
              </div>
            </div>

            {/* Act 2: Reading */}
            <div className="group bg-white rounded-[32px] p-3.5 shadow-[0_16px_45px_rgba(11,78,73,0.2)] hover:shadow-[0_24px_55px_rgba(11,78,73,0.3)] border-2 border-white hover:border-[#FFE1D2] transition-all duration-300 hover:-translate-y-2.5 flex flex-col justify-between">
              <div>
                <div className="relative mb-2">
                  <div className="h-[175px] rounded-t-[26px] rounded-b-[16px] overflow-hidden">
                    <img
                      src="/images/school/reading-nook-books.jpg"
                      alt="Reading Library and Storybooks"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </div>
                  {/* Circular Floating Badge overlapping bottom of photo */}
                  <div className="absolute -bottom-3.5 left-3 w-9 h-9 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-white z-10">
                    <div className="w-7 h-7 rounded-full bg-[#F47767] flex items-center justify-center text-white shadow-xs">
                      <BookOpen size={14} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 px-1.5 pb-1">
                  <h4 className="font-['Baloo_2'] text-[17px] font-bold text-[#0B4E49] mb-1 group-hover:text-[#F47767] transition-colors">
                    Reading
                  </h4>
                  <p className="text-[13px] text-[#423832] leading-snug font-medium">
                    Big imaginations start with books
                  </p>
                </div>
              </div>
            </div>

            {/* Act 3: Art & Craft */}
            <div className="group bg-white rounded-[32px] p-3.5 shadow-[0_16px_45px_rgba(11,78,73,0.2)] hover:shadow-[0_24px_55px_rgba(11,78,73,0.3)] border-2 border-white hover:border-[#FFE1D2] transition-all duration-300 hover:-translate-y-2.5 flex flex-col justify-between">
              <div>
                <div className="relative mb-2">
                  <div className="h-[175px] rounded-t-[26px] rounded-b-[16px] overflow-hidden">
                    <img
                      src="/images/school/art-craft-easels.jpg"
                      alt="Art Easels and Creative Studio"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </div>
                  {/* Circular Floating Badge overlapping bottom of photo */}
                  <div className="absolute -bottom-3.5 left-3 w-9 h-9 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-white z-10">
                    <div className="w-7 h-7 rounded-full bg-[#21B8AF] flex items-center justify-center text-white shadow-xs">
                      <Palette size={14} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 px-1.5 pb-1">
                  <h4 className="font-['Baloo_2'] text-[17px] font-bold text-[#0B4E49] mb-1 group-hover:text-[#F47767] transition-colors">
                    Art &amp; Craft
                  </h4>
                  <p className="text-[13px] text-[#423832] leading-snug font-medium">
                    Create, express, be yourself
                  </p>
                </div>
              </div>
            </div>

            {/* Act 4: Music */}
            <div className="group bg-white rounded-[32px] p-3.5 shadow-[0_16px_45px_rgba(11,78,73,0.2)] hover:shadow-[0_24px_55px_rgba(11,78,73,0.3)] border-2 border-white hover:border-[#FFE1D2] transition-all duration-300 hover:-translate-y-2.5 flex flex-col justify-between">
              <div>
                <div className="relative mb-2">
                  <div className="h-[175px] rounded-t-[26px] rounded-b-[16px] overflow-hidden">
                    <img
                      src="/images/children/child-traditional-music.jpg"
                      alt="Music & Rhythm Exploration"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </div>
                  {/* Circular Floating Badge overlapping bottom of photo */}
                  <div className="absolute -bottom-3.5 left-3 w-9 h-9 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-white z-10">
                    <div className="w-7 h-7 rounded-full bg-[#F47767] flex items-center justify-center text-white shadow-xs">
                      <Music size={14} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 px-1.5 pb-1">
                  <h4 className="font-['Baloo_2'] text-[17px] font-bold text-[#0B4E49] mb-1 group-hover:text-[#F47767] transition-colors">
                    Music
                  </h4>
                  <p className="text-[13px] text-[#423832] leading-snug font-medium">
                    Find your rhythm and voice
                  </p>
                </div>
              </div>
            </div>

            {/* Act 5: Nature Play */}
            <div className="group bg-white rounded-[32px] p-3.5 shadow-[0_16px_45px_rgba(11,78,73,0.2)] hover:shadow-[0_24px_55px_rgba(11,78,73,0.3)] border-2 border-white hover:border-[#FFE1D2] transition-all duration-300 hover:-translate-y-2.5 flex flex-col justify-between">
              <div>
                <div className="relative mb-2">
                  <div className="h-[175px] rounded-t-[26px] rounded-b-[16px] overflow-hidden">
                    <img
                      src="/images/school/gardening-patch.jpg"
                      alt="Nature Play and Garden Patch"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </div>
                  {/* Circular Floating Badge overlapping bottom of photo */}
                  <div className="absolute -bottom-3.5 left-3 w-9 h-9 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-white z-10">
                    <div className="w-7 h-7 rounded-full bg-[#83C98B] flex items-center justify-center text-white shadow-xs">
                      <Sprout size={14} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 px-1.5 pb-1">
                  <h4 className="font-['Baloo_2'] text-[17px] font-bold text-[#0B4E49] mb-1 group-hover:text-[#F47767] transition-colors">
                    Nature Play
                  </h4>
                  <p className="text-[13px] text-[#423832] leading-snug font-medium">
                    Real-world learning beyond
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botanical Leafy Branch Doodle on Right Side */}
          <div className="absolute top-10 right-4 lg:right-12 pointer-events-none opacity-40 z-0">
            <SvgLeafBranch className="w-20 h-28 text-white" color="#FFFFFF" />
          </div>
        </div>

        {/* Irregular Fluid Wave transition to Gallery (Warm Peach/Cream) */}
        <div className="w-full overflow-hidden leading-none mt-16 -mb-24">
          <svg className="w-full h-14 sm:h-20 text-[#FFF1E8] block" viewBox="0 0 1440 90" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,40 C320,-5 540,85 760,35 C980,-15 1200,75 1440,30 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* =========================================================
          8. LIFE AT BUBBLES — INTERACTIVE PHOTO & MOMENTS SHOW
      ========================================================= */}
      <section id="gallery" className="py-24 bg-gradient-to-b from-[#FFF1E8] via-[#FFF8F2] to-[#FFF1E8] relative overflow-hidden">
        {/* Playful background decoration */}
        <div className="absolute top-10 left-[6%] pointer-events-none opacity-25">
          <SvgStar className="w-14 h-14 text-[#F47767]" />
        </div>
        <div className="absolute bottom-12 right-[6%] pointer-events-none opacity-30">
          <SvgBubble size={90} color="#38D3C7" />
        </div>

        {/* Playful Animated Peeking Bunny and Butterfly in Gallery */}
        <div className="absolute top-8 right-[8%] z-20 pointer-events-none hidden md:block">
          <AnimatedCuteBunny className="w-16 h-16 filter drop-shadow-md" />
        </div>
        <div className="absolute top-14 left-[5%] z-20 pointer-events-none hidden sm:block">
          <AnimatedButterfly className="w-14 h-14" color="#F47767" wingColor="#FFE1D2" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-[760px] mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FFE1D2] shadow-sm mb-1 animate-emoji-float">
              <span className="text-base">📸</span>
              <span className="text-xs font-black text-[#F47767] uppercase tracking-wider">Joyful Everyday Moments</span>
              <span className="text-base">💛</span>
            </div>

            <h2 className="font-['Baloo_2'] text-[clamp(34px,4.5vw,56px)] font-black text-[#0B4E49] leading-tight">
              Moments of Wonder &amp; Discovery
            </h2>
            <p className="text-[#746860] text-sm sm:text-base leading-relaxed">
              Step inside our little world! Browse real snapshots of our pupils exploring, creating art, enjoying fresh fruit, and resting every single day.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              {[
                { key: 'all', label: '🌈 All Moments' },
                { key: 'spaces', label: '🏫 Campus & Spaces' },
                { key: 'outdoor', label: '🎈 Playground & Outdoor' },
                { key: 'activities', label: '🎨 Art, Music & Sensory' },
                { key: 'children', label: '🍎 Little Explorers' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setGalleryCategory(tab.key as any);
                    setCurrentSlide(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                    galleryCategory === tab.key
                      ? 'bg-[#0B4E49] text-white shadow-md scale-105'
                      : 'bg-white hover:bg-[#FFF7EC] text-[#746860] border border-[#F5E9D8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Photo Show Stage */}
          <div className="bg-white rounded-[36px] p-5 sm:p-8 shadow-[0_20px_60px_rgba(11,78,73,0.12)] border-4 border-white relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Viewport Stage */}
              <div className="lg:col-span-8 relative group">
                <div className="relative h-[340px] sm:h-[460px] w-full rounded-[28px] overflow-hidden bg-stone-900 shadow-inner">
                  <img
                    src={filteredGallery[currentSlide]?.src}
                    alt={filteredGallery[currentSlide]?.title}
                    className="w-full h-full object-cover transition-all duration-700"
                  />

                  {/* Gradient Overlay for Title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 sm:p-8 text-white">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#21B8AF] text-white text-[11px] font-black tracking-wide mb-2 uppercase">
                      {filteredGallery[currentSlide]?.categoryLabel}
                    </span>
                    <h3 className="font-['Baloo_2'] text-xl sm:text-2xl font-black text-white mb-1">
                      {filteredGallery[currentSlide]?.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 line-clamp-2 max-w-xl">
                      {filteredGallery[currentSlide]?.desc}
                    </p>
                  </div>

                  {/* Top Bar on Image: Slide counter & Fullscreen trigger */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-extrabold border border-white/20">
                      {currentSlide + 1} / {filteredGallery.length}
                    </span>
                    <button
                      onClick={() => {
                        const globalIdx = galleryPhotos.findIndex(
                          (p) => p.id === filteredGallery[currentSlide]?.id
                        );
                        setLightboxIndex(globalIdx !== -1 ? globalIdx : 0);
                        setLightboxOpen(true);
                      }}
                      className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md hover:bg-[#F47767] text-white flex items-center justify-center transition border border-white/20 shadow-md"
                      title="Open Fullscreen Lightbox Show"
                    >
                      <Maximize2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Left & Right Slide Controls */}
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === 0 ? filteredGallery.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-[#21B8AF] text-[#0B4E49] hover:text-white flex items-center justify-center shadow-lg transition transform hover:scale-110"
                  title="Previous Photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % filteredGallery.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-[#21B8AF] text-[#0B4E49] hover:text-white flex items-center justify-center shadow-lg transition transform hover:scale-110"
                  title="Next Photo"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Right Details & Show Controls */}
              <div className="lg:col-span-4 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#21B8AF] uppercase tracking-wider">
                      FEATURED MOMENT
                    </span>
                    {/* Autoplay Toggle Button */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition ${
                        isPlaying
                          ? 'bg-[#EBF8F2] text-[#168F89] border border-[#83C98B]'
                          : 'bg-[#FFF1E8] text-[#F47767] border border-[#FFE1D2]'
                      }`}
                    >
                      {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      <span>{isPlaying ? 'Auto-Playing' : 'Paused'}</span>
                    </button>
                  </div>

                  <h3 className="font-['Baloo_2'] text-2xl font-black text-[#0B4E49] leading-tight">
                    {filteredGallery[currentSlide]?.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-[#423832] leading-relaxed font-medium">
                    {filteredGallery[currentSlide]?.desc}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FFF7EC] border border-[#F5E9D8] space-y-1.5">
                    <p className="text-xs font-bold text-[#0B4E49] flex items-center gap-2">
                      <span className="text-base">✨</span>
                      <span>Bubbles Educational Philosophy</span>
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#5A4D44] leading-relaxed font-medium">
                      Every moment captured reflects our dedication to safe child exploration, gentle teacher guidance, and joy in daily learning.
                    </p>
                  </div>
                </div>

                {/* Big Button to launch Fullscreen Lightbox Show */}
                <button
                  onClick={() => {
                    const globalIdx = galleryPhotos.findIndex(
                      (p) => p.id === filteredGallery[currentSlide]?.id
                    );
                    setLightboxIndex(globalIdx !== -1 ? globalIdx : 0);
                    setLightboxOpen(true);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#0B4E49] hover:bg-[#083A36] text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Maximize2 size={16} />
                  <span>Launch Fullscreen Show ({filteredGallery.length} Photos)</span>
                </button>
              </div>
            </div>

            {/* Bottom Filmstrip Thumbnails Row */}
            <div className="mt-6 pt-5 border-t border-[#F5E9D8]">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {filteredGallery.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`shrink-0 w-20 sm:w-24 h-16 sm:h-20 rounded-2xl overflow-hidden transition-all duration-300 relative ${
                      idx === currentSlide
                        ? 'ring-4 ring-[#21B8AF] scale-105 shadow-md'
                        : 'opacity-60 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {idx === currentSlide && (
                      <div className="absolute inset-0 bg-[#21B8AF]/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          8 & 9. TESTIMONIALS & "COME VISIT OUR LITTLE WORLD" SECTIONS (Unified Turquoise #2BDAD2)
      ========================================================= */}
      <section className="relative bg-[#2BDAD2] pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden">
        {/* Top Wave transition from cream section above */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 sm:h-11 text-[#FFF1E8]/70 preserve-3d"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L1440,0 L1440,15 C1160,42 860,5 540,32 C260,52 100,18 0,25 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* --- Soap Bubble Clusters across the Turquoise Area (Matching Reference Image) --- */}
        {/* Top-Left Sky Bubbles */}
        <div className="absolute top-8 left-8 pointer-events-none">
          <SvgBubble size={64} color="#FFFFFF" />
        </div>
        <div className="absolute top-22 left-24 pointer-events-none">
          <SvgBubble size={36} color="#FFFFFF" />
        </div>
        <div className="absolute top-10 left-[42%] pointer-events-none hidden sm:block">
          <SvgBubble size={24} color="#FFFFFF" />
        </div>

        {/* Top-Right Sky Bubbles */}
        <div className="absolute top-8 right-10 pointer-events-none">
          <SvgBubble size={72} color="#FFFFFF" />
        </div>
        <div className="absolute top-24 right-28 pointer-events-none">
          <SvgBubble size={40} color="#FFFFFF" />
        </div>

        {/* Mid & Bottom Floating Bubbles */}
        <div className="absolute top-[48%] left-6 pointer-events-none">
          <SvgBubble size={54} color="#FFFFFF" />
        </div>
        <div className="absolute top-[52%] right-8 pointer-events-none">
          <SvgBubble size={60} color="#FFFFFF" />
        </div>
        <div className="absolute bottom-20 left-16 pointer-events-none hidden sm:block">
          <SvgBubble size={48} color="#FFFFFF" />
        </div>

        {/* Star & Sparkle Doodles */}
        <div className="absolute top-12 left-5 pointer-events-none opacity-60">
          <SvgStar className="w-8 h-8 text-white" />
        </div>
        <div className="absolute top-16 right-[36%] pointer-events-none opacity-50 hidden md:block">
          <SvgStar className="w-6 h-6 text-white" />
        </div>

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10 space-y-12 sm:space-y-16">
          {/* =====================================================
              1. UPPER PART: TESTIMONIAL & HAPPY PARENTS / CHILDREN
          ===================================================== */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
            {/* Left: White Pebble Speech Bubble Card with Mother & Daughter inside */}
            <div className="w-full lg:max-w-[720px] bg-white rounded-[40px] sm:rounded-[56px] p-5 sm:p-7 shadow-[0_16px_45px_rgba(11,78,73,0.15)] flex flex-col sm:flex-row items-center gap-5 sm:gap-6 relative">
              {/* Circular Photo: Mother & Daughter */}
              <div className="shrink-0">
                <img
                  src={testimonials[activeTestimonial].photo}
                  alt="Mother and Child at Bubbles"
                  className="w-28 h-28 sm:w-34 sm:h-34 rounded-full object-cover border-4 border-[#F0FAF7] shadow-md"
                />
              </div>

              {/* Quote Content */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="text-[#21B8AF] text-3xl sm:text-4xl font-serif font-black leading-none select-none block">
                    “
                  </span>
                </div>
                <p className="text-sm sm:text-[15.5px] text-[#362923] leading-relaxed font-medium">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-bold text-[13px] sm:text-sm text-[#0B4E49]">
                      — {testimonials[activeTestimonial].author}
                    </span>
                    <span className="text-xs text-[#5A4D44] ml-2 font-semibold">
                      {testimonials[activeTestimonial].role}
                    </span>
                  </div>

                  {/* Left & Right Circular Arrow Controls */}
                  <div className="flex items-center justify-center sm:justify-end gap-2">
                    <button
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === 0 ? testimonials.length - 1 : prev - 1
                        )
                      }
                      className="w-7 h-7 rounded-full bg-[#168F89] hover:bg-[#0B4E49] text-white flex items-center justify-center transition shadow-sm"
                      title="Previous testimonial"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === testimonials.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="w-7 h-7 rounded-full bg-[#168F89] hover:bg-[#0B4E49] text-white flex items-center justify-center transition shadow-sm"
                      title="Next testimonial"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: "Happy Parents, Happy Children ♡" Playful Typography */}
            <div className="text-center space-y-0.5 select-none">
              <p className="font-['Baloo_2'] text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm">
                Happy
              </p>
              <p className="font-['Baloo_2'] text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm">
                Parents
              </p>
              <p className="font-['Baloo_2'] text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm">
                Happy
              </p>
              <p className="font-['Baloo_2'] text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm flex items-center justify-center gap-1">
                <span>Children</span>
                <span className="text-white text-lg font-bold">♡</span>
              </p>
            </div>

            {/* Right: Smiling Pupil Circular Photo with Peach Splash Accent */}
            <div className="relative shrink-0 flex justify-center">
              {/* Peach organic droplet splash shape behind photo (from mockup) */}
              <div className="absolute -right-4 -bottom-3 w-36 sm:w-44 h-36 sm:h-44 rounded-[50%_65%_45%_70%/65%_45%_70%_50%] bg-[#FFB58F] transform rotate-12 z-0 shadow-sm" />
              <img
                src="/images/children/child-boy-apple.jpg"
                alt="Happy Pupil at Bubbles"
                className="w-28 h-28 sm:w-34 sm:h-34 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
              />
            </div>
          </div>

          {/* =====================================================
              2. LOWER PART: "COME VISIT OUR LITTLE WORLD" CORAL BANNER
          ===================================================== */}
          <div className="relative">
            {/* Organic Peach Splash Accent behind right edge */}
            <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-[60%_40%_70%_30%/40%_70%_30%_60%] bg-[#FF9F80] opacity-80 pointer-events-none z-0 hidden lg:block" />

            {/* Green Leafy Branch Doodle peaking out from behind right edge */}
            <div className="absolute -right-8 -bottom-5 pointer-events-none z-20 text-[#093E3A] opacity-90 hidden lg:block">
              <SvgLeafBranch className="w-24 h-28 transform rotate-12" color="#093E3A" />
            </div>

            {/* Main Coral Rounded Card */}
            <div className="bg-gradient-to-r from-[#F67060] to-[#EE5D4B] rounded-[36px] sm:rounded-[44px] p-6 sm:p-9 text-white shadow-[0_20px_50px_rgba(238,93,75,0.32)] relative z-10 overflow-hidden">
              {/* Subtle Bubble & Sun Doodles inside Coral Card */}
              <div className="absolute -top-10 -right-10 opacity-15 pointer-events-none">
                <SvgBubble size={160} color="#FFFFFF" />
              </div>
              <div className="absolute top-6 right-[38%] pointer-events-none opacity-40 hidden md:block">
                <SvgSunCompass className="w-14 h-14 text-white" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Left: Real Bubbles School Entrance Photo */}
                <div className="lg:col-span-4 flex justify-center lg:justify-start">
                  <div className="rounded-[26px] sm:rounded-[34px] overflow-hidden border-4 border-white shadow-lg w-full max-w-[340px] h-[190px] sm:h-[210px] bg-white/10">
                    <img
                      src="/images/school/school-entrance-sign.jpg"
                      alt="Bubbles Early Years School Campus Entrance"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Center: Headings & Subtitle */}
                <div className="lg:col-span-5 space-y-2 text-center lg:text-left">
                  <span className="text-[#FEEA85] text-xs font-black uppercase tracking-widest block">
                    VISIT US
                  </span>
                  <h2 className="font-['Baloo_2'] text-3xl sm:text-4xl font-black leading-tight text-white">
                    Come Visit Our Little World
                  </h2>
                  <p className="text-white/95 text-sm sm:text-base font-medium leading-relaxed max-w-md">
                    See for yourself why Bubbles is the perfect place for your child to learn, play and grow.
                  </p>
                </div>

                {/* Right: Action Buttons */}
                <div className="lg:col-span-3 flex flex-col gap-3 justify-center items-center lg:items-stretch">
                  <button
                    onClick={() => setTourModalOpen(true)}
                    className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FFFDF7] hover:bg-white text-[#0B4E49] font-black text-xs sm:text-sm shadow-md transition transform hover:scale-102"
                  >
                    <span>Book a Visit</span>
                    <Calendar size={15} className="text-[#168F89]" />
                  </button>

                  <button
                    onClick={() => setTourModalOpen(true)}
                    className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0B4E49] hover:bg-[#073633] text-white font-black text-xs sm:text-sm shadow-md transition transform hover:scale-102"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight size={15} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Organic Wave Divider leading directly into the Dark Teal Footer */}
        <div className="w-full overflow-hidden leading-none mt-14 sm:mt-18 -mb-12 sm:-mb-16">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 sm:h-18 text-[#093E3A] preserve-3d"
            preserveAspectRatio="none"
          >
            <path
              d="M0,35 C320,75 540,10 820,45 C1100,75 1300,20 1440,38 L1440,90 L0,90 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* =========================================================
          9. FOOTER (Deep Dark Teal #093E3A)
      ========================================================= */}
      <footer id="footer" className="bg-[#093E3A] text-white pt-16 pb-12 px-5 sm:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand & Logo */}
            <div className="lg:col-span-1 space-y-4">
              <img
                src="/logo.png"
                alt="Bubbles Early Years School"
                className="h-12 w-auto object-contain"
              />
              <p className="text-white/70 text-xs leading-relaxed">
                Nurturing, inspiring early childhood education designed specifically for children ages 1 to 6.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-['Baloo_2'] text-base font-bold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <a href="#hero" className="hover:text-[#FFB58F] transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#adventure" className="hover:text-[#FFB58F] transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#pillars" className="hover:text-[#FFB58F] transition">
                    Learning
                  </a>
                </li>
                <li>
                  <a href="#spaces" className="hover:text-[#FFB58F] transition">
                    Our Spaces
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-[#FFB58F] transition">
                    Photo Show
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Secondary Links */}
            <div>
              <h4 className="font-['Baloo_2'] text-base font-bold text-white mb-3">Programs</h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <a href="#activities" className="hover:text-[#FFB58F] transition">
                    Activities
                  </a>
                </li>
                <li>
                  <button
                    onClick={onNavigateToPortal}
                    className="hover:text-[#FFB58F] transition text-left"
                  >
                    Parent Portal (PIN)
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateToLogin}
                    className="hover:text-[#FFB58F] transition text-left"
                  >
                    Staff &amp; Teacher Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setTourModalOpen(true)}
                    className="hover:text-[#FFB58F] transition text-left"
                  >
                    Schedule a Tour
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Get In Touch */}
            <div>
              <h4 className="font-['Baloo_2'] text-base font-bold text-white mb-3">Get In Touch</h4>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#FFB58F] shrink-0 mt-0.5" />
                  <span>Bubbles Early Years Campus, Addis Ababa</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-[#FFB58F] shrink-0" />
                  <span>0948 88 33 88 / 0940 88 00 55</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-[#FFB58F] shrink-0" />
                  <span>info@bubblesearlyyears.com</span>
                </li>
              </ul>
            </div>

            {/* Col 5: Follow Us */}
            <div>
              <h4 className="font-['Baloo_2'] text-base font-bold text-white mb-3">Follow Us</h4>
              <div className="flex items-center gap-2.5">
                <a
                  href="#facebook"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F47767] flex items-center justify-center text-white transition"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="#instagram"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F47767] flex items-center justify-center text-white transition"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="#youtube"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F47767] flex items-center justify-center text-white transition"
                >
                  <Youtube size={14} />
                </a>
                <a
                  href="#twitter"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F47767] flex items-center justify-center text-white transition"
                >
                  <Twitter size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
            <p>© 2026 Bubbles Early Years School. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              <span>Small steps. Bright futures.</span>
              <Heart size={12} className="text-[#F47767] inline" fill="#F47767" />
            </p>
          </div>
        </div>
      </footer>

      {/* =========================================================
          10. INTERACTIVE TOUR & ENROLLMENT MODAL
      ========================================================= */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-7 sm:p-9 max-w-lg w-full relative shadow-2xl border-4 border-[#BDF3EE]">
            <button
              onClick={() => setTourModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFF7EC] text-[#746860] hover:bg-[#F47767] hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            {tourSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-[#DDF1DE] text-[#83C98B] rounded-full flex items-center justify-center mx-auto text-3xl">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-['Baloo_2'] text-2xl font-bold text-[#0B4E49]">
                  Visit Request Received!
                </h3>
                <p className="text-sm text-[#423832] font-medium leading-relaxed max-w-sm mx-auto">
                  Thank you! Our admissions coordinator will contact you at {tourForm.phone || tourForm.email} within 24 hours to confirm your family walkthrough.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTourSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Bubbles" className="h-9 w-auto" />
                  <div>
                    <h3 className="font-['Baloo_2'] text-xl font-bold text-[#0B4E49] leading-none">
                      Schedule a Campus Visit
                    </h3>
                    <p className="text-xs text-[#5A4D44] mt-1 font-medium">
                      Explore our classrooms and meet our dedicated educators.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#4B4039] mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tourForm.parentName}
                      onChange={(e) => setTourForm({ ...tourForm, parentName: e.target.value })}
                      placeholder="e.g. Selam Mengistu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F5E9D8] text-xs bg-[#FFF7EC] focus:bg-white focus:outline-none focus:border-[#21B8AF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4B4039] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={tourForm.phone}
                      onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                      placeholder="+251 91 144 5566"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F5E9D8] text-xs bg-[#FFF7EC] focus:bg-white focus:outline-none focus:border-[#21B8AF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4B4039] mb-1">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      value={tourForm.childName}
                      onChange={(e) => setTourForm({ ...tourForm, childName: e.target.value })}
                      placeholder="e.g. Noah"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F5E9D8] text-xs bg-[#FFF7EC] focus:bg-white focus:outline-none focus:border-[#21B8AF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4B4039] mb-1">
                      Child's Age Group
                    </label>
                    <select
                      value={tourForm.childAge}
                      onChange={(e) => setTourForm({ ...tourForm, childAge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F5E9D8] text-xs bg-[#FFF7EC] focus:bg-white focus:outline-none focus:border-[#21B8AF]"
                    >
                      <option>1 – 2 Years (Toddlers)</option>
                      <option>2 – 3 Years (Little Learners)</option>
                      <option>3 – 4 Years (Growing Minds)</option>
                      <option>4 – 5 Years (Big Thinkers)</option>
                      <option>5 – 6 Years (Future Ready)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B4039] mb-1">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={tourForm.preferredDate}
                    onChange={(e) => setTourForm({ ...tourForm, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F5E9D8] text-xs bg-[#FFF7EC] focus:bg-white focus:outline-none focus:border-[#21B8AF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#F47767] hover:bg-[#E85E50] text-white font-black text-sm shadow-[0_8px_20px_rgba(244,119,103,0.3)] transition transform hover:-translate-y-0.5"
                >
                  Confirm Visit Request ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          11. FULL-SCREEN PHOTO SHOW LIGHTBOX MODAL
      ========================================================= */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-fade-in text-white select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Bubbles" className="h-8 w-auto" />
              <div>
                <p className="font-['Baloo_2'] font-bold text-sm text-white leading-none">
                  {galleryPhotos[lightboxIndex]?.title}
                </p>
                <span className="text-[11px] text-[#21B8AF] font-bold">
                  {galleryPhotos[lightboxIndex]?.categoryLabel} • Photo {lightboxIndex + 1} of {galleryPhotos.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  isPlaying ? 'bg-[#21B8AF] text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause Show' : 'Autoplay'}</span>
              </button>

              <button
                onClick={() => setLightboxOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#F47767] flex items-center justify-center text-white transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Photo Area with Left/Right Arrows */}
          <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8">
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1))
              }
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-[#21B8AF] text-white flex items-center justify-center shadow-lg transition backdrop-blur-sm"
              title="Previous Photo"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={galleryPhotos[lightboxIndex]?.src}
              alt={galleryPhotos[lightboxIndex]?.title}
              className="max-h-[70vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />

            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-[#21B8AF] text-white flex items-center justify-center shadow-lg transition backdrop-blur-sm"
              title="Next Photo"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Caption & Thumbnail Strip */}
          <div className="bg-black/60 border-t border-white/10 px-6 py-3">
            <p className="text-center text-xs text-white/80 max-w-2xl mx-auto mb-3 font-medium">
              {galleryPhotos[lightboxIndex]?.desc}
            </p>
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-4xl mx-auto">
              {galleryPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
                    idx === lightboxIndex
                      ? 'ring-2 ring-[#21B8AF] scale-110 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
