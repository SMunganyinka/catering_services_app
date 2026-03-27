import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, MessageCircle, Building2, ChevronDown, ChevronUp, 
  Check, Calendar, ArrowRight, Navigation, X
} from 'lucide-react';

interface ContactPageProps {}

const ContactPage: React.FC<ContactPageProps> = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedMapArea, setSelectedMapArea] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Data ---

  const faqs = [
    {
      question: 'What is the minimum guest count for each service tier?',
      answer: 'Silver tier starts at 20 guests, Gold tier at 50 guests, and Diamond tier at 100 guests. We can accommodate larger events with custom packages.'
    },
    {
      question: 'How far in advance should I book my event?',
      answer: 'We recommend booking at least 2-4 weeks in advance for small events and 2-3 months for weddings and large corporate events to ensure availability.'
    },
    {
      question: 'Do you accommodate dietary restrictions?',
      answer: 'Absolutely! We specialize in creating delicious menus for vegetarian, vegan, gluten-free, halal, and allergy-friendly options. Your guests\' safety is our priority.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, mobile money (MoMo/Airtel Money), and all major credit cards. A 50% deposit is required to secure your date.'
    },
    {
      question: 'Do you provide rentals and equipment?',
      answer: 'Yes, we have an extensive inventory of tables, chairs, linens, and dinnerware included in our Gold and Diamond packages.'
    }
  ];

  const departments = [
    { 
      name: 'Sales & Bookings', 
      email: 'bookings@cuisine-courier.com', 
      phone: '+250 788 123 456',
      desc: 'New event inquiries, quotes, and scheduling.',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    { 
      name: 'Operations', 
      email: 'ops@cuisine-courier.com', 
      phone: '+250 788 123 457',
      desc: 'Day-of coordination, setup, and staffing.',
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-stone-100 text-stone-700 border-stone-200'
    },
    { 
      name: 'Client Support', 
      email: 'support@cuisine-courier.com', 
      phone: '+250 788 123 458',
      desc: 'Billing, feedback, and post-event support.',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    }
  ];

  // Coordinates adjusted for a real Google Map (Centered on Kigali)
  const serviceAreas = [
    { id: 1, name: 'Kigali City', x: '50%', y: '35%', info: 'Full service available for all corporate and private events.' },
    { id: 2, name: 'Nyamata', x: '65%', y: '55%', info: 'Available for large outdoor weddings and community events.' },
    { id: 3, name: 'Musanze', x: '45%', y: '15%', info: 'Specialized in tourism lodge catering and retreats.' },
    { id: 4, name: 'Huye', x: '55%', y: '75%', info: 'University event specialists and large galas.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen text-stone-800 font-sans pb-20">
      
      {/* --- Hero Section --- */}
      <header className="relative pt-20 pb-20 px-6 border-b border-stone-200/60 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#44403c 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-stone-900 mb-6 leading-tight">
            Let's Plan Something <br/> <span className="text-yellow-500 italic">Extraordinary</span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Whether you have a question about services, pricing, or need a custom quote, our team is ready to assist you.
          </p>
        </div>
      </header>

      {/* --- Quick Contact Cards --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
              <Phone className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-1">Call Us</h3>
            <p className="text-stone-400 text-sm mb-3">Mon - Fri: 8am - 6pm</p>
            <p className="font-bold text-stone-900 text-lg">+250 788 123 456</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
              <Mail className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-1">Email Us</h3>
            <p className="text-stone-400 text-sm mb-3">We reply within 24 hours</p>
            <p className="font-bold text-stone-900 text-lg">info@cuisine-courier.com</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
              <MapPin className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-1">Visit Us</h3>
            <p className="text-stone-400 text-sm mb-3">Headquarters</p>
            <p className="font-bold text-stone-900 text-lg">KG 123 St, Kigali</p>
          </div>
        </div>
      </section>

      {/* --- Main Content Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Form (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-8 md:p-12">
              <h2 className="font-serif text-3xl font-bold mb-2">Start a Conversation</h2>
              <p className="text-stone-500 mb-8 font-light">Fill out the form below and the right department will get back to you.</p>

              {submitted ? (
                <div className="bg-green-50 p-12 rounded-3xl text-center border border-green-100 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-stone-900">Message Sent!</h3>
                  <p className="text-stone-600 font-light">Thank you for reaching out. A member of our team will contact you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-6 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Full Name</label>
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all font-medium text-stone-900 placeholder-stone-400"
                        placeholder="Frank Mugisha"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Email Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all font-medium text-stone-900 placeholder-stone-400"
                        placeholder="frank@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Phone</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all font-medium text-stone-900 placeholder-stone-400"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Inquiry Type</label>
                      <div className="relative">
                        <select 
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all appearance-none cursor-pointer font-medium text-stone-700"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="booking">Request Booking / Quote</option>
                          <option value="feedback">Feedback & Testimonials</option>
                          <option value="partnership">Business Partnership</option>
                          <option value="careers">Careers / Join Team</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Subject</label>
                    <input 
                      type="text" required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all font-medium text-stone-900 placeholder-stone-400"
                      placeholder="Brief subject line"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Message</label>
                    <textarea 
                      rows={5} required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all resize-none font-medium text-stone-900 placeholder-stone-400 leading-relaxed"
                      placeholder="Tell us about your event details..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-stone-900 text-amber-50 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-stone-900/10"
                  >
                    {isSubmitting ? (
                      <>Sending Message...</>
                    ) : (
                      <>Send Message <Send className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Departments & Map (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Department Specific Contacts */}
            <div>
              <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2 text-stone-900">
                <Building2 className="w-5 h-5 text-amber-500" /> Departments
              </h3>
              <div className="space-y-4">
                {departments.map((dept, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl Rwf{dept.color} group-hover:scale-110 transition-transform shrink-0`}>
                        {dept.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm mb-1">{dept.name}</h4>
                        <p className="text-xs text-amber-600 font-medium mb-1">{dept.email}</p>
                        <p className="text-xs text-stone-400 italic line-clamp-1">{dept.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Map Widget */}
            <div className="bg-white rounded-[2.5rem] p-4 border border-stone-200 shadow-lg overflow-hidden">
              <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2 text-stone-900">
                <Navigation className="w-5 h-5 text-amber-500" /> Service Areas
              </h3>
              
              <div className="relative h-80 bg-stone-200 rounded-2xl overflow-hidden border-2 border-stone-100 group">
                
                {/* 1. Real Google Map Embed */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15905.52233681776!2d30.058506!3d-1.944088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca73d78c8c3dd%3A0x536772b367486706!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', top: 0, left: 0, zIndex: 0, filter: 'grayscale(30%) contrast(1.1)' }} /* Slight filter to match brand */
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />

                {/* 2. Overlay Container for Pins */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {serviceAreas.map(area => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedMapArea(area)}
                      className={`pointer-events-auto absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:z-20 Rwf{
                        selectedMapArea?.id === area.id ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                      style={{ top: area.y, left: area.x }}
                      title={area.name}
                    >
                      <div className="relative">
                        {/* Custom Pin Styling */}
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-colors Rwf{
                          selectedMapArea?.id === area.id ? 'bg-amber-500 text-white' : 'bg-stone-800 text-white'
                        }`}>
                          <MapPin className="w-4 h-4 fill-current" />
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-stone-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                          {area.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 3. Selected Area Info Card Overlay */}
                {selectedMapArea && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 z-40 border border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-stone-900 font-serif text-lg">{selectedMapArea.name}</h4>
                      <button onClick={() => setSelectedMapArea(null)} className="text-stone-400 hover:text-stone-900 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed mb-3">{selectedMapArea.info}</p>
                    <button className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline group">
                      View Events Here <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12 text-stone-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-stone-50 transition-colors group"
              >
                <span className="font-bold text-stone-900 text-lg pr-8 group-hover:text-amber-700 transition-colors">{faq.question}</span>
                <div className={`p-2 rounded-full transition-colors Rwf{expandedFaq === index ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-500'}`}>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>
              {expandedFaq === index && (
                <div className="px-8 pb-6 text-stone-600 leading-relaxed border-t border-stone-100 pt-6 animate-in slide-in-from-top-2 fade-in duration-200 font-light">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ContactPage;