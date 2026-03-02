import RecommendedHomesCard from "@/components/RecommendedHomesCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Home, DollarSign, Phone, Search, MessageCircle, CheckCircle, Grid2X2 } from "lucide-react";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import ClickSpark from "@/components/ClickSpark";
import { useNavigate } from "react-router-dom";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import BenefitCard from "@/components/cards/BenefitCard";
import PublicNavbar from "@/components/PublicNavbar";

export default function Landing() {
    const navigate = useNavigate();

    const projects = [
        { title: "Recommended Homes", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80" },
        { title: "New Listings", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80" },
        { title: "Price Reduced", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80" },
        { title: "Just Sold", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80" },
        { title: "Recommended Homess", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80" },
        { title: "New Listingsd", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80" },
        { title: "Price Reduceds", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80" },
        { title: "Just Sold<", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80" },
    ];

    // const heroImages = [
    //     "/images/landing/bg.jpg",
    //     "/images/landing/bg-2.jpg",
    // ];

  const heroImages = [
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ];
    const initialHeroIndex = Math.floor(Math.random() * heroImages.length);

    return (
        <ClickSpark>
            <main className="relative bg-background min-h-screen">
                {/* Fixed gradient background */}
                <div className="absolute top-0 left-0 w-full h-[825px] bg-gradient-to-b from-[#2a4b80] to-[#fff] z-0 pointer-events-none"></div>

                {/* Navbar */}
                <PublicNavbar />

                {/* Content */}
                <div className="w-full flex flex-col z-10 relative">
                    <div
                        className="w-full h-[550px] absolute inset-0 z-1"
                        style={{
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))"
                        }}
                    />

                    {/* Hero Section */}
                    <div className="relative w-full h-[550px] flex justify-center items-center">
                        <Carousel 
                            className="absolute inset-0"
                            opts={{ align: "start", loop: true, startIndex: initialHeroIndex }}
                            plugins={[Autoplay({ delay: 3500 })]}
                        >
                            <CarouselContent>
                                {heroImages.map((src) => (
                                    <CarouselItem key={src} className="basis-full">
                                        <img className="w-full h-[550px] object-cover z-10 !select-none !pointer-events-none" src={src} alt="Hero background" />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        <div className="w-full max-w-[750px] px-4 text-center z-10 relative">
                            <Effect slide fade delay={100}>
                                <h1 className="relative mb-10 font-extrabold text-4xl md:text-6xl text-white font-inter leading-tight tracking-tight text-shadow-regular">
                                    Placeholder heading — {' '}
                                    <GradientText
                                        className="text-4xl md:text-6xl font-bold text-white font-inter leading-tight tracking-tight"
                                        text="your tagline here"
                                        gradient="linear-gradient(90deg, #ffffff 0%,rgb(103, 178, 253) 25%,rgb(75, 132, 238) 50%,rgb(103, 178, 253) 75%, #ffffff 100%)"
                                        transition={{ duration: 30, repeat: Infinity, ease: "easeOut" }}
                                    />
                                    {' '}
                                    placeholder copy.
                                </h1>
                            </Effect>
                            
                            <div className="flex flex-col justify-center items-center text-center">
                                <Effect slide fade delay={300}>
                                    <RippleButton 
                                        variant="accent" 
                                        size="lg" 
                                        className="w-full sm:w-auto py-8 sm:py-8 px-6 sm:px-[75px] text-base sm:text-lg group transition-transform duration-300 hover:translate-y-[-2px] hover:scale-[1.02]"
                                        onClick={() => navigate("/login")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Grid2X2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                                            Get started
                                        </div>
                                        <RippleButtonRipples/>
                                    </RippleButton>
                                </Effect>
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="w-full px-4 md:px-12 lg:px-24 py-12">
                        <div className="text-center mb-8">
                            <GradientText
                                className="!font-extrabold !inline-flex !m-0 text-3xl md:text-4xl"
                                text="Placeholder section title"
                                gradient="linear-gradient(90deg, #000000 0%,rgb(99, 102, 133) 50%, #000000 100%)"
                                transition={{ duration: 30, repeat: Infinity, ease: "easeOut" }}
                            />
                        </div>
                        
                        <Carousel
                            className="w-full" 
                            opts={{ align: "start", loop: true }}
                            plugins={[
                                Autoplay({ delay: 2250, stopOnInteraction: true, stopOnMouseEnter: true })
                            ]}
                        >
                            <CarouselContent>
                                {projects.map((item, index) => {
                                    const idx = index + 4;

                                    return (
                                        <CarouselItem key={item.title} className="basis-full sm:basis-1/2 lg:basis-1/3">
                                            <Effect slide fade delay={250 + idx * 50}>
                                                <RecommendedHomesCard title={item.title} image={item.image} />
                                            </Effect>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 sm:left-4 bg-white/90 hover:bg-white shadow-lg z-10" />
                            <CarouselNext className="right-2 sm:right-4 bg-white/90 hover:bg-white shadow-lg z-10" />
                        </Carousel>

                        <div className="flex justify-center mt-8">
                            <RippleButton 
                                variant="accent" 
                                size="lg" 
                                className="p-8 px-[75px] text-lg group transition-transform duration-300 hover:translate-y-[-2px] hover:scale-[1.02]"
                                onClick={() => navigate("/login")}
                            >
                                <div className="flex items-center gap-2">
                                    <Grid2X2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                                    Explorar Propiedades
                                </div>
                                <RippleButtonRipples/>
                            </RippleButton>
                        </div>
                    </div>

                    {/* Services Section */}
                    <section className="relative w-full mt-8 mb-16">
                        <div className="relative w-[90%] sm:w-[85%] lg:w-[80%] mx-auto">
                            <div className="mb-10 text-center">
                                <p className="mb-2 text-sm font-medium tracking-[0.25em] text-black/60 uppercase">
                                    Placeholder label
                                </p>
                                <GradientText
                                    className="!font-extrabold !inline-flex !m-0 text-3xl md:text-4xl"
                                    text="Placeholder services heading"
                                    gradient="linear-gradient(90deg, #000000 0%,rgb(99, 102, 133) 50%, #000000 100%)"
                                    transition={{ duration: 30, repeat: Infinity, ease: "easeOut" }}
                                />
                            </div>

                            <div className="relative rounded-3xl border border-black/5 bg-white/90 shadow-[0_22px_55px_rgba(15,23,42,0.14)] overflow-hidden">
                                <div className="relative p-6 md:p-10">
                                    {/* Cross separators on desktop */}
                                    <div className="absolute inset-y-0 left-1/3 hidden w-px bg-black/15 md:block pointer-events-none" />
                                    <div className="absolute inset-y-0 left-2/3 hidden w-px bg-black/15 md:block pointer-events-none" />

                                    <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="flex flex-col">
                                            <BenefitCard
                                                title="Comprar una propiedad"
                                                icon={Home}
                                                description="Encuentra tu hogar ideal entre nuestras exclusivas propiedades."
                                            />
                                            <div className="mt-4 flex justify-center">
                                                <RippleButton 
                                                    variant="default" 
                                                    size="lg" 
                                                    className="px-6"
                                                    onClick={() => navigate("/login")}
                                                >
                                                    Ver Propiedades
                                                    <RippleButtonRipples/>
                                                </RippleButton>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <BenefitCard
                                                title="Placeholder benefit two"
                                                icon={DollarSign}
                                                description="Placeholder description for second benefit."
                                            />
                                            <div className="mt-4 flex justify-center">
                                                <RippleButton variant="default" size="lg" className="px-6">
                                                    Action two
                                                    <RippleButtonRipples/>
                                                </RippleButton>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <BenefitCard
                                                title="Placeholder benefit three"
                                                icon={Phone}
                                                description="Placeholder description for third benefit."
                                            />
                                            <div className="mt-4 flex justify-center">
                                                <RippleButton variant="default" size="lg" className="px-6">
                                                    Action three
                                                    <RippleButtonRipples/>
                                                </RippleButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Steps Section */}
                    <section className="relative w-full py-32 pb-48 bg-[url('/images/app/bg-1.svg')] bg-repeat bg-center bg-[length:1200px_auto]">
                        <div className="absolute inset-0 bg-white/90" />
                        <div className="relative w-[75%] mx-auto">
                            <div className="mb-10 text-center">
                                <p className="mb-2 text-sm font-medium tracking-[0.25em] text-black/60 uppercase">
                                    Placeholder steps label
                                </p>
                                <GradientText
                                    className="!font-extrabold !inline-flex !m-0 text-3xl md:text-4xl"
                                    text="Placeholder steps heading"
                                    gradient="linear-gradient(90deg, #000000 0%,rgb(99, 102, 133) 50%, #000000 100%)"
                                    transition={{ duration: 30, repeat: Infinity, ease: "easeOut" }}
                                />
                            </div>

                            <div className="relative">
                                {/* Connector line on desktop */}
                                <div className="absolute top-10 left-[10%] right-[10%] hidden h-px bg-black/10 md:block pointer-events-none" />

                                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                                    <div
                                        className="relative flex flex-col items-start gap-4 p-6 rounded-2xl border border-black/5 bg-white/80 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#1b3c6f] to-[#2a4e87] text-white font-bold text-lg">
                                                1
                                            </div>
                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                                                <Search className="w-5 h-5 text-[#1b3c6f]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-black">
                                                Step one
                                            </h3>
                                            <p className="text-sm text-black/70 text-left">
                                                Placeholder step one description.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="relative flex flex-col items-start gap-4 p-6 rounded-2xl border border-black/5 bg-white/80 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#1b3c6f] to-[#2a4e87] text-white font-bold text-lg">
                                                2
                                            </div>
                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                                                <MessageCircle className="w-5 h-5 text-[#1b3c6f]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-black">
                                                Step two
                                            </h3>
                                            <p className="text-sm text-black/70 text-left">
                                                Placeholder step two description.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="relative flex flex-col items-start gap-4 p-6 rounded-2xl border border-black/5 bg-white/80 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#1b3c6f] to-[#2a4e87] text-white font-bold text-lg">
                                                3
                                            </div>
                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                                                <CheckCircle className="w-5 h-5 text-[#1b3c6f]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-black">
                                                Step three
                                            </h3>
                                            <p className="text-sm text-black/70 text-left">
                                                Placeholder step three description.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="w-full border-t border-white/10 bg-gradient-to-b from-black/90 to-[#020617]">
                    <div className="w-[75%] mx-auto py-10 flex flex-col gap-10 text-sm text-white/80 md:flex-row md:items-start md:justify-between">
                        {/* Brand / tagline */}
                        <div className="space-y-3 max-w-sm">
                            <p className="text-xl font-semibold tracking-wide text-white">
                                Base App
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/70">
                                <p>
                                    Placeholder tagline<br />
                                    Replace with your copy
                                </p>
                            </div>
                        </div>

                        {/* Quick navigation */}
                        <div className="flex flex-col gap-3 text-xs md:text-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                                Navegación
                            </p>
                            <nav className="flex flex-col gap-1.5 text-white/75">
                                <button
                                    onClick={() => navigate("/")}
                                    className="hover:text-white transition-colors duration-150 text-left"
                                >
                                    Inicio
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="hover:text-white transition-colors duration-150 text-left"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="hover:text-white transition-colors duration-150 text-left"
                                >
                                    Services
                                </button>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="hover:text-white transition-colors duration-150 text-left"
                                >
                                    Contact
                                </button>
                            </nav>
                        </div>

                        {/* Contact */}
                        {/* <div className="flex flex-col items-start gap-3 text-xs md:text-sm md:items-end">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                                Contáctanos
                            </p>
                            <div className="flex items-center gap-2 text-white/80">
                                <Phone className="w-4 h-4 text-white/70" />
                                <a href="tel:+50300000000" className="hover:text-white transition-colors duration-150">
                                    (+503) 0000 0000
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <Mail className="w-4 h-4 text-white/70" />
                                <a
                                    href="mailto:contacto@inmobiliaria.com"
                                    className="hover:text-white transition-colors duration-150"
                                >
                                    contacto@inmobiliaria.com
                                </a>
                            </div>
                        </div> */}
                    </div>

                    <div className="w-[75%] mx-auto border-t border-white/10 py-4 flex flex-col items-center gap-1 text-[11px] text-white/40 md:flex-row md:justify-between">
                        <p>© {new Date().getFullYear()} Base App. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </ClickSpark>
    )
}