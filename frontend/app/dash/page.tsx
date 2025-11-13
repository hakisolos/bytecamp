'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home, Book, Users, Bell, UserCircle, Settings,
    Code, User, CheckCircle, Clock, Flame,
    BookOpen, GraduationCap, ThumbsUp, MessageCircle
} from 'lucide-react';

interface Course {
    title: string;
    description: string;
    duration: string;
    difficulty: string;
}

interface Activity {
    user: {
        name: string;
        initials: string;
        color: string;
    };
    time: string;
    message: string;
}

interface UserData {
    id: number;
    username: string;
    email: string;
    followers: string[];
    following: string[];
    courses: string[];
    avatar: string;
    level: string;
    joined_at: string;
    expoints: number;
    rank: string;
}

export default function ByteCampDashboard() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showSwipeNotification, setShowSwipeNotification] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Check if JWT exists
                const jwt = localStorage.getItem('jwt');
                if (!jwt) {
                    router.push('/login');
                    return;
                }

                // Fetch user profile
                const response = await fetch('http://localhost:8080/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        // Invalid or expired token
                        localStorage.removeItem('jwt');
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                if (data.success) {
                    setUserData(data.data);
                } else {
                    throw new Error('Failed to load user data');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    useEffect(() => {
        const swipeShown = localStorage.getItem('swipeNotificationShown');
        if (!swipeShown && window.innerWidth < 768) {
            setTimeout(() => {
                setShowSwipeNotification(true);
                setTimeout(() => setShowSwipeNotification(false), 4000);
                localStorage.setItem('swipeNotificationShown', 'true');
            }, 1000);
        }
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 80) {
            setIsSidebarOpen(false);
        }
        if (touchEnd - touchStart > 80 && touchStart < window.innerWidth / 2) {
            setIsSidebarOpen(true);
        }
    };

    const recommendedCourses: Course[] = [
        {
            title: "Introduction to Python",
            description: "Learn the basics of Python programming",
            duration: "4 hours",
            difficulty: "Beginner"
        },
        {
            title: "Web Development Fundamentals",
            description: "HTML, CSS, and JavaScript basics",
            duration: "6 hours",
            difficulty: "Beginner"
        },
        {
            title: "Data Science Essentials",
            description: "Introduction to data analysis and visualization",
            duration: "8 hours",
            difficulty: "Intermediate"
        }
    ];

    const communityActivities: Activity[] = [
        {
            user: {
                name: userData?.username || "User",
                initials: userData?.username?.charAt(0).toUpperCase() || "U",
                color: "bg-blue-100 dark:bg-blue-900 text-blue-600"
            },
            time: "2 hours ago",
            message: "Just completed the JavaScript course!"
        },
        {
            user: {
                name: userData?.username || "User",
                initials: userData?.username?.charAt(0).toUpperCase() || "U",
                color: "bg-green-100 dark:bg-green-900 text-green-600"
            },
            time: "5 hours ago",
            message: "Started learning React today. Excited!"
        }
    ];

    // Calculate stats based on user data
    const stats = {
        activeCourses: userData?.courses?.length || 0,
        completedCourses: 0, // You can add logic to differentiate completed courses
        learningHours: Math.floor((userData?.expoints || 0) / 10), // Example calculation
        monthlyGoal: Math.min(((userData?.expoints || 0) / 1000) * 100, 100) // Example: goal is 1000 points
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div
            className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Swipe Notification */}
            {showSwipeNotification && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-xs md:hidden animate-in slide-in-from-top">
                    <span className="text-sm font-medium">👉 Swipe right to open sidebar</span>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-lg">
                            <Code size={20} />
                        </div>
                        <h1 className="text-xl font-bold">
                            Byte<span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Camp</span>
                        </h1>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        {userData.avatar ? (
                            <img
                                src={userData.avatar}
                                alt={userData.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center font-semibold">
                                {userData.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold">{userData.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userData.rank}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 text-white">
                        <Home size={20} />
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                        <Book size={20} />
                        <span>My Courses</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                        <Users size={20} />
                        <span>Community</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                        <Bell size={20} />
                        <span>Notifications</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                        <UserCircle size={20} />
                        <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                </nav>

                {/* Monthly Goal */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-500 dark:text-gray-400">Monthly Goal</span>
                        <span className="font-semibold">{Math.round(stats.monthlyGoal)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${stats.monthlyGoal}%` }}></div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="md:ml-64 min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Welcome, {userData.username}!</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Start your coding journey today</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                                <Bell size={20} />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-600 transition-all"
                                >
                                    {userData.avatar ? (
                                        <img
                                            src={userData.avatar}
                                            alt={userData.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center font-semibold">
                                            {userData.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <UserCircle size={18} className="text-blue-600" />
                                            <span>Your Profile</span>
                                        </a>
                                        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <Settings size={18} className="text-blue-600" />
                                            <span>Settings</span>
                                        </a>
                                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('jwt');
                                                window.location.href = '/login';
                                            }}
                                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center text-lg">
                                    <Book size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Courses</p>
                                    <p className="text-2xl font-bold">{stats.activeCourses}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 flex items-center justify-center text-lg">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                                    <p className="text-2xl font-bold">{userData.level}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 flex items-center justify-center text-lg">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience Points</p>
                                    <p className="text-2xl font-bold">{userData.expoints}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 flex items-center justify-center text-lg">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                                    <p className="text-2xl font-bold">{userData.followers?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Continue Learning */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Continue Learning</h2>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">Browse Courses</a>
                                </div>
                                <div className="p-8 text-center">
                                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="mt-4 text-lg font-semibold">
                                        {stats.activeCourses === 0 ? 'No active courses' : `${stats.activeCourses} Active Courses`}
                                    </h3>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                                        {stats.activeCourses === 0
                                            ? 'Start your first course to begin your coding journey'
                                            : 'Keep learning and growing your skills'
                                        }
                                    </p>
                                    <a href="#" className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all">
                                        Explore Courses
                                    </a>
                                </div>
                            </div>

                            {/* Community Activity */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Community Activity</h2>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">See All</a>
                                </div>
                                <div>
                                    {communityActivities.map((activity, index) => (
                                        <div key={index} className="p-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex gap-3">
                                                <div className={`w-10 h-10 rounded-full ${activity.user.color} flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                                                    {activity.user.initials}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold">{activity.user.name}</p>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.message}</p>
                                                    <div className="mt-2 flex gap-4 text-xs">
                                                        <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                                                            <ThumbsUp size={14} /> Like
                                                        </button>
                                                        <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                                                            <MessageCircle size={14} /> Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Profile Card */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        {userData.avatar ? (
                                            <img
                                                src={userData.avatar}
                                                alt={userData.username}
                                                className="w-24 h-24 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center text-3xl font-bold">
                                                {userData.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <h2 className="mt-4 text-xl font-bold">{userData.username}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
                                        <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
                                                <p className="text-lg font-semibold capitalize">{userData.rank}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Points</p>
                                                <p className="text-lg font-semibold">{userData.expoints.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                                                <p className="text-lg font-semibold">{userData.followers?.length || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
                                                <p className="text-lg font-semibold">{userData.following?.length || 0}</p>
                                            </div>
                                        </div>
                                        <a href="#" className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all font-medium">
                                            View Full Profile
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Courses */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Recommended</h2>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">See All</a>
                                </div>
                                <div>
                                    {recommendedCourses.map((course, index) => (
                                        <div key={index} className="p-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                            <h3 className="text-sm font-semibold">{course.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{course.description}</p>
                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} /> {course.duration}
                                                </span>
                                                <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600">
                                                    {course.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}