"use client"
interface LogoProps {
  label: string;
  type:boolean
  
}
const Logo = ({label,type=false}:LogoProps) => {
  return (
    <div className={type?"relative  min-w-32 h-16 overflow-hidden" :"relative min-w-96 h-36 overflow-hidden animate-slideInFromBelow opacity-0"}>
      <img
        src="https://cdn.pixabay.com/photo/2015/10/11/12/48/chess-982260_1280.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        style={{
          transform: "translateY(-15px)", // Shift the image up by 15px
        }}
      />
      <div className="flex items-center justify-center font-playfair font-extrabold w-full h-full bg-black">
        <h1
          className={type?"text-6xl font-bold text-transparent bg-clip-text":"text-9xl font-bold text-transparent bg-clip-text"}
          style={{
            backgroundImage: "url('https://cdn.pixabay.com/photo/2015/10/11/12/48/chess-982260_1280.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitTextStroke: "0.5px white", // Add stroke around text
          }}
        >
          {label}
        </h1>
      </div>
    </div>
  );
};

export default Logo;
