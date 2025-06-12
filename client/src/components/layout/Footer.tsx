import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-900">S</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Simpsons Toy Store</h3>
                <p className="text-blue-200 text-sm">Premium Collectibles</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm mb-4">
              Your one-stop shop for authentic Simpsons merchandise, toys, and collectibles from Springfield's finest family.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <i className="fab fa-youtube text-xl" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=plush" className="hover:text-white transition-colors">Plush Toys</Link></li>
              <li><Link href="/products?category=figures" className="hover:text-white transition-colors">Action Figures</Link></li>
              <li><Link href="/products?category=collectibles" className="hover:text-white transition-colors">Collectibles</Link></li>
              <li><Link href="/products?category=lego" className="hover:text-white transition-colors">LEGO Sets</Link></li>
              <li><Link href="/products?new=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-white transition-colors">Sale Items</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-xl font-semibold mb-2">Stay Updated!</h4>
            <p className="text-blue-200 text-sm mb-4">
              Get the latest news about new products, exclusive deals, and Springfield updates!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-yellow-400 text-gray-900"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200 text-sm">
          <p>© 2024 Simpsons Toy Store. All rights reserved. | D'oh! These are premium collectibles!</p>
          <p className="mt-2">The Simpsons™ & © 2024 Twentieth Century Fox Film Corporation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
