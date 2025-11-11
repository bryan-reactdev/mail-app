import RecommendedHomesCard from "@/components/RecommendedHomesCard";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Languages, LogIn } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { LogOut } from "lucide-react";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import Title from "@/components/Title";

export default function Landing() {
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

    return(
    <div className="page">
        {/* --- Navbar --- */}
        <div className="w-full flex border-none p-4">
            <ButtonGroup className="flex w-full justify-between px-4">
                <ButtonGroup className="flex items-center">
                    <Button variant={"link"}>
                        <h1 className="text-2xl font-extrabold font-ztnature">BIOVAC</h1>
                    </Button>
                </ButtonGroup>

                <div className="flex flex-row">
                    <RippleButton variant="default">
                        <LogIn/> Login
                        <RippleButtonRipples/>
                    </RippleButton>
                </div>
            </ButtonGroup>
        </div>

        {/* --- Hero --- */}
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

            <div className="w-[750px] text-center z-100">
                <Title 
                  text="La app #1 para gestionar todos tus proyectos"
                  className="relative mb-10 font-extrabold text-6xl text-white font-inter leading-tight tracking-tight text-shadow-regular"
                  delay={30}
                  duration={0.12}
                  rootMargin="0px"
                />
                
                <div className="flex flex-col justify-center items-center text-center">
                        <div className="w-full flex justify-center items-center gap-4">
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

        {/* --- 2nd Section --- */}
        <div className="w-full p-12 px-24">
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
                            <CarouselItem key={item.title} className="basis-1/3">
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
    )
}