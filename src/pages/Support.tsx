import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useMessageLimit } from '@/contexts/MessageLimitContext';
import { Navigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const contactInfo = {
  email: 'mail.morningtiffins@gmail.com',
  phone: '+1 (555) 123-4567',
  address: '123 Food Street, Cuisine City, FC 12345',
  orderingHours: '5:30 AM - 12:00 AM (Midnight)',
  deliveryHours: '6:00 AM - 10:00 AM',
  nextDayDelivery: 'Orders placed after 11:00 PM will be delivered the next day',
};

const faqItems = [
  {
    question: "What are your ordering hours?",
    answer: "We accept orders from 5:30 AM to 12:00 AM (Midnight). Orders placed after 11:00 PM will be delivered the next day. Our delivery hours are from 6:00 AM to 10:00 AM."
  },
  {
    question: "When will my order be delivered?",
    answer: "Orders placed between 5:30 AM and 11:00 PM will be delivered the same day between 6:00 AM and 10:00 AM. Orders placed after 11:00 PM will be delivered the next day during the same delivery window."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay."
  },
  {
    question: "How can I modify or cancel my subscription?",
    answer: "You can modify or cancel your subscription at any time by going to the 'Subscriptions' section in your profile. Click on your active subscription and select the desired action."
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with your order, please contact our support team within 24 hours of delivery for a full refund."
  },
  {
    question: "How do I update my delivery address?",
    answer: "You can update your delivery address by going to the 'Address' section in your profile. Click on 'Add New Address' or edit an existing address."
  },
  {
    question: "Can I place an order for a specific delivery time?",
    answer: "Currently, we deliver all orders between 6:00 AM and 10:00 AM. Orders placed after 11:00 PM will be delivered the next day. We don't offer specific delivery time slots at this time."
  }
];

export const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { messagesLeft, lastMessageTime, canSendMessage, checkMessageLimit, updateMessageCount } = useMessageLimit();

  useEffect(() => {
    if (user) {
      checkMessageLimit();
    }
  }, [user, checkMessageLimit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSendMessage) {
      toast.error(`You have used today's message limit. Please try again tomorrow.`);
      return;
    }

    if (!user || !profile) {
      toast.error('Please log in to send messages');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: contactInfo.email,
        subject: formData.subject,
        message: formData.message,
        user_id: user.uid,
        user_email: profile.email,
        order_info: profile.orderHistory && profile.orderHistory.length > 0 
          ? `Latest order: ${profile.orderHistory[0].id}`
          : 'No orders found',
        timestamp: new Date().toISOString()
      };

      // Send email using EmailJS
      await emailjs.send(
        'service_7uve7c9', // EmailJS service ID
        'template_78omane', // EmailJS template ID
        templateParams,
        'jgCM9y3VXOmGDkbbf' // EmailJS public key
      );

      // Update message count
      await updateMessageCount();

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      toast.success('Message sent successfully! We will get back to you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Support Center</h1>

      {/* Important Notice */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Important Ordering Information</h3>
              <p className="text-blue-600">
                We accept orders from 5:30 AM to 12:00 AM (Midnight). Orders placed after 11:00 PM will be delivered the next day. 
                Our delivery hours are from 6:00 AM to 10:00 AM. Please plan your orders accordingly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Limit Notice */}
      {user && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-700 mb-2">Message Limit</h3>
                <p className="text-yellow-600">
                  You have {messagesLeft} message{messagesLeft !== 1 ? 's' : ''} left for today.
                  {lastMessageTime && (
                    <span className="block mt-1">
                      Last message sent at {format(lastMessageTime, 'h:mm a')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{contactInfo.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              Phone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{contactInfo.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{contactInfo.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Ordering Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{contactInfo.orderingHours}</p>
            <p className="text-sm text-gray-500 mt-1">{contactInfo.nextDayDelivery}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Delivery Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{contactInfo.deliveryHours}</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={!canSendMessage || isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!canSendMessage || isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                disabled={!canSendMessage || isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="min-h-[150px]"
                disabled={!canSendMessage || isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={!canSendMessage || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 