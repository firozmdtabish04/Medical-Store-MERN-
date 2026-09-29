import React, { useState } from "react";
import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageCircle,
  Send,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // ==========================================
  // CONTACT INFORMATION
  // ==========================================

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 8102946894",
      description: "Mon - Sat, 9:00 AM - 6:00 PM",
      href: "tel:+918102946894",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "mdtabishfiroz@gmail.com",
      description: "We usually reply within 24 hours",
      href: "mailto:mdtabishfiroz@gmail.com",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat with MediFind",
      description: "Quick support through WhatsApp",
      href: "https://wa.me/918102946894",
    },
    {
      icon: MapPin,
      title: "Our Location",
      value: "Bhubaneswar, Odisha",
      description: "Serving customers through nearby pharmacies",
      href: "#location",
    },
  ];

  // ==========================================
  // FAQ
  // ==========================================

  const faqs = [
    {
      question: "How can I find a medicine?",
      answer:
        "Use the medicine search on MediFind to enter the medicine name. You can then discover nearby pharmacies where the medicine may be available.",
    },
    {
      question: "How does nearby pharmacy search work?",
      answer:
        "MediFind can use your browser location to search for pharmacies around your current location. You can also use location-based pharmacy discovery.",
    },
    {
      question: "Can I compare medicine prices?",
      answer:
        "The platform is designed to show available medicine information from registered pharmacies so customers can compare available options.",
    },
    {
      question: "How can a pharmacy register?",
      answer:
        "A pharmacist can create a pharmacist account and submit pharmacy information. The pharmacy then goes through the platform's approval workflow.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes. MediFind is designed to provide order status updates and delivery tracking after an order has been placed and assigned for delivery.",
    },
  ];

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in your name, email and message.");

      return;
    }

    console.log("Contact Form:", formData);

    alert("Thank you for contacting MediFind. Your message has been received.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="overflow-hidden bg-white">
      {/* =========================================
          HERO
      ========================================== */}

      <section className="relative">
        {/* Background */}

        <div className="top-10 h-80 w-80 rounded-full bg-green-100/70 absolute -left-32 blur-3xl" />

        <div className="top-20 h-80 w-80 rounded-full bg-red-100/50 absolute -right-32 blur-3xl" />

        <div className="px-4 pb-16 pt-16 mx-auto max-w-7xl text-center relative sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-3xl">
            {/* Badge */}

            <div className="gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 text-sm font-bold text-green-700 inline-flex items-center">
              <HeartPulse size={17} />
              MediFind Support
            </div>

            {/* Heading */}

            <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
              We're Here to
              <span className="text-green-600"> Help</span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Have a question about finding medicines, pharmacies, orders or
              deliveries? Contact the MediFind team.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTACT INFORMATION
      ========================================== */}

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 transition group-hover:bg-green-600">
                    <Icon
                      size={22}
                      className="text-green-600 transition group-hover:text-white"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">{item.title}</h3>

                  <p className="mt-2 text-sm font-semibold text-green-600">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {item.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          CONTACT FORM + INFO
      ========================================== */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* =====================================
              LEFT INFORMATION
          ====================================== */}

          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-green-600">
              Get In Touch
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Send Us a<span className="text-green-600"> Message</span>
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Whether you are a customer looking for medicine, a pharmacy
              interested in joining MediFind, or a delivery partner, our team
              would be happy to hear from you.
            </p>

            {/* Support points */}

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <ShieldCheck size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Secure Support</h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your contact information is used to respond to your request.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <Clock3 size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Support Hours</h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Monday to Saturday, 9:00 AM to 6:00 PM.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <MessageCircle size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Quick Assistance</h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Contact us through WhatsApp for general platform support.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
              <ArrowRight size={17} />
            </a>
          </div>

          {/* =====================================
              FORM
          ====================================== */}

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-7">
              <h3 className="text-2xl font-extrabold text-gray-900">
                Contact Form
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Fill out the form and we'll get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="px-4 py-3 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>

              {/* Email + Phone */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 text-sm font-semibold text-gray-700 block"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="px-4 py-3 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 text-sm font-semibold text-gray-700 block"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="px-4 py-3 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Subject */}

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="px-4 py-3 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                >
                  <option value="">Select a subject</option>

                  <option value="medicine">Medicine Search</option>

                  <option value="order">Order Support</option>

                  <option value="pharmacy">Pharmacy Registration</option>

                  <option value="delivery">Delivery Support</option>

                  <option value="technical">Technical Issue</option>

                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="px-4 py-3 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="gap-2 px-6 py-3.5 w-full justify-center rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 flex items-center transition hover:bg-green-700"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================
          LOCATION
      ========================================== */}

      <section id="location" className="bg-gray-50">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-10 items-center lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
                Find Us
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Serving Customers
                <span className="text-green-600"> Nearby</span>
              </h2>

              <p className="mt-5 text-gray-600 leading-7">
                MediFind is designed around location-based medicine discovery,
                helping customers connect with pharmacies in their area.
              </p>

              <div className="mt-7 gap-4 flex items-start">
                <div className="h-12 w-12 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <MapPin size={23} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">MediFind</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Bhubaneswar, Odisha, India
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}

            <div className="min-h-[350px] justify-center overflow-hidden rounded-[2rem] bg-green-100 relative flex items-center">
              {/* Grid */}

              <div
                className="opacity-30 absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Center */}

              <div className="flex-col relative flex items-center">
                <div className="h-20 w-20 justify-center rounded-full bg-green-600 text-white shadow-xl shadow-green-900/20 flex items-center">
                  <MapPin size={35} />
                </div>

                <div className="mt-5 px-5 py-3 rounded-xl bg-white text-center shadow-lg">
                  <p className="font-bold text-gray-900">MediFind</p>

                  <p className="text-xs text-gray-500">Bhubaneswar, Odisha</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FAQ
      ========================================== */}

      <section className="px-4 py-20 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
            FAQ
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-600">
            Some common questions about MediFind.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="gap-4 px-5 py-5 w-full justify-between text-left flex items-center"
                >
                  <span className="font-bold text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-green-600 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 py-5 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-7">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          IMPORTANT NOTICE
      ========================================== */}

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="p-6 mx-auto max-w-5xl rounded-2xl border border-red-100 bg-red-50">
          <div className="gap-4 flex">
            <div className="h-10 w-10 justify-center rounded-xl bg-red-100 flex shrink-0 items-center">
              <ShieldCheck size={20} className="text-red-600" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">Important Notice</h3>

              <p className="mt-2 text-sm text-gray-600 leading-6">
                MediFind is a medicine discovery, pharmacy connection and
                ordering platform. For medical emergencies or urgent health
                concerns, contact your local emergency medical service or a
                qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="px-6 py-14 mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r text-center shadow-2xl shadow-green-900/20 from-green-600 to-green-700 sm:px-10">
          <div className="mx-auto max-w-2xl">
            <HeartPulse size={36} className="mx-auto text-white" />

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Need Help With MediFind?
            </h2>

            <p className="mt-4 text-green-50 leading-7">
              Our support team is here to help you with questions about the
              platform.
            </p>

            <a
              href="mailto:mdtabishfiroz@gmail.com"
              className="mt-8 gap-2 px-7 py-3.5 rounded-xl bg-white font-bold text-green-700 inline-flex items-center transition hover:bg-green-50"
            >
              <Mail size={18} />
              Email Support
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
