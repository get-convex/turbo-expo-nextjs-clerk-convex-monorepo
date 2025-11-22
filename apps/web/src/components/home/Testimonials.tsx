import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "wow... i'll never have to wait for the tik tokker to say the ingredients again... thank you !!!",
    author: "John",
    rating: 5
  },
  {
    quote: "Love the idea of this app. no more looking through a thousand different apps to find your saved recipe... I can have them all in one spot.",
    author: "Vanessa",
    rating: 5
  },
  {
    quote: "The coolest thing I've learned in a long time. Perfect for anyone who saves recipes and can be done from multiple platforms.",
    author: "Hollie",
    rating: 5
  },
  {
    quote: "This app is amazing and the most perfect way to get all those great recipes you've been saving all over the internet into one app! Also, this makes shopping for ingredients Wayyy easier.",
    author: "Justin",
    rating: 5
  },
  {
    quote: "omg!! thank God there is an app I can saved recipe too!! lost to many good recipes due to losing them or them getting deleted!!",
    author: "Amy",
    rating: 5
  },
  {
    quote: "Super convenient, especially for saving recipes from sites like tiktok. can't wait to explore more features as updates roll out. Loving it so far!",
    author: "Axel",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-brand-beige">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-brand-black tracking-tight">
          Why they love RecipeAI
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {testimonial.quote}
              </p>

              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-black text-black" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    {/* Placeholder for avatar */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                  </div>
                  <span className="font-bold text-black">{testimonial.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
