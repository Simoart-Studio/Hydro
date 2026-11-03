export interface Testimonial {
  quote: string;
  author: string;
  city: string;
}

export const testimonialsSection = {
  title: "Opinie klientów",
};

// Tylko prawdziwe opinie, za zgodą autora. Pusta tablica ukrywa sekcję.
export const testimonials: Testimonial[] = [];
