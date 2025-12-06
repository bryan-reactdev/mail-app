import RecommendedHomesCard from "@/components/RecommendedHomesCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { LogIn } from "lucide-react";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import Title from "@/components/title";
import ClickSpark from "@/components/ClickSpark";
import { useNavigate } from "react-router-dom";

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

    const heroImages = [
        "/images/landing/bg.jpg",
        "/images/landing/bg-2.jpg",
    ];
    const initialHeroIndex = Math.floor(Math.random() * heroImages.length);

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <ClickSpark>
            <main className="relative bg-sidebar min-h-screen">
                {/* Navbar */}
                <div className="w-full flex items-center gap-2 md:gap-4 bg-sidebar p-2 md:p-4 relative z-50">
                    <div className="flex items-center justify-between w-full px-2 md:px-4">
                        <Button
                            variant="link"
                            onClick={() => navigate("/")}
                            className="cursor-pointer p-0 h-auto"
                            tabIndex={0}
                            aria-label="Go to Home"
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate("/");
                                }
                            }}
                        >
                            <h1 className="text-2xl md:text-4xl font-extrabold font-ztnature cursor-pointer">BIOVAC</h1>
                        </Button>

                        <div className="flex flex-row items-center gap-3 md:gap-4">
                            <RippleButton 
                                variant="default" 
                                onClick={handleLoginClick}
                                size="sm"
                                className="h-9 md:h-10 px-2 md:px-4"
                            >
                                <LogIn className="h-4 w-4 md:h-4 md:w-4" />
                                <span className="hidden sm:inline">Login</span>
                                <RippleButtonRipples />
                            </RippleButton>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full flex flex-col z-10 relative">
                    {/* Hero Section */}
                    <div className="relative w-full h-[450px] flex justify-center items-center">
                        <Carousel 
                            className="absolute inset-0"
                            opts={{ align: "start", loop: true, startIndex: initialHeroIndex }}
                            plugins={[Autoplay({ delay: 5000 })]}
                        >
                            <CarouselContent>
                                {heroImages.map((src) => (
                                    <CarouselItem key={src} className="basis-full">
                                        <img className="w-full h-[450px] object-cover" src={src} alt="Hero background" />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        <div className="w-full max-w-[750px] px-4 text-center z-10 relative">
                            <Title 
                                text="La app #1 para gestionar todos tus proyectos"
                                className="relative mb-10 font-extrabold text-4xl md:text-6xl text-white font-inter leading-tight tracking-tight text-shadow-regular"
                                delay={30}
                                duration={0.12}
                                rootMargin="0px"
                            />
                            
                            <div className="flex flex-col justify-center items-center text-center">
                                <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <Effect slide fade delay={100}>
                                        <RippleButton variant="default" className="button-hero text-md" size="lg">
                                            Conoce más
                                            <RippleButtonRipples/>
                                        </RippleButton>
                                    </Effect>
                                    <Effect slide fade delay={150}>
                                        <RippleButton variant="default" className="button-hero text-md" size="lg">
                                            Registrate
                                            <RippleButtonRipples/>
                                        </RippleButton>
                                    </Effect>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="w-full px-4 md:px-12 lg:px-24 py-12">
                        <Title 
                            text="Nuestros Proyectos" 
                            className="font-bold text-2xl mb-4"
                            effectDelay={250}
                        />
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
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </div>
            </main>
        </ClickSpark>
    )
}