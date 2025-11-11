interface RecommendedHomesCardProps {
    title: string;
    image: string;
    className?: string;
}

export default function RecommendedHomesCard({ 
    title, 
    image,
    className = ""
}: RecommendedHomesCardProps) {
    return (  
        <div className={`relative w-full h-50 rounded-lg flex flex-col items-center justify-center text-white text-shadow-small overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10 rounded-lg z-5 pointer-events-none" />
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover rounded-lg" />

            {/* Header */}
            <div className="w-full flex flex-row items-center justify-between p-4 mb-auto z-10">
                <h1 className="font-bold text-lg">{title}</h1>
            </div>
        </div>
    );
}
