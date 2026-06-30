// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Globe, Share2, Play, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="pt-16 pb-8"
      style={{
        backgroundColor: "var(--bg-nav)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-4" aria-label="Vynextee home">
              <img
                src="/logo.jpeg"
                alt="Vynextee"
                className="h-10 w-10 object-contain rounded-lg transition-transform group-hover:scale-110 duration-300"
              />
              <span
                className="text-xl font-bold tracking-wider text-white"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                VYNEX<span style={{ color: "var(--accent)" }}>TEE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Premium T-shirts and bags crafted for the bold. Quality that speaks louder than logos.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Globe,  href: "#", label: "Website" },
                { Icon: Share2, href: "#", label: "Share" },
                { Icon: Play,   href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: "All Products",  to: "/shop" },
                { label: "T-Shirts",      to: "/shop?category=tshirt" },
                { label: "Bags",          to: "/shop?category=bag" },
                { label: "New Arrivals",  to: "/shop" },
                { label: "Bestsellers",   to: "/shop" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Info</h3>
            <ul className="space-y-3">
              {["About Us", "Size Guide", "Shipping Policy", "Returns & Refunds", "Privacy Policy", "Terms"].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                <span>123 Fashion Street, Mumbai, MH 400001</span>
              </li>
              <li>
                <a href="mailto:hello@vynextee.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Mail size={15} style={{ color: "var(--accent)" }} />
                  hello@vynextee.com
                </a>
              </li>
              <li>
                <a href="tel:+919999999999" className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Phone size={15} style={{ color: "var(--accent)" }} />
                  +91 99999 99999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {year} Vynextee. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "UPI", "RazorPay"].map((m) => (
              <span
                key={m}
                className="text-[10px] px-2 py-1 rounded"
                style={{ color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
