// USER MANAGEMENT CONTROLLER
// Handles user registration, authentication, progress tracking, and profile management

const db = require('../config/data');

// CREATE NEW USER (Registration)
exports.createUser = (req, res) => {
    try {
        // Extract user data from request body
        const { username, name, grade } = req.body;
        
        // VALIDATION: Check if username already exists
        const existingUser = db.users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Username already exists',
                error: 'DUPLICATE_USERNAME' 
            });
        }
        
        // VALIDATION: Check required fields
        if (!username || !name || !grade) {
            return res.status(400).json({ 
                message: 'Username, name, and grade are required',
                error: 'MISSING_FIELDS' 
            });
        }
        
        // Generate new user ID
        const newId = Math.max(...db.users.map(u => u.id), 0) + 1;
        
        // Create new user object with default values
        const newUser = {
            id: newId,
            username,
            name,
            grade, // pre-k, kindergarten, 1st, 2nd, 3rd, 4th, 5th
            avatar: 'bear', // Default avatar
            totalPoints: 0, // Start with 0 points
            streakDays: 0, // No streak initially
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        
        // Add user to database
        db.users.push(newUser);
        
        // Initialize empty progress for the new user
        // This creates progress tracking entries for all learning modules
        const initialProgress = [
            { userId: newId, module: 'colors', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() },
            { userId: newId, module: 'spelling', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() },
            { userId: newId, module: 'sentences', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() },
            { userId: newId, module: 'capitalization', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() }
        ];
        
        // Add initial progress to database
        db.userProgress.push(...initialProgress);
        
        // Return success response (don't include sensitive data)
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                grade: newUser.grade,
                avatar: newUser.avatar,
                totalPoints: newUser.totalPoints
            }
        });
        
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ 
            message: 'Error creating user',
            error: error.message 
        });
    }
};

// USER LOGIN (Simple authentication)
exports.loginUser = (req, res) => {
    try {
        const { username } = req.body;
        
        // Find user by username
        const user = db.users.find(u => u.username === username);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'USER_NOT_FOUND' 
            });
        }
        
        // Update last active timestamp
        user.lastActive = new Date().toISOString();
        
        // Return user data (excluding sensitive information)
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                grade: user.grade,
                avatar: user.avatar,
                totalPoints: user.totalPoints,
                streakDays: user.streakDays
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error during login',
            error: error.message 
        });
    }
};

// GET USER PROFILE
exports.getUserProfile = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        // Find user by ID
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'USER_NOT_FOUND' 
            });
        }
        
        // Get user's progress across all modules
        const userProgress = db.userProgress.filter(p => p.userId === userId);
        
        // Calculate total lessons completed
        const totalLessonsCompleted = userProgress.reduce((total, progress) => {
            return total + progress.completedLessons.length;
        }, 0);
        
        // Calculate total time spent learning
        const totalTimeSpent = userProgress.reduce((total, progress) => {
            return total + progress.timeSpent;
        }, 0);
        
        // Return comprehensive user profile
        res.json({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                grade: user.grade,
                avatar: user.avatar,
                totalPoints: user.totalPoints,
                streakDays: user.streakDays,
                createdAt: user.createdAt,
                lastActive: user.lastActive
            },
            stats: {
                totalLessonsCompleted,
                totalTimeSpent, // in seconds
                totalTimeSpentFormatted: Math.floor(totalTimeSpent / 60) + ' minutes', // convert to minutes
                progressByModule: userProgress
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching user profile',
            error: error.message 
        });
    }
};

// UPDATE USER PROGRESS
exports.updateProgress = (req, res) => {
    try {
        const { userId, module, lessonCompleted, score, timeSpent } = req.body;
        
        // Find user's progress for the specific module
        const progressIndex = db.userProgress.findIndex(p => 
            p.userId === userId && p.module === module
        );
        
        if (progressIndex === -1) {
            return res.status(404).json({ 
                message: 'Progress record not found',
                error: 'PROGRESS_NOT_FOUND' 
            });
        }
        
        // Update progress
        const progress = db.userProgress[progressIndex];
        
        // Add completed lesson if not already completed
        if (lessonCompleted && !progress.completedLessons.includes(lessonCompleted)) {
            progress.completedLessons.push(lessonCompleted);
        }
        
        // Update scores and time
        if (score) progress.totalScore += score;
        if (timeSpent) progress.timeSpent += timeSpent;
        progress.lastUpdated = new Date().toISOString();
        
        // Update user's total points
        const user = db.users.find(u => u.id === userId);
        if (user && score) {
            user.totalPoints += score;
            user.lastActive = new Date().toISOString();
        }
        
        res.json({
            message: 'Progress updated successfully',
            progress: progress,
            totalPoints: user ? user.totalPoints : 0
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating progress',
            error: error.message 
        });
    }
};

// GET LEADERBOARD (Top users by points)
exports.getLeaderboard = (req, res) => {
    try {
        // Sort users by total points (descending) and take top 10
        const topUsers = db.users
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, 10)
            .map((user, index) => ({
                rank: index + 1,
                name: user.name,
                grade: user.grade,
                avatar: user.avatar,
                totalPoints: user.totalPoints,
                streakDays: user.streakDays
            }));
        
        res.json({
            message: 'Leaderboard retrieved successfully',
            leaderboard: topUsers
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching leaderboard',
            error: error.message 
        });
    }
};

// UPDATE USER AVATAR
exports.updateAvatar = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { avatar } = req.body;
        
        // Find user
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'USER_NOT_FOUND' 
            });
        }
        
        // Validate avatar exists in available avatars
        const availableAvatar = db.avatars.find(a => a.name === avatar);
        if (!availableAvatar) {
            return res.status(400).json({ 
                message: 'Invalid avatar selection',
                error: 'INVALID_AVATAR' 
            });
        }
        
        // Check if user has enough points to unlock this avatar
        if (user.totalPoints < availableAvatar.unlockLevel) {
            return res.status(403).json({ 
                message: `Need ${availableAvatar.unlockLevel} points to unlock this avatar`,
                error: 'INSUFFICIENT_POINTS',
                required: availableAvatar.unlockLevel,
                current: user.totalPoints
            });
        }
        
        // Update user's avatar
        user.avatar = avatar;
        user.lastActive = new Date().toISOString();
        
        res.json({
            message: 'Avatar updated successfully',
            avatar: availableAvatar
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating avatar',
            error: error.message 
        });
    }
}; 