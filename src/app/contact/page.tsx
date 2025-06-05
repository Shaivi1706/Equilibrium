// 'use client';

// import React, { FormEvent, useState } from 'react';
// import { BackgroundBeams } from '@/components/ui/background-beams';

// function MusicSchoolContactUs() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

// const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//   event.preventDefault();

//   try {
//     const res = await fetch('/api/post-contact', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, message }),
//     });

//     if (!res.ok) throw new Error('Network response was not ok');

//     const data = await res.json();
//     if (data.status === 'success') {
//       alert('Thank you for your feedback!');
//       setEmail('');
//       setMessage('');
//     }
//   } catch (error) {
//     console.error('Fetch error:', error);
//     alert('Something went wrong while sending your message.');
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 pt-36 relative">
//       {' '}
//       {/* Ensure the container is relative */}
//       {/* BackgroundBeams with adjusted z-index */}
//       <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />
//       {/* Content with higher z-index */}
//       <div className="max-w-2xl mx-auto p-4 relative z-10">
//         {' '}
//         {/* Add relative and z-10 to bring content to the front */}
//         <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">
//           Contact Us
//         </h1>
//         <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center">
//           I'll be grateful for your review about my website :-)
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Your email address"
//             className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full p-4 text-white bg-neutral-950 placeholder:text-neutral-700"
//             required
//           />
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Your message"
//             className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full text-white p-4 bg-neutral-950 placeholder:text-neutral-700"
//             rows={5}
//             required
//           ></textarea>
//           <button
//             type="submit"
//             className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
//           >
//             Send Message
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default MusicSchoolContactUs;


'use client';
import React, { FormEvent, useState } from 'react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

function MusicSchoolContactUs() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/post-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      if (data.status === 'success') {
        setIsSuccess(true);
        setEmail('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Something went wrong while sending your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 pt-36 relative overflow-hidden">
      {/* BackgroundBeams with adjusted z-index */}
      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />
      
      {/* Content with higher z-index */}
      <div className="max-w-3xl mx-auto p-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-6">
            <MessageSquare className="w-8 h-8 text-teal-400" />
          </div>
          
          <h1 className="text-4xl md:text-7xl font-sans font-bold mb-6 text-white leading-tight">
            Get In <span className="text-teal-400">Touch</span>
          </h1>
          
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
            I'd love to hear your thoughts about my website! Your feedback helps me create better experiences for everyone.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-black/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-8 shadow-2xl">
          {isSuccess && (
            <div className="mb-6 p-4 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <p className="text-teal-300 font-medium">Thank you for your feedback! I'll get back to you soon.</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-4 rounded-xl border border-neutral-700 bg-neutral-900/50 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                required
              />
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-white font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me what you think about the website, any suggestions, or just say hello!"
                className="w-full p-4 rounded-xl border border-neutral-700 bg-neutral-900/50 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm resize-none"
                rows={6}
                required
              />
            </div>

            {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-teal-500/50 disabled:to-teal-600/50 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-teal-500/25 flex items-center justify-center gap-3"
              >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
              </button>
            </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Usually respond within 24 hours • All feedback is appreciated
          </p>
        </div>
      </div>
    </div>
  );
}

export default MusicSchoolContactUs;