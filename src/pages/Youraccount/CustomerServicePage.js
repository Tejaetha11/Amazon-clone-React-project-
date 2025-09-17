import { useState } from "react";

export const CustomerServicePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatusMessage("Please fill in all fields");
      return;
    }

    // Simulate submitting to server / API
    try {
      // Replace with real submit API call if available
      await new Promise(resolve => setTimeout(resolve, 1500)); // mock delay

      setStatusMessage("Your message has been sent. Our support team will contact you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatusMessage("Error sending message. Please try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Customer Service</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p>Phone: <a href="tel:+911234567890" className="text-blue-600 underline">+91 12345 67890</a></p>
        <p>Email: <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a></p>
        <p>Our service hours: Monday to Saturday, 9 AM - 6 PM</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>How do I track my order?</strong> — Log in to your account, go to Orders, and select the order you want to track.</li>
          <li><strong>How do I return or exchange an item?</strong> — Visit our Returns & Exchanges page and follow the instructions.</li>
          <li><strong>How do I cancel an order?</strong> — Contact our support as soon as possible, or cancel from your Orders page if allowed.</li>
          <li><strong>What payment methods are accepted?</strong> — We accept credit card, debit card, net banking, UPI, and cash on delivery.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
        {statusMessage && (
          <div className={`mb-4 p-3 rounded ${statusMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {statusMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Name</label>
            <input id="name" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">Email</label>
            <input id="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} className="w-full border rounded px-3 py-2" type="email" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="subject">Subject</label>
            <input id="subject" value={formData.subject} onChange={e => handleInputChange("subject", e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Brief subject" />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="message">Message</label>
            <textarea id="message" value={formData.message} onChange={e => handleInputChange("message", e.target.value)} className="w-full border rounded px-3 py-2" rows={5} placeholder="Explain your issue or question"></textarea>
          </div>
          <button type="submit" className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 font-semibold">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};
