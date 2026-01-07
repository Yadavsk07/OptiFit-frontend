import { Link } from "react-router-dom";
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Apple, 
  Award, 
  Flame, 
  Zap, 
  BarChart3,
  Calendar,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Users,
  Activity
} from "lucide-react";

const Landing = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-semibold">AI-Powered Fitness Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                AI Fitness Coach
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Get personalized workout plans, smart nutrition guidance, and track your progress with AI-powered insights. 
              Transform your fitness journey with the power of artificial intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                Start Free Today
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-indigo-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-300" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-300" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-300" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete AI-powered fitness ecosystem designed to help you achieve your goals faster and smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Dumbbell size={32} />}
              title="AI-Generated Workout Plans"
              description="Personalized workout routines based on your fitness goals, level, equipment, and preferences. Get expert-level plans in seconds."
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Apple size={32} />}
              title="Smart Diet Plans"
              description="Custom nutrition plans with precise calorie and macro targets. Tailored to your body metrics, goals, and dietary preferences."
              gradient="from-green-500 to-emerald-600"
            />
            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="Advanced Progress Tracking"
              description="Track PRs, streaks, weight progress, and exercise history. Visualize your journey with interactive charts and analytics."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={<BookOpen size={32} />}
              title="Comprehensive Exercise Library"
              description="Browse 150+ exercises with detailed instructions, videos, tips, and alternatives. Learn proper form and technique."
              gradient="from-indigo-500 to-purple-600"
            />
            <FeatureCard
              icon={<MessageCircle size={32} />}
              title="24/7 AI Fitness Coach"
              description="Get instant answers to fitness questions, modify your plans, and receive personalized guidance anytime you need it."
              gradient="from-orange-500 to-red-600"
            />
            <FeatureCard
              icon={<Award size={32} />}
              title="Gamified Progress"
              description="Earn PRs, build streaks, and track achievements. Stay motivated with visual progress indicators and milestone celebrations."
              gradient="from-yellow-500 to-orange-600"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and transform your fitness journey
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Create Account"
              description="Sign up in seconds with just your email and password. No credit card required."
              icon={<Users size={24} />}
            />
            <StepCard
              number="2"
              title="Complete Profile"
              description="Tell us about your goals, fitness level, equipment, and preferences. Takes just 2 minutes."
              icon={<Target size={24} />}
            />
            <StepCard
              number="3"
              title="Get AI Plans"
              description="Receive personalized workout and diet plans generated by advanced AI based on your profile."
              icon={<Sparkles size={24} />}
            />
            <StepCard
              number="4"
              title="Track & Improve"
              description="Log your workouts, track progress, break PRs, and let AI guide you to success."
              icon={<Activity size={24} />}
            />
          </div>
        </div>
      </section>

      {/* KEY FEATURES DETAILED */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left: Image/Icon Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-12 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                <Dumbbell size={120} className="text-white mx-auto" />
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Personalized Workout Plans
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our AI analyzes your fitness profile to create workout plans that match your exact needs. 
                Whether you're a beginner or advanced, have a full gym or just bodyweight, we've got you covered.
              </p>
              <ul className="space-y-4">
                <FeatureItem text="Customized to your fitness goals (weight loss, muscle gain, endurance)" />
                <FeatureItem text="Adapts to your available equipment (gym, home, bodyweight)" />
                <FeatureItem text="Considers your injuries and limitations" />
                <FeatureItem text="Weekly schedules with day-by-day exercise breakdowns" />
                <FeatureItem text="Sets, reps, rest times, and form tips included" />
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left: Content */}
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Smart Nutrition Planning
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get science-backed diet plans that align with your fitness goals. Calculate your daily 
                calorie and macro needs automatically based on your body composition and activity level.
              </p>
              <ul className="space-y-4">
                <FeatureItem text="Daily calorie targets based on your goals" />
                <FeatureItem text="Precise macro breakdown (protein, carbs, fats)" />
                <FeatureItem text="Meal plans with detailed nutrition info" />
                <FeatureItem text="Supports vegetarian, vegan, and non-vegetarian diets" />
                <FeatureItem text="Grocery lists and meal prep suggestions" />
              </ul>
            </div>

            {/* Right: Image/Icon Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform">
                <Apple size={120} className="text-white mx-auto" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image/Icon Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-12 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                <BarChart3 size={120} className="text-white mx-auto" />
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Advanced Progress Tracking
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Never lose track of your progress. Our comprehensive tracking system helps you stay 
                motivated and see real results over time.
              </p>
              <ul className="space-y-4">
                <FeatureItem text="Personal Records (PRs) automatically calculated" />
                <FeatureItem text="Workout streaks to keep you consistent" />
                <FeatureItem text="Daily exercise logging with date tracking" />
                <FeatureItem text="Weight progress visualization with charts" />
                <FeatureItem text="30-day workout calendar view" />
                <FeatureItem text="Exercise history and performance trends" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STATS/BENEFITS */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose OptiFit?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of users transforming their fitness with AI-powered guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={<Zap size={32} />}
              number="Instant"
              label="AI-Generated Plans"
              description="Get personalized plans in seconds, not days"
            />
            <StatCard
              icon={<Target size={32} />}
              number="100%"
              label="Personalized"
              description="Every plan tailored to your unique profile"
            />
            <StatCard
              icon={<Flame size={32} />}
              number="24/7"
              label="AI Coach"
              description="Get answers and guidance anytime"
            />
            <StatCard
              icon={<Award size={32} />}
              number="Free"
              label="Forever"
              description="No hidden costs, no subscriptions"
            />
          </div>
        </div>
      </section>

      {/* AI COACH SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-12 md:p-16 border-2 border-indigo-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-6 shadow-xl">
                <MessageCircle className="text-white" size={40} />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Personal AI Fitness Coach
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get instant, expert-level answers to all your fitness questions. Our AI coach is available 24/7 
                to help you on your journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  Answer Questions
                </h4>
                <p className="text-gray-600">
                  Ask about exercises, nutrition, form, recovery, or general fitness advice. Get comprehensive, 
                  science-backed answers instantly.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  Modify Plans
                </h4>
                <p className="text-gray-600">
                  Need to adjust your workout or diet plan? Just ask! The AI can update your plans based on 
                  your feedback and preferences.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  Calculate Metrics
                </h4>
                <p className="text-gray-600">
                  Get help calculating BMI, calories, macros, or any fitness-related metrics. The AI does the 
                  math for you.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  Stay Motivated
                </h4>
                <p className="text-gray-600">
                  Get encouragement, tips, and motivation when you need it most. Your AI coach is always 
                  there to support you.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/signup"
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform transition-all hover:scale-105 shadow-xl"
              >
                Try AI Coach Free
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EXERCISE LIBRARY HIGHLIGHT */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                <BookOpen size={16} />
                Exercise Library
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Master Every Exercise
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Access our comprehensive library of 150+ exercises with detailed instructions, 
                video demonstrations, and expert tips. Learn proper form and avoid common mistakes.
              </p>
              <ul className="space-y-4 mb-8">
                <FeatureItem text="Step-by-step instructions for each exercise" />
                <FeatureItem text="Common mistakes to avoid" />
                <FeatureItem text="Pro tips for better results" />
                <FeatureItem text="Alternative exercises for variations" />
                <FeatureItem text="Video demonstrations via YouTube" />
                <FeatureItem text="Filter by muscle group, equipment, and difficulty" />
              </ul>
              <Link
                to="/signup"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Explore Exercise Library
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                <Dumbbell className="text-blue-600 mb-3" size={32} />
                <h4 className="font-bold text-gray-900 mb-2">Strength</h4>
                <p className="text-sm text-gray-600">Build muscle and power</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                <Activity className="text-green-600 mb-3" size={32} />
                <h4 className="font-bold text-gray-900 mb-2">Cardio</h4>
                <p className="text-sm text-gray-600">Improve endurance</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                <Target className="text-purple-600 mb-3" size={32} />
                <h4 className="font-bold text-gray-900 mb-2">Flexibility</h4>
                <p className="text-sm text-gray-600">Increase mobility</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
                <Award className="text-orange-600 mb-3" size={32} />
                <h4 className="font-bold text-gray-900 mb-2">Advanced</h4>
                <p className="text-sm text-gray-600">Challenge yourself</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are achieving their fitness goals with AI-powered guidance. 
            Start your journey today — it's completely free!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={22} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-8 text-indigo-200 text-sm">
            No credit card required • Free forever • AI-powered
          </p>
        </div>
      </section>
    </div>
  );
};

/* Feature Card Component */
const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

/* Step Card Component */
const StepCard = ({ number, title, description, icon }) => (
  <div className="text-center">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-xl opacity-50"></div>
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-xl">
        {number}
      </div>
      <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
        <span className="text-indigo-600">{icon}</span>
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">
      {title}
    </h3>
    <p className="text-gray-600">
      {description}
    </p>
  </div>
);

/* Feature Item Component */
const FeatureItem = ({ text }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
    <span className="text-gray-700">{text}</span>
  </li>
);

/* Stat Card Component */
const StatCard = ({ icon, number, label, description }) => (
  <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 text-white">
      {icon}
    </div>
    <div className="text-3xl font-bold mb-2">{number}</div>
    <div className="text-lg font-semibold mb-2 text-indigo-100">{label}</div>
    <div className="text-sm text-indigo-200">{description}</div>
  </div>
);

export default Landing;
