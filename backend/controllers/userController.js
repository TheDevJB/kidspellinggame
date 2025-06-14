const db = require('../config/data');

exports.createUser = (req, res) => {
    try {
        const { username, name, grade } = req.body;
        
        const existingUser = db.users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Username already exists',
                error: 'DUPLICATE_USERNAME' 
            });
        }
        
        if (!username || !name || !grade) {
            return res.status(400).json({ 
                message: 'Username, name, and grade are required',
                error: 'MISSING_FIELDS' 
            });
        }
        
        const newId = Math.max(...db.users.map(u => u.id), 0) + 1;
        
        const newUser = {
            id: newId,
            username,
            name,
            grade,
            avatar: 'bear',
            totalPoints: 0,
            streakDays: 0,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        
        db.users.push(newUser);
        
        const initialProgress = [
            { userId: newId, module: 'colors', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() },
            { userId: newId, module: 'spelling', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() },
            { userId: newId, module: 'sentences', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() },
            { userId: newId, module: 'capitalization', grade, completedLessons: [], currentLesson: null, totalScore: 0, timeSpent: 0, lastUpdated: new Date().toISOString() }
        ];
        
        db.userProgress.push(...initialProgress);
        
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
        res.status(500).json({ 
            message: 'Error creating user',
            error: error.message 
        });
    }
};

exports.loginUser = (req, res) => {
    try {
        const { username } = req.body;
        
        const user = db.users.find(u => u.username === username);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'USER_NOT_FOUND' 
            });
        }
        
        user.lastActive = new Date().toISOString();
        
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

exports.getUserProfile = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'USER_NOT_FOUND' 
            });
        }
        
        const userProgress = db.userProgress.filter(p => p.userId === userId);
        
        const totalLessonsCompleted = userProgress.reduce((total, progress) => {
            return total + progress.completedLessons.length;
        }, 0);
        
        const totalTimeSpent = userProgress.reduce((total, progress) => {
            return total + progress.timeSpent;
        }, 0);
        
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
                totalTimeSpent,
                totalTimeSpentFormatted: Math.floor(totalTimeSpent / 60) + ' minutes',
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

exports.updateProgress = (req, res) => {
    try {
        const { userId, module, lessonCompleted, score, timeSpent } = req.body;
        
        const progressIndex = db.userProgress.findIndex(p => 
            p.userId === userId && p.module === module
        );
        
        if (progressIndex === -1) {
            return res.status(404).json({ 
                message: 'Progress record not found',
                error: 'PROGRESS_NOT_FOUND' 
            });
        }
        
        const progress = db.userProgress[progressIndex];
        
        if (lessonCompleted && !progress.completedLessons.includes(lessonCompleted)) {
            progress.completedLessons.push(lessonCompleted);
        }
        
        if (score) progress.totalScore += score;
        if (timeSpent) progress.timeSpent += timeSpent;
        progress.lastUpdated = new Date().toISOString();
        
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

exports.getLeaderboard = (req, res) => {
    try {
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

exports.updateAvatar = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { avatar } = req.body;
        
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                error: 'USER_NOT_FOUND' 
            });
        }
        
        const availableAvatar = db.avatars.find(a => a.name === avatar);
        if (!availableAvatar) {
            return res.status(400).json({ 
                message: 'Invalid avatar selection',
                error: 'INVALID_AVATAR' 
            });
        }
        
        if (user.totalPoints < availableAvatar.unlockLevel) {
            return res.status(403).json({ 
                message: `Need ${availableAvatar.unlockLevel} points to unlock this avatar`,
                error: 'INSUFFICIENT_POINTS',
                required: availableAvatar.unlockLevel,
                current: user.totalPoints
            });
        }
        
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
