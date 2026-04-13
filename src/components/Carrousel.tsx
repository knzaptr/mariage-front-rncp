import Image from "next/image";

const images = ["/ll1.JPG", "/ll2.JPG", "/ll3.JPG"];

const Carousel = () => {
  return (
    <div className="slider w-full">
      <div className="slide-track">
        {[...images, ...images].map((img, index) => (
          <div className="slide" key={index}>
            <Image
              src={img}
              alt={`carousel image ${index + 1}`}
              height={300}
              width={500}
              className="carousel-img"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
