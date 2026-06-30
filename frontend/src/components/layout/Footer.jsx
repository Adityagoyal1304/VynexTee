// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Globe, Share2, Play, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0d0d1a] border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-4" aria-label="Vynextee home">
              <img
                src="/logo.png"
                alt="Vynextee"
                className="h-10 w-10 object-contain transition-transform group-hover:scale-110 duration-300"
              />
              <span
                className="font-display text-xl font-bold tracking-wider text-white"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                VYNEX<span className="text-[#60a5fa]">TEE</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              Premium T-shirts and bags crafted for the bold. Quality that speaks louder than logos.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Globe, href: "#", label: "Website" },
                { Icon: Share2, href: "#", label: "Share" },
                { Icon: Play, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-[#60a5fa] hover:border-[#60a5fa]/30 hover:bg-[#60a5fa]/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: "All Products", to: "/shop" },
                { label: "T-Shirts", to: "/shop?category=tshirt" },
                { label: "Bags", to: "/shop?category=bag" },
                { label: "New Arrivals", to: "/shop?badge=New" },
                { label: "Bestsellers", to: "/shop?badge=Bestseller" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Info</h3>
            <ul className="space-y-3">
              {[
                "About Us",
                "Size Guide",
                "Shipping Policy",
                "Returns & Refunds",
                "Privacy Policy",
                "Terms of Service",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin size={16} className="mt-0.5 text-[#60a5fa] shrink-0" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li>
                <a
                  href="mailto:hello@vynextee.com"
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <Mail size={16} className="text-[#60a5fa] shrink-0" />
                  hello@vynextee.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919999999999"
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <Phone size={16} className="text-[#60a5fa] shrink-0" />
                  +91 99999 99999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {year} Vynextee. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Visa", "Mastercard", "UPI", "RazorPay"].map((method) => (
              <span
                key={method}
                className="text-xs text-white/30 px-2 py-1 rounded bg-white/5 border border-white/5"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
