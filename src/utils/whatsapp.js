export const createWhatsAppLink = ({ type, name, price, category, customMessage, phone }) => {
  // Use settings phone if passed, otherwise fallback
  const fallbackNumber = '917009482040';
  let finalPhone = phone || window.__SALON_WHATSAPP_NUMBER__ || fallbackNumber;

  // Clean the number format: remove non-digits
  finalPhone = finalPhone.replace(/\D/g, '');

  let text = 'Hi Mehak Salon & Spa,\n';

  if (customMessage) {
    text += customMessage;
  } else if (type === 'service') {
    text += `I want to know more about ${name || 'your services'}.\n`;
    if (category) text += `Category: ${category}\n`;
    if (price) text += `Price: ₹${price}\n`;
    text += `Please share availability and booking details.`;
  } else if (type === 'package') {
    text += `I want to book the ${name || 'package'}.\n`;
    if (price) text += `Package Price: ₹${price}\n`;
    text += `Please share availability and booking details.`;
  } else if (type === 'course') {
    text += `I want to know more about ${name || 'your courses'}.\n`;
    if (price) text += `Course Fee: ₹${price}\n`;
    text += `Please share course details and enrollment process.`;
  } else if (type === 'offer') {
    text += `I want to know more about the offer: ${name || 'your offers'}.\n`;
    if (price) text += `Offer Price: ₹${price}\n`;
    text += `Please share availability and booking details.`;
  } else {
    // General booking fallback
    text += `I want to book an appointment.\nPlease share available slots.`;
  }

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${finalPhone}?text=${encodedText}`;
};
