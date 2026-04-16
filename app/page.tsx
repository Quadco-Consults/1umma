'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, GraduationCap, Heart, BookOpen, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { currentRole } = useRole();

  // Redirect if already logged in
  useEffect(() => {
    if (currentRole) {
      const redirectPath = currentRole === 'school' ? '/portal/dashboard' : '/dashboard';
      router.push(redirectPath);
    }
  }, [currentRole, router]);

  const stats = [
    { number: '500+', label: 'Students Supported' },
    { number: '50+', label: 'Partner Schools' },
    { number: '₦50M+', label: 'Scholarships Awarded' },
    { number: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: 'Quality Islamic Education',
      description: 'Providing access to top-tier Islamic schools for underprivileged students across Abuja.',
    },
    {
      icon: Heart,
      title: 'Holistic Support',
      description: 'Beyond tuition - covering books, uniforms, and essential learning materials.',
    },
    {
      icon: BookOpen,
      title: 'Academic Excellence',
      description: 'Monitoring student performance and ensuring continuous academic growth.',
    },
    {
      icon: Award,
      title: 'Merit-Based Selection',
      description: 'Fair and transparent selection process based on need and academic potential.',
    },
  ];

  const benefits = [
    'Full tuition coverage for qualified students',
    'Learning materials and school supplies',
    'Regular academic progress monitoring',
    'Community and mentorship support',
    'Pathway to higher education opportunities',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Contact Bar */}
      <div className="bg-brand-cream border-b border-brand/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-brand/80">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>+234 812 949 6666, +234 816 681 5377</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>hello@1ummahng.org</span>
              </div>
            </div>
            <div className="text-xs">Empowering the Ummah through Education</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-brand text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 bg-white rounded-full p-1.5">
                <Image
                  src="/1Ummah-Web-logo.png"
                  alt="1Ummah Logo"
                  fill
                  className="object-contain p-0.5"
                  sizes="56px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">1-Ummah</h1>
                <p className="text-xs text-white/90">Islamic Organisation</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <a href="#about" className="hover:text-brand-light transition-colors">About SILP</a>
              <a href="#features" className="hover:text-brand-light transition-colors">Features</a>
              <a href="#benefits" className="hover:text-brand-light transition-colors">Benefits</a>
              <a href="#contact" className="hover:text-brand-light transition-colors">Contact</a>
            </nav>

            {/* Login Button */}
            <Button
              onClick={() => router.push('/login')}
              className="bg-white text-brand hover:bg-brand-light hover:text-brand font-semibold shadow-md"
              size="lg"
            >
              Portal Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand/5 via-white to-brand-light/20 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-light rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-semibold">
                Transforming Lives Through Education
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand leading-tight">
                Scholarship Initiative for the Less Privileged
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Empowering underprivileged students across Abuja with access to quality Islamic education.
                Together, we're building a stronger, more educated Ummah.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-brand hover:bg-brand/90 text-white font-semibold text-lg h-14 px-8 shadow-lg"
                  onClick={() => router.push('/login')}
                >
                  Access Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand text-brand hover:bg-brand hover:text-white font-semibold text-lg h-14 px-8"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-brand">{stat.number}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/SILP-Graduation-150x150.png"
                  alt="SILP Students"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-light/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              Comprehensive support designed to ensure student success and academic excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 border-transparent hover:border-brand hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-brand" />
                    </div>
                    <CardTitle className="text-xl text-brand">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Benefits List */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-brand mb-6">
                Program Benefits
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our scholarship program provides comprehensive support to ensure every student
                has the opportunity to succeed academically and personally.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/1Ummah-NG22.png"
                  alt="1Ummah Students"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Make a Difference?</h2>
            <p className="text-xl text-white/90">
              Join us in transforming lives through education. Access our portal to manage scholarships,
              track student progress, or make a contribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-brand hover:bg-brand-light font-semibold text-lg h-14 px-8"
                onClick={() => router.push('/login')}
              >
                Access Portal
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-brand font-semibold text-lg h-14 px-8"
              >
                Make Donation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-brand/95 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo and About */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 bg-white rounded-full p-1">
                  <Image
                    src="/1Ummah-Web-logo.png"
                    alt="1Ummah Logo"
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">1-Ummah</h3>
                  <p className="text-sm text-white/80">Islamic Organisation</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                Empowering the Muslim community through education, charity, and social development initiatives.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Us</h4>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>+234 812 949 6666</p>
                    <p>+234 816 681 5377</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>hello@1ummahng.org</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm text-white/80">
                <a href="#about" className="block hover:text-white transition-colors">About SILP</a>
                <a href="#features" className="block hover:text-white transition-colors">Features</a>
                <a href="#benefits" className="block hover:text-white transition-colors">Benefits</a>
                <button onClick={() => router.push('/login')} className="block hover:text-white transition-colors">Portal Login</button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
            <p>© 2026 1Ummah Islamic Organisation, Abuja. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
