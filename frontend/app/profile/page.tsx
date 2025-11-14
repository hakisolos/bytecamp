'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home, Book, Users, Bell, UserCircle, Settings,
    Code, ArrowLeft, Mail, Calendar, Award, TrendingUp,
    Edit2, Camera, Shield, LogOut, Trophy, Target,
    BookOpen, Star, CheckCircle, X
} from 'lucide-react';

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

export default function ByteCampProfile() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isUploadingPP, setIsUploadingPP] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const jwt = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
                if (!jwt) {
                    router.replace('/login');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwt');
                        sessionStorage.removeItem('jwt');
                        router.replace('/login');
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRankColor = (rank: string) => {
        const colors: Record<string, string> = {
            bronze: 'text-orange-600 bg-orange-100 dark:bg-orange-900',
            silver: 'text-gray-600 bg-gray-100 dark:bg-gray-700',
            gold: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900',
            platinum: 'text-purple-600 bg-purple-100 dark:bg-purple-900',
            diamond: 'text-blue-600 bg-blue-100 dark:bg-blue-900'
        };
        return colors[rank.toLowerCase()] || colors.bronze;
    };

    const calculateNextLevelXP = (currentXP: number) => {
        const currentLevel = Math.floor(currentXP / 100);
        return (currentLevel + 1) * 100;
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        sessionStorage.removeItem('jwt');
        router.replace('/login');
    };

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size should be less than 5MB');
            return;
        }

        setIsUploadingPP(true);
        setUploadError(null);

        try {
            const jwt = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
            if (!jwt) {
                router.replace('/login');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8080/api/user/updatePP', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                body: formData
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwt');
                    sessionStorage.removeItem('jwt');
                    router.replace('/login');
                    return;
                }
                throw new Error('Failed to upload profile picture');
            }

            // Reload the page to show updated profile picture
            window.location.reload();
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
            setIsUploadingPP(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
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

    const nextLevelXP = calculateNextLevelXP(userData.expoints);
    const progressToNextLevel = ((userData.expoints % 100) / 100) * 100;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Upload Loading Overlay */}
            {isUploadingPP && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-sm mx-4 text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold mb-2">Uploading Profile Picture</h3>
                        <p className="text-gray-500 dark:text-gray-400">Please wait while we update your profile...</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold">My Profile</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and settings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={18} />
                                <span className="hidden sm:inline">Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
                    {/* Cover Background */}
                    <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-20">
                            {/* Avatar */}
                            <div className="relative">
                                {userData.avatar ? (
                                    <img
                                        src={userData.avatar}
                                        alt={userData.username}
                                        className="w-32 h-32 rounded-xl border-4 border-white dark:border-gray-900 object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-xl border-4 border-white dark:border-gray-900 bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                                        {userData.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                                    <Camera size={16} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                            {userData.username}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                            <Mail size={16} />
                                            {userData.email}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg ${getRankColor(userData.rank)} font-semibold capitalize flex items-center gap-2`}>
                                        <Trophy size={18} />
                                        {userData.rank}
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                            <Award size={16} />
                                            <span className="text-sm">Level</span>
                                        </div>
                                        <p className="text-2xl font-bold">{userData.level}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                            <Star size={16} />
                                            <span className="text-sm">XP</span>
                                        </div>
                                        <p className="text-2xl font-bold">{userData.expoints.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                            <Users size={16} />
                                            <span className="text-sm">Followers</span>
                                        </div>
                                        <p className="text-2xl font-bold">{userData.followers?.length || 0}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                            <BookOpen size={16} />
                                            <span className="text-sm">Courses</span>
                                        </div>
                                        <p className="text-2xl font-bold">{userData.courses?.length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'overview'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'activity'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('achievements')}
                                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'achievements'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Achievements
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'settings'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                {/* Progress Card */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp size={20} className="text-blue-600" />
                                        Learning Progress
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Level {userData.level} Progress</span>
                                                <span className="font-semibold">{userData.expoints} / {nextLevelXP} XP</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${progressToNextLevel}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {nextLevelXP - userData.expoints} XP until Level {parseInt(userData.level) + 1}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center">
                                                    <UserCircle size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                                    <p className="font-medium">{userData.username}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 flex items-center justify-center">
                                                    <Mail size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="font-medium">{userData.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 flex items-center justify-center">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                                    <p className="font-medium">{formatDate(userData.joined_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'activity' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                                <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start a course to see your activity here</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'achievements' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                                <div className="text-center py-12">
                                    <Trophy className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">No achievements yet</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Complete courses to unlock achievements</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Settings size={20} />
                                        Account Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Shield size={20} className="text-blue-600" />
                                                <div className="text-left">
                                                    <p className="font-medium">Change Password</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your password</p>
                                                </div>
                                            </div>
                                            <Edit2 size={18} className="text-gray-400" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Bell size={20} className="text-blue-600" />
                                                <div className="text-left">
                                                    <p className="font-medium">Notifications</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage notification preferences</p>
                                                </div>
                                            </div>
                                            <Edit2 size={18} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900 p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    >
                                        <LogOut size={20} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total XP</span>
                                    <span className="font-semibold">{userData.expoints.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Level</span>
                                    <span className="font-semibold">Level {userData.level}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Rank</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRankColor(userData.rank)}`}>
                                        {userData.rank}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Following</span>
                                    <span className="font-semibold">{userData.following?.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-semibold mb-4">Social</h3>
                            <div className="space-y-3">
                                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Find Friends
                                </button>
                                <button className="w-full py-3 px-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                                    View Followers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Edit Profile</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                Profile editing coming soon!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}