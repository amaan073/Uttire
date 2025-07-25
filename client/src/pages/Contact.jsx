import customer_care from "../assets/images/customer_care.webp";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    var name = e.target.querySelector("input[type='text']").value;
    var email = e.target.querySelector("input[type='email']").value;
    var message = e.target.querySelector("textarea").value;

    var mailto = `mailto:amaankhanp2001@gmail.com?body=${encodeURIComponent(
      message
    )}%0A%0AFrom:%20${name}<${email}>`;
    console.log(mailto);

    window.location.href = mailto;
  };

  return (
    <>
      <div className="container-xxl text-center">
        <div className="py-5">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <h2 className="mb-5">We'd Love to Hear from You!</h2>
          <img
            src={customer_care}
            alt="customer care"
            className="mt-2 w-100 h-auto"
            style={{ maxWidth: "800px" }}
          />
        </div>

        <hr />

        <div className="my-5">
          <h2>Get in Touch</h2>
          <p>Have questions or feedback? Reach out to us!</p>
          <div className="border rounded p-3 mx-auto bg-white d-inline-block mt-3">
            <table className="text-start mx-auto">
              <tbody>
                <tr>
                  <td className="p-2 pe-4 fw-semibold ">Email:</td>
                  <td className="p-2">support@uttire.com</td>
                </tr>
                <tr>
                  <td className="p-2 pe-4 fw-semibold ">Phone:</td>
                  <td className="p-2">+91 1234567890</td>
                </tr>
                <tr>
                  <td className="p-2 pe-4 fw-semibold ">Address:</td>
                  <td className="p-2">456, MI road, Jaipur</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr />

        <div className="my-5">
          <h3 className="my-5">Send us a message</h3>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div
              className="bd-example m-0 border text-start w-100 p-3 rounded-4 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input type="text" className="form-control" id="name" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
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
                ></textarea>
              </div>
              <div className="mb-1">
                <input
                  type="submit"
                  value="Send Message"
                  className="btn btn-primary"
                />
              </div>
            </div>
          </form>
        </div>

        <hr />

        {/* FAQ */}
        <div className="my-5">
          <h3 className="mb-5">Frequently Asked Questions</h3>
          <ol
            className="text-start d-inline-block mx-auto"
            style={{ maxWidth: "800px" }}
          >
            <li className="ps-2 my-4 border-bottom pb-3">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p className="fw-semibold">What is Uttire's return policy?</p>
              <span>
                We accept returns within 30 days of purchase. Items must be
                unworn, unwashed, and in original packaging.
              </span>
            </li>
            <li className="ps-2 my-4 border-bottom pb-3">
              <p className="fw-semibold">How can I track my order?</p>
              <span>
                Once your order has shipped, you will receive an email with a
                tracking number and a link to track your order online.
              </span>
            </li>
            <li className="ps-2 my-4 border-bottom pb-3">
              <p className="fw-semibold">
                Do you offer international shipping?{" "}
              </p>
              <span>
                Yes, we ship to select international locations. Please check our
                shipping policy for more details.
              </span>
            </li>
            <li className="ps-2 my-4 border-bottom pb-3">
              <p className="fw-semibold">
                How do I care for my Uttire clothing?
              </p>
              <span>
                We recommend following the care label instructions. Generally,
                machine wash cold and tumble dry low.
              </span>
            </li>
            <li className="ps-2 my-4 border-bottom pb-3">
              <p className="fw-semibold">Can I change or cancel my order?</p>
              <span>
                If you need to change or cancel your order, please contact us
                within 24 hours of placing your order.
              </span>
            </li>
            <li className="ps-2 mt-4">
              <p className="fw-semibold">How can I contact customer service?</p>
              <span>
                You can reach our customer service team via email at
                support@uttire.com or by calling +911234567890.
              </span>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Contact;
