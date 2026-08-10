import React from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import HoursDropdown from "./HoursDropdown";
import { FaClock } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";

const DellaAdventurePark = () => {
  const scrollLeft = () => {
    document.getElementById("scrollContainer").scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("scrollContainer").scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="della-adventure-page">
      {/* About Section */}
      <section className="section">
        <div className="container">
          <h1
            className="section-title "
            style={{
              color: "#04430eff",
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            {" "}
            DELLA ADVENTURE PARK{" "}
          </h1>

          {/* Row 1: Images */}
          <div className="image-row">
            <div className="image-left">
              <img
                src="https://i.pinimg.com/1200x/ee/f1/d7/eef1d78da9875a24515a8e332587d950.jpg"
                alt="Adventure Activities"
              />
            </div>

            <div className="image-right">
              <img
                src="https://i.pinimg.com/1200x/49/98/9c/49989ce5aa6d152e17d4412f357315e4.jpg"
                alt="Adventure Activity 1"
              />
              <img
                src="https://i.pinimg.com/1200x/78/48/42/784842cd6cb3f6a8aae45da0d508de41.jpg"
                alt="Adventure Activity 2"
              />
            </div>
          </div>

          {/* Row 2: About & Hours */}
          <div className="about-row">
            <div className="about-text">
              <p>
                Della Adventure Park is India's Largest Extreme Adventure park
                with 50 plus adventure activities. Experience India's only Swoop
                swing (100 ft.), India's Longest Flying Fox (1250ft.), 5 kinds
                of zorbing and 700cc yanncha raptor ATV only at Della Adventure,
                Lonavala.
              </p>
              <p>
                Make sure you do not miss out on adrenaline-pumping adventure
                activities like Archery, Rocket Ejector, Motocross dirt bike
                riding, Buggy Ride, Paintball and Rappelling.
              </p>

              <div className="guidelines">
                {/* <i className="fas fa-check-circle"></i> */}
                <FaPaw size={20} color="#1a2a6c" />{" "}
                <span>Meets animal welfare guidelines</span>
                <br></br> <br></br>
                <div className="clock-container">
                  <FaClock className="clockwise" size={23} color="#1a2a6c" />{" "}
                  <span>Time Duration - More than 3 hours</span>
                </div>
              </div>

              <div className="improve-listing">
                <h3>Suggest edits to improve what we show.</h3>
                <a href="#" className="btn">
                  Improve this listing
                </a>
              </div>
            </div>

            <div className="hours-box">
              {/* <h3>Hours</h3>
        <table className="hours-table">
          <tbody>
            <tr>
              <td><strong>Monday - Saturday</strong></td>
              <td>11:00 AM - 7:00 PM</td>
            </tr>
          </tbody>
        </table> */}

              <div className="hours-dropdown">
                <HoursDropdown></HoursDropdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="section" style={{ background: "#f0f2f5" }}>
        <div className="container">
          <h2 className="section-title">Recommended experiences nearby</h2>

          <div className="scroll-wrapper">
            <button className="scroll-btn left" onClick={scrollLeft}>
              &lt;
            </button>

            <div className="experiences" id="scrollContainer">
              {[
                {
                  img: "https://i.pinimg.com/1200x/0e/fc/9c/0efc9c8da3e2ee7a901810f2a19926ca.jpg",
                  title: "Phang Nga Bay Sea Canoeing Trip with Lunch",
                  duration: "8h",
                  price: "$9,255",
                },
                {
                  img: "https://i.pinimg.com/1200x/72/42/58/724258492a60d9d9e9187b84b25688c7.jpg",
                  title:
                    "Sanjay Gandhi National Park (SGNP) + Kenheri Caves Tour",
                  duration: "5-6 hours",
                  price: "$9,404",
                },
                {
                  img: "https://i.pinimg.com/1200x/87/0b/34/870b34bcdd989a71824a72dde77c6ec0.jpg",
                  title: "Hill-station & Heritage: Lonavala & Karla Caves Tour",
                  duration: "10-12 hours",
                  price: "$6,500",
                },
                {
                  img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
                  title:
                    "Private Taj Mahal Day Tour From Mumbai, Pune, Chennai",
                  duration: "16-18 hours",
                  price: "$8,500",
                },
                {
                  img: "https://i.pinimg.com/1200x/87/0b/34/870b34bcdd989a71824a72dde77c6ec0.jpg",
                  title: "Hill-station & Heritage: Lonavala & Karla Caves Tour",
                  duration: "10-12 hours",
                  price: "$6,500",
                },
                {
                  img: "https://i.pinimg.com/1200x/72/42/58/724258492a60d9d9e9187b84b25688c7.jpg",
                  title:
                    "Sanjay Gandhi National Park (SGNP) + Kenheri Caves Tour",
                  duration: "5-6 hours",
                  price: "$9,404",
                },
              ].map((exp, index) => (
                <div className="experience-card" key={index}>
                  <div className="card-image">
                    <img src={exp.img} alt={exp.title} loading="lazy" />
                  </div>
                  <div className="card-content">
                    <h3>{exp.title}</h3>
                    <div className="card-details">
                      <span>
                        <i className="fas fa-clock"></i> Duration:{" "}
                        {exp.duration}
                      </span>
                    </div>
                    <div className="badge">Free cancellation</div>
                    <div className="price">from {exp.price}</div>
                    <div className="card-action">
                      <a href="#" className="btn">
                        Reserve
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="scroll-btn right" onClick={scrollRight}>
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>
                We are a premier tours and travels company offering the best
                adventure experiences across India and beyond.
              </p>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Destinations</a>
                </li>
                <li>
                  <a href="#">Adventure Tours</a>
                </li>
                <li>
                  <a href="#">Group Bookings</a>
                </li>
                <li>
                  <a href="#">Special Offers</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>
                <i className="fas fa-map-marker-alt"></i> DesiVDesi Adventure
                Pune, Maharashtra, India
              </p>
              <p>
                <i className="fas fa-phone"></i> +91 7888251550
              </p>
              <p>
                <i className="fas fa-envelope"></i> desivdesi@gmail.com
              </p>
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>&copy; 2025 Adventure Tours. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.della-adventure-page {
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  background: linear-gradient(135deg, #ff5722, #e64a19);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(230, 74, 25, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(230, 74, 25, 0.4);
}

.section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 50px;
  color: #1a2a6c;
  font-size: 36px;
  position: relative;
  font-weight: 700;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d);
  border-radius: 3px;
}


.clockwise {
  animation: spin 4s linear infinite; /* clockwise */
}
.anticlockwise {
  animation: spinReverse 4s linear infinite; /* anticlockwise */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spinReverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

/* About Section */
.image-row {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.image-left {
  flex: 2.0;
  height: 420px;
}

.image-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(4, 4, 4, 0.1);
  transition: transform 0.3s ease;
}

.image-left img:hover {
  transform: scale(1.0);
}

.image-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-right img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 22px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.image-right img:hover {
  transform: scale(1.01);
}

.about-row {
  display: flex ;
  gap: 40px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.about-text {
  flex: 1;
  min-width: 300px;
  font-size: 17px;
  line-height: 1.8;
  color: #444;
}

.about-text p {
  margin-bottom: 20px;
}

.hours-box {
  flex: 1;
  min-width: 200px;   /* was 20px, increased so text won’t break */
  background: transparent;
  padding: 15px 20px; /* reduced from 35px */
  border-radius: 10px; /* slightly smaller */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* lighter shadow */
  border-top: 4px solid #e4e4e7ff; /* thinner top border */
  max-width: 320px;   /* prevent it from stretching too wide */
  margin: 0 auto;     /* center it nicely */
}

}

.guidelines {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #388e3c;
  font-weight: 500;
}

.guidelines i {
  margin-right: 10px;
  font-size: 20px;
}

.improve-listing {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.improve-listing h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #555;
}

/* Experiences Section */
.experiences-section {
  background: linear-gradient(to bottom, #f0f2f5, #e6e9ed);
  position: relative;
  overflow: hidden;
}

.experiences-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d);
}

.scroll-wrapper {
  position: relative;
  padding: 0 40px;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a2a6c;
}

.scroll-btn:hover {
  background: #1a2a6c;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.scroll-btn.left {
  left: 0;
}

.scroll-btn.right {
  right: 0;
}

.experiences {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 5px;
  scrollbar-width: none;
}

.experiences::-webkit-scrollbar {
  display: none;
}

.experience-card {
  min-width: 300px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.experience-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.experience-card:hover .card-image img {
  transform: scale(1.1);
}

.card-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #1a2a6c;
  line-height: 1.4;
  min-height: 50px;
}

.card-details {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.card-details i {
  margin-right: 8px;
  color: #ff5722;
}

.badge {
  background: #4caf50;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: inline-block;
  margin-bottom: 15px;
  font-weight: 500;
}

.price {
  font-weight: bold;
  margin: 15px 0;
  color: #e64a19;
  font-size: 20px;
}

.card-action {
  margin-top: 20px;
}

/* Footer */
footer {
  background: linear-gradient(to right, #1a2a6c, #2c3e50);
  color: white;
  padding: 60px 0 20px;
  position: relative;
}

footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
  margin-bottom: 40px;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-section h3 {
  margin-bottom: 20px;
  font-size: 22px;
  position: relative;
  padding-bottom: 10px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #fdbb2d;
}

.footer-section p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
  padding-left: 15px;
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #fdbb2d;
  padding-left: 20px;
}

.footer-links a:hover::before {
  opacity: 1;
  left: 5px;
}

.footer-section i {
  margin-right: 10px;
  color: #fdbb2d;
  width: 20px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-icons a {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
}

.social-icons a:hover {
  background: #fdbb2d;
  transform: translateY(-3px);
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #aaa;
}

/* Responsive Design */
@media (max-width: 992px) {
  .section-title {
    font-size: 30px;
  }
  
  .image-row {
    flex-direction: column;
  }
  
  .image-right {
    flex-direction: row;
  }
  
  .image-right img {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 26px;
  }
  
  .about-row {
    flex-direction: column;
  }
  
  .image-right {
    flex-direction: column;
  }
  
  .scroll-wrapper {
    padding: 0 30px;
  }
  
  .scroll-btn {
    width: 40px;
    height: 40px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 15px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .experience-card {
    min-width: 260px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

      `}</style>
    </div>
  );
};

export default DellaAdventurePark;
