import useOnlineStatus from "../hooks/useOnlineStatus";
import Image from "../components/ui/Image";
import customer_care from "../assets/images/customer_care.webp";
import { useState } from "react";

const Contact = () => {
  const isOnline = useOnlineStatus();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:support@uttire.com?body=${encodeURIComponent(
      formData.message
    )}%0A%0AFrom:%20${formData.name}<${formData.email}>`;

    window.location.href = mailto;

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="container-fluid px-4 py-5" style={{ maxWidth: "1600px" }}>
      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 text-center mt-4 mt-md-0">
          <Image
            src={customer_care}
            alt="Customer support illustration"
            className="rounded shadow-lg w-100"
            style={{ height: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <div className="p-4 p-sm-5 rounded-4 shadow-lg bg-white text-center text-md-start">
            <h1 className="display-4 fw-bold mb-3">Get in Touch</h1>
            <p className="lead text-muted mb-4">
              Have a question, feedback, or just want to say hello? We&apos;d
              love to hear from you!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center pt-4 mb-5">
        <h2 className="fw-bold mb-4">Our Contact Details</h2>
        <div className="row justify-content-center g-4">
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-sm bg-white h-100">
              <h5 className="fw-bold mb-2">Email</h5>
              <p className="text-muted mb-0">support@uttire.com</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-sm bg-white h-100">
              <h5 className="fw-bold mb-2">Phone</h5>
              <p className="text-muted mb-0">+91 1234567890</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-sm bg-white h-100">
              <h5 className="fw-bold mb-2">Address</h5>
              <p className="text-muted mb-0">456, MI Road, Jaipur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="row justify-content-center pt-4 mb-5">
        <div className="col-lg-6">
          <div className="p-4 p-sm-5 rounded-4 shadow-lg bg-white">
            <h3 className="mb-4 fw-bold text-center">Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                ></textarea>
              </div>
              <div className="d-grid">
                <input
                  type="submit"
                  value="Send Message"
                  className="btn btn-primary"
                  disabled={!isOnline}
                />
                {!isOnline && (
                  <p className="text-danger mt-2 small text-center">
                    Oops! You’re offline. Connect to the internet to send your
                    message.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="text-center pt-4 mb-5">
        <h2 className="fw-bold mb-4">Frequently Asked Questions</h2>
        <div className="row justify-content-center g-4 text-start">
          {[
            {
              question: "What is Uttire's return policy?",
              answer:
                "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original packaging.",
            },
            {
              question: "How can I track my order?",
              answer:
                "Once your order has shipped, you will receive an email with a tracking number and a link to track your order online.",
            },
            {
              question: "Do you offer international shipping?",
              answer:
                "Yes, we ship to select international locations. Please check our shipping policy for more details.",
            },
            {
              question: "How do I care for my Uttire clothing?",
              answer:
                "Follow the care label instructions. Generally, machine wash cold and tumble dry low.",
            },
            {
              question: "Can I change or cancel my order?",
              answer:
                "If you need to change or cancel your order, please contact us within 24 hours of placing your order.",
            },
            {
              question: "How can I contact customer service?",
              answer:
                "You can reach our customer service team via email at support@uttire.com or by calling +911234567890.",
            },
          ].map(({ question, answer }) => (
            <div
              key={question}
              className="col-12 col-md-8 border-bottom pb-3 mb-3 mx-auto"
            >
              <p className="fw-semibold mb-1">{question}</p>
              <span className="text-muted">{answer}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
