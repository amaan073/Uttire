import image from "../assets/image.png";

const About = () => {
  return (
    <>
      <div className="container text-center py-5">
        <div>
          <h1>Our story</h1>
          <img
            src={image}
            alt="about image"
            className="w-100 my-3"
            style={{ maxWidth: "600px" }}
          />
          <p>
            Founded in 2025, Uttire was born out of a desire to create clothing
            that embodies both style and comfort. Our journey began in India,
            where we realized that fashion should not only be about looking good
            but also about feeling good. Each piece is designed with the modern
            individual in mind, bleding contemporary aesthetics with timeless
            elegance.
          </p>
          {/* Collage of 6 images */}
          <div className="d-grid w-100">
            <img src={image} />
            <img src={image} />
            <img src={image} />
            <img src={image} />
            <img src={image} />
            <img src={image} />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
